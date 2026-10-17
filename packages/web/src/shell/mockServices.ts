/* oxlint-disable max-lines -- 壳模式的「服务方法 → 空数据结构」对照表必须集中在一处，
   拆文件会让「某接口被裁剪后返回什么形状」散落多处，反而更容易漏掉字段。 */
import type { IServiceAccessor } from "@zcode/services";
import type { AppSettings, AppUsageRange, AppUsageSnapshot, UserInfo } from "@zcode/shared";

const SHELL_USER: UserInfo = {
  id: "shell-user",
  username: "shell",
  displayName: "Shell Preview",
};

/**
 * 空用量快照：字段必须齐全（zod schema 同构），否则图表迭代 undefined 会直接崩。
 */
function createEmptyAppUsageSnapshot(range: AppUsageRange): AppUsageSnapshot {
  return {
    range,
    generatedAt: Date.now(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Shanghai",
    source: "agent-db",
    summary: {
      totalTokens: 0,
      inputTokens: 0,
      outputTokens: 0,
      reasoningTokens: 0,
      cacheCreationTokens: 0,
      cacheReadTokens: 0,
      cacheHitRate: 0,
      totalSessions: 0,
      totalTurns: 0,
      toolCallCount: 0,
      toolErrorRate: 0,
      modelErrorRate: 0,
      avgTimeToFirstTokenMs: null,
      avgTurnDurationMs: null,
      activeDays: 0,
      currentStreakDays: 0,
      longestSessionMs: 0,
      longestStreakDays: 0,
      peakDayTokens: 0,
      favoriteModel: null,
    },
    heatmap: { startDate: null, endDate: null, maxTokens: 0, weeks: [] },
    dailyModelUsage: [],
    models: [],
    tools: [],
  };
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "zai-dark",
  locale: "zh-CN",
  recentProjects: [],
  askUserQuestionAutoResolutionEnabled: true,
  modelIoFullRetentionEnabled: false,
} as AppSettings;

/**
 * 空 Git 摘要：壳模式没有仓库，字段仍要齐全（`autoRefreshWatchPaths` 等会被直接迭代）。
 */
function createEmptyGitSummary(workspacePath: string) {
  return {
    workspacePath,
    repoRoot: workspacePath,
    workspaceInRepoPath: "",
    autoRefreshWatchPaths: [],
    branchName: null,
    trackingBranchName: null,
    headRefType: "branch" as const,
    ahead: 0,
    behind: 0,
    isDirty: false,
    isGitAvailable: false,
    isRepository: false,
  };
}

const SHELL_WORKSPACE_PATH = "shell://conversation";

const SHELL_PROVIDER_ID = "shell-preview";
const SHELL_PROVIDER_NAME = "Shell Preview";
const SHELL_MODEL_ID = "shell-preview-model";

/**
 * 壳模式占位模型：名字带 Shell Preview 前缀，一眼能看出不是真实模型。
 * 只为了让模型选择器、draft composer 等界面能渲染出完整形态，不代表可用的真实能力。
 */
const SHELL_MODEL_CONFIG = {
  enabled: true,
  properties: {
    requiresMfjsToolSchema: false,
    contextWindow: 128000,
    inputFormat: {
      supportsText: true,
      supportsImage: false,
      supportsVideo: false,
      supportsAudio: false,
      supportsPdf: false,
    },
    outputFormat: { supportsText: true },
    supportsToolCall: true,
    supportsJsonSchemaOutput: false,
    supportsNativeWebSearch: false,
    supportsMidConversationSystem: false,
  },
  optionSpecs: {
    reasoningLevel: {
      values: ["low", "medium", "high"],
      map: "{'reasoning': {'effort': reasoningLevel}}",
    },
    maxOutputTokens: { max: 8192, map: "{'max_output_tokens': maxOutputTokens}" },
  },
};

function createShellProviderConfig() {
  return {
    builtinModelIds: [SHELL_MODEL_ID],
    personalModelIds: [],
    modelOrder: [SHELL_MODEL_ID],
    access: { type: "api-key" as const, apiKey: "shell-preview-key" },
  };
}

/**
 * Provider Settings View：设置页「模型设置」读它。
 * 四个字段都是必填，缺 providers 会让该分区整块崩。
 */
function createShellProviderSettingsView() {
  return {
    revision: 1,
    providerTemplates: [],
    providerOrder: [SHELL_PROVIDER_ID],
    providers: [
      {
        providerId: SHELL_PROVIDER_ID,
        providerName: SHELL_PROVIDER_NAME,
        templateId: SHELL_PROVIDER_ID,
        enabled: true,
        executable: true,
        effectiveConfig: createShellProviderConfig(),
        issues: [],
        models: [
          {
            kind: "candidate" as const,
            modelId: SHELL_MODEL_ID,
            builtin: true,
            effectiveBuiltinConfig: SHELL_MODEL_CONFIG,
            effectiveConfig: SHELL_MODEL_CONFIG,
            enabled: true,
            executable: true,
            selectable: true,
            issues: [],
          },
        ],
      },
    ],
  };
}

/** Model Selection View：composer 的模型选择器与「当前没有可用模型」提示读它。 */
function createShellModelSelectionView() {
  return {
    revision: 1,
    providers: [
      {
        providerId: SHELL_PROVIDER_ID,
        providerName: SHELL_PROVIDER_NAME,
        templateId: SHELL_PROVIDER_ID,
        config: createShellProviderConfig(),
        models: [{ modelId: SHELL_MODEL_ID, config: SHELL_MODEL_CONFIG }],
      },
    ],
    effectiveSelection: { providerId: SHELL_PROVIDER_ID, modelId: SHELL_MODEL_ID },
    preferredSelection: { providerId: SHELL_PROVIDER_ID, modelId: SHELL_MODEL_ID },
  };
}

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

  if (serviceName === "modelSelectionService") {
    if (method === "getView") return async () => createShellModelSelectionView();
  }

  if (serviceName === "providerSettingsService") {
    // 设置页「刷新」走 refresh(...)，与 getView 同形状。
    // 返回兜底对象会让 projectProviderSettingsViewToFormProviders 在 view.providers.map 处崩。
    if (method === "getView" || method === "refresh" || method === "reload") {
      return async () => createShellProviderSettingsView();
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

  if (serviceName === "gitService") {
    // 壳模式没有真实仓库：refresh 必须返回完整结构（changes 是数组），
    // 缺字段会让 useGitRepository 在 .changes 处抛 "is not iterable"。
    if (method === "refresh") {
      return async ({ workspacePath }: { workspacePath?: string }) => ({
        summary: createEmptyGitSummary(workspacePath ?? SHELL_WORKSPACE_PATH),
        identity: null,
        unstagedChanges: [],
        stagedChanges: [],
        branchComparison: null,
      });
    }
    if (method === "getRepositorySummary") {
      return async ({ workspacePath }: { workspacePath?: string }) =>
        createEmptyGitSummary(workspacePath ?? SHELL_WORKSPACE_PATH);
    }
    if (method === "getWorkspaceRepositoryInfo") {
      return async ({ workspacePath }: { workspacePath?: string }) => ({
        workspacePath: workspacePath ?? SHELL_WORKSPACE_PATH,
        kind: "not-repository" as const,
        isGitAvailable: false,
      });
    }
    if (method === "getChanges" || method === "getIgnoredPaths") {
      return async () => [];
    }
    if (method === "getLocalBranches") {
      return async () => ({ headRefType: "branch" as const, currentBranchName: null, branches: [] });
    }
    if (method === "getBranchComparison") {
      return async () => ({ baseRef: null, headRef: null, comparisonLabel: null, changes: [] });
    }
    if (method === "getCommitGraph") {
      return async () => ({ commits: [], hasMore: false });
    }
    if (method === "getIdentity") {
      return async () => null;
    }
  }

  if (serviceName === "clientScenesService") {
    // 该接口用 { code, data } 信封：code 必须是 0，否则 UI 会当成业务错误并清空推荐列表。
    if (method === "list") return async () => ({ code: 0, data: [] });
  }

  if (serviceName === "credentialService") {
    // 凭据读取返回 string|null，壳模式一律 null（未登录任何 OAuth provider）。
    // 返回兜底对象会让调用方的 `?.trim()` 抛 "trim is not a function"。
    if (method === "load") return async () => null;
    if (method === "save" || method === "delete" || method === "remove") return async () => {};
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

  if (serviceName === "zcodeTaskService" || serviceName === "windowControllerService") {
    // 任务集合类 RPC 的消费方一律按数组处理（spread / map / filter），
    // 返回分页对象会让分组视图抛 "is not iterable"。分页查询单独返回对象形态。
    if (
      method === "listTasks" ||
      method === "list" ||
      method === "queryTasks" ||
      method === "listPinnedTasks" ||
      method === "listArchivedTasks" ||
      method === "listPinnedTaskIds" ||
      method === "listDeletedTaskIds"
    ) {
      return async () => [];
    }
    if (method === "listTaskList" || method === "queryTaskList") {
      return async () => ({ items: [], total: 0, hasMore: false });
    }
    // 分组视图结构是三个数组的复合体，缺任一个字段都会在客户端 .map 处崩。
    if (method === "listGroupedTaskViewStructure" || method === "getGroupedTaskViewStructure") {
      return async () => ({ groups: [], members: [], topLevelOrders: [] });
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
  }

  if (serviceName === "zcodeAgentService") {
    // v4 传输握手：helloConversationV4 的返回值要过 helloMessageSchema(.strict)，
    // 缺字段会让 sessions-index / conversation 订阅全部 fail-closed 并每 3 秒重试。
    if (method === "helloConversationV4") {
      return async () => ({
        kind: "hello" as const,
        protocolVersion: 3 as const,
        connectionId: "shell-connection",
        clientMode: "desktop-continuous" as const,
        deliveryProfile: "continuous" as const,
        serverTime: Date.now(),
        // hostCapabilitiesSchema 里 nativeDialogs / localTerminal / binaryFrames / compression 是必填。
        capabilities: {
          nativeDialogs: false,
          localTerminal: false,
          binaryFrames: false,
          compression: "none" as const,
        },
        auth: { userId: SHELL_USER.id },
      });
    }
    // Composer 的 Skill catalog：`/` 面板展开即读，字段缺失会让聊天区整块崩。
    if (method === "getSkillReferenceCatalog") {
      return async () => ({ skills: [], authority: null, diagnostics: [] });
    }
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
