---
title: TDesign Web Components
description: TDesign 适配桌面端的组件库，可以在任何前端项目中使用。
spline: explain
isGettingStarted: true
---

### 安装

#### 使用 npm 安装

推荐使用 npm 方式进行开发

```bash
npm i tdesign-web-components
```

#### 浏览器引入（敬请期待）

### 基础使用

无需额外配置即可实现组件按需引入：

```javascript
import 'tdesign-web-components/lib/style/index.css'; // 少量公共样式
import 'tdesign-web-components/lib/button';
```

也可以整体引入

```javascript
import 'tdesign-web-components/lib/style/index.css'; // 少量公共样式
import 'tdesign-web-components';
```
然后按照以下写法使用即可

```js
document.body.innerHTML = `<t-button theme="success">按钮</t-button>`;
```

### 工程化使用

如果使用vite打包工具，并且使用了`jsx`语法，需要在`vite.config.ts`中添加以下配置，设置vite解析`jsx`的逻辑：

```javascript
import { defineConfig } from 'vite'
export default defineConfig({
+   esbuild: {
+     jsxFactory: 'Component.h',
+     jsxFragment: 'Component.f',
+   },
})
```

> 注意：在`vite >= 5.x` 版本中，需要使用下面的vite插件，其它版本可跳过

```js
import lessCompilerPlugin from 'tdesign-web-components/plugins/vite-plugin-less-compiler';

// vite.config.ts
export default defineConfig({
  plugins: [lessCompilerPlugin({
    lessOptions: {} // less 相关参数
  })]
})
```

如果使用webpack打包工具，并且使用了`jsx`语法，需要在`babel`中设置`jsx`的解析逻辑：

```javascript
{
  "presets": [
    ...
+   [
+     "@babel/preset-react",
+     {
+       "pragma": "Component.h",
+       "pragmaFrag": "Component.f"
+     }
+   ]
+  ],
   ...
}
```

### 更改主题

由于原始样式基于 less 编写，需要自行处理 less 文件的编译（例如安装 less、less-loader）

更多 less 变量定义 [查看这里](https://github.com/Tencent/tdesign-common/blob/main/style/web/_variables.less)

```javascript
import 'tdesign-web-components/esm/button'
import 'tdesign-web-components/esm/style/index.js' // 少量公共样式
```

在 vite 中定制主题

```javascript
// vite.config.js
export default {
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          '@btn-height-default': '40px',
        },
      },
    },
  },
};
```

在 webpack 中定制主题

```javascript
// webpack.config.js
module.exports = {
  rules: [{
    test: /\.less$/,
    use: [{
      loader: 'css-loader',
      options: {
+       exportType: 'string', // translates CSS into string
      },
    }, {
      loader: 'less-loader', // compiles Less to CSS
+     options: {
+       lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
+         modifyVars: {
+           '@btn-height-default': '40px',
+         },
+         javascriptEnabled: true,
+       },
+     },
    }],
+   include: /node_modules\/tdesign-web-components/, // 建议对组件库中的less单独处理
  }],
}
```

### 浏览器兼容性

| [<img src="https://tdesign.gtimg.com/docs/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> IE / Edge | [<img src="https://tdesign.gtimg.com/docs/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://tdesign.gtimg.com/docs/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://tdesign.gtimg.com/docs/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge >=84                                                                                                                                                                 | Firefox >=83                                                                                                                                                            | Chrome >=84                                                                                                                                                          | Safari >=14.1                                                                                                                                                        |

## FAQ

Q: 是否内置 reset 样式统一页面元素的默认样式 ？

A: 我们不引入 `reset.less`

