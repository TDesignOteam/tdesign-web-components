---
title: Affix 固钉
description: 在指定的范围内，将元素固定不动
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础固钉
适用于页面结构简单的场景，默认容器是 `body` 。

{{ base }}

### 指定挂载的容器

适用于较为复杂的场景，元素固定位置会受容器位置的影响。

{{ container }}
 

## API

### Affix Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
children | TNode | - | 内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
container | String / Function | () => (() => window) | 指定滚动的容器。数据类型为 String 时，会被当作选择器处理，进行节点查询。示例：'body' 或 () => document.body。TS 类型：`ScrollContainer`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | 内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
offsetBottom | Number | 0 |  距离容器顶部达到指定距离后触发固定 | N
offsetTop | Number | 0 |  距离容器底部达到指定距离后触发固定 | N
zIndex | Number | - | 固钉定位层级，样式默认为 500 | N
onFixedChange | Function |  | TS 类型: `(affixed: boolean, context: { top: number }) => void`<br/>固定状态发生变化时触发 | N
