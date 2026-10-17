# ZCode UI Shell

基于 [zai-org/ZCode](https://github.com/zai-org/ZCode) 裁剪的**前端界面壳**，方便在本地预览共享 UI（侧栏、对话工作区、设置入口、onboarding 等）。

> 非官方社区衍生；与 Z.ai / 上游官方无隶属关系。完整产品请看上游仓库。

## 快速开始

需要 Node.js **24+** 与 pnpm（见 [mise.toml](mise.toml)）。

```bash
pnpm install
pnpm dev
```

浏览器打开 Vite 提示的地址（默认 `http://localhost:5173`）。

壳模式用 `packages/web/src/shell/` 里的 mock platform / mock services 挂载 `@zcode/ui`，**默认不连**真实 Agent、Desktop Host 或业务 API。

## 能做什么 / 不能做什么

| | |
| --- | --- |
| 可以 | 预览主界面壳层、设置入口、主题与布局相关 UI |
| 不可以 | 真实对话、文件、Git、登录支付、Agent 执行等 |

若要完整能力，请使用上游：[zai-org/ZCode](https://github.com/zai-org/ZCode)。

## 仓库里有什么

| 包 | 作用 |
| --- | --- |
| `packages/ui` | 主界面组件、hooks、Zustand store |
| `packages/web` | Vite 壳入口 |
| `packages/shared` | 协议与类型 |
| `packages/services` | 服务接口（壳内由 mock 承接） |
| `packages/rpc` 等 | UI / services 的编译期依赖 |

文档保留 `docs/ui`、`docs/design`、`docs/chat`；设计规范见 [DESIGN.md](DESIGN.md)。

## 配置说明

`.env*` 与 `config/default.json` 里的业务地址、社群链接默认留空，避免误连线上环境。需要联调时，在本地未跟踪的 `.env.local` 里自行填写即可。

## 许可

Apache-2.0，见 [LICENSE](LICENSE)。更多说明见 [NOTICE.md](NOTICE.md) 与 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)。

「ZCode」「Z.ai」仅用于说明代码来源。Git 历史中可能仍有裁剪前的完整树快照；若只想分发当前壳，可自行用 orphan 分支或新仓库推送当前工作树。
