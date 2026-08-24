:: BASE_DOC ::

## API

### ChatLoading Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets) | N
innerClass | String | - | shadowDOM className of component | N
innerStyle | Object | - | shadowDOM CSS(Cascading Style Sheets) | N
animation | String | moving | Typescript: `ChatLoadingAnimation` `type ChatLoadingAnimation = 'skeleton' \| 'moving' \| 'gradient' \| 'circle' \| 'dots'`。[see more ts definition](https://github.com/TDesignOteam/tdesign-web-components/blob/develop/packages/components/chat-loading/type.ts) | N
text | String | - | text of chat loading | N
