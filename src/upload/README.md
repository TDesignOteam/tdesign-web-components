---
title: Upload 上传
description: 上传组件允许用户传输文件或提交自己的内容
isComponent: true
usage: { title: '', description: '' }
spline: data
---

### 基础用法

基础文件上传风格，设置 `theme=file` 即可，这种风格不支持拖拽上传，文档下方有拖拽上传和批量上传示例。

- `action` 表示上传接口地址。
- `formatRequest` 用于格式化上传接口请求参数，可以新增或修改参数。
- `formatResponse` 用于格式化接口响应值，如果响应值中的 `error` 字段存在，则会判定本次上传失败。
- `sizeLimit` 用于设置文件大小限制，如果超出限制不会触发上传请求。
- `allowUploadDuplicateFile` 是否允许上传相同文件名的文件。
- `onSelectChange` 会在文件选择之后，上传请求发起之前触发。
- `onSuccess` 会在上传成功后触发。
- `onFail` 会在上传失败后触发。

{{ base }}

### 输入框单文件上传

设置 `theme="single-input"` 即可，这种风格不支持拖拽上传，文档下方有拖拽上传和批量上传示例。

{{ input }}

### 基础图片上传

图片上传成功后，显示预览图片；图片上传失败后，不显示预览图片。

- 设置属性 `theme="image"` 即可，这种风格不支持拖拽上传，如果需要拖拽上传请移步文档下方有拖拽上传的示例。
- 图片预览地址，默认会读取上传接口返回的 `url` 字段。如果接口没有返回 `url` 字段，可以使用 `formatResponse` 格式化返回值，在返回值中增加 `url` 字段。

{{ image }}


## API
### Upload Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
abridgeName | Array | - | 文件名过长时，需要省略中间的文本，保留首尾文本。示例：[10, 7]，表示首尾分别保留的文本长度。TS 类型：`Array<number>` | N
accept | String | - | 接受上传的文件类型，[查看 W3C示例](https://www.w3schools.com/tags/att_input_accept.asp)，[查看 MDN 示例](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input/file) | N
action | String | - | 上传接口。设接口响应数据为字段 `response`，那么 `response.error` 存在时会判断此次上传失败，并显示错误文本信息；`response.url` 会作为文件上传成功后的地址，并使用该地址显示图片或文件 | N
autoUpload | Boolean | true | 是否在选择文件后自动发起请求上传文件 | N
beforeUpload | Function | - | 如果是自动上传模式 `autoUpload=true`，表示单个文件上传之前的钩子函数，若函数返回值为 `false` 则表示不上传当前文件。<br/>如果是非自动上传模式 `autoUpload=false`，函数返回值为 `false` 时表示从上传文件中剔除当前文件。TS 类型：`(file: UploadFile) => boolean \| Promise<boolean>` | N
disabled | Boolean | undefined | 是否禁用 | N
files | Array | [] | 已上传文件列表，同 `value`。TS 类型：`Array<T>` | N
formatResponse | Function | - | 用于格式化文件上传后的响应数据。`response` 指接口响应结果，`file` 指当前上传的单个文件。TS 类型：`(response: any, file: UploadFile) => UploadFile` | N
max | Number | 0 | 用于控制文件上传数量，值为 0 则不限制 | N
multiple | Boolean | false | 是否支持多选文件 | N
sizeLimit | Number / Object | - | 图片文件大小限制，单位 KB。可选单位有：`'B' \| 'KB' \| 'MB' \| 'GB'`。示例一：`1000`。示例二：`{ size: 2, unit: 'MB', message: '图片大小不超过 {sizeLimit} MB' }`。TS 类型：`number \| SizeLimitObj` `interface SizeLimitObj { size: number; unit: SizeUnit ; message?: string }` `type SizeUnit = 'B' \| 'KB' \| 'MB' \| 'GB'`。[详细类型定义](https://github.com/Tencent/tdesign-react/tree/develop/src/upload/type.ts) | N
theme | String | file | 上传组件风格。`custom` 表示完全自定义风格；`file` 表示默认文件上传风格；`file-flow` 表示文件批量上传；`file-input` 表示输入框形式的文件上传；`image` 表示默认图片上传风格；`image-flow` 表示图片批量上传。可选项：custom/file/file-flow/file-input/image/image-flow | N
value | Array | [] | 已上传文件列表，同 `files`。TS 类型：`Array<T>` | N

### Upload Events

名称 | 参数 | 说明
-- | -- | --
onChange | `(value: Array<T>, context: UploadChangeContext) => void` | 已上传文件列表发生变化时触发，`trigger` 表示触发本次的来源
onFail | `(options: UploadFailContext) => void` | 上传失败后触发
onSelectChange | `(files: File[], context: UploadSelectChangeContext) => void` | 选择文件或图片之后，上传之前，触发该事件
onSuccess | `(context: SuccessContext) => void` | 上传成功后触发
onValidate | `(context: { type: UploadValidateType, files: UploadFile[] }) => void` | 文件上传校验结束事件，文件数量超出、文件大小超出限制等场景会触发

### UploadFile

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
lastModified | Number | - | 上一次变更的时间 | N
name | String | - | 文件名称 | N
percent | Number | - | 下载进度 | N
raw | Object | - | 原始文件对象。TS 类型：`File` | N
response | Object | - | 上传接口返回的数据。`response.error` 存在时会判断此次上传失败，并显示错误文本信息；`response.url` 会作为文件上传成功后的地址，并使用该地址显示图片。TS 类型：`{ [key: string]: any }` | N
size | Number | - | 文件大小 | N
status | String | - | 文件上传状态：上传成功，上传失败，上传中，等待上传。TS 类型：` 'success' \| 'fail' \| 'progress' \| 'waiting'` | N
type | String | - | 文件类型 | N
uploadTime | String | - | 上传时间 | N
url | String | - | 文件上传成功后的下载/访问地址 | N