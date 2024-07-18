---
title: Menu 导航菜单
description: 用于承载网站的架构，并提供跳转的菜单列表。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 可收起的侧边导航

在侧边导航上提供收起按钮，点击后可以将侧边栏最小化，常见于带有图标的侧边导航。

{{ closable-side }}

## API

### Menu Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
collapsed | Boolean | false | 是否收起菜单 | N
logo | TElement | - | 站点 LOGO。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
operations | TElement | - | 导航操作区域。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
value | String / Number | - | 激活菜单项。TS 类型：`MenuValue` `type MenuValue = string \| number`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/menu/type.ts) | N
width | String / Number / Array | '232px' | 菜单宽度。值类型为数组时，分别表示菜单展开和折叠的宽度。[ 展开时的宽度, 折叠时的宽度 ]，示例：['200px', '80px']。TS 类型：`string \| number \| Array<string \| number>` | N
onChange | Function |  | TS 类型：`(evt: CustomEvent<MenuValue>) => void`<br/>激活菜单项发生变化时触发 | N


### MenuItem Props


名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
disabled | Boolean | - | 是否禁用菜单项展开/收起/跳转等功能 | N
href | String | - | 跳转链接 | N
icon | TElement | - | 图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
target | String | - | 链接或路由跳转方式。可选项：_blank/_self/_parent/_top | N
value | String / Number | - | 菜单项唯一标识。TS 类型：`MenuValue` | N
onClick | Function |  | TS 类型：`(evt: CustomEvent<{ e: MouseEvent, value: MenuValue }>) => void`<br/>点击时触发 | N
