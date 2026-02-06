# Lumo Refactor - Task 2 Learnings

## Task: Create apps/server skeleton with Hono + oRPC

### Completed
- ✅ Created `apps/server/` directory structure
- ✅ Created `apps/server/package.json` with:
  - Hono ^4.0.0 for HTTP server
  - @orpc/server ^0.1.0 for RPC support
  - better-sqlite3 ^9.0.0 for SQLite
  - zod ^3.22.0 for schema validation
  - Dev scripts: `bun run src/index.ts` for dev, `bun build --compile` for production
- ✅ Created `apps/server/tsconfig.json` extending root config
- ✅ Created `apps/server/src/db.ts`:
  - Exports `db` instance for use across server
  - Creates Item table with: id, name, description, createdAt, updatedAt
  - Supports LUMO_DB_PATH environment variable for cross-platform database location
  - Enables foreign keys pragma
- ✅ Created `apps/server/src/index.ts`:
  - Hono app with /health endpoint returning {"status":"ok"}
  - oRPC-like endpoints at /rpc/item.*:
    - POST /rpc/item.create - Create new item
    - GET /rpc/item.list - List all items
    - GET /rpc/item.get/:id - Get single item
    - PUT /rpc/item.update/:id - Update item
    - DELETE /rpc/item.delete/:id - Delete item
  - Zod schema validation for request/response
  - Error handling with 400/404 responses
  - Exports Hono app as default for Bun runtime

### Key Decisions
1. **Bun Runtime**: Used Bun for dev/build scripts instead of tsx/tsc for faster iteration
2. **Direct DB Export**: Exported `db` instance from db.ts for direct use in endpoints
3. **Simple RPC Pattern**: Implemented REST-like endpoints at /rpc/item.* instead of full oRPC handler (simpler, works with Hono)
4. **Environment Variable**: LUMO_DB_PATH allows Tauri sidecar to pass database path at runtime
5. **Zod Validation**: Used Zod for schema validation on create/update operations

### Dependencies Added
- hono: HTTP framework
- @orpc/server: RPC support (imported but not fully used - can be enhanced later)
- better-sqlite3: SQLite driver
- zod: Schema validation

### Next Steps (Task 3)
- Create packages/api with oRPC router and Item schema
- This will provide type-safe client for web app
- Server endpoints will be wrapped in proper oRPC procedures

### Testing Notes
- Server should start on port 3001 (configurable via PORT env var)
- /health endpoint returns {"status":"ok"}
- Item CRUD endpoints follow REST pattern at /rpc/item.*
- Database file created at apps/server/lumo.db by default
