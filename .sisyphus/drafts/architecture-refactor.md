# Draft: Architecture Refactor - Lumo

## Requirements (confirmed)
- 去除 Tauri 部分的 Database Migration Rust 代码
- packages/api 去除 Local Storage 的 Adapter
- API 部分改为使用 oRPC
- apps/server 使用 Hono 作为 Server 应用，Hono 对接 oRPC
- 去除所有 Journal To Do 部分的代码
- Web 端只保留简单的增删改查逻辑
- DB 内容完全清除，只保留一个简单的表格用来做增删改查测试
- 数据库还是使用 SQLite，通过 Hono 管理 SQLite 文件，不再通过 Rust
- dev 环境变成同时启动 server 和 web，使用 turbo repo
- build 变成使用 bun 来构建 hono server 作为一个 binary，然后 tauri 把这个打包进来
- **项目名称全部改成 lumo**（包括 package names, 命名空间等）

## Technical Decisions (confirmed)
- **数据模型**: Item 表 (id, name, description, createdAt, updatedAt)
- **Web UI**: 极简 CRUD（列表展示 + 创建/编辑/删除按钮）
- **Server 启动**: Tauri Sidecar 方式启动 Hono server binary
- **数据库位置**: App Data 目录（跨平台标准位置）
- **项目命名**: 全部改为 lumo（@lumo/web, @lumo/server, @lumo/ui 等）
- **数据迁移**: 丢弃旧数据，全新开始
- **目标平台**: Windows + macOS + Linux 全平台
- **Web/Server 关系**: Web 始终连接 Server（dev 和 production 都通过 oRPC）
- **测试策略**: 无自动化测试

## Metis Review Findings
- 需要处理跨平台 SQLite 路径
- 需要确保 Server 在 UI 之前启动
- 需要处理 Server 优雅关闭避免 DB 损坏
- 需要确保 oRPC 类型在 Web 客户端可用

## Research Findings

### 当前项目结构
- **apps/web**: Vite + React 应用，完全围绕 Journal/Todo 功能构建
- **packages/desktop**: Tauri 桌面包装器
- **packages/desktop/src-tauri**: Rust 后端，包含 SQLite 数据库管理和迁移
- **packages/api**: 仓库层抽象，使用双适配器存储系统
- **packages/db**: 数据库层，包含 LocalStorage 和 SQLite 两个适配器
- **packages/ui**: 共享 UI 组件
- **packages/shared**: 共享 TS 工具和类型

### 需要删除的内容
1. **Rust 数据库代码** (`packages/desktop/src-tauri/src/db/`):
   - database.rs, commands.rs, migration.rs, mod.rs
   - migrations/ 目录
   - Cargo.toml 中的 sqlx, sqlparser 依赖

2. **LocalStorage 适配器** (`packages/db/src/adapters/localStorage.ts`)

3. **Journal/Todo 代码** (apps/web):
   - components/journal/ 目录 (9个组件文件)
   - hooks/ (useJournal, useTodoKeyboard, useTodoFocus)
   - lib/stores/journalStore.ts
   - lib/types/journal.ts
   - 所有相关测试文件

### 需要新建的内容
1. **apps/server**: Hono + oRPC 服务器
2. **简化的 Web 应用**: 简单的 CRUD UI
3. **简化的数据库 schema**: 单表 CRUD 测试

## Open Questions
- ✅ 数据模型 → Item 表
- ✅ Web UI 功能 → 极简 CRUD
- ✅ Server 启动方式 → Sidecar
- ✅ 数据库位置 → App Data 目录
- ✅ 项目命名 → lumo

## Scope Boundaries
- INCLUDE: 
  - 新建 apps/server (Hono + oRPC)
  - 重构 apps/web 为简单 CRUD
  - 简化 packages/db 为单表
  - 修改 Tauri 启动逻辑
  - 修改 turbo 配置
  - 修改 build 流程

- EXCLUDE:
  - packages/ui 组件库（保留）
  - packages/shared 工具（保留）
  - Tauri 窗口管理等非数据库功能
