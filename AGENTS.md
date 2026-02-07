# AGENTS.md

Guidance for agentic coding assistants working in this repository.

## Scope and Repo Shape

- Monorepo managed by `pnpm` workspaces + Turbo.
- Workspace roots:
  - `apps/server` (Bun + Hono server)
  - `apps/web` (Vite + React app)
  - `apps/website` (Next.js marketing website)
  - `packages/api` (oRPC contracts/routers)
  - `packages/db` (Drizzle + Bun SQLite)
  - `packages/ui` (shared React UI components)
  - `packages/shared` (shared types/utils)
  - `packages/desktop` (Tauri wrapper)

## Package Manager and Runtime

- Package manager: `pnpm@10.12.1`.
- Node is used across the repo; Bun is required for server runtime/build commands.
- Rust/Tauri toolchain is required for desktop builds.

## Primary Commands (Run From Repo Root)

### Develop

- `pnpm dev` - run Turbo dev graph.
- `pnpm dev:server` - run only server dev process.
- `pnpm dev:website` - run Next.js website dev server.
- `pnpm dev:desktop` - run Tauri desktop dev flow.

### Build

- `pnpm build` - build server + web + desktop.
- `pnpm build:server` - build server binary (`apps/server/dist/server`).
- `pnpm build:web` - build Vite web app.
- `pnpm build:website` - build Next.js website.
- `pnpm build:desktop` - build Tauri desktop app.

### Lint

- `pnpm lint` - Turbo lint task (currently most relevant in `apps/website` and `apps/web`).
- `pnpm -C apps/website lint` - lint Next.js app directly.

### Type Check

- `pnpm typecheck` - Turbo typecheck across workspaces.
- `pnpm -C apps/web typecheck`
- `pnpm -C apps/server typecheck`
- `pnpm -C apps/website typecheck`

### Test

- `pnpm test` - run root Vitest (`passWithNoTests: true`).
- `pnpm test:ui` - run Vitest UI.
- `pnpm exec vitest run` - explicit non-watch test run.

## Running a Single Test (Important)

No committed test files currently exist, but Vitest is configured. Use these patterns when adding/running tests:

- Run one test file (root config):
  - `pnpm exec vitest run path/to/file.test.ts`
- Run one test file in web app with web config:
  - `pnpm exec vitest run --config apps/web/vitest.config.ts apps/web/src/path/to/file.test.tsx`
- Run tests matching a name:
  - `pnpm exec vitest run -t "test name"`
- Combine file + name filter:
  - `pnpm exec vitest run apps/web/src/path/to/file.test.tsx -t "renders item"`
- Watch a single file while developing:
  - `pnpm exec vitest --config apps/web/vitest.config.ts apps/web/src/path/to/file.test.tsx`

## Code Style and Conventions

## UI Component Installation Policy

- All UI component extraction/installation (shadcn/ui, AI Elements, and related UI generators) must be performed in `packages/ui`.
- `components.json` must live in `packages/ui/components.json`.
- Do not add or keep app-local `components.json` files under `apps/*`.
- Apps should consume shared UI components via `@lumo/ui` exports instead of generating duplicate UI components locally.

### Language and Typing

- TypeScript-first repository with `strict: true` broadly enabled.
- Prefer explicit domain types and schema-derived types over `any`.
- Use `import type` for type-only imports.
- Keep API contracts and validation schemas aligned (`packages/api/src/contracts` + `packages/api/src/schemas`).
- Favor narrow return types for exported helpers when useful.

### Imports and Module Structure

- Import order pattern used across repo:
  1) external packages,
  2) workspace/internal aliases,
  3) relative imports.
- Keep a blank line between logical import groups.
- Use path aliases where configured:
  - `@/*` in `apps/web`
  - `@/*` in `apps/website`
- In shared packages, export from `src/index.ts` and keep public surface deliberate.

### Formatting and File-Level Consistency

- No single global formatter config is enforced at root.
- Follow the existing style of the file you edit:
  - `apps/web`, `apps/server`, `packages/api`, `packages/db`, `packages/ui`:
    - double quotes
    - semicolons often omitted
  - `apps/website` and parts of `packages/shared`:
    - double quotes
    - semicolons commonly present
- Do not perform broad formatting-only rewrites unless explicitly requested.
- Keep diffs tight and focused on behavior.

### Naming Conventions

- React components: `PascalCase` (e.g. `ItemList.tsx`).
- Hooks: `useXxx` in hook modules.
- Utility functions/variables: `camelCase`.
- Constants and env-like values: `UPPER_SNAKE_CASE` (e.g. `SERVER_URL`).
- Zod schemas: `XxxSchema`; derived input/output types should mirror schema intent.

### React and UI Patterns

- Functional components + hooks only (no class components observed).
- Prefer controlled inputs for forms (`value` + `onChange`).
- Use shared UI primitives from `@lumo/ui` before introducing custom duplicates.
- Keep client/server boundaries explicit in Next.js (`"use client"` where required).

### Error Handling

- In oRPC routers, throw typed contract errors (e.g. `errors.NOT_FOUND()`) instead of raw strings.
- Validate IO with Zod schemas in `packages/api/src/schemas`.
- In UI async flows, use `try/finally` for loading-state cleanup.
- Surface user-facing errors from query/mutation state (`error?.message`) rather than swallowing.
- Log operational server errors with context (`onError` interceptor pattern in server).

### Data and API Conventions

- Keep API route definitions, contract types, and handlers synchronized.
- Reuse shared types from `@lumo/api` and `@lumo/db` rather than redefining shapes.
- For DB mutations, ensure timestamp updates are handled consistently (`createdAt`/`updatedAt`).

## Lint/Type/Test Expectations for PRs

Before finalizing substantial changes, run:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm exec vitest run` (or targeted commands above)

If touching only one workspace, workspace-local commands are acceptable.

## Cursor and Copilot Rules Check

- `.cursorrules`: not found.
- `.cursor/rules/`: not found.
- `.github/copilot-instructions.md`: not found.

If these files are added later, treat their instructions as higher-priority repository policy and update this file accordingly.
