---
title: Badge 徽标
description: 出现在图标或文字右上角的徽标标识。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 红点样式的徽标

仅显示为圆点的徽标，有图标时位于图标右上角，无图标时位于文字标题后侧。弱提示场景下，不显示数量，需要用户去手动点击查看进行消除。
{{ baseDotStyle }}

### 数字样式的徽标

含数字的徽标，适用于需要较强提醒的场景，直接提醒用户相关信息数量。
{{ baseNumberStyle }}

### 自定样式的徽标

可对显示信息进行自定义配置，如展示为“热门hot”“最新new”等。
{{ baseCustom }}

### 不同尺寸的徽标

提供标准（默认）、小两种尺寸。
{{ baseSize }}

### 不同形状的徽标

提供圆形和方形两种不同形状的徽标展示。
{{ baseShape }}

### 控制徽标显示偏移位置

{{ baseOffset }}

## API

| 名称               | 类型       | 默认值    | 说明                                                                         | 必传 |
|------------------|----------|--------|----------------------------------------------------------------------------|----|
| className        | String   | -      | 类名。                                                                        | N  |
| style            | Object   | -      | 样式，TS 类型：`Record<string, string \| number>`。                               | N  |
| children         | TNode    | -      | 徽标内容，同 content。TS 类型：`string \| TNode`。                                    | N  |
| color            | String   | -      | 颜色。                                                                        | N  |
| content          | TNode    | -      | 徽标内容。TS 类型：`string \| TNode`。                                              | N  |
| count            | TNode    | -      | 徽标右上角内容。可以是数字，也可以是文字。如：'new'/3/99+。TS 类型：`string \| number \| TNode`。      | N  |
| dot              | Boolean  | false  | 是否为小红点样式。                                                                  | N  |
| maxCount         | Number   | 99     | 最大显示数字，超过最大值会显示 `{maxCount}+`，仅当 count 为数字时有效。TS 类型：`number`               | N  |
| offset           | Number   | 0      | 设置状态点的位置偏移，示例：[-10, 20] 或 ['10em', '8rem']。TS 类型：`Array<string \| number>` | N  |
| shape            | String   | circle | 形状。可选项：可选项：circle/round。TS 类型：`circle' \| round`。                          | N  |
| showZero         | Boolean  | false  | 当数值为 0 时，是否展示徽标。                                                           | N  |
| size             | String   | -      | 尺寸。可选项：small/medium。TS 类型：`small \| medium`。                               | N  |
| ignoreAttributes | String[] | -      | 在host标签上忽略的属性                                                              | N  |
