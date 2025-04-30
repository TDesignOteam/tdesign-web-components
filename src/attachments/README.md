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

## API

### Attachments Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
items |  TdAttachmentItem[] | false | 附件列表，同 Upload UploadFile | Y
onRemove | (item:  TdAttachmentItem) => void / undefined | - | 附件移除时的回调函数 | N
removable | boolean | true | 是否显示删除按钮 | N
overflow | 'wrap'/'scrollX'/'scrollY' | 'wrap' | 文件列表超出时样式 | N
imageViewer | Boolean | true | 图片预览开关 | N

