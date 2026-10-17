import type { IPlatformService } from "@zcode/shared";

const noopAsync = async () => {};
const noopDispose = () => {};

/**
 * 前端壳专用平台桥：无 Electron / 无远端 Host。
 * Proxy 兜底未列出的方法，避免 IPlatformService 面扩大导致壳编译失败。
 */
export function createShellPlatform(): IPlatformService {
  const base = {
    canSelectFilePath: false,
    selectDirectory: async () => null,
    selectFile: async () => null,
    selectFiles: async () => [],
    onRemoteConnectionLog: () => noopDispose,
    onRemoteSessionClosed: () => noopDispose,
    onBotRemoteWorkspaceReconnected: () => noopDispose,
    activateOrSetWorkspace: async () => ({ activated: false }),
    connectRemote: async () => ({ success: false, error: "shell-mode: remote unavailable" }),
    cancelPendingRemoteConnection: noopAsync,
    startWebRemoteControl: async () => ({
      success: false,
      error: "shell-mode: web remote control unavailable",
    }),
    refreshWebRemoteControlPairing: async () => ({
      success: false,
      error: "shell-mode: web remote control unavailable",
    }),
    stopWebRemoteControl: noopAsync,
    getWebRemoteControlStatus: async () => ({ enabled: false }),
    disposeRemoteSession: noopAsync,
    isDockerAvailable: async () => false,
    listWSLDistros: async () => [],
    listDockerContainers: async () => [],
    listSSHConfigAliases: async () => [],
    openExternal: (url: string) => {
      window.open(url, "_blank", "noopener,noreferrer");
    },
    openFeedback: noopAsync,
    openCommunity: noopAsync,
    canOpenCommunity: async () => false,
    openInFileManager: async () => ({ success: false, error: "shell-mode" }),
    registerOAuthState: () => {},
    onOAuthCallback: () => noopDispose,
    onPaymentCallback: () => noopDispose,
    notifyRendererReady: () => {},
    showTaskNotification: () => {},
    reportTelemetryEvent: noopAsync,
    reportArmsCustomEvent: noopAsync,
    syncWindowTabs: () => {},
    syncWebRemoteControlTasks: () => {},
    syncWindowUnreadCount: () => {},
    syncActiveTaskSession: () => {},
    log: () => {},
    getDeviceId: () => "shell-device",
    getSystemLocale: () => navigator.language || "zh-CN",
    getDataBaseDir: async () => "",
    getDefaultShell: async () => "",
    getShells: async () => [],
    detectShell: async () => null,
    isWindowsDesktop: () => false,
    onSettingsChanged: () => noopDispose,
    getUpdateState: async () => ({ kind: "idle" as const, enabled: false }),
    onUpdateStateChanged: () => noopDispose,
    getDesktopWindowChromeState: async () => ({ isMaximized: false }),
    onDesktopWindowChromeStateChanged: () => noopDispose,
    loadMcpFromUserDirectory: async () => ({ servers: [], success: true }),
    saveMcpToUserDirectory: async () => ({ success: true }),
    migrateLegacyCommonMcp: async () => ({ migrated: false }),
  };

  const methodCache = new Map<string | symbol, unknown>();

  return new Proxy(base, {
    get(target, prop, receiver) {
      if (prop in target) {
        return Reflect.get(target, prop, receiver);
      }
      if (typeof prop === "symbol") return undefined;
      const cached = methodCache.get(prop);
      if (cached !== undefined) return cached;
      const name = String(prop);
      const method = name.startsWith("on")
        ? () => noopDispose
        : (..._args: unknown[]) => {
            // 壳模式：其余平台能力一律空成功对象，避免调用方读字段崩掉。
            return Promise.resolve({
              success: true,
              servers: [],
              exists: false,
              handled: true,
              isMaximized: false,
              enabled: false,
            });
          };
      methodCache.set(prop, method);
      return method;
    },
  }) as unknown as IPlatformService;
}
