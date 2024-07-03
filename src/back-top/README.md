---
title: BackTop 回到顶部
description: 用于返回页面顶部
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础的回到顶部

默认距离页面右侧24px，距离页面底部80px，滚动动画时长200ms。
{{ base }}

### 不同耗时的回到顶部

设置滚动动画时长2s。
{{ baseDuration }}

### 不同组件尺寸的回到顶部

提供标准（默认）、小两种尺寸。
{{ baseSize }}

### 不同组件形状的回到顶部

提供方形（默认）、圆形两种形状。
{{ baseShape }}

### 不同组件主题的回到顶部

{{ baseTheme }}

### 可自定义内容的回到顶部

{{ baseCustom }}

## API

[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/main/src/common.ts)

| 名称            | 类型                | 默认值              | 说明                                                                                                                                                                                 | 必传 |
|---------------|-------------------|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----|
| className     | String            | -                | 类名                                                                                                                                                                                 | N  |
| style         | Object            | -                | 样式，TS 类型：`Record<string, string \| number>`                                                                                                                                        | N  |
| children      | TNode             | -                | 回到顶部内容，同 `content`。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/main/src/common.ts)	                                               | N  |
| container     | String / Function | 'body'           | 监听滚动的容器。数据类型为 String 时，会被当作选择器处理，进行节点查询。示例：'body' 或 () => document.body。TS 类型：AttachNode。 [通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/main/src/common.ts) | N  |
| content       | TNode             | -                | 回到顶部内容。TS 类型：`string\| TNode`。  [通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/main/src/common.ts)                                                           | N  |
| default       | TNode             | -                | 回到顶部内容，同 content。TS 类型：`string\| TNode`。      [通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/main/src/common.ts)                                             | N  |
| duration      | Number            | 200              | 回到顶部的耗时单位：毫秒                                                                                                                                                                       | N  |
| offset        | Array             | ["24px", "80px"] | 回到顶部相对右下角的位置偏移，示例：[10, 20] 或 ['10em', '8rem']。TS 类型：`Array<string \| number>`                                                                                                      | N  |
| shape         | String            | square           | 回到顶部的形状。可选项：circle/square。TS 类型：`BackTopShapeEnum type BackTopShapeEnum = 'circle' \| 'square'`。                                                                                   | N  |
| size          | String            | medium           | 组件尺寸。可选项：medium/small                                                                                                                                                              | N  |
| target        | String / Function | 'body'           | 指定回到该对象。数据类型为 String 时，会被当作选择器处理，进行节点查询。示例：'body' 或 () => document.body。TS 类型：AttachNode。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/main/src/common.ts)  | N  |
| theme         | String            | light            | 组件主题风格，浅色、主色、深色。可选项：light/primary/dark                                                                                                                                             | N  |
| visibleHeight | String / Number   | '200px'          | 滚动高度达到此参数值才出现                                                                                                                                                                      | N  |
| onClick       | Function          | -                | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击回到顶部时触发                                                                                                                         | N  |



