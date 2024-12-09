import fs from 'fs';
import less from 'less';
import MagicString from 'magic-string';

const lessToCss = async (id: string, lessOptions: Less.Options): Promise<string> => {
  const source = fs.readFileSync(id, 'utf-8');
  const output = await (less as any).render(source, {
    ...lessOptions,
    filename: id,
  });
  return (output as Less.RenderOutput).css || '';
};

export default function lessCompilerPlugin(
  options: {
    include?: RegExp;
    exclude?: RegExp;
    lessOptions?: Less.Options;
  } = {},
) {
  const { include = /tdesign-web-components.*\.js/, exclude, lessOptions = {} } = options;

  return {
    name: 'vite-plugin-less-compiler',
    async transform(code, id) {
      if (exclude && exclude.test(id)) {
        return null;
      }

      if (!include.test(id)) {
        return null;
      }

      const magicString = new MagicString(code);
      const ast = this.parse(code);

      for (const node of ast.body) {
        const { type = '', source = {}, specifiers } = node;
        if (type !== 'ImportDeclaration' || !source.value.match(/^.*\.less$/)) {
          continue;
        }
        if (!specifiers && specifiers?.[0]?.type !== 'ImportDefaultSpecifier') {
          continue;
        }
        const [{ local = {} }] = specifiers;
        // 这里只能使用 for loop
        // eslint-disable-next-line no-await-in-loop
        const css = await lessToCss(source.value, lessOptions);
        magicString.overwrite(node.start, node.end, `const ${local.name} = \`${css}\``);
      }
      return {
        code: magicString.toString(),
      };
    },
  };
}
