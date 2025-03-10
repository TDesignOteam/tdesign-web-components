---
title: FileCard 文件缩略卡片
description: 文件缩略卡片。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础使用

{{ base }}

### 关闭事件

{{ close }}

## API

### Filecard Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
class | String | - | 类名 | N
onRemove | (item: Attachment) => void | - | 附件移除时的回调函数 | N
item | Attachment | false | 附件，同 Upload UploadFile | Y
disabled | Boolean | false | 禁用状态 | N


