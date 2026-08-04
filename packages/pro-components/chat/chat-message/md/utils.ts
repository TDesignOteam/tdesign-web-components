import CherryStream from 'cherry-markdown/dist/cherry-markdown.stream.esm.js';

/** cherryMarkdown自动添加part属性插件 */
export const AddPartHook = CherryStream.createSyntaxHook('addPart', CherryStream.constants.HOOKS_TYPE_LIST.PAR, {
  makeHtml(str) {
    return str;
  },
  afterMakeHtml(str) {
    // 用于追踪当前是否在 data-edit-code="true" 的上下文中
    let result = '';
    let depth = 0; // 追踪嵌套深度
    const editCodeStack: number[] = []; // 记录哪些深度层级有 data-edit-code="true"

    // 使用正则表达式逐个处理标签
    const tagRegex = /<\/?(?!br\b)([^\s/>]+)([^>]*)>/g;
    let lastIndex = 0;
    let match;

    while ((match = tagRegex.exec(str)) !== null) {
      const [whole, tag, attr = ''] = match;
      const isClosingTag = whole.startsWith('</');

      // 添加标签之前的文本内容
      result += str.slice(lastIndex, match.index);

      if (isClosingTag) {
        // 闭合标签：直接添加，并减少深度
        result += whole;
        if (editCodeStack[editCodeStack.length - 1] === depth) {
          editCodeStack.pop();
        }
        depth -= 1;
      } else {
        // 开始标签：检查是否需要添加 part 属性
        const hasDataEditCode = /(\s|^)data-edit-code\s*=\s*["']true["']/.test(attr);
        const hasPartAttr = /(\s|^)part\s*=/.test(attr);
        const isSelfClosing = /\/$/.test(attr);

        // 判断当前是否在 data-edit-code="true" 的上下文中
        const inEditCodeContext = editCodeStack.length > 0 || hasDataEditCode;
        const partPrefix = inEditCodeContext ? 'md_code_' : 'md_';

        if (hasPartAttr) {
          // 已有 part 属性，不添加
          result += whole;
        } else {
          // 添加 part 属性
          result += `<${tag}${attr} part="${partPrefix}${tag}">`;
        }

        // 如果不是自闭合标签，增加深度
        if (!isSelfClosing) {
          depth += 1;
          if (hasDataEditCode) {
            editCodeStack.push(depth);
          }
        }
      }

      lastIndex = tagRegex.lastIndex;
    }

    // 添加剩余的文本内容
    result += str.slice(lastIndex);

    return result;
  },
});
