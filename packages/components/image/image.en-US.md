:: BASE_DOC ::

## API
### Image Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
alt | String | - | \- | N
error | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
fit | String | fill | options: contain/cover/fill/none/scale-down | N
gallery | Boolean | false | \- | N
lazy | Boolean | false | \- | N
loading | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
overlayContent | TNode | - | overlay on the top of image。Typescript：`string \| TNode`。[see more ts definition](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
overlayTrigger | String | always | options: always/hover | N
placeholder | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
position | String | center | \- | N
shape | String | square | options: circle/round/square | N
src | String | - | src attribute of `<img>` | N
srcset | Object | - | for `.avif` and `.webp` image url, load `srcset` before `src`。Typescript：`ImageSrcset`。[see more ts definition](./type.ts) | N
onError | Function |  | Typescript：`(context: { e: Event }) => void`<br/>trigger on image load failed | N
onLoad | Function |  | Typescript：`(context: { e: Event }) => void`<br/>trigger on image loaded | N
