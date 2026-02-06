# Task 8: Update turbo.json and root package.json

## Summary
Updated turbo.json and root package.json to properly configure dev/build tasks for server+web.

## Changes Made

### turbo.json
- **Status**: Already correctly configured
- **dev:server task**: Defined with cache=false, persistent=true
- **build:server task**: Defined with cache=false, outputs=["dist/**"]
- **dev task**: Depends on dev:server, cache=false, persistent=true
- No changes needed - configuration was already in place

### package.json
- **dev script**: `turbo dev --filter=@lumo/web --filter=@lumo/server`
  - Runs both web and server in parallel via turbo
- **build script**: Updated to `turbo build --filter=@lumo/server --filter=@lumo/web --filter=@lumo/desktop`
  - Explicitly includes server, web, and desktop builds
  - Ensures server binary is built before desktop packaging
- **build:server script**: `pnpm -C apps/server build`
  - Direct build command for server binary compilation with Bun

## Key Insights

1. **Turbo Configuration Already Complete**
   - The turbo.json was already properly configured from previous work
   - dev:server and build:server tasks were already defined
   - dev task already depends on dev:server

2. **Build Script Enhancement**
   - Changed `build` from generic `turbo build` to explicit filter list
   - This ensures predictable build order: server → web → desktop
   - Server binary must be built before desktop can package it as sidecar

3. **Parallel Execution**
   - `pnpm dev` now runs server and web in parallel via turbo
   - Both tasks are persistent (long-running)
   - Server starts on port 3001, web on port 5173

## Verification

✅ turbo.json has dev:server and build:server tasks
✅ root package.json dev script runs both server and web
✅ root package.json build script includes all three packages
✅ build:server script available for standalone server builds

## Next Steps

Task 9 (Final integration) should:
1. Run `pnpm install` to verify dependencies
2. Run `pnpm dev` and verify both server and web start
3. Test Item CRUD operations
4. Run `pnpm build:server` and verify binary creation
5. Run `pnpm build:desktop` and verify Tauri build
