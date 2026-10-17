# Third-party notices (UI shell)

本仓库是从 [zai-org/ZCode](https://github.com/zai-org/ZCode) 裁剪出的非官方 UI 壳。完整产品依赖图、复制源码、原生二进制与 NOTICE 原文以**上游仓库**为准：

https://github.com/zai-org/ZCode/blob/main/THIRD-PARTY-NOTICES.md

## 本壳如何处理依赖许可

1. 运行 `pnpm install` 后，各 npm 包的许可证文本位于对应 `node_modules/<package>/`（或包内 `LICENSE*` / `NOTICE*`）。
2. 工作区生产依赖以根目录 `pnpm-lock.yaml` 与各 `package.json` 为准；本仓不再维护已删除的 `third-party/inventory.json` 生成流水线。
3. UI 相关第三方组件（例如通过 skills / 文档引用的上游片段）若要求保留 NOTICE，请同时遵守其原始条款；技能文档中指向根 `THIRD-PARTY-NOTICES.md` 的链接，在完整产品语境下指上游文件。

## 说明

- 包元数据中的 license 字段仅供识别，不能替代原许可全文。
- 本文件不声称已枚举当前 `pnpm-lock.yaml` 中的每一个传递依赖；再分发二进制或打包产物前，请按你的分发物重新生成或核对第三方清单。
- 第一方代码许可见 [LICENSE](LICENSE)；产品范围与风险见 [NOTICE.md](NOTICE.md)。
