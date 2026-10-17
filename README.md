# ZCode UI Shell

本仓库已裁成**前端界面壳**：保留共享 UI（`packages/ui`）与 Vite Web 入口（`packages/web`），去掉 Agent CLI、Desktop Host、Server 等后端运行时。

## 保留的包

| 包 | 作用 |
| --- | --- |
| `packages/ui` | 主界面组件、hooks、Zustand store |
| `packages/web` | Vite 壳入口（mock platform + mock services） |
| `packages/shared` | 协议与类型 |
| `packages/services` | 服务接口（壳内用 Proxy mock） |
| `packages/rpc` / `packages/provider` / `packages/provider-node` / `packages/model-option-map` / `packages/zcode-cua` | UI/services 编译期依赖 |

## 启动

```bash
pnpm install
pnpm dev
```

浏览器打开 Vite 提示的本地地址（默认 `http://localhost:5173`）。

壳模式不连接真实 Agent / Desktop / Server。`packages/web/src/shell/` 用 mock platform + mock services 挂载 `@zcode/ui` 的 `Root`，可预览侧栏、对话工作区、设置入口与 onboarding 壳层。

## 说明

- 设计规范仍见 `DESIGN.md`。
- 已删除：`apps/zcode-cli`、`packages/desktop`、`packages/server`、远控/分享等后端与宿主运行时，以及桌面发行脚本、第三方声明、Electron/E2E 文档等壳外材料。
- 文档仅保留 `docs/ui`、`docs/design`、`docs/chat`；脚本仅保留 `clean` / Node 版本检查 / lint-staged 相关入口。
- mock 只覆盖首屏与壳层展示；真实对话、文件、Git、Agent 能力不可用。
- 若要完整产品能力，请回到未裁剪的完整 monorepo。
