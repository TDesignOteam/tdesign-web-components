# 版本发布流程

## 发布频率

组件库正常每两周滚动发布版本，一般在周三/周四，尽量不在周五或晚上发布，防止周末非工作时间响应不及时

如果遇到用户要求紧急修复 bug，可以视情况发布 PATCH 或先行版本，判断标准：

- 影响范围大，大多数用户都可能会遇到问题：请遵照正常发布流程严格测试产物质量及整理 CHANGELOG 后发布 PATCH 版本，以使用户可以自动更新到
- 新上线的功能，仅有少量用户使用：可以不整理 changelog，直接发布先行版本供用户使用，如 `x.y.z-alpha`

## Monorepo 发布包（1.3.1-alpha.11 起）

本仓库对外发布两个 npm 包，版本号需保持一致：

| 包 | 路径 | CHANGELOG |
|----|------|-----------|
| `@tdesign/web-components` | `packages/tdesign-web-components/package.json` | `packages/tdesign-web-components/CHANGELOG.md` |
| `@tdesign/web-components-chat` | `packages/tdesign-web-components-chat/package.json` | `packages/tdesign-web-components-chat/CHANGELOG.md` |

`1.2.x` 及更早合包时期的历史记录已并入 UI 包 CHANGELOG 的「历史版本」章节。

发布前检查：

```bash
pnpm run check:types
pnpm run build:chat
# 确认 lib 中无 mock 目录、无 external @tdesign/common-js / @tdesign/web-components-shared
```

## 发布流程

- 从 `develop` 新建 `release/x.y.z` 分支，并修改 **两个发布包** `package.json` 中的版本号，推送分支至远程仓库，并提交一个合入 `develop` 的 Pull Request 到仓库
- 仓库的 Github Action 会自动整理上个版本至今 commit 对应的 CHANGELOG draft，并作为评论推送到该 Pull Request 上
- 发布人检查 CHANGELOG，按 UI / Chat 拆分写入各自 `packages/*/CHANGELOG.md`，并优化内容逻辑结构
- 确认无误后删除对应评论的首行提示（即 `删除此行代表确认该日志` 所在行）；确认后 Action 将内容写入 `packages/tdesign-web-components/CHANGELOG.md`（UI 主日志，含历史归档）
- 确认无误后，合并分支入 `develop`
- 合入 `develop` 后，仓库会触发 Github Action 合入 `main` 分支，并将版本号作为 `tag` 打在仓库上，并触发 Github Action 执行 npm 版本发布流程
- 合入 `main` 分支后，站点的部署流水线 web hook 会监听到 `main` 分支的新增 commit，并触发流水线，官网更新站点
