# Snitch — Shared Packages (`packages/`)

## What is This?

This directory contains the **shared packages** for the Snitch monorepo. These packages act as the **single source of truth** for both the frontend (`client/`) and backend (`server/`).

They are managed by `pnpm` workspaces. Both `client` and `server` consume these packages locally without needing to publish them to npm.

> **Architecture Principle:** Never define data schemas or API types twice. If a data structure crosses the network boundary between client and server, it MUST be defined here.

---

## AI Development Workflow — MANDATORY

> ⚠️ **MANDATORY:** Before creating any interface, type, or Zod schema in the `client` or `server`, check if it belongs here first.

1. **Client needs a form schema?** → Define it in `@snitch/schemas`, export it, and import it in both the React component and the Express route.
2. **Server needs an API response type?** → Define it in `@snitch/types`, export it, and import it in the Express controller and RTK Query/Axios client.
3. **Never duplicate.** If you see a type or schema defined in both `client` and `server`, it is a violation of the monorepo architecture. Refactor it into `packages/`.

---

## Packages Structure

```
packages/
├── schemas/         # @snitch/schemas
│   ├── src/
│   │   ├── user.schema.ts
│   │   ├── product.schema.ts
│   │   ├── category.schema.ts
│   │   └── index.ts # Single entry point for exports
│   └── package.json
│
└── types/           # @snitch/types
    ├── src/
    │   ├── api.type.ts
    │   ├── auth.type.ts
    │   ├── jwt.type.ts
    │   ├── product.type.ts
    │   ├── user.type.ts
    │   └── index.ts # Single entry point for exports
    └── package.json
```

---

## `@snitch/schemas` — Validation Layer

**Purpose:** Zod schemas for validating data on both ends.

- **Frontend:** Used with `react-hook-form` + `@hookform/resolvers/zod` to validate forms before submission.
- **Backend:** Used with the `validate()` Express middleware to validate incoming request bodies and queries.

### Rules

1. **Export everything from `index.ts`.** Consumers should only import from `@snitch/schemas`, never deep paths like `@snitch/schemas/src/user.schema`.
2. **Export inferred types.** Always export the TypeScript type inferred from the Zod schema.

```ts
// packages/schemas/src/user.schema.ts
import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Export the inferred type so both client and server can use it
export type LoginUserDto = z.infer<typeof loginUserSchema>;
```

3. **Re-export Zod.** `packages/schemas/src/index.ts` re-exports `z` and `ZodSchema` so that `client` and `server` don't need `zod` installed as a direct dependency for basic usage.

---

## `@snitch/types` — TypeScript Definitions

**Purpose:** Shared TypeScript types that don't require runtime validation.

- API Response structures (`ApiSuccess<T>`, `ApiErrorResponse`).
- Database document shapes (stripped of Mongoose/MongoDB specific methods).
- JWT payload structures.

### Rules

1. **Export everything from `index.ts`.**
2. **Pure Types Only.** This package should contain `interface` and `type` declarations only. No runtime logic, no classes, no functions.

```ts
// packages/types/src/api.type.ts
export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};
```

---

## Usage in Apps

Both `client` and `server` have these packages linked in their `package.json`:

```json
"dependencies": {
  "@snitch/schemas": "workspace:*",
  "@snitch/types": "workspace:*"
}
```

### Example Usage (Client / React)

```tsx
import { loginUserSchema, type LoginUserDto } from '@snitch/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm<LoginUserDto>({
  resolver: zodResolver(loginUserSchema),
});
```

### Example Usage (Server / Express)

```ts
import { loginUserSchema, type LoginUserDto } from '@snitch/schemas';
import type { ApiSuccess } from '@snitch/types';
import { validate } from '@/middlewares/validate.middleware.js';

router.post('/login', validate(loginUserSchema), (req, res) => {
  const data = req.body as LoginUserDto; // Strongly typed!

  const response: ApiSuccess<{ token: string }> = {
    success: true,
    message: 'Logged in',
    data: { token: '...' },
  };

  res.json(response);
});
```

---

## How to add a new package

If we ever need a new shared package (e.g., `@snitch/utils`):

1. Create `packages/utils`.
2. Add `package.json` with `"name": "@snitch/utils"` and `"type": "module"`.
3. Configure `exports` in `package.json` to point to `./src/index.ts`.
4. Run `pnpm install` at the workspace root to link it.
5. Add `"@snitch/utils": "workspace:*"` to `client` and `server` package.json dependencies.
