# Lumo Architecture Refactor

## TL;DR

> **Quick Summary**: Major architecture refactor to simplify Lumo from a Journal/Todo app to a minimal CRUD demo. Replace Rust database layer with Hono+oRPC server, rename all packages from journal-todo to lumo.
> 
> **Deliverables**:
> - New `apps/server` with Hono + oRPC + SQLite
> - Simplified `apps/web` with basic Item CRUD UI
> - Tauri sidecar configuration for server binary
> - All packages renamed to @lumo/*
> - Removed: Rust DB code, LocalStorage adapter, Journal/Todo features
> 
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 → Task 3 → Task 5 → Task 7 → Task 9

---

## Context

### Original Request
用户要求进行大规模架构重构：
1. 去除 Tauri Rust 数据库迁移代码
2. 去除 LocalStorage 适配器
3. API 改用 oRPC
4. 新建 apps/server 使用 Hono
5. 去除 Journal/Todo 代码，简化为 CRUD
6. 数据库简化为单表
7. SQLite 由 Hono server 管理
8. dev 环境同时启动 server 和 web
9. build 使用 Bun 编译 server binary，Tauri 打包为 sidecar
10. 项目名称全部改为 lumo

### Interview Summary
**Key Discussions**:
- 数据模型: Item 表 (id, name, description, createdAt, updatedAt)
- Web UI: 极简 CRUD（列表 + 创建/编辑/删除）
- Server 启动: Tauri Sidecar
- 数据库位置: App Data 目录
- 数据迁移: 丢弃旧数据
- 目标平台: Windows + macOS + Linux
- 测试策略: 无自动化测试

### Metis Review
**Identified Gaps** (addressed):
- 跨平台 SQLite 路径处理 → Server 启动时通过环境变量接收路径
- Server 启动顺序 → Tauri sidecar 配置确保 server 先启动
- 优雅关闭 → Server 处理 SIGTERM 信号
- oRPC 类型共享 → 创建 packages/api 导出类型

---

## Work Objectives

### Core Objective
将 Lumo 从复杂的 Journal/Todo 应用重构为简单的 CRUD 演示应用，使用现代化的 Hono+oRPC 架构。

### Concrete Deliverables
- `apps/server/` - Hono + oRPC 服务器
- `apps/web/` - 简化的 React CRUD UI
- `packages/api/` - oRPC 路由和类型定义
- 更新的 Tauri 配置（sidecar）
- 更新的 turbo.json 和 package.json

### Definition of Done
- [ ] `pnpm dev` 同时启动 server 和 web
- [ ] Web UI 可以进行 Item 的增删改查
- [ ] `pnpm build` 生成 server binary
- [ ] Tauri 应用启动时自动启动 server sidecar
- [ ] 所有 package 名称为 @lumo/*

### Must Have
- Hono server 监听端口并响应 oRPC 请求
- SQLite 数据库存储 Item 数据
- Web UI 显示 Item 列表并支持 CRUD
- Tauri sidecar 配置

### Must NOT Have (Guardrails)
- 不添加 Journal/Todo 之外的新功能
- 不添加认证、缓存等额外层
- 不添加搜索、分页、过滤功能
- 不修改 packages/ui 组件库（除非必要的重命名）
- 不添加自动化测试
- 不迁移旧数据

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
> ALL verification is executed by the agent using tools.

### Test Decision
- **Infrastructure exists**: YES (Vitest)
- **Automated tests**: None (per user request)
- **Framework**: N/A

### Agent-Executed QA Scenarios (MANDATORY)

Every task includes QA scenarios using Bash (curl) or Playwright for verification.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Rename all packages to @lumo/*
└── Task 2: Create apps/server skeleton with Hono + oRPC

Wave 2 (After Wave 1):
├── Task 3: Create packages/api with oRPC router and Item schema
├── Task 4: Remove Rust database code from Tauri
└── Task 5: Remove old packages/db and packages/api content

Wave 3 (After Wave 2):
├── Task 6: Simplify apps/web to Item CRUD UI
├── Task 7: Configure Tauri sidecar for server binary
└── Task 8: Update turbo.json and root package.json

Wave 4 (After Wave 3):
└── Task 9: Final integration and cleanup
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3, 4, 5, 6 | 2 |
| 2 | None | 3, 7 | 1 |
| 3 | 1, 2 | 6 | 4, 5 |
| 4 | 1 | 7 | 3, 5 |
| 5 | 1 | 6 | 3, 4 |
| 6 | 3, 5 | 9 | 7, 8 |
| 7 | 2, 4 | 9 | 6, 8 |
| 8 | 1 | 9 | 6, 7 |
| 9 | 6, 7, 8 | None | None |

---

## TODOs

- [x] 1. Rename all packages to @lumo/*

  **What to do**:
  - Update root package.json: name to "lumo"
  - Update apps/web/package.json: name to "@lumo/web", update dependencies
  - Update packages/desktop/package.json: name to "@lumo/desktop"
  - Update packages/ui/package.json: name to "@lumo/ui"
  - Update packages/shared/package.json: name to "@lumo/shared"
  - Update all import statements referencing @journal-todo/* to @lumo/*
  - Update pnpm-workspace.yaml if needed

  **Must NOT do**:
  - Change any functionality
  - Modify component implementations

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`git-master`]
    - `git-master`: For atomic commits of rename changes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Tasks 3, 4, 5, 6
  - **Blocked By**: None

  **References**:
  - `package.json` - Root package config
  - `apps/web/package.json` - Web app config
  - `packages/*/package.json` - All package configs
  - `pnpm-workspace.yaml` - Workspace config

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: All packages renamed to @lumo/*
    Tool: Bash (grep)
    Steps:
      1. grep -r "journal-todo" --include="package.json" .
      2. Assert: No matches found (exit code 1)
      3. grep -r "@lumo" --include="package.json" .
      4. Assert: Matches found in all package.json files
    Expected Result: No journal-todo references remain
    Evidence: grep output captured

  Scenario: pnpm install succeeds after rename
    Tool: Bash
    Steps:
      1. pnpm install
      2. Assert: Exit code 0
    Expected Result: Dependencies resolve correctly
    Evidence: pnpm output captured
  ```

  **Commit**: YES
  - Message: `refactor: rename all packages from journal-todo to lumo`
  - Files: `package.json`, `apps/*/package.json`, `packages/*/package.json`

---

- [x] 2. Create apps/server skeleton with Hono + oRPC

  **What to do**:
  - Create `apps/server/` directory
  - Create `apps/server/package.json` with dependencies: hono, @orpc/server, better-sqlite3
  - Create `apps/server/src/index.ts` - Main entry point with Hono app
  - Create `apps/server/src/db.ts` - SQLite database setup with Item table
  - Create `apps/server/tsconfig.json`
  - Add dev script: `bun run src/index.ts`
  - Add build script: `bun build --compile --minify src/index.ts --outfile dist/server`

  **Must NOT do**:
  - Add authentication
  - Add complex middleware
  - Add multiple tables

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Tasks 3, 7
  - **Blocked By**: None

  **References**:
  - oRPC + Hono integration: https://orpc.dev/docs/adapters/hono
  - Hono getting started: https://hono.dev/docs/getting-started/bun
  - Bun SQLite: https://bun.sh/docs/api/sqlite

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Server starts and responds to health check
    Tool: Bash
    Preconditions: Server not running
    Steps:
      1. cd apps/server && bun run src/index.ts &
      2. sleep 2
      3. curl -s http://localhost:3001/health
      4. Assert: Response contains "ok"
      5. kill %1
    Expected Result: Server boots and responds
    Evidence: curl response captured

  Scenario: Server package.json is valid
    Tool: Bash
    Steps:
      1. cat apps/server/package.json | jq '.name'
      2. Assert: Output is "@lumo/server"
      3. cat apps/server/package.json | jq '.dependencies.hono'
      4. Assert: Output is not null
    Expected Result: Package configured correctly
    Evidence: jq output captured
  ```

  **Commit**: YES
  - Message: `feat(server): create Hono server skeleton with SQLite`
  - Files: `apps/server/*`

---

- [x] 3. Create packages/api with oRPC router and Item schema

  **What to do**:
  - Clear existing packages/api content
  - Create `packages/api/src/router.ts` - oRPC router with Item CRUD procedures
  - Create `packages/api/src/schema.ts` - Zod schemas for Item
  - Create `packages/api/src/client.ts` - oRPC client for web app
  - Create `packages/api/src/index.ts` - Exports
  - Update `packages/api/package.json` with new dependencies: @orpc/server, @orpc/client, zod
  - Item schema: { id: number, name: string, description: string, createdAt: string, updatedAt: string }

  **Must NOT do**:
  - Add complex validation beyond basic types
  - Add multiple entities
  - Add authentication middleware

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: Tasks 1, 2

  **References**:
  - oRPC procedures: https://orpc.dev/docs/procedure
  - oRPC router: https://orpc.dev/docs/router
  - Zod schemas: https://zod.dev

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: API package exports router and client
    Tool: Bash
    Steps:
      1. cat packages/api/src/index.ts
      2. Assert: Contains "export" statements for router, client, schema
    Expected Result: Exports are defined
    Evidence: File content captured

  Scenario: TypeScript compiles without errors
    Tool: Bash
    Steps:
      1. cd packages/api && pnpm tsc --noEmit
      2. Assert: Exit code 0
    Expected Result: No type errors
    Evidence: tsc output captured
  ```

  **Commit**: YES
  - Message: `feat(api): create oRPC router with Item CRUD procedures`
  - Files: `packages/api/*`

---

- [x] 4. Remove Rust database code from Tauri

  **What to do**:
  - Delete `packages/desktop/src-tauri/src/db/` directory entirely
  - Delete `packages/desktop/src-tauri/migrations/` directory
  - Remove db module import from `src/lib.rs`
  - Remove database initialization code from `src/lib.rs` setup()
  - Remove `execute_single_sql` and `execute_batch_sql` from invoke_handler
  - Remove sqlx, sqlparser dependencies from Cargo.toml
  - Keep tokio if needed for other async operations, otherwise remove

  **Must NOT do**:
  - Remove non-database Rust code
  - Modify window management code
  - Change Tauri configuration (yet)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 5)
  - **Blocks**: Task 7
  - **Blocked By**: Task 1

  **References**:
  - `packages/desktop/src-tauri/src/db/` - Database module to remove
  - `packages/desktop/src-tauri/src/lib.rs` - Main setup code
  - `packages/desktop/src-tauri/Cargo.toml` - Dependencies

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Database directory removed
    Tool: Bash
    Steps:
      1. ls packages/desktop/src-tauri/src/db/ 2>&1
      2. Assert: "No such file or directory" or similar error
    Expected Result: db directory does not exist
    Evidence: ls output captured

  Scenario: Rust code compiles without db module
    Tool: Bash
    Steps:
      1. cd packages/desktop/src-tauri && cargo check
      2. Assert: Exit code 0
    Expected Result: Rust compiles successfully
    Evidence: cargo output captured
  ```

  **Commit**: YES
  - Message: `refactor(desktop): remove Rust database code`
  - Files: `packages/desktop/src-tauri/*`

---

- [x] 5. Remove old packages/db and packages/api content

  **What to do**:
  - Delete `packages/db/src/adapters/` directory (localStorage.ts, sqlite.ts, types.ts)
  - Delete `packages/db/src/schema/` directory (workspace.ts, page.ts, todo.ts)
  - Delete `packages/db/src/client.ts`
  - Delete `packages/db/src/__tests__/`
  - Delete `packages/db/drizzle.config.ts`
  - Update `packages/db/package.json` - remove drizzle-orm, drizzle-kit, @tauri-apps/api
  - Keep packages/db as minimal package or delete entirely if not needed

  **Must NOT do**:
  - Remove packages/ui
  - Remove packages/shared

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:
  - `packages/db/src/` - All files to remove
  - `packages/db/package.json` - Dependencies to clean

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Old adapters removed
    Tool: Bash
    Steps:
      1. ls packages/db/src/adapters/ 2>&1
      2. Assert: "No such file or directory" or directory is empty
    Expected Result: Adapters directory removed
    Evidence: ls output captured

  Scenario: No drizzle dependencies remain
    Tool: Bash
    Steps:
      1. cat packages/db/package.json | jq '.dependencies["drizzle-orm"]'
      2. Assert: Output is null
    Expected Result: Drizzle removed from dependencies
    Evidence: jq output captured
  ```

  **Commit**: YES
  - Message: `refactor(db): remove old adapters and schemas`
  - Files: `packages/db/*`

---

- [x] 6. Simplify apps/web to Item CRUD UI

  **What to do**:
  - Delete `apps/web/src/components/journal/` directory entirely
  - Delete `apps/web/src/hooks/useJournal.ts`, `useTodoKeyboard.ts`, `useTodoFocus.ts`
  - Delete `apps/web/src/lib/stores/journalStore.ts`
  - Delete `apps/web/src/lib/types/journal.ts`
  - Delete `apps/web/src/__tests__/` directory
  - Create `apps/web/src/components/ItemList.tsx` - Display items in a list
  - Create `apps/web/src/components/ItemForm.tsx` - Create/Edit item form
  - Create `apps/web/src/hooks/useItems.ts` - Hook using oRPC client
  - Update `apps/web/src/App.tsx` - Render ItemList and ItemForm
  - Update imports to use @lumo/api for oRPC client

  **Must NOT do**:
  - Add search, filter, or pagination
  - Add complex state management
  - Add animations or transitions
  - Redesign UI beyond basic functionality

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: For creating clean, minimal CRUD UI

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: Task 9
  - **Blocked By**: Tasks 3, 5

  **References**:
  - `packages/ui/src/components/` - Reusable UI components (Button, Input, Card, etc.)
  - `packages/api/src/client.ts` - oRPC client to use
  - `apps/web/src/App.tsx` - Entry point to modify

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Journal components removed
    Tool: Bash
    Steps:
      1. ls apps/web/src/components/journal/ 2>&1
      2. Assert: "No such file or directory"
    Expected Result: Journal directory removed
    Evidence: ls output captured

  Scenario: Web app compiles without errors
    Tool: Bash
    Steps:
      1. cd apps/web && pnpm tsc --noEmit
      2. Assert: Exit code 0
    Expected Result: TypeScript compiles
    Evidence: tsc output captured

  Scenario: Item CRUD UI renders
    Tool: Playwright
    Preconditions: Server running on localhost:3001, web dev server on localhost:5173
    Steps:
      1. Navigate to http://localhost:5173
      2. Wait for: main content visible (timeout: 10s)
      3. Assert: Page contains "Items" or similar heading
      4. Assert: Create button or form is visible
      5. Screenshot: .sisyphus/evidence/task-6-web-ui.png
    Expected Result: CRUD UI is rendered
    Evidence: .sisyphus/evidence/task-6-web-ui.png
  ```

  **Commit**: YES
  - Message: `refactor(web): replace Journal UI with simple Item CRUD`
  - Files: `apps/web/src/*`

---

- [x] 7. Configure Tauri sidecar for server binary

  **What to do**:
  - Update `packages/desktop/src-tauri/tauri.conf.json`:
    - Add sidecar configuration under `bundle.externalBin`
    - Configure sidecar name: "server" or "lumo-server"
  - Update `packages/desktop/src-tauri/src/lib.rs`:
    - Add code to spawn sidecar on app startup
    - Pass database path via environment variable (app data directory)
    - Handle sidecar process lifecycle
  - Update `packages/desktop/src-tauri/Cargo.toml`:
    - Add tauri-plugin-shell if needed for sidecar management
  - Create build script to copy server binary to correct location

  **Must NOT do**:
  - Add complex process management
  - Add multiple sidecars

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6, 8)
  - **Blocks**: Task 9
  - **Blocked By**: Tasks 2, 4

  **References**:
  - Tauri sidecar docs: https://v2.tauri.app/develop/sidecar/
  - `packages/desktop/src-tauri/tauri.conf.json` - Tauri config
  - `packages/desktop/src-tauri/src/lib.rs` - Rust entry point

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Sidecar configured in tauri.conf.json
    Tool: Bash
    Steps:
      1. cat packages/desktop/src-tauri/tauri.conf.json | jq '.bundle.externalBin'
      2. Assert: Output contains "server" or similar
    Expected Result: Sidecar is configured
    Evidence: jq output captured

  Scenario: Rust code compiles with sidecar logic
    Tool: Bash
    Steps:
      1. cd packages/desktop/src-tauri && cargo check
      2. Assert: Exit code 0
    Expected Result: Rust compiles
    Evidence: cargo output captured
  ```

  **Commit**: YES
  - Message: `feat(desktop): configure Tauri sidecar for server binary`
  - Files: `packages/desktop/src-tauri/*`

---

- [x] 8. Update turbo.json and root package.json

  **What to do**:
  - Update `turbo.json`:
    - Add `dev:server` task for apps/server
    - Update `dev` task to run both web and server in parallel
    - Add `build:server` task for Bun binary compilation
  - Update root `package.json`:
    - Update name to "lumo"
    - Add `dev` script: runs both server and web via turbo
    - Add `build:server` script: builds server binary with Bun
    - Update `build:desktop` to depend on server binary
  - Update `apps/server/package.json`:
    - Add `dev` script
    - Add `build` script for Bun compilation

  **Must NOT do**:
  - Change unrelated turbo tasks
  - Add complex build pipelines

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6, 7)
  - **Blocks**: Task 9
  - **Blocked By**: Task 1

  **References**:
  - `turbo.json` - Current turbo config
  - `package.json` - Root package config
  - Turbo docs: https://turbo.build/repo/docs

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: pnpm dev starts both server and web
    Tool: Bash
    Steps:
      1. timeout 10 pnpm dev || true
      2. Assert: Output contains both "server" and "web" task names
    Expected Result: Both tasks are started
    Evidence: pnpm output captured

  Scenario: turbo.json has server tasks
    Tool: Bash
    Steps:
      1. cat turbo.json | jq '.tasks["dev"]'
      2. Assert: Task is defined
    Expected Result: Dev task configured
    Evidence: jq output captured
  ```

  **Commit**: YES
  - Message: `build: update turbo config for server + web dev`
  - Files: `turbo.json`, `package.json`

---

- [x] 9. Final integration and cleanup

  **What to do**:
  - Run `pnpm install` to ensure all dependencies resolve
  - Run `pnpm dev` and verify both server and web start
  - Test Item CRUD operations via web UI
  - Run `pnpm build:server` and verify binary is created
  - Run `pnpm build:desktop` and verify Tauri app builds
  - Clean up any remaining journal-todo references
  - Delete old migration files, test files, unused configs
  - Update README.md with new project structure

  **Must NOT do**:
  - Add new features
  - Refactor working code

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: [`playwright`]
    - `playwright`: For E2E verification of CRUD operations

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (final)
  - **Blocks**: None
  - **Blocked By**: Tasks 6, 7, 8

  **References**:
  - All previous task outputs
  - `README.md` - To update

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Full dev environment works
    Tool: Bash
    Steps:
      1. pnpm install
      2. Assert: Exit code 0
      3. pnpm dev &
      4. sleep 5
      5. curl -s http://localhost:3001/health
      6. Assert: Response contains "ok"
      7. curl -s http://localhost:5173
      8. Assert: Response contains HTML
      9. kill %1
    Expected Result: Dev environment fully functional
    Evidence: curl responses captured

  Scenario: Item CRUD works end-to-end
    Tool: Playwright
    Preconditions: pnpm dev running
    Steps:
      1. Navigate to http://localhost:5173
      2. Wait for page load
      3. Fill item name: "Test Item"
      4. Fill item description: "Test Description"
      5. Click create/submit button
      6. Wait for item to appear in list
      7. Assert: List contains "Test Item"
      8. Screenshot: .sisyphus/evidence/task-9-crud-create.png
      9. Click delete button for "Test Item"
      10. Wait for item to disappear
      11. Assert: List does not contain "Test Item"
      12. Screenshot: .sisyphus/evidence/task-9-crud-delete.png
    Expected Result: CRUD operations work
    Evidence: .sisyphus/evidence/task-9-crud-*.png

  Scenario: Server binary builds
    Tool: Bash
    Steps:
      1. pnpm build:server
      2. Assert: Exit code 0
      3. ls apps/server/dist/server* 2>&1
      4. Assert: Binary file exists
    Expected Result: Binary is created
    Evidence: ls output captured

  Scenario: No journal-todo references remain
    Tool: Bash
    Steps:
      1. grep -r "journal-todo" --include="*.ts" --include="*.tsx" --include="*.json" . | grep -v node_modules | grep -v .git
      2. Assert: No matches (exit code 1)
    Expected Result: All references renamed
    Evidence: grep output captured
  ```

  **Commit**: YES
  - Message: `chore: final cleanup and integration verification`
  - Files: Various cleanup files

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `refactor: rename all packages from journal-todo to lumo` | package.json files | pnpm install |
| 2 | `feat(server): create Hono server skeleton with SQLite` | apps/server/* | Server starts |
| 3 | `feat(api): create oRPC router with Item CRUD procedures` | packages/api/* | tsc --noEmit |
| 4 | `refactor(desktop): remove Rust database code` | src-tauri/* | cargo check |
| 5 | `refactor(db): remove old adapters and schemas` | packages/db/* | pnpm install |
| 6 | `refactor(web): replace Journal UI with simple Item CRUD` | apps/web/* | tsc --noEmit |
| 7 | `feat(desktop): configure Tauri sidecar for server binary` | src-tauri/* | cargo check |
| 8 | `build: update turbo config for server + web dev` | turbo.json, package.json | pnpm dev |
| 9 | `chore: final cleanup and integration verification` | Various | Full E2E test |

---

## Success Criteria

### Verification Commands
```bash
# Dev environment
pnpm dev  # Expected: Both server and web start

# Server health
curl http://localhost:3001/health  # Expected: {"status":"ok"}

# Item CRUD
curl -X POST http://localhost:3001/rpc/item.create -H "Content-Type: application/json" -d '{"name":"Test","description":"Desc"}'
# Expected: {"id":1,"name":"Test",...}

curl http://localhost:3001/rpc/item.list
# Expected: [{"id":1,"name":"Test",...}]

# Build
pnpm build:server  # Expected: Binary at apps/server/dist/server

# No old references
grep -r "journal-todo" . --include="*.json" | grep -v node_modules
# Expected: No matches
```

### Final Checklist
- [ ] All packages renamed to @lumo/*
- [ ] Server starts and responds to oRPC requests
- [ ] Web UI displays Item list and supports CRUD
- [ ] Tauri sidecar configuration complete
- [ ] Server binary builds with Bun
- [ ] No journal-todo references remain
- [ ] pnpm dev runs both server and web
- [ ] pnpm build:desktop succeeds
