# Task 7: Configure Tauri Sidecar for Server Binary

## Summary
Configured Tauri to spawn the server binary as a sidecar process with proper database path environment variable.

## Changes Made

### 1. Updated tauri.conf.json
- **File**: `packages/desktop/src-tauri/tauri.conf.json`
- **Change**: Updated `beforeBuildCommand` to:
  1. Build web app: `pnpm --filter @lumo/web build`
  2. Build server binary: `pnpm --filter @lumo/server build`
  3. Copy server binary to `binaries/lumo-server` with proper permissions
- **Reason**: Tauri needs the server binary in the `binaries/` directory (relative to src-tauri) before building the desktop app

### 2. Fixed Environment Variable in lib.rs
- **File**: `packages/desktop/src-tauri/src/lib.rs`
- **Change**: Changed environment variable from `DATABASE_PATH` to `LUMO_DB_PATH` (line 73)
- **Reason**: The server code (`apps/server/src/db.ts`) expects `LUMO_DB_PATH`, not `DATABASE_PATH`

## Key Learnings

1. **Tauri externalBin Configuration**:
   - The `externalBin` array in tauri.conf.json specifies binaries to bundle with the app
   - Paths are relative to the `src-tauri` directory
   - Binaries must exist before the Tauri build process starts

2. **Server Binary Build Process**:
   - Server builds to `apps/server/dist/server` using Bun's `--compile` flag
   - Binary must be copied to `packages/desktop/src-tauri/binaries/lumo-server`
   - Binary needs executable permissions (0o755)

3. **Sidecar Spawning**:
   - Tauri's `shell().sidecar()` API spawns the bundled binary
   - Environment variables can be set with `.env(key, value)`
   - Sidecar runs as a child process of the Tauri app
   - Database path is set to app data directory + "lumo.db"

4. **Environment Variable Consistency**:
   - Server expects `LUMO_DB_PATH` (defined in `apps/server/src/db.ts`)
   - Must match between Rust sidecar spawn code and Node.js server code
   - Inconsistent naming was causing the server to use wrong database path

## Verification

- Rust code compiles successfully (cargo check passed)
- tauri.conf.json is valid JSON
- Environment variable names now match between Rust and TypeScript code

## Next Steps

When building the desktop app:
1. Run `pnpm build:desktop` from repo root
2. The beforeBuildCommand will automatically:
   - Build the web UI
   - Build the server binary
   - Copy the binary to the correct location
3. Tauri will bundle the server binary with the desktop app
4. On app startup, the sidecar will spawn with the correct database path

## Task Completion Verification (2026-02-06)

Re-verified all configuration is in place:
- ✅ tauri.conf.json has externalBin configured (line 42)
- ✅ lib.rs spawns sidecar with LUMO_DB_PATH env var (line 73)
- ✅ Server code expects LUMO_DB_PATH (apps/server/src/db.ts line 8)
- ✅ Rust code compiles without errors
- ✅ All environment variable names match

**Status**: Task was already completed in previous session. No additional changes needed.
