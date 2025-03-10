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
class | String | - | 类名 | N
onRemove | (item: Attachment) => void / undefined | - | 附件移除时的回调函数 | N
items | Attachment[] | false | 附件列表，同 Upload UploadFile | Y
disabled | Boolean | false | 禁用状态 | N
overflow | 'wrap'/'scrollX'/'scrollY' | 'wrap' | 文件列表超出时样式 | N

