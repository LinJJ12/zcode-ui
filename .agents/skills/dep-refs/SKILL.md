---
name: dep-refs
description: Use when the agent needs to inspect TypeScript export references in the workspace, list exports from a file, verify whether an export is unused before deletion, or investigate who imports a symbol during refactors.
disable-model-invocation: true
---

# Dep Refs

This checkout does not include `pnpm knip` or `pnpm dep:refs`. Before changing or deleting a TypeScript export, search the workspace for the symbol name and confirm there is no remaining importer.

## Workflow

Search for the export name from the repository root, then open the callers:

```bash
rg -n "createBotsService" packages
```

When the symbol name is unknown, read the file's export list, then search each name the same way.

A search miss is not proof the symbol is unused. Also check dynamic `import()`, string references, and barrel re-exports before deleting. If a name only appears in a re-export, trace that public path before removing it.

For refactors, report concrete callers with file and line, then decide whether to update callers, preserve the export, or delete it.
