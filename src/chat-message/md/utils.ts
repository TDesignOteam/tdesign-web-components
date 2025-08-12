import Cherry from 'cherry-markdown/dist/cherry-markdown.core';

/** cherryMarkdown自动添加part属性插件 */
export const AddPartHook = Cherry.createSyntaxHook('addPart', Cherry.constants.HOOKS_TYPE_LIST.PAR, {
  makeHtml(str) {
    return str;
  },
  afterMakeHtml(str) {
    return str.replace(/<(?!br\b)([^\s/]+)(\s*>|\s+[^>]+>)/g, (_whole, tag, attr) => `<${tag} part="md_${tag}"${attr}`);
  },
});
