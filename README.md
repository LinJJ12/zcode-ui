# Unofficial ZCode UI Shell

**非官方 / Unofficial.** 本仓库不是 [zai-org/ZCode](https://github.com/zai-org/ZCode) 的官方分支，也未获得 Z.ai / ZCode 商标或产品背书。

本仓库从已开源的 ZCode（Apache-2.0）裁剪而来，只保留**前端界面壳**，用于本地预览共享 UI。它不能替代完整产品，也不提供可用的 Agent、Desktop Host 或 Server。

完整产品与官方文档请使用上游：

- 源码：https://github.com/zai-org/ZCode
- 许可证：Apache-2.0（见本仓 [LICENSE](LICENSE)）

## 这个仓库能做什么

| 能力 | 状态 |
| --- | --- |
| 侧栏、对话工作区、设置入口、onboarding 等界面壳 | 可本地预览 |
| 真实对话、文件、Git、Agent、登录、支付 | **不可用**（mock） |
| Desktop / CLI / Server / 远控 | **已移除** |

`packages/web/src/shell/` 用 mock platform 与 mock services 挂载 `@zcode/ui` 的 `Root`，只覆盖首屏与壳层展示。

## 保留的包

| 包 | 作用 |
| --- | --- |
| `packages/ui` | 主界面组件、hooks、Zustand store |
| `packages/web` | Vite 壳入口 |
| `packages/shared` | 协议与类型 |
| `packages/services` | 服务接口（壳内由 Proxy mock） |
| `packages/rpc` 等 | UI / services 的编译期依赖 |

文档仅保留 `docs/ui`、`docs/design`、`docs/chat`。设计规范见 [DESIGN.md](DESIGN.md)。

## 启动

需要 Node.js **24+** 与 pnpm（版本见 [mise.toml](mise.toml)）。

```bash
pnpm install
pnpm dev
```

浏览器打开 Vite 提示的地址（默认 `http://localhost:5173`）。

壳模式默认**不**连接官方业务 API。若自行填写 `.env` 中的线上地址，请求可能打到第三方服务，请自行负责合规与配额。

## 许可与声明

- 第一方代码：[LICENSE](LICENSE)（Apache-2.0）
- 风险与归属摘要：[NOTICE.md](NOTICE.md)
- 第三方依赖说明：[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)
- 完整产品的第三方清单以上游仓库为准

「ZCode」「Z.ai」等名称仅用于说明代码来源；本仓库不授予商标使用权。

## Git 历史说明

当前工作树是裁剪后的 UI 壳，但仓库历史里仍可能包含裁剪前的完整 monorepo 快照。若你只想分发当前壳、不希望历史中的完整树被检出，请自行用 orphan 分支或新建无历史仓库再推送当前树；本 README 不替你完成该操作。

## 与上游的关系

| | 本仓库 | 上游 zai-org/ZCode |
| --- | --- | --- |
| 定位 | 非官方 UI 壳预览 | 官方完整产品源码 |
| 运行时 | mock，无 Agent / Host / Server | 桌面、Web、CLI 等完整链路 |
| 支持渠道 | 无官方支持 | 以上游仓库与官方渠道为准 |
