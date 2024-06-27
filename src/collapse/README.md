---
title: Collapse 折叠面板
description: 可以将较多或较复杂的内容进行分组，分组内容区可以折叠展开或隐藏。
isComponent: true
usage: { title: '', description: '' }
spline: data
---

### 基础折叠面板

基础折叠面板，可自定义面板内容。

{{ base }}

### 手风琴模式折叠面板

手风琴模式折叠面板，一次只能打开一个面板。

{{ mutex }}

### 可设置图标的折叠面板

可设置是否显示展开图标以及图标展示的位置

{{ icon }}

### 可设置右侧操作的折叠面板

可自定义面板右侧操作区域

{{ rightSlot }}

### 不同模式的折叠面板


{{ other }}

## API

### Collapse Props

| 名称                | 类型     | 默认值 | 说明                                                                                      | 必传 |
| ------------------- | -------- | ------ | ----------------------------------------------------------------------------------------- | ---- |
| borderless          | Boolean  | false  | 是否为无边框模式                                                                          | N    |
| defaultExpandAll    | Boolean  | false  | 默认是否展开全部                                                                          | N    |
| disabled            | Boolean  | -      | 是否禁用面板展开/收起操作                                                                 | N    |
| expandIconPlacement | String   | left   | 展开图标的位置，左侧或右侧。可选项：left/right                                            | N    |
| expandMutex         | Boolean  | false  | 每个面板互斥展开，每次只展开一个面板                                                      | N    |
| expandOnRowClick    | Boolean  | true   | 是否允许点击整行标题展开面板                                                              | N    |
| value               | Array    | []     | 展开的面板集合。TS 类型：`CollapseValue` `type CollapseValue = Array<string \| number>`。 | N    |
| onChange            | Function |        | TS 类型：`(value: CollapseValue) => void`<br/>切换面板时触发，返回变化的值                | N    |


### CollapsePanel Props

| 名称              | 类型            | 默认值    | 说明                                                             | 必传 |
| ----------------- | --------------- | --------- | ---------------------------------------------------------------- | ---- |
| destroyOnCollapse | Boolean         | false     | 当前面板处理折叠状态时，是否销毁面板内容                         | N    |
| disabled          | Boolean         | undefined | 禁止当前面板展开，优先级大于 Collapse 的同名属性                 | N    |
| value             | String / Number | -         | 必需。当前面板唯一标识，如果值为空则取当前面下标兜底作为唯一标识 | Y    |
