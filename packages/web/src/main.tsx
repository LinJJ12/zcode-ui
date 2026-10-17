import { createRoot } from "react-dom/client";
import {
  AppErrorBoundary,
  Root,
  ZCodeIntlProvider,
  setStreamClientId,
} from "@zcode/ui";
import "@zcode/ui/styles.css";
import { createShellPlatform } from "./shell/mockPlatform.js";
import { createShellServices } from "./shell/mockServices.js";

/**
 * 前端界面壳入口：不启动 server / desktop host / agent。
 * 用 mock platform + mock services 挂载共享 Root，便于单独预览 UI 壳。
 */
const platform = createShellPlatform();
const services = createShellServices();

setStreamClientId(platform.getDeviceId?.() ?? "shell-device");

createRoot(document.getElementById("root")!).render(
  <AppErrorBoundary>
    <ZCodeIntlProvider
      settingService={services.settingService}
      broadcastService={services.broadcastService}
      resolveSystemLocale={platform.getSystemLocale}
    >
      <Root
        services={services}
        platform={platform}
        isDesktop={false}
        restoreSession={false}
        supportsSettings
        allowOpenWorkspace
        allowRemoteWorkspace={false}
        preferDirectoryBrowser
        webRemoteControlFeatureEnabled={false}
      />
    </ZCodeIntlProvider>
  </AppErrorBoundary>,
);
