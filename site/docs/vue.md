---
title: Vue 中使用
spline: explain
isGettingStarted: true
---

### 安装

#### 使用 npm 安装

```bash
npm i tdesign-web-components
```

### 使用

```js
import 'tdesign-web-components/lib/style/index.css'; // 少量公共样式
import 'tdesign-web-components/lib/button';

export default {
  name: 'App',
  setup() {
    const theme = ref('success')

    const clickFn = () => {
      theme.value === 'success' ? 'warning' : 'success'
    }

    return () => <t-button :theme={theme} @click="clickFn">按钮</t-button>
  }
}
```

### 注意

props的key需要由`camelCase`写法，换为`hyphenate`，例如`abcDef`在使用时要设置为`abc-def`
