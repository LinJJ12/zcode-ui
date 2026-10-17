# Policy schema

This checkout does not ship `architecture-policy.yaml`. Each module's `module.ts` holds its local dependency declaration. The notes below describe the previous policy shape.

Each module has an `id`, one or more `roots`, optional `managed: true`, `requires`, `provides`, `publicEntrypoints`, and an optional `owner`. Existing modules may remain unmanaged while they are in baseline migration.

The policy owns path and layer topology. A module's `module.ts` owns its local dependency declaration. Do not add a second hand-maintained dependency graph.
