# Lumo - Minimal CRUD Demo

A modern, minimal CRUD application demonstrating a clean architecture with Hono server, React web UI, and Tauri desktop wrapper.

## Project Structure

```
lumo/
├── apps/
│   ├── server/          # Hono + oRPC server with SQLite
│   ├── web/             # React + Vite web UI
│   └── desktop/         # Tauri desktop wrapper
├── packages/
│   ├── api/             # oRPC router and schemas
│   ├── ui/              # Reusable UI components
│   ├── shared/          # Shared utilities and types
│   └── db/              # Database utilities (minimal)
└── turbo.json           # Monorepo build configuration
```

## Tech Stack

- **Server**: Hono + oRPC + SQLite (better-sqlite3)
- **Web**: React 19 + Vite + Tailwind CSS
- **Desktop**: Tauri v2 (sidecar for server binary)
- **Monorepo**: pnpm + Turbo
- **Language**: TypeScript (strict mode)

## Getting Started

### Prerequisites

- Node.js 18+ (or Bun 1.3.6+)
- pnpm 10+
- Rust (for Tauri desktop builds)

### Installation

```bash
pnpm install
```

### Development

Start both server and web dev servers:

```bash
pnpm dev
```

This runs:
- **Server**: `http://localhost:3001` (Hono + oRPC)
- **Web**: `http://localhost:5173` (Vite dev server)

### Building

Build all packages:

```bash
pnpm build
```

Build server binary only:

```bash
pnpm build:server
```

Build desktop app:

```bash
pnpm build:desktop
```

## Features

### Item CRUD

The web UI provides a minimal interface for managing items:

- **Create**: Add new items with name and description
- **Read**: View all items in a list
- **Update**: Edit existing items
- **Delete**: Remove items

### Data Model

```typescript
Item {
  id: number
  name: string
  description: string
  createdAt: string (ISO datetime)
  updatedAt: string (ISO datetime)
}
```

### API

The server exposes oRPC procedures at `/rpc/*`:

- `POST /rpc/item.create` - Create new item
- `GET /rpc/item.list` - List all items
- `GET /rpc/item.get/:id` - Get single item
- `PUT /rpc/item.update/:id` - Update item
- `DELETE /rpc/item.delete/:id` - Delete item
- `GET /health` - Health check

## Architecture

### Server (`apps/server`)

- Hono web framework for HTTP routing
- oRPC for type-safe RPC procedures
- SQLite database with better-sqlite3
- Zod for runtime schema validation

### Web (`apps/web`)

- React functional components with hooks
- Vite for fast development and building
- Tailwind CSS for styling
- oRPC client for server communication

### Desktop (`apps/desktop`)

- Tauri v2 for cross-platform desktop app
- Server runs as sidecar process
- Database stored in app data directory

### Shared (`packages/api`)

- oRPC router type definitions
- Zod schemas for Item validation
- oRPC client factory for web

## Development Workflow

### Running Tests

Currently, no automated tests are configured. Manual testing via the web UI is recommended.

### Type Checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint
```

## Deployment

### Desktop

Build the Tauri app:

```bash
pnpm build:desktop
```

This creates platform-specific installers in `apps/desktop/src-tauri/target/release/bundle/`.

### Web

Build the web app:

```bash
pnpm build:web
```

Output is in `apps/web/dist/`.

## Environment Variables

### Server

- `PORT` - Server port (default: 3001)
- `LUMO_DB_PATH` - SQLite database path (default: ./lumo.db)

### Desktop

- Database path is automatically set to app data directory

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## License

MIT
