# NOTICE

本仓库从 [zai-org/ZCode](https://github.com/zai-org/ZCode) 裁出前端相关源码，方便对照参考。完整产品声明以上游为准。

## 范围

- `packages/web` 通过 mock 挂载 `@zcode/ui`，用于界面预览
- 不提供可用的 Agent / Desktop Host / Server，也不等同于完整产品能力
- 若检出裁剪前的历史提交，行为边界请参考上游仓库

## 配置与网络

壳预览默认使用空的业务 endpoint。自行在 `.env` 中填写真实地址时，请求与配额由配置者负责。`config/default.json` 中的反馈与社群链接默认留空。

## 隐私与遥测

- **壳预览（`pnpm dev` / `packages/web`）**：Vite 将业务 base URL 与 OAuth client id 置空；平台 mock 将遥测上报做成空操作。未自行填写 endpoint 时，不应向业务后端上报事件或登录。
- **遥测能力残留**：源码中仍保留 ARMS / 事件上报路径；仅当构建注入非空的 `ZCODE_TELEMETRY_REPORT_ENDPOINT` / `ZCODE_ARMS_RUM_ENDPOINT` 时才会上报（可能含设备标识等）。本仓壳构建不注入这些地址。
- **公开产品地址**：部分源码与测试仍出现 `zcode.z.ai`、`cdn-zcode.z.ai`、`chat.z.ai` 等公开域名，以及文档化的 OAuth `client_id`（公开应用标识，不是 secret）。空会话推荐卡图标已改为本地占位，壳预览不会为此请求官方 CDN；插件市场配置里仍保留公开 CDN manifest 地址，仅在接上真实插件服务并刷新时才会访问。
- **本地密钥**：真实密钥只放在未跟踪的 `.env.local` 等文件；勿改写已跟踪的空 `.env.development` / `.env.production` 后提交。
- **Git 历史**：若发布完整历史，作者邮箱会出现在 `git log` 中；需要隐藏身份时请自行改写历史或仅发布压缩后的新根提交。

## 许可

- 第一方代码：[LICENSE](LICENSE)（Apache-2.0）
- 第三方说明：[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)
- 完整 monorepo 的第三方清单见上游  
  https://github.com/zai-org/ZCode/blob/main/THIRD-PARTY-NOTICES.md

Apache-2.0 不附带商标授权；名称仅用于说明来源。
