# Security

本仓库是从上游裁出的 UI 对照壳，不提供完整产品后端。

## 报告漏洞

请优先向上游 [zai-org/ZCode](https://github.com/zai-org/ZCode) 的安全渠道报告。若本仓裁剪代码本身有可复现问题，可在本仓 Issues 中描述（勿在公开 issue 中粘贴真实密钥、令牌或个人数据）。

## 本地配置

- 密钥与私有 endpoint 只放在未跟踪文件（例如 `.env.local`）。
- 已跟踪的 `.env.development` / `.env.production` / `.env.example` 应为占位；填入真实值后请勿提交。
