<p align="center">
  <a href="https://tdesign.tencent.com/" target="_blank">
    <img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png" />
  </a>
</p>

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

简体中文 | [English](./README.md)

TDesign Web Components 适配桌面端的组件库，适合在任何前端项目中使用。

# 🎉 特性

- 适配桌面端交互
- 基于 [omi](https://github.com/Tencent/omi)
- 与其他框架/库（Vue / React）版本 UI 保持一致
- 支持暗黑模式及其他主题定制
- 支持按需加载

# 📦 安装

```shell
npm i @tdesign/web-components
```

```shell
yarn add @tdesign/web-components
```

```shell
pnpm add @tdesign/web-components
```

# 🔨 基础使用

推荐使用 Webpack 或 Rollup 等支持 tree-shaking 特性的构建工具，无需额外配置即可实现组件按需引入：

```tsx
import '@tdesign/web-components/lib/style/index.css';
import '@tdesign/web-components/button';

document.body.innerHTML = `<t-button theme="success">按钮</t-button>`;
```

更多使用方式请点击 👉🏻 [快速开始](./site/docs/getting-started.md)

`@tdesign/web-components-chat` 提供 AI Chat 组件，需与 `@tdesign/web-components` 一并安装。更新日志：[UI](./packages/tdesign-web-components/CHANGELOG.md) · [Chat](./packages/tdesign-web-components-chat/CHANGELOG.md)。更多说明见 [DEVELOP_GUIDE](./DEVELOP_GUIDE.md)。

# 快速体验

可以访问官方提供的 [TDesign Starter](https://tdesign.tencent.com/starter/react/) 项目体验使用 TDesign 组件快速搭建业务系统。

# 浏览器兼容性

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge >=84                                                                                                                                                                                                        | Firefox >=83                                                                                                                                                                                                      | Chrome >=84                                                                                                                                                                                                   | Safari >=14.1                                                                                                                                                                                                 |

详情参见[桌面端组件库浏览器兼容性说明](https://github.com/Tencent/tdesign/wiki/Browser-Compatibility)

# 其他技术栈实现

- 桌面端 Vue 3 实现：[web-vue-next](https://github.com/Tencent/tdesign-vue-next)
- 桌面端 Vue 实现： [web-vue](https://github.com/Tencent/tdesign-vue)
- 移动端小程序实现： [小程序](https://github.com/Tencent/tdesign-miniprogram)

# 参与贡献

TDesign 欢迎任何愿意参与贡献的参与者。如果需要本地运行代码或参与贡献，请先阅读[参与贡献](https://github.com/TDesignOteam/tdesign-web-components/blob/main/DEVELOP_GUIDE.md)。

## 贡献成员

<a href="https://github.com/TDesignOteam/tdesign-web-components/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=TDesignOteam/tdesign-web-components" />
</a>

# 反馈

有任何问题，建议通过 [Github issues](https://github.com/TDesignOteam/tdesign-web-components/issues) 反馈或扫码加入用户微信群。

<img src="https://raw.githubusercontent.com/Tencent/tdesign/main/packages/components/src/images/groups/react-group.png" width="200" />

# 开源协议

TDesign 遵循 [MIT 协议](https://github.com/Tencent/tdesign-react/LICENSE)。
