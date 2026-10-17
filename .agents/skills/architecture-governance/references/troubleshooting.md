# Troubleshooting

- `module-dependency`: import the target module's public contract, or add the dependency to `module.ts` after confirming the integration owner.
- `deep-import`: replace an internal path with the target module's declared public entrypoint.
- `cycle`: move the shared type into a contract or create an application/integration owner; do not silence the cycle.
- This checkout has no architecture checker or baseline file. Fix the owning module instead of recording an exception.
