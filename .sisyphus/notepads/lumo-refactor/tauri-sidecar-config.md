# Tauri Sidecar Configuration - 2026-02-06

## Task: Configure Tauri sidecar for server binary

### Current State
The Tauri sidecar configuration for the server binary is **already complete and correctly configured**.

### Configuration Details

#### 1. tauri.conf.json (packages/desktop/src-tauri/tauri.conf.json)

**externalBin configuration (lines 41-43):**
```json
"externalBin": [
  "binaries/lumo-server"
]
```

**beforeBuildCommand (line 9):**
- Builds the web app: `pnpm --filter @lumo/web build`
- Builds the server: `pnpm --filter @lumo/server build`
- Copies server binary from `apps/server/dist/server` to `binaries/lumo-server`
- Sets executable permissions (chmod 0o755)

#### 2. lib.rs (packages/desktop/src-tauri/src/lib.rs)

**Sidecar spawn implementation (lines 63-88):**
```rust
// Get database path in app data directory
let db_path = app_data_dir.join("lumo.db");

// Spawn server sidecar with LUMO_DB_PATH environment variable
let app_handle = app.handle().clone();
async_runtime::spawn(async move {
    match app_handle.shell().sidecar("lumo-server") {
        Ok(sidecar) => {
            match sidecar
                .env("LUMO_DB_PATH", db_path.to_string_lossy().to_string())
                .spawn()
            {
                Ok(_child) => {
                    logger::info("Server sidecar started successfully");
                }
                Err(e) => {
                    logger::error(&format!("Failed to spawn server sidecar: {}", e));
                }
            }
        }
        Err(e) => {
            logger::error(&format!("Failed to get server sidecar: {}", e));
        }
    }
});
```

### Key Learnings

1. **Tauri v2 Sidecar Configuration:**
   - `externalBin` in tauri.conf.json specifies binaries to bundle with the app
   - Path is relative to the Tauri project root (packages/desktop/src-tauri)
   - Binary name in externalBin should NOT include platform-specific extensions (.exe)
   - Tauri automatically handles platform-specific extensions at runtime

2. **Sidecar Spawning:**
   - Use `app_handle.shell().sidecar("binary-name")` to get sidecar command
   - Binary name is just the filename without path or extension
   - Environment variables are set using `.env(key, value)` before `.spawn()`
   - Spawning should be done in an async context using `async_runtime::spawn`

3. **Database Path Management:**
   - Desktop app stores database in app data directory
   - Path is passed to server via `LUMO_DB_PATH` environment variable
   - Server reads this environment variable to determine database location

4. **Build Process:**
   - Server is built using Bun: `bun build --compile --minify src/index.ts --outfile dist/server`
   - Binary is copied to `binaries/` directory during Tauri build
   - Tauri bundles the binary with the app during packaging

5. **Error Handling:**
   - Both sidecar retrieval and spawn operations have error handling
   - Errors are logged using the custom logger module
   - Failures are non-fatal - app continues to run even if sidecar fails

### Verification Status

- ✅ tauri.conf.json has correct externalBin configuration
- ✅ lib.rs spawns sidecar with LUMO_DB_PATH environment variable
- ✅ Build process copies server binary to correct location
- ✅ Error handling is implemented
- ✅ Async spawning is used to avoid blocking app startup

### No Changes Required

The configuration was already complete and correct. No updates were needed to either tauri.conf.json or lib.rs.
