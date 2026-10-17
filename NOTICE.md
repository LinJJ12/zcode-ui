# NOTICE — Unofficial ZCode UI Shell

本文件适用于本仓库**当前工作树**所公开的源码及其构建产物。本仓库为基于 [zai-org/ZCode](https://github.com/zai-org/ZCode) 的非官方衍生裁剪，不是官方产品发行物。

## 一、产品范围与风险

当前树仅提供前端界面壳预览：

- 通过 `packages/web` 的 mock platform / mock services 挂载 `@zcode/ui`
- **不**连接真实 Agent、Desktop Host 或 Server
- **不**提供可用的对话执行、文件操作、Git、支付、远控等产品能力

界面外观与上游产品相似，不代表功能可用，也不代表获得官方支持或背书。AI 相关文案、占位状态和设置页展示可能不完整或与真实产品不一致；勿将其当作安全或合规保证。

若检出或构建 Git 历史中裁剪之前的提交，行为边界以上游完整产品的声明为准，而不是本文件对「当前壳」的描述。

## 二、网络与配置

壳预览默认使用空的业务 endpoint（见 `packages/web/vite.config.ts`）。仓库内 `.env*` 示例已改为占位符；填写真实地址后产生的请求、配额与合规责任由配置者自行承担。

`config/default.json` 中的反馈与社群链接已清空，避免误导用户进入官方渠道并声称来自本非官方仓库。

## 三、本地数据与凭据

浏览器本地存储可能保存主题、语言等 UI 偏好。不要把真实密钥、token 或私人数据写入版本控制跟踪的文件。本壳不提供与完整产品同等的凭据加密或审计能力。

## 四、许可与第三方

- 第一方代码：[LICENSE](LICENSE)（Apache-2.0）
- 第三方依赖说明：[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)
- 完整 monorepo 的第三方清单与原生组件声明，见上游  
  https://github.com/zai-org/ZCode/blob/main/THIRD-PARTY-NOTICES.md

Apache-2.0 不授予「ZCode」「Z.ai」等商标使用权，仅允许合理说明代码来源。本仓库的修改不改变上游或其他权利人的权利。
