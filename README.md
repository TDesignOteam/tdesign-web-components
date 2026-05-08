<p align="center">
  <a href="https://tdesign.tencent.com/" target="_blank">
    <img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png" />
  </a>
</p>

<!-- CI Test: $(date) -->

<p align="center">
   <a href="https://www.npmjs.com/package/@tdesign/web-components-chat">
    <img src="https://img.shields.io/npm/l/@tdesign/web-components-chat.svg?sanitize=true" alt="License" />
  </a>
  <a href="https://app.codecov.io/gh/Tencent/tdesign-web-components">
    <img src="https://img.shields.io/codecov/c/github/Tencent/tdesign-web-components/develop.svg?style=flat-square" alt="codecov">
  </a>
  <a href="https://www.npmjs.com/package/@tdesign/web-components-chat">
    <img src="https://img.shields.io/npm/v/@tdesign/web-components-chat.svg?sanitize=true" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/@tdesign/web-components-chat">
    <img src="https://img.shields.io/npm/dm/@tdesign/web-components-chat.svg?sanitize=true" alt="Downloads" />
  </a>
</p>

English | [简体中文](./README-zh_CN.md)

TDesign Web Components is a UI component and is suitable for use in any front-end project.

# 🎉 Features

- Desktop application interaction
- High quality UI components based on [omi](https://github.com/Tencent/omi)
- Consistent API and UI with TDesign component libraries for other frameworks
- Dark mode and customizable theme
- Support tree-shaking

# 📦 Installation

```shell
npm i @tdesign/web-components-chat
```

```shell
yarn add @tdesign/web-components-chat
```

```shell
pnpm add @tdesign/web-components-chat
```

> `@tdesign/web-components-ui` will be installed automatically as a peer dependency.

# 🔨 Usage

```tsx
import '@tdesign/web-components-chat';

document.body.innerHTML = `<t-chatbot></t-chatbot>`;
```

If you only need the base UI components:

```tsx
import '@tdesign/web-components-ui/lib/style/index.css'
import '@tdesign/web-components-ui/lib/button'

document.body.innerHTML = `<t-button theme="success">按钮</t-button>`;
```

More ways to use please click 👉🏻 [getting-started](./site/docs/getting-started.md)

The package of @tdesign/web-components-chat provides AI Chat components, and @tdesign/web-components-ui provides the base UI components. Read [the documentation](https://github.com/Tencent/tdesign/blob/main/docs/develop-install.md) for more details.

# Quick Start

Visit [TDesign Starter](https://tdesign.tencent.com/starter/react/) to experience in the application built with TDesign React UI components.

# Browser Support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge >=84                                                                                                                                                                                                        | Firefox >=83                                                                                                                                                                                                      | Chrome >=84                                                                                                                                                                                                   | Safari >=14.1                                                                                                                                                                                                 |

Read our [browser compatibility](https://github.com/Tencent/tdesign/wiki/Browser-Compatibility) for more details.

# TDesign component libraries

TDesign also provides component libraries for other platforms and frameworks.

- component library for Vue 3.x : [tdesign-vue-next](https://github.com/Tencent/tdesign-vue-next)
- component library for Vue 2.x : [tdesign-vue](https://github.com/Tencent/tdesign-vue)
- component library for Wechat miniprogram : [tdesign-miniprogram](https://github.com/Tencent/tdesign-miniprogram)

# Contributing

Contributing is welcome. Read [guidelines for contributing](https://github.com/TDesignOteam/tdesign-web-components/blob/main/DEVELOP_GUIDE.md) before submitting your [Pull Request](https://github.com/TDesignOteam/tdesign-web-components/pulls).

## Contributors

<a href="https://github.com/TDesignOteam/tdesign-web-components/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=TDesignOteam/tdesign-web-components" />
</a>

# Feedback

Create your [Github issues](https://github.com/TDesignOteam/tdesign-web-components/issues) or scan the QR code below to join our user groups

<img src="https://raw.githubusercontent.com/Tencent/tdesign/main/packages/components/src/images/groups/react-group.png" width="200" />

# License

The MIT License. Please see [the license file](./LICENSE) for more information.
