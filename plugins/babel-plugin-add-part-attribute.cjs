module.exports = function ({ types: t }) {
  /** 解析基础类型数据 */
  function baseTypeHandler(v) {
    // 字符串
    if (t.isStringLiteral(v)) {
      return v;
    }
    // 模板字符串
    if (t.isTemplateLiteral(v)) {
      return v;
    }
    // 变量标识符
    if (t.isIdentifier(v)) {
      return v;
    }
    return null;
  }

  return {
    visitor: {
      CallExpression(path) {
        const { node } = path;
        const { callee } = node;
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.object, { name: 'Component' }) &&
          t.isIdentifier(callee.property, { name: 'h' })
        ) {
          const [type, props] = node.arguments;

          // t-开头的标签忽略
          if (t.isStringLiteral(type) && type.value.startsWith('t-')) {
            return;
          }
          if (t.isObjectExpression(props)) {
            // 取className/class属性
            const classProp = props.properties.find(
              (prop) =>
                t.isObjectProperty(prop) &&
                (t.isIdentifier(prop.key, { name: 'className' }) ||
                  t.isIdentifier(prop.key, { name: 'class' }) ||
                  t.isStringLiteral(prop.key, { value: 'class' })),
            );
            // 取part属性
            const partProp = props.properties.find(
              (prop) => t.isObjectProperty(prop) && t.isIdentifier(prop.key, { name: 'part' }),
            );
            // 未手动设置part且存在className，自动补充part
            if (!partProp && classProp) {
              let partValue = '';

              // 处理多种不同的 className 表达式
              const baseTypeResult = baseTypeHandler(classProp.value);
              if (baseTypeResult) {
                partValue = baseTypeResult;
                // 处理classname(x)
              } else if (t.isCallExpression(classProp.value)) {
                const { callee } = classProp.value;
                if (t.isIdentifier(callee, { name: 'classname' }) || t.isIdentifier(callee, { name: 'classNames' })) {
                  const args = classProp.value.arguments;
                  if (args.length <= 0) {
                    return;
                  }
                  const firstArg = args[0];
                  const baseTypeResult = baseTypeHandler(firstArg);
                  if (baseTypeResult) {
                    partValue = baseTypeResult;
                    // 处理 classname([c1, c2])，取c1
                  } else if (t.isArrayExpression(firstArg)) {
                    const { elements } = firstArg;
                    if (elements.length <= 0) {
                      return;
                    }
                    const baseTypeResult = baseTypeHandler(elements[0]);
                    if (baseTypeResult) {
                      partValue = baseTypeResult;
                    }
                  }
                  // classname第一个参数如果为Object，目前忽略掉
                }
                // class为变量表达式，这里直接取值
              } else if (t.isMemberExpression(classProp.value)) {
                partValue = classProp.value;
              }
              // 追加part属性
              if (partValue) {
                const partAttribute = t.objectProperty(t.identifier('part'), partValue);
                props.properties.push(partAttribute);
              }
            }
          }
        }
      },
    },
  };
};
