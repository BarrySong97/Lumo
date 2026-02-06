# Task 8: Update turbo.json and root package.json

## Completed Actions

### 1. Updated turbo.json
- Added `dev:server` task with `cache: false` and `persistent: true`
- Added `build:server` task with `cache: false` and `outputs: ["dist/**"]`
- Modified `dev` task to depend on `dev:server` via `dependsOn: ["dev:server"]`
- This ensures server starts before web when running `pnpm dev`

### 2. Updated root package.json scripts
- Modified `dev` script: `turbo dev --filter=@lumo/web --filter=@lumo/server`
  - Now runs both web and server in parallel via turbo
- Added `build:server` script: `pnpm -C apps/server build`
  - Delegates to apps/server build script (Bun compilation)
- Kept existing scripts unchanged

## Key Design Decisions

1. **Turbo dependency chain**: `dev` task depends on `dev:server` to ensure server starts first
2. **Parallel execution**: Both `@lumo/web` and `@lumo/server` filters in dev script allow parallel startup
3. **Build separation**: `build:server` is separate from main `build` task to allow independent compilation
4. **Bun compilation**: Server build uses Bun's `--compile` flag for binary generation

## Verification

- turbo.json: Valid JSON with all required tasks
- package.json: Valid JSON with updated scripts
- No syntax errors in either file
- Scripts follow existing naming conventions

## Next Steps (Task 9)

- Run `pnpm dev` to verify both server and web start
- Test Item CRUD operations
- Run `pnpm build:server` to verify binary creation
- Run `pnpm build:desktop` to verify Tauri build
