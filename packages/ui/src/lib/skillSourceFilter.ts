import type { ZCodeProvider } from "@zcode/shared";

type SkillSourceType = "glm" | "unknown";

export function resolveSkillSourceType(skillPath: string): SkillSourceType {
  const normalized = skillPath.replaceAll("\\", "/").toLowerCase();
  if (normalized.includes("/.zcode/skills/")) {
    return "glm";
  }
  if (normalized.includes("/.zcode/cli/plugins/cache/")) {
    return "glm";
  }
  return "unknown";
}

const SKILL_ID_PROVIDER_RE = /^glm:/;

function isZcodeSkill(skill: { id?: string; path: string; scope?: string }): boolean {
  return (
    // plugin skill 的真实路径在 CLI plugin cache 下，不在 `.zcode/skills`。
    // 服务层已用 scope 标记来源，前端过滤时要放行，否则 `/` 和 `$` 面板会漏掉插件技能。
    skill.scope === "plugin" ||
    (typeof skill.id === "string" && SKILL_ID_PROVIDER_RE.test(skill.id)) ||
    resolveSkillSourceType(skill.path) === "glm"
  );
}

export function filterSkillsForProvider<T extends { path: string; id?: string; scope?: string }>(
  skills: T[],
  _legacyProvider: ZCodeProvider,
): T[] {
  // Skill catalog 由 RPC 下发，接口被裁剪时整个字段可能缺失；
  // 这里兜住空值，避免 `/` 面板一展开就把整个聊天区打进错误边界。
  if (!Array.isArray(skills)) {
    return [];
  }
  return skills.filter(isZcodeSkill);
}
