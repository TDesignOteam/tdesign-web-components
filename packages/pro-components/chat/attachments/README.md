---
title: Attachments 文件附件
description: 文件附件。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础使用

{{ base }}

### 滚动scrollX

{{ scrollX }}

### 滚动scrollY

{{ scrollY }}

### 图片

{{ images }}

## API

### Attachments Props

| 名称        | 类型                                         | 默认值   | 说明                     | 必传 |
| ----------- | -------------------------------------------- | -------- | ------------------------ | ---- |
| items       | `TdAttachmentItem[]`                         | -        | 附件列表                 | Y    |
| overflow    | `'wrap' \| 'scrollX' \| 'scrollY'`           | `'wrap'` | 文件列表超出时的布局方式 | N    |
| removable   | Boolean                                      | `true`   | 是否显示删除按钮         | N    |
| imageViewer | Boolean                                      | `true`   | 是否启用图片预览         | N    |
| onRemove    | `(e: CustomEvent<TdAttachmentItem>) => void` | -        | 移除附件时触发           | N    |
| onFileClick | `(e: CustomEvent<TdAttachmentItem>) => void` | -        | 点击附件时触发           | N    |
