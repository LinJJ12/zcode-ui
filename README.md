# ZCode UI

把 [zai-org/ZCode](https://github.com/zai-org/ZCode) 里和界面相关的源码单独留在这里，方便以后写别的项目时直接对照。

只贴上游仓库链接时，阅读范围经常停在 README 或少数文件。这个仓库把前端相关代码收在本地，组件、样式、状态和页面结构都可以按目录翻。

来源是上游的 Apache-2.0 代码，这里只做裁剪，方便查阅。

## 写新项目时先看哪

| 想参考什么 | 从这里开始 |
| --- | --- |
| 页面、组件、交互 | `packages/ui/src` |
| 设计规范 | [DESIGN.md](DESIGN.md)、`docs/design`、`docs/ui` |
| 对话与会话界面 | `docs/chat`、`packages/ui/src` 里对应的会话组件 |
| 状态 | `packages/ui/src/store`、`packages/ui/src/hooks` |
| 类型与协议形状 | `packages/shared` |
| 服务接口长什么样 | `packages/services`（本仓用 mock 接上，方便看调用方式） |
| 页面怎么挂起来 | `packages/web/src/shell` |

`packages/web` 是一个能打开的 Vite 入口，用来把 UI 跑起来看布局，不是完整产品。

## 本地看一眼界面

需要 Node.js **24+** 与 pnpm（见 [mise.toml](mise.toml)）。

```bash
pnpm install
pnpm dev
```

浏览器打开 Vite 提示的地址（默认 `http://localhost:5173`）。对话、文件、Git、登录这些需要后端的能力在这里是 mock，只为了把界面撑起来。

## 构建与部署

```bash
pnpm build        # 产物在 packages/web/dist
```

`dist` 是纯静态文件，丢到任意静态托管即可。构建用的是相对路径（`base: "./"`），
所以既能挂在站点根（`https://example.com/`），也能挂在子目录
（`https://example.com/zcode/`、GitHub Pages 项目页）。

本地预览构建产物：

```bash
pnpm --filter @zcode/web exec vite preview
```

## 界面能做什么、不能做什么

mock 只保证界面渲染，不代表功能可用：

- 模型选择器里的 **Shell Preview** 是占位 provider，用来让输入框显示完整形态。
  点发送不会有回复——壳里没有 agent 会话协议。
- 使用统计、任务列表、插件市场、MCP、技能、命令、钩子都是空列表。
  新建表单能打开、能提交，但数据不会落盘，刷新即恢复。
- Git 面板、终端、文件树需要真实工作区，这里只有空态。
- 「打开文件夹」走内置目录浏览器，选中的是虚构路径 `/shell-home`。

## 自查

```bash
node packages/web/scripts/smoke-shell.mjs http://localhost:5173/
```

输出一组 markers，`errorBoundary: false` 表示首屏没有落进错误边界。

## 目录

| 包 | 作用 |
| --- | --- |
| `packages/ui` | 主界面组件、hooks、Zustand store |
| `packages/web` | Vite 入口 |
| `packages/shared` | 协议与类型 |
| `packages/services` | 服务接口 |
| `packages/rpc` 等 | 上面这些包编译时还要用到的依赖 |

业务地址默认留空，见 `.env.example`。这个仓库的用途是对照源码，不需要连线上服务。

隐私与遥测边界见 [NOTICE.md](NOTICE.md)。请勿把真实密钥写入已跟踪的 env 占位文件。

## 许可

Apache-2.0，见 [LICENSE](LICENSE)。第三方说明见 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)。
