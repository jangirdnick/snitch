# Snitch — AI Engineering Handbook (Root)

## What is This?

Welcome to **Snitch**, a modern fashion e-commerce platform.

This repository is structured as a **pnpm workspace monorepo**. It contains both the frontend, the backend, and shared packages to ensure end-to-end type safety and architectural consistency.

This file serves as the **entry point** for any AI agent interacting with the codebase. It provides the high-level map of the repository.

> ⚠️ **MANDATORY AI DIRECTIVE:** Before you touch _any_ code in a specific folder, you MUST read the `GEMINI.md` file located inside that folder. They contain the specific architectural rules, tech stack details, and coding conventions for that specific layer.

---

## Monorepo Map

The workspace is divided into three distinct zones:

### 1. `client/` (Frontend)

- **Tech:** React 19, Vite, TailwindCSS, Shadcn UI, RTK Query, React Router v7.
- **Role:** The user-facing e-commerce storefront and admin dashboard.
- **AI Instructions:** Read `client/GEMINI.md` and `client/.agents/skills/` before modifying frontend code.

### 2. `server/` (Backend)

- **Tech:** Node.js, Express v5, TypeScript, Mongoose (MongoDB), Redis, Pino, Zod.
- **Role:** The REST API powering the client. Handles business logic, authentication, database operations, and image processing via PixKit.
- **AI Instructions:** Read `server/GEMINI.md` before modifying backend code. Adhere strictly to the "Custom Error Domain Pattern" and layered architecture (Routes → Controllers → Services → Models).

### 3. `packages/` (Shared Monorepo Packages)

- **Tech:** Zod, TypeScript.
- **Role:** The single source of truth for data structures that cross the network boundary.
  - `@snitch/schemas`: Zod schemas for validation on _both_ client (forms) and server (request body).
  - `@snitch/types`: Pure TypeScript interfaces (API responses, base document shapes).
- **AI Instructions:** Read `packages/GEMINI.md`. **Never duplicate schemas or types between client and server.** Always define them here.

---

## Development Workflow

This is a `pnpm` monorepo. **Do not use npm or yarn.**

### Running the Full Stack Locally

```bash
# Install all dependencies across the entire monorepo
pnpm install

# Run both the client and server concurrently
pnpm dev
```

### Script Aliases (from Root)

- `pnpm dev:server` — Runs only the backend.
- `pnpm dev:client` — Runs only the frontend.
- `pnpm validate` — Runs Type-checking, Linting, and Prettier checks across all packages.
- `pnpm clean` — Clears all `dist/` folders and `.cache` directories.

### Managing Dependencies

Always use the `--filter` flag to target specific workspaces:

```bash
# Add a package to the server
pnpm add [package-name] --filter server

# Add a package to the client
pnpm add [package-name] --filter client

# Add a dev dependency to the root workspace (e.g. for linting)
pnpm add -D [package-name] -w
```

---

## Code Quality Standards

The root workspace manages linting and formatting globally to ensure consistency across the entire monorepo:

1. **Prettier:** Code formatting is enforced via `.prettierrc`.
2. **ESLint:** Code linting is enforced via `eslint.config.mjs` (flat config) utilizing `@typescript-eslint`.
3. **Husky & Lint-Staged:** Pre-commit hooks automatically run Prettier and ESLint on changed files to prevent bad code from being committed.
4. **Commitlint:** Commit messages must follow Conventional Commits (e.g., `feat: add cart logic`, `fix: resolve auth crash`).

---

## The AI's Prime Directive

When the USER asks you to build a feature (e.g., "Add a wishlist"):

1. **Plan Full-Stack:** Recognize that this requires changes in `packages/` (schemas/types), `server/` (routes, controller, service, model), and `client/` (UI, RTK Query API, components).
2. **Consult the Local Oracles:** Read the `GEMINI.md` in each of those folders.
3. **Draft an Implementation Plan:** Present the plan to the user explaining which files will be touched in which workspace.
4. **Execute Methodically:** Work from the ground up:
   - _First:_ Define shared types and validation schemas in `packages/`.
   - _Second:_ Build the database models, services, and controllers in `server/`.
   - _Third:_ Build the RTK Query endpoints and UI components in `client/`.

Never guess the architecture. If you aren't sure, check the `GEMINI.md` files.
