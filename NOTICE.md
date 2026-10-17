# NOTICE

本仓库从 [zai-org/ZCode](https://github.com/zai-org/ZCode) 裁出前端相关源码，方便对照参考。完整产品声明以上游为准。

## 范围

- `packages/web` 通过 mock 挂载 `@zcode/ui`，用于界面预览
- 不提供可用的 Agent / Desktop Host / Server，也不等同于完整产品能力
- 若检出裁剪前的历史提交，行为边界请参考上游仓库

## 配置与网络

壳预览默认使用空的业务 endpoint。自行在 `.env` 中填写真实地址时，请求与配额由配置者负责。`config/default.json` 中的反馈与社群链接默认留空。

## 许可

- 第一方代码：[LICENSE](LICENSE)（Apache-2.0）
- 第三方说明：[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)
- 完整 monorepo 的第三方清单见上游  
  https://github.com/zai-org/ZCode/blob/main/THIRD-PARTY-NOTICES.md

Apache-2.0 不附带商标授权；名称仅用于说明来源。
