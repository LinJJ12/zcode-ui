import type { IServiceAccessor } from "@zcode/services";
import type { AppSettings, UserInfo } from "@zcode/shared";

const SHELL_USER: UserInfo = {
  id: "shell-user",
  username: "shell",
  displayName: "Shell Preview",
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: "zai-dark",
  locale: "zh-CN",
  recentProjects: [],
  askUserQuestionAutoResolutionEnabled: true,
  modelIoFullRetentionEnabled: false,
} as AppSettings;

const SHELL_WORKSPACE_PATH = "shell://conversation";

let subscriptionSeq = 0;

function nextSubscribeAck() {
  subscriptionSeq += 1;
  return {
    subscriptionId: `shell-sub-${subscriptionSeq}`,
    mode: "snapshot" as const,
    logEpoch: "shell-epoch-1",
  };
}

function createDisposable() {
  return { dispose: () => {} };
}

function isEventMethod(name: string): boolean {
  return (
    name.startsWith("on") ||
    name === "subscribe" ||
    name === "watch" ||
    name.endsWith("Changed") ||
    name.endsWith("Updated") ||
    name.endsWith("Listener")
  );
}

function createEventMethod() {
  // 事件有两种形态：onX(listener) 直接返回 disposable，
  // 以及 onX()(listener) 这种先取 Event 再订阅。两种都要能被调用。
  return (...args: unknown[]) => {
    if (args.some((arg) => typeof arg === "function")) {
      return createDisposable();
    }
    return (..._inner: unknown[]) => createDisposable();
  };
}

function createServiceMethod(serviceName: string, method: string): unknown {
  if (serviceName === "broadcastService") {
    if (method === "onMessage") return () => createDisposable();
    if (method === "send") return async () => {};
  }

  if (serviceName === "settingService") {
    if (method === "get") return async () => ({ ...DEFAULT_SETTINGS });
    if (method === "update") return async () => ({ ...DEFAULT_SETTINGS });
  }

  if (serviceName === "oauthService") {
    if (method === "restoreCachedSessionState") {
      return async () =>
        ({
          status: "authenticated",
          userInfo: SHELL_USER,
        }) as const;
    }
    if (method === "restoreCachedSession") return async () => SHELL_USER;
    if (method === "getActiveProvider") return async () => null;
    if (method === "getProviders") return async () => [];
  }

  if (serviceName === "modelSelectionService" || serviceName === "providerSettingsService") {
    if (method === "getView") {
      return async () => ({
        revision: 0,
        providers: [],
      });
    }
  }

  if (serviceName === "codingPlanSubscriptionService") {
    if (method === "getDynamicWorkflowClientConfig") {
      return async () => ({ enabled: false });
    }
  }

  if (serviceName === "usageStatsService") {
    // 壳模式没有 agent 数据库：返回结构完整的空快照，而不是让兜底对象流到图表里。
    // 图表/热力图会直接迭代 dailyModelUsage、heatmap.weeks，字段缺失会把整块设置页打进错误边界。
    if (method === "getAppUsageSnapshot") {
      return async ({ range }: { range?: string }) =>
        createEmptyAppUsageSnapshot((range ?? "all") as AppUsageRange);
    }
    if (method === "getCodingPlanUsageSnapshot" || method === "getSnapshot") {
      return async () => null;
    }
  }

  if (serviceName === "systemService") {
    if (method === "info") {
      return async () => ({
        homedir: "/shell-home",
        platform: "linux",
      });
    }
    // 壳模式没有本机 Host，终端 shell 枚举必须返回数组：
    // 调用方直接 .map / .find，返回兜底对象会让整个设置页进错误边界。
    if (method === "listIntegratedTerminalShells" || method === "getIntegratedTerminalShells") {
      return async () => [];
    }
    if (method === "listShells" || method === "getShells" || method === "detectShells") {
      return async () => [];
    }
  }

  if (serviceName === "fileService") {
    if (method === "ensureConversationWorkspace") {
      return async () => ({
        path: SHELL_WORKSPACE_PATH,
        created: false,
        workspacePurpose: "conversation" as const,
      });
    }
    if (method === "createDefaultWorkspace" || method === "createScratchWorkspace") {
      return async () => ({ path: SHELL_WORKSPACE_PATH });
    }
    if (method === "readdir" || method === "searchWorkspaceFiles") {
      return async () => [];
    }
    if (method === "checkFilesExist") {
      return async ({ paths }: { paths: string[] }) =>
        paths.map((path) => ({ path, exists: path === SHELL_WORKSPACE_PATH }));
    }
    if (method === "stat") {
      return async () => ({
        path: SHELL_WORKSPACE_PATH,
        isDirectory: true,
        isFile: false,
        size: 0,
        mtimeMs: Date.now(),
      });
    }
    if (method === "resolvePath") {
      return async ({ path }: { path: string }) => path;
    }
  }

  if (serviceName === "zcodeTaskService") {
    if (method === "listTasks" || method === "list" || method === "queryTasks") {
      return async () => ({ tasks: [], items: [] });
    }
    if (method === "getSessionsIndex" || method === "listSessions") {
      return async () => ({ sessions: [] });
    }
  }

  if (serviceName === "windowControllerService") {
    if (method === "subscribeControllerV4" || method === "resyncControllerV4") {
      return async () => ({ ack: nextSubscribeAck() });
    }
    if (method === "unsubscribeControllerV4") return async () => {};
    if (method === "listOpenWorkspaces" || method === "getOpenWorkspaces") {
      return async () => ({ workspaces: [] });
    }
    if (
      method === "listTaskList" ||
      method === "queryTasks" ||
      method === "listTasks" ||
      method === "listPinnedTasks"
    ) {
      return async () => ({ items: [], total: 0, hasMore: false });
    }
  }

  if (serviceName === "zcodeAgentService") {
    if (
      method === "subscribeSessionsIndexV4" ||
      method === "resyncSessionsIndexV4" ||
      method === "subscribeWorkspaceConfigV4" ||
      method === "subscribeConversationV4"
    ) {
      return async () => ({ ack: nextSubscribeAck() });
    }
    if (
      method === "unsubscribeSessionsIndexV4" ||
      method === "unsubscribeWorkspaceConfigV4" ||
      method === "unsubscribeConversationV4"
    ) {
      return async () => {};
    }
    if (method === "syncAppRuntimePreferences" || method === "syncDynamicWorkflowUserMode") {
      return async () => {};
    }
  }

  if (serviceName === "subagentsService") {
    if (method === "list" || method === "listAgents" || method === "getWorkspaceContext") {
      return async () => ({ agents: [] });
    }
  }

  if (serviceName === "pluginManagementService") {
    if (method === "listPlugins") {
      return async () => ({ plugins: [], diagnostics: [] });
    }
    if (method === "getPluginsOverview") {
      return async () => ({
        marketplaces: [],
        availablePlugins: [],
        installedPlugins: [],
        restorableBuiltins: [],
        diagnostics: [],
        capability: { supported: true },
      });
    }
    if (method === "getPluginReferenceCatalog") {
      return async () => ({ plugins: [], diagnostics: [] });
    }
    if (
      method === "addPluginMarketplace" ||
      method === "removePluginMarketplace" ||
      method === "updatePluginMarketplace" ||
      method === "installPlugin" ||
      method === "uninstallPlugin" ||
      method === "updatePlugin" ||
      method === "restoreBuiltinPlugin" ||
      method === "setPluginEnabled" ||
      method === "configurePlugin" ||
      method === "validatePlugin" ||
      method === "cancelPluginOperation"
    ) {
      return async () => ({ diagnostics: [] });
    }
    if (method === "describePlugin") {
      return async () => ({
        pluginId: "",
        components: [],
        diagnostics: [],
      });
    }
  }

  if (serviceName === "clientConfigService") {
    if (method === "getSnapshot") {
      return async () => ({
        pluginStoreOrder: null,
        recommendedPlugins: [],
      });
    }
  }

  if (serviceName === "skillsService") {
    if (method === "list" || method === "listSkills" || method === "getOverview") {
      return async () => ({ skills: [], items: [], diagnostics: [] });
    }
  }

  if (serviceName === "pluginsService" || serviceName === "mcpSyncService") {
    if (method.startsWith("list") || method.startsWith("get") || method.startsWith("load")) {
      return async () => ({ servers: [], items: [], plugins: [], diagnostics: [] });
    }
  }

  if (serviceName === "botsService") {
    if (method === "syncAppRuntimePreferences") return async () => {};
  }

  if (isEventMethod(method)) {
    return createEventMethod();
  }

  // 订阅类 RPC 统一回空 ACK，避免 Zod/下游读 .ack 崩掉。
  if (method.startsWith("subscribe") || method.startsWith("resync")) {
    return async () => ({ ack: nextSubscribeAck() });
  }

  // 列表类读路径统一空集合，避免 `.items` / `.servers` 一类解构崩掉。
  if (
    method.startsWith("list") ||
    method.startsWith("query") ||
    method.startsWith("search") ||
    method.startsWith("get")
  ) {
    return async () => ({
      items: [],
      tasks: [],
      sessions: [],
      servers: [],
      agents: [],
      total: 0,
      hasMore: false,
      exists: false,
      handled: true,
      summary: { branch: null, dirty: false, ahead: 0, behind: 0 },
      code: "ok",
      path: null,
      isMaximized: false,
    });
  }

  return async () => {
    // 壳模式：未特化的服务方法统一空成功，避免 Root 启动链路因缺 Host 崩溃。
    return {
      items: [],
      servers: [],
      agents: [],
      total: 0,
      hasMore: false,
      exists: false,
      handled: true,
      summary: { branch: null, dirty: false, ahead: 0, behind: 0 },
      code: "ok",
    };
  };
}

function createServiceProxy(serviceName: string): object {
  const methods = new Map<string, unknown>();
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (typeof prop === "symbol") return undefined;
        const method = String(prop);
        const cached = methods.get(method);
        if (cached !== undefined) return cached;
        const created = createServiceMethod(serviceName, method);
        methods.set(method, created);
        return created;
      },
    },
  );
}

/**
 * 用 Proxy 拼出 IServiceAccessor：特化首屏关键读路径，其余方法空成功。
 * 不连接 Agent / Desktop Host / Server。
 */
export function createShellServices(): IServiceAccessor {
  const services = new Map<string, object>();
  return new Proxy({} as IServiceAccessor, {
    get(_target, prop) {
      if (typeof prop === "symbol") return undefined;
      const name = String(prop);
      const existing = services.get(name);
      if (existing) return existing;
      const created = createServiceProxy(name);
      services.set(name, created);
      return created;
    },
  });
}
