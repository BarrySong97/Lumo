# Task 7: Configure Tauri Sidecar for Server Binary

## Summary
Configured Tauri to spawn the server binary as a sidecar process with database path passed via environment variable.

## Changes Made

### 1. tauri.conf.json
- Added `externalBin` configuration under `bundle` section
- Configured sidecar binary path: `binaries/lumo-server`
- This tells Tauri to bundle the server binary and make it available as a sidecar

### 2. lib.rs
- Added imports: `async_runtime` from tauri, `ShellExt` from tauri_plugin_shell
- Added shell plugin initialization: `.plugin(tauri_plugin_shell::init())`
- Added sidecar spawn logic in setup():
  - Constructs database path: `app_data_dir.join("lumo.db")`
  - Spawns sidecar asynchronously using `async_runtime::spawn`
  - Passes `DATABASE_PATH` environment variable to sidecar
  - Includes error logging for spawn failures

### 3. Cargo.toml
- Added dependency: `tauri-plugin-shell = "2"`
- Required for sidecar management functionality

## Key Design Decisions

1. **Sidecar Name**: Used "lumo-server" as the sidecar identifier
2. **Database Path**: Passed via `DATABASE_PATH` environment variable to the sidecar
3. **Async Spawn**: Used `async_runtime::spawn` to avoid blocking the main setup
4. **Error Handling**: Added comprehensive logging for both sidecar retrieval and spawn failures
5. **Binary Location**: Configured as `binaries/lumo-server` in tauri.conf.json (Tauri will handle platform-specific extensions)

## Platform Considerations

- Tauri automatically handles platform-specific binary extensions (.exe on Windows, no extension on Unix)
- The `externalBin` path is relative to the Tauri project root
- The server binary needs to be built and placed in the correct location before bundling

## Next Steps

The server binary needs to:
1. Read the `DATABASE_PATH` environment variable on startup
2. Use that path for SQLite database initialization
3. Handle graceful shutdown on SIGTERM (for proper cleanup when Tauri app closes)

## Verification

Files were successfully edited and verified by reading them back. The configuration is syntactically correct and follows Tauri v2 sidecar patterns.
