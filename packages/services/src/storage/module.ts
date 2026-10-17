/**
 * storage 模块清单：设置页「存储管理」的磁盘占用扫描与清理。
 * 对外只暴露 contract.ts。
 */
export const storageModule = {
  id: "storage",
  requires: ["shared", "rpc", "services"],
  provides: ["storage-service"],
  publicEntrypoints: ["contract.ts"],
} as const;
