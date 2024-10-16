---
title: Tdesign Web Components
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

如果使用vite打包工具，需要在`vite.config.ts`中添加以下配置，设置vite解析`jsx`的逻辑：

```javascript
import { defineConfig } from 'vite'
export default defineConfig({
+   esbuild: {
+     jsxFactory: 'h',
+     jsxFragment: 'h.f',
+   },
})
```

如果使用webpack打包工具，需要在`babel`中设置`jsx`的解析逻辑：

```javascript
{
  "presets": [
    ...
+   [
+     "@babel/preset-react",
+     {
+       "pragma": "h",
+       "pragmaFrag": "h.f"
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

### 更改样式

有些业务场景需要更改组件的样式，但是`shadowDOM`具有天然样式隔离的特点，组件外部的样式影响不到组件内部，为此 Tdesign Web Components 提供了几种方式来对样式进行更改：

#### 通过设置`css`属性，来修改样式（推荐）
  
目前每一个组件，都默认有一个`css`的属性，设置该值时会在`shadowDOM`内部创建`style`标签：

```html
<t-button css="button.t-button {color: red}">填充按钮</t-button>
```

会在组件内部，创建`style`标签，改变内部样式：

```html
<!-- DOM结构 -->
<t-button
  #shadow-root
    <button>...</button>
    <style>
      button.t-button {
        color: red;
      }
    </style>
</t-button>
```

#### 通过设置`style`、`innerStyle`来改变样式

**任意组件**，均可设置`style`和`innerStyle`，约定`style`只在最外层标签上起作用：

```html
<!-- 设置style -->
<t-button style={{ color: 'red' }}>填充按钮</t-button>

<!-- DOM结构 -->
<t-button style="color: red">
  #shadow-root
    <button>...</button>
</t-button>
```

约定`innerStyle`只在`shadowDOM`内部第一层标签上起作用：
 
```html
<!-- 设置innerStyle -->
<t-button innerStyle={{ color: 'red' }}>填充按钮</t-button>

<!-- 对应DOM结构 -->
<t-button>
  #shadow-root
    <button style="color: red">...</button>
</t-button>
```

#### 通过设置`class`、`innerClass`来改变样式（可以和`css`属性搭配使用）

**任意组件**，均可设置`class`和`innerClass`，约定`class`只在最外层标签上起作用：

```html
<!-- 设置class -->
<t-button class="customClass">填充按钮</t-button>

<!-- 对应DOM结构 -->
<t-button class="customClass">
  #shadow-root
    <button>...</button>
</t-button>
```

约定`innerClass`只在`shadowDOM`内部第一层标签上起作用：

```html
<!-- 设置innerStyle -->
<t-button innerClass="customClass">填充按钮</t-button>

<!-- 对应DOM结构 -->
<t-button>
  #shadow-root
    <button class="customClass">...</button>
</t-button>
```

> 后续会推出基于打包工具的样式注入插件，敬请期待...

### 浏览器兼容性

| [<img src="https://tdesign.gtimg.com/docs/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> IE / Edge | [<img src="https://tdesign.gtimg.com/docs/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://tdesign.gtimg.com/docs/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://tdesign.gtimg.com/docs/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge >=84                                                                                                                                                                 | Firefox >=83                                                                                                                                                            | Chrome >=84                                                                                                                                                          | Safari >=14.1                                                                                                                                                        |

## FAQ

Q: 是否内置 reset 样式统一页面元素的默认样式 ？

A: 我们不引入 `reset.less`

