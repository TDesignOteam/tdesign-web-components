# 开发前准备

熟悉Web Components 框架：[OMI](https://omi.cdn-go.cn/home/latest/zh/introduction.html)

# 开发指南

tdesign-web-components 包含主代码和一个子仓库，子仓库指向 [tdesign-common](https://github.com/Tencent/tdesign-common) 仓库

## 公共子仓库 tdesign-common

本项目以子仓库的形式引入 tdesign-common 公共仓库，对应 src/\_common 文件夹，由于Tdesign React/Vue等组件库已相对成熟，我们涉及到开发common部分的比较少，主要是复用其中已经定义过的样式class和方法，包括：

- 一些公共的工具函数
- 组件库 UI 开发内容，既 html 结构和 css 样式（React/Vue 等多技术栈共用）

### 初始化子仓库

- 初次克隆代码后需要初始化子仓库： git submodule init && git submodule update
- git submodule update 之后子仓库不指向任何分支，只是一个指向某一个提交的游离状态

### 子仓库开发

子仓库组件分支从 develop checkout 示例：feature/button，提交代码时先进入子仓库完成提交，然在回到主仓库完成提交

- 先进入 common 文件夹，正常将样式修改添加提交
- 回到主仓库，此时应该会看到 common 文件夹是修改状态，按照正常步骤添加提交即可

## 开发规范

### API 规范

[API](./src/_common/api.md)

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
├── site # 站点代码
├── src # 组件代码
├── src/[组件]/__tests__ # 测试文件
├── src/[组件]/_example # 演示文件
├── test # 测试配置
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
        component: () => import('tdesign-web-components/button/README.md'),
    },
    ...
  ],
},
```

### Demo 格式

目前支持 omi class 组件和 function 组件demo，前者适用于有状态的demo，后者适用于静态的demo展示，具体可参考`switch`组件

### 组件 Demo 演示配置

为了保证与 vue 等其他仓库演示文档内容统一，目前将公共基础演示 demo 与说明归档在 `src/_common/docs/web/api/[组件].md` 中，其中需要各个技术栈的组件提供文档里面所要求的基础 demo 文件否则会编译警告。

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

```bash
# 启动项目
npm run start
# 更新网站组件单元覆盖率徽章
npm run update:coverage-badge
# 编译站点
npm run site
# 编译站点预览
npm run site:preview
# 编译组件库
npm run build
# 快速创建组件及其相关文件（暂不支持）
npm run init

# 运行全部单元测试用例(包括所有example的ssr测试)
npm run test
# 运行全部单元测试用例
npm run test:unit
# 运行指定组件单元测试用例，xxx表示组件目录名称, 多个组件用空格分开
# eg: npm run test:unit button affix
npm run test:unit xxx

# 运行全部e2e测试用例
npm run test:e2e
# 运行指定组件（空格分割）e2e测试用例，xxx表示组件目录名称
npm run test:e2e xxx
# gui模式运行查看e2e测试用例
npm run test:e2e-gui

# 更新测试用例snapshot
npm run test:update

# 生成测试覆盖率
npm run update:coverage-badge
# 生成分组件格式化后的覆盖率到site/test-coverage.js，区分unit和e2e

# 自动修复 eslint 错误
npm run lint:fix
# 查看 eslint 错误
npm run lint
```
