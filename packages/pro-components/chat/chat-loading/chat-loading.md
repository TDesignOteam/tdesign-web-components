:: BASE_DOC ::

## API

### ChatLoading Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式 | N
innerClass | String | - | shadowDOM 类名 | N
innerStyle | Object | - | shadowDOM 样式 | N
animation | String | moving | 加载的状态形式。TS 类型：`ChatLoadingAnimation` `type ChatLoadingAnimation = 'skeleton' \| 'moving' \| 'gradient' \| 'circle' \| 'dots'`。[详细类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/develop/src/chat-loading/type.ts) | N
text | String | - | 加载过程展示的文字内容 | N
