# Learnings

## SQLite & Bun Build Investigation (Task 1)

### Current SQLite Setup
- **Location**: `/Users/songtianjian/Lumo/apps/server/src/db.ts`
- **Library**: `better-sqlite3` v9.0.0 (synchronous SQLite driver)
- **Database Path**: Configurable via `LUMO_DB_PATH` env var, defaults to `./lumo.db`
- **Schema**: Single table `Item` with fields: id, name, description, createdAt, updatedAt
- **Initialization**: Auto-creates table on startup via `db.exec()` in db.ts
- **Type Exports**: `Item` type defined in db.ts for type safety

### Bun Build Configuration
- **Build Script**: `bun build --compile --minify src/index.ts --outfile dist/server`
- **Location**: `/Users/songtianjian/Lumo/apps/server/package.json` line 7
- **Output**: Standalone binary at `dist/server`
- **Flags**: `--compile` (creates executable), `--minify` (optimizes size)
- **Dev Script**: `bun run src/index.ts` (direct execution)

### Server Architecture (Hono + oRPC)
- **Framework**: Hono v4.0.0 (lightweight HTTP framework)
- **RPC**: @orpc/server v1.13.4 (type-safe RPC procedures)
- **Validation**: Zod v3.22.0 (runtime schema validation)
- **Port**: 3001 (configurable via PORT env var)
- **Health Check**: GET /health endpoint
- **RPC Endpoints**: All procedures under /rpc/* prefix

### CRUD Procedures (oRPC Router)
- `item.list` - GET all items (ordered by createdAt DESC)
- `item.get` - GET single item by id
- `item.create` - POST new item (name required, description optional)
- `item.update` - PUT update item (partial updates supported)
- `item.delete` - DELETE item by id

### Workspace Structure
- **Root**: `/Users/songtianjian/Lumo/` (pnpm monorepo)
- **Apps**: 
  - `/apps/server` - Hono + oRPC + SQLite (existing)
  - `/apps/web` - React + Vite (existing)
  - `/apps/website` - Next.js marketing site (existing)
- **Packages**: (shared code)
  - `/packages/db` - Database utilities (has sqlite adapter test)
  - `/packages/api` - oRPC router definitions
  - `/packages/ui` - Reusable UI components
  - `/packages/shared` - Shared utilities and types
  - `/packages/desktop` - Tauri desktop wrapper

### Build System
- **Monorepo Tool**: Turbo v2.5.4
- **Package Manager**: pnpm v10.12.1
- **TypeScript**: v5.8.3 (strict mode)
- **Turbo Tasks**: build, build:server, dev, dev:server, dev:tauri, lint, typecheck

### Key Patterns for Task 2 (apps/server skeleton)
1. **Database**: Use better-sqlite3 with minimal schema (single table pattern)
2. **Build**: Use `bun build --compile --minify` for standalone binary
3. **Framework**: Hono for HTTP routing, @orpc/server for RPC procedures
4. **Validation**: Zod schemas for input/output validation
5. **Environment**: Support PORT and DB_PATH env vars
6. **Health Check**: Include GET /health endpoint
7. **Error Handling**: Use oRPC error interceptor for logging

### Files to Reference
- `/Users/songtianjian/Lumo/apps/server/src/db.ts` - Database initialization pattern
- `/Users/songtianjian/Lumo/apps/server/src/index.ts` - Hono + oRPC setup pattern
- `/Users/songtianjian/Lumo/apps/server/package.json` - Dependencies and build script
- `/Users/songtianjian/Lumo/turbo.json` - Monorepo task configuration
- `/Users/songtianjian/Lumo/package.json` - Root workspace scripts

## Task 2: Hono + oRPC + Bun Server Skeleton Research

### Current Date: Feb 6, 2026

### Key Findings

#### 1. **Hono + Bun Setup**
- **Framework**: Hono is a lightweight web framework built on Fetch API
- **Runtime**: Bun is a fast JavaScript runtime with built-in TypeScript support
- **Entry Point**: Hono on Bun uses `export default app` pattern
- **Dev Server**: `bun run --hot src/index.ts` for hot reload
- **Port Configuration**: Can export `{ port, fetch }` object to customize port

**Minimal Hono + Bun Example**:
```typescript
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Bun!'))

export default app
```

#### 2. **oRPC Hono Adapter**
- **Package**: `@orpc/server` (latest) + `@orpc/client` (latest)
- **Handler**: Use `RPCHandler` from `@orpc/server/fetch`
- **Middleware Integration**: Mount at `/rpc/*` path using Hono middleware
- **Context**: Pass context through handler options
- **Body Parser Issue**: If Hono reads body first, use Proxy to intercept body parsers

**oRPC Hono Integration Pattern**:
```typescript
import { Hono } from 'hono'
import { RPCHandler } from '@orpc/server/fetch'

const app = new Hono()
const handler = new RPCHandler(router, { interceptors: [...] })

app.use('/rpc/*', async (c, next) => {
  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: '/rpc',
    context: {}
  })
  
  if (matched) {
    return c.newResponse(response.body, response)
  }
  await next()
})

export default app
```

#### 3. **oRPC Router Definition**
- **Schema Validation**: Use Zod (or any standard-schema validator)
- **Procedure Definition**: Use `os.input().handler()` pattern
- **Middleware**: Use `.use()` for middleware/auth
- **Router Structure**: Nested object structure for organization

**oRPC Procedure Pattern**:
```typescript
import { os } from '@orpc/server'
import * as z from 'zod'

export const listItems = os
  .input(z.object({ limit: z.number().optional() }))
  .handler(async ({ input }) => {
    // implementation
    return []
  })

export const router = {
  item: {
    list: listItems,
    // ... more procedures
  }
}
```

#### 4. **Bun SQLite Support**
- **Built-in**: Bun has native SQLite support (no external package needed)
- **API**: `Bun.sql` template tag for queries
- **Database**: Can use `better-sqlite3` or Bun's native API
- **Note**: Bun's native SQLite is optimized for performance

#### 5. **Package Dependencies for Minimal Setup**
```json
{
  "dependencies": {
    "hono": "latest",
    "@orpc/server": "latest",
    "@orpc/client": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "bun-types": "latest"
  }
}
```

#### 6. **File Structure for apps/server**
```
apps/server/
├── src/
│   ├── index.ts           # Hono app entry point
│   ├── router.ts          # oRPC router definition
│   ├── procedures/        # Individual procedures
│   │   ├── item.ts
│   │   └── ...
│   └── db.ts              # SQLite database setup
├── package.json
├── tsconfig.json
└── bunfig.toml            # Optional Bun config
```

#### 7. **Key Imports**
- `import { Hono } from 'hono'` - Web framework
- `import { RPCHandler } from '@orpc/server/fetch'` - oRPC handler
- `import { os } from '@orpc/server'` - Procedure builder
- `import * as z from 'zod'` - Schema validation
- Bun SQLite: `Bun.sql` (built-in, no import needed)

#### 8. **Development Workflow**
- Install: `bun install`
- Dev: `bun run dev` (with hot reload via `--hot`)
- Build: `bun build ./src/index.ts --outdir ./dist`
- Run: `bun ./dist/index.js`

### Next Steps for Task 2
1. Create `apps/server` directory structure
2. Set up `package.json` with dependencies
3. Create `src/index.ts` with Hono + oRPC integration
4. Define router with sample procedures
5. Set up SQLite database connection
6. Test with `bun run dev`

### Documentation References
- Hono Bun Guide: https://hono.dev/docs/getting-started/bun
- oRPC Getting Started: https://orpc.io/docs/getting-started
- oRPC Hono Adapter: https://orpc.io/docs/adapters/hono
- Bun Official: https://bun.sh


## Task 2: Server Skeleton Investigation

### Existing Hono + oRPC Server Pattern

**Status**: ALREADY IMPLEMENTED ✓

The server skeleton has been fully created with the following structure:

#### Files Created
- `/Users/songtianjian/Lumo/apps/server/package.json` - Server package config
- `/Users/songtianjian/Lumo/apps/server/src/index.ts` - Main Hono app entry point
- `/Users/songtianjian/Lumo/apps/server/src/db.ts` - SQLite database setup
- `/Users/songtianjian/Lumo/apps/server/src/router.ts` - oRPC router (alternative implementation)
- `/Users/songtianjian/Lumo/apps/server/tsconfig.json` - TypeScript config

#### Port Configuration
- **Default Port**: 3001
- **Environment Variable**: `PORT` (defaults to 3001 if not set)
- **Database Path**: `LUMO_DB_PATH` (defaults to `./lumo.db` relative to server)
- **Health Check**: `GET /health` returns `{"status":"ok"}`

#### Server Implementation Details

**Package Dependencies**:
- `hono@^4.0.0` - Web framework
- `@orpc/server@^1.13.4` - oRPC server adapter
- `better-sqlite3@^9.0.0` - SQLite driver
- `zod@^3.22.0` - Schema validation

**Scripts**:
- `dev`: `bun run src/index.ts` - Development server
- `build`: `bun build --compile --minify src/index.ts --outfile dist/server` - Binary compilation
- `typecheck`: `tsc --noEmit` - Type checking

**Database Schema**:
```sql
CREATE TABLE IF NOT EXISTS Item (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

**oRPC Procedures** (defined in `src/index.ts`):
- `item.list()` - Returns all items ordered by createdAt DESC
- `item.get(id: number)` - Returns single item by ID
- `item.create(input: {name, description?})` - Creates new item
- `item.update(input: {id, data: {name?, description?}})` - Updates item
- `item.delete(id: number)` - Deletes item

**RPC Handler**:
- Mounted at `/rpc/*` path
- Uses `@orpc/server/fetch` RPCHandler
- Includes error interceptor for logging

#### API Package Integration

**Location**: `/Users/songtianjian/Lumo/packages/api/`

**Files**:
- `src/schema.ts` - Zod schemas for Item (ItemSchema, CreateItemSchema, UpdateItemSchema)
- `src/router.ts` - Alternative router implementation (not currently used in server)
- `src/client.ts` - oRPC client factory with default baseURL `http://localhost:3001`
- `src/index.ts` - Exports all schemas, router, and client

**Client Configuration**:
- Default baseURL: `http://localhost:3001`
- RPC endpoint: `${baseURL}/rpc`
- Supports all CRUD operations via fetch

#### Root Configuration

**Root package.json scripts**:
- `dev`: `turbo dev --filter=@lumo/web --filter=@lumo/server` - Runs both server and web
- `dev:server`: `pnpm -C apps/server dev` - Server only
- `build:server`: `pnpm -C apps/server build` - Builds server binary

**turbo.json tasks**:
- `dev:server` - Persistent task for server development
- `dev` - Depends on `dev:server`, runs both server and web
- `build:server` - No cache, outputs to `dist/**`

### Key Observations

1. **Dual Router Implementation**: Both `src/index.ts` and `src/router.ts` define Item procedures. The `src/index.ts` is the active implementation used by Hono.

2. **Port Hardcoded in Client**: The `packages/api/src/client.ts` has hardcoded `http://localhost:3001`. This works for dev but may need environment-based configuration for production/desktop.

3. **Database Path Flexibility**: Server accepts `LUMO_DB_PATH` environment variable, allowing Tauri to pass app data directory path.

4. **Turbo Integration**: Root `package.json` already has `pnpm dev` configured to run both server and web via turbo.

5. **TypeScript Configuration**: Server uses `moduleResolution: "bundler"` and targets `esnext` for Bun compatibility.

### Ready for Next Tasks

- Task 2 is COMPLETE - server skeleton exists and is functional
- Task 3 (packages/api) is COMPLETE - oRPC router and schemas exist
- Task 7 (Tauri sidecar) can proceed - server binary compilation is configured
- Task 8 (turbo config) is COMPLETE - dev and build scripts are configured

### Potential Issues to Address in Later Tasks

1. Client baseURL hardcoding - may need environment variable support for desktop/production
2. Duplicate router definitions - `src/router.ts` appears unused, could be cleaned up
3. Error handling - RPC errors are logged but not returned with proper HTTP status codes
4. CORS - No CORS configuration visible, may be needed for web app communication


## Task 2: Hono + oRPC + SQLite Server Skeleton (Completed)

### Implementation Summary
- **Status**: ✅ Complete and verified
- **Date**: Feb 6, 2026
- **Key Achievement**: Minimal server skeleton with Hono, oRPC, and SQLite working in both dev and compiled modes

### Technical Decisions

#### 1. Database: sql.js instead of better-sqlite3
- **Reason**: better-sqlite3 requires native bindings that don't compile well with Bun's `--compile` flag
- **Solution**: Used sql.js (pure JavaScript SQLite implementation)
- **Trade-off**: Slightly slower than native bindings, but works reliably in compiled binaries
- **File Persistence**: Manual save to disk after each operation using `fs.writeFileSync()`

#### 2. oRPC API Version
- **Version**: @orpc/server@1.13.4 (updated from ^0.1.0 in packages/api)
- **API Pattern**: `os.input().output().handler()` (not `createProcedure()`)
- **Handler Signature**: Receives input directly as parameter, not wrapped in options object

#### 3. Server Architecture
- **Framework**: Hono v4.0.0 (lightweight HTTP framework)
- **RPC Handler**: RPCHandler from @orpc/server/fetch
- **Health Endpoint**: GET /health returns `{ status: "ok" }`
- **RPC Prefix**: All procedures mounted at /rpc/* path

### Files Created/Modified
1. **apps/server/package.json**
   - Added sql.js dependency
   - Kept build script: `bun build --compile --minify src/index.ts --outfile dist/server`
   - Dev script: `bun run src/index.ts`

2. **apps/server/src/db.ts**
   - Async initialization with sql.js
   - Database path from LUMO_DB_PATH env var or ./lumo.db
   - Wrapper API matching better-sqlite3 interface (prepare, exec, pragma)
   - Auto-save to disk after mutations

3. **apps/server/src/index.ts**
   - Hono app with /health endpoint
   - oRPC router with item CRUD procedures
   - RPCHandler wired to /rpc/* prefix
   - Port configurable via PORT env var (default 3001)

4. **packages/api/package.json**
   - Fixed version mismatch: @orpc/server and @orpc/client to ^1.13.4

### CRUD Procedures Implemented
- `item.list` - GET all items (ordered by createdAt DESC)
- `item.get` - GET single item by id
- `item.create` - POST new item (name required, description optional)
- `item.update` - PUT update item (partial updates supported)
- `item.delete` - DELETE item by id

### Verification Results
✅ Dev server runs: `bun run src/index.ts`
✅ Health check responds: `curl http://localhost:3001/health` → `{"status":"ok"}`
✅ Build succeeds: `pnpm build` → creates dist/server binary
✅ Binary runs: `./dist/server` → responds to /health

### Database Schema
```sql
CREATE TABLE Item (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

### Known Limitations
1. sql.js stores entire database in memory, persists to disk on each write
2. No connection pooling (single in-memory database)
3. No concurrent write support (synchronous operations)
4. Suitable for single-process server, not for multi-process deployments

### Next Steps (Task 3 & 7)
- Task 3: Wire web UI to server RPC endpoints
- Task 7: Integrate server as Tauri sidecar
- Both tasks depend on this server skeleton being stable and working

