const addPartAttribute = require('./plugins/babel-plugin-add-part-attribute.cjs');

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '86',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-transform-runtime', addPartAttribute],
};
