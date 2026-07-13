# 开发前准备

熟悉Web Components 框架：[OMI](https://omi.cdn-go.cn/home/latest/zh/introduction.html)

# 开发指南

tdesign-web-components 包含主代码和一个子仓库，子仓库指向 [tdesign-common](https://github.com/Tencent/tdesign-common) 仓库

## 公共子仓库 tdesign-common

本项目以子仓库的形式引入 tdesign-common 公共仓库，对应 `packages/common` 目录，由于 Tdesign React/Vue 等组件库已相对成熟，我们涉及到开发 common 部分的比较少，主要是复用其中已经定义过的样式 class 和方法，包括：

- 一些公共的工具函数
- 组件库 UI 开发内容，即 html 结构和 css 样式（React/Vue 等多技术栈共用）

### 初始化子仓库

- 初次克隆代码后需要初始化子仓库：`git submodule update --init packages/common`
- git submodule update 之后子仓库不指向任何分支，只是一个指向某一个提交的游离状态

### 子仓库开发

子仓库组件分支从 develop checkout 示例：feature/button，提交代码时先进入子仓库完成提交，然在回到主仓库完成提交

- 先进入 `packages/common` 文件夹，正常将样式修改添加提交
- 回到主仓库，此时应该会看到 `packages/common` 是修改状态，按照正常步骤添加提交即可

## 开发规范

### API 规范

[API](./packages/common/api.md)

### 前缀

组件和 css 前缀以 t- 开头，无论 js 还是 css 都使用变量定义前缀，方便后续替换

### js

遵循 eslint-config-airbnb-base 编码规范

使用 `npm run lint:fix` 执行自动修复 eslint 错误

### css

组件样式在 common 子仓库开发，类名使用 [BEM 命名规则](http://getbem.com/)

### git

#### 分支

主仓库遵循使用 git flow 规范，从 main checkout分支：[https://nvie.com/posts/a-successful-git-branching-model/](https://nvie.com/posts/a-successful-git-branching-model/)

如果是贡献新组件，分支名如：feat/button，如果是已有组件新增功能分支名如：feat/button_supporttext，如果是已有组件修复bug分支名如：fix/button_border，记得如果同时要在子仓库开发 UI，子仓库也要 checkout 同名分支

#### 提交说明

项目使用基于 angular 提交规范：[https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)

每次提交会自动触发提交验证

- 使用工具 commitizen 协助规范 git commit 信息
- fix & feat 的提交会被用来生成 changelog
- 提交会触发 git pre-commit 检查，修复提示的 eslint 错误

具体细节可参考`package.json husky 配置`

##### 提交步骤

1. 选择并确认好需要提交的代码
2. 考虑到可视化工具的差异，建议使用命令行提交，输入 `git commit`，然后根据提示逐步输入必要的信息即可

**windows 用户注意事项：** 由于 husky 中配置的 git hook 指令依赖 shell 执行环境，为了保证正常的提交，建议在 git bash 或 [windows 10 wsl 环境](https://docs.microsoft.com/en-us/windows/wsl/install-win10) 下执行提交。

## 开发

### 安装依赖

```bash
npm i
```

### 本地开发

```shell
npm run start
```

浏览器访问 <http://127.0.0.1:15000>

### 目录结构

```shell
.
├── packages/
│   ├── common/                         # tdesign-common 子仓库（submodule）
│   │   ├── js/                         # 跨端公共 JS（构建时 bundle 进 UI/Chat 发布包）
│   │   └── style/                      # 跨端公共 Less 样式
│   ├── components/                     # UI 组件源码 (@tdesign/components)
│   ├── pro-components/
│   │   └── chat/                       # Chat 组件源码
│   ├── shared/                         # WC 专用工具源码（构建时 bundle 进发布包）
│   ├── tdesign-web-components/         # UI npm 发布包 @tdesign/web-components
│   │   ├── CHANGELOG.md
│   │   ├── lib|esm|cjs|dist/           # vite build 产物
│   │   └── site/                       # UI 文档站
│   ├── tdesign-web-components-chat/    # Chat npm 发布包 @tdesign/web-components-chat
│   │   ├── CHANGELOG.md
│   │   └── site/                       # Chat 文档站
│   └── vite-config/                    # 共享构建配置
```

### 发布包架构

| 包名 | 源码 | 用户安装 |
|------|------|----------|
| `@tdesign/web-components` | `packages/components` | 基础 UI 组件 |
| `@tdesign/web-components-chat` | `packages/pro-components/chat` | AI Chat（peer 依赖 UI 包） |

**构建与依赖策略**

- 构建入口：各发布包 `pnpm run build` → `vite build`（`@tdesign/vite-config`）
- 产物格式：`lib`（类型 + 声明邻近 JS）、`esm`、`cjs`、`dist`（UMD）
- `packages/common/js`、`packages/shared`：**内联进** `lib/esm/cjs`，不单独发 npm
- Chat 额外依赖：`@tdesign/ai-chat-engine`（dependencies）；`@tdesign/web-components`（peer）

**按需引入（Web Components）**

```javascript
// 注册自定义元素（副作用 import）
import '@tdesign/web-components/button';
import '@tdesign/web-components-chat/chatbot';

// 样式
import '@tdesign/web-components/lib/style/index.css';
```

`package.json` 的 `exports` 约定：`"."` 全量入口，`"./*"` 单组件（如 `/button`、`/chatbot`），`./lib/style/index.css` 公共样式。

**更新日志**

- UI：`packages/tdesign-web-components/CHANGELOG.md`
- Chat：`packages/tdesign-web-components-chat/CHANGELOG.md`

Chat 依赖 `@tdesign/ai-chat-engine`（`^0.1.0`）。npm 尚未发布时，需先在 [tdesign-ai-core](https://github.com/TDesignOteam/tdesign-ai-core) 的 `packages/chat-engine` 目录执行 `pnpm link --global`，再在本仓库根目录执行：

```bash
pnpm run link:ai
# 等价于 pnpm link --global @tdesign/ai-chat-engine
```

`@tdesign/ai-shared` 为 chat-engine 内部依赖，无需在主仓库单独安装或 link。

克隆后需初始化子模块：

```bash
git submodule update --init packages/common
```

### 新增开发组件

暂不支持命令行方式，需要参考button的组件结构手动复制一份目录结构，再改成自己的组件名.

### 组件页路由配置

每一个组件页，都是一个 md 文件，参考 `/site/sidebar.config.ts` 已有定义，直接按照模板添加即可

```javascript
{
  title: '基础组件',
  type: 'component', // 组件文档
  children: [
    {
        title: 'Button 按钮',
        name: 'button',
        path: '/components/button',
        component: () => import('@tdesign/web-components/button/README.md'),
    },
    ...
  ],
},
```

`packages/components/index.ts` 中也需要导出你新添加的组件，如：

```typescript
export * from './button';
```

### Demo 格式

目前支持 omi class 组件和 function 组件demo，前者适用于有状态的demo，后者适用于静态的demo展示，具体可参考`switch`组件

### 组件 Demo 演示配置

为了保证与 vue 等其他仓库演示文档内容统一，目前将公共基础演示 demo 与说明归档在 `packages/common/docs/web/api/[组件].md` 中，其中需要各个技术栈的组件提供文档里面所要求的基础 demo 文件否则会编译警告。

例如 `tooltip` 组件则需要 `_expample` 文件夹中包含有 `arrow.tsx`、 `noArrow.tsx` 文件

```md
# Tooltip 文字提示

用于文字提示的气泡框。

### 带箭头的文字提示

{{ arrow }}

...
```

如需额外添加演示 demo 的可以参考以下写法:

```md
{{ PrimaryButton }}
```

### Demo 调试

当一个 md 文件插入了很多个 demo 之后，一些组件生命周期方法调试起来会变得困难，若想对某个 demo 单独调试，可以访问路由：/demos/组件名/demo 名，如想单独调试 button 组件 demos 文件夹下的 base demo，则可点击 demo 旁的箭头或直接访问：<http://127.0.0.1:15000/react/demos/button/base>

所有 demo 路由列表页：<http://127.0.0.1:15000/react/demos>

### 组件测试参考

- [Jest](https://jestjs.io/)
- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro)

### 项目常用脚本说明

各源码包通过 `check:types`（prepare → shared 声明 → components 声明 → chat `--noEmit`）做全仓类型检查。发布构建由 `vite build` 直写 `packages/tdesign-web-components/{lib,esm,cjs,dist}`：`packages/common` 与 `packages/shared` 均作为包内 `_internal/*` 私有实现进入发布包，用户只需安装主包即可使用。

```bash
# 启动 UI 文档站
pnpm run start
# 编译 UI 文档站
pnpm run site:ui
# 编译 Chat 文档站
pnpm run site:chat
# 预览 UI 文档站
pnpm run preview:ui
# 编译全部组件库
pnpm run build
# 编译 UI 组件库（vite build → lib/esm/cjs/dist）
pnpm run build:ui
# 编译 Chat（含 UI）
pnpm run build:chat
# 生成 less 声明 + common 类型缓存 + shared/components 声明 + chat 类型检查
pnpm run check:types

# 自动修复 eslint 错误
pnpm run lint:fix
# 查看 eslint 错误
pnpm run lint
```
