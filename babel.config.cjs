const addPartAttribute = require('./plugins/babel-plugin-add-part-attribute.cjs');

module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: ['@babel/plugin-transform-runtime', addPartAttribute],
};
