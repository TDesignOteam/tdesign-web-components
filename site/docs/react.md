---
title: React 中使用
spline: explain
isGettingStarted: true
---

### 安装

```bash
npm i tdesign-web-components
```

### 使用

```javascript
import 'tdesign-web-components/lib/style/index.css'; // 少量公共样式
import 'tdesign-web-components/lib/button';

const App = () => {
  const button = React.useRef();
  const [theme, setTheme] = React.useState('success')

  const clickFn = () => {
    setTheme(theme === 'success' ? 'warning' : 'success');
  }

  React.useEffect(() => {
    button.current.addEventListener('click', clickFn)
    return () => {
      button.current.removeEventListener('click', clickFn)
    }
  }, [theme])

  return (
    <t-button ref={button} theme={theme}>按钮</t-button>
  )
}
```
### 注意

props的key需要由`camelCase`写法，换为`hyphenate`，例如`abcDef`在使用时要设置为`abc-def`

