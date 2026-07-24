# Server (snitch-backend)

Node.js + TypeScript + Express 5 backend for the snitch monorepo. Uses MongoDB (mongoose) for persistence, Redis (ioredis) for cache / session throttling, JWT for auth, bcryptjs for password hashing, Resend for transactional email, Passport for OAuth (Google), Multer for file uploads, and cookie-parser for session cookies.

---

## Quick start

```bash
# from server/
pnpm install
cp .env.example .env   # then fill in values
pnpm dev               # tsx watch — hot reload on src changes
```

The server listens on `PORT` (default `4000`) once Mongo and Redis connect.

---

## Scripts

| Script              | What it does                                                   |
| ------------------- | -------------------------------------------------------------- |
| `pnpm dev`          | Run with `tsx watch` (auto-restart on file change).            |
| `pnpm build`        | Type-check and emit JS to `dist/` via `tsc`.                   |
| `pnpm start`        | Run the compiled `dist/server.js` with Node.                   |
| `pnpm start:prod`   | Run compiled output with `NODE_ENV=production` set explicitly. |
| `pnpm lint`         | ESLint over `src/`.                                            |
| `pnpm lint:fix`     | ESLint with `--fix`.                                           |
| `pnpm type-check`   | `tsc --noEmit` only — no JS emitted, useful in CI.             |
| `pnpm format`       | Prettier write across the directory.                           |
| `pnpm format:check` | Prettier check (read-only) — used in CI.                       |
| `pnpm clean`        | Delete `dist/`.                                                |
| `pnpm test`         | Jest test runner.                                              |
| `pnpm test:watch`   | Jest watch mode.                                               |

Root-level equivalents exist: `pnpm dev:server`, `pnpm build:server`, `pnpm lint` (runs client + server).

---

## Environment variables

Loaded via `dotenv/config` at boot in `src/config/config.ts`. Required keys (see `.env.example`):

- `NODE_ENV` — `development` | `production` | `test`
- `PORT` — HTTP port (default `4000`)
- `MONGODB_URI` — MongoDB connection string
- `CORS_ORIGIN` — allowed origin for CORS
- `JWT_SECRET` — symmetric secret for signing access/refresh tokens
- `RESEND_API_KEY` — Resend email API key
- `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` — Redis connection params
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth credentials
- `PIXKIT_PUBLIC_KEY` / `PIXKIT_SECRET_KEY` / `PIXKIT_PROJECT_ID` — PixKit media service credentials

Never commit a real `.env` — only `.env.example`.

**Config access pattern:** Read from `process.env` **only** inside `src/config/config.ts`. Everywhere else, import the typed `config` object:

```ts
// ✅ Correct
import config from '@/config/config.js';
const port = config.PORT;

// ❌ Wrong — never read process.env outside config/
const port = process.env.PORT;
```

The config module uses `requireENV()` and `requireENVNumber()` helpers that throw at startup if any required variable is missing or malformed.

---

## Project layout

```
server/
├── src/
│   ├── app.ts              # Express app factory (middleware, routes, Passport)
│   ├── config/
│   │   ├── config.ts       # Typed env config — single source of truth
│   │   ├── database.config.ts  # MongoDB/Mongoose connection
│   │   └── redis.config.ts     # ioredis client
│   ├── routes/
│   │   ├── auth.route.ts   # /api/auth/* — register, login, refresh, logout, Google OAuth
│   │   ├── user.route.ts   # /api/user/*
│   │   └── product.route.ts # /api/product/* — public + admin (AuthAdminGuard)
│   ├── controllers/
│   │   ├── auth.controller.ts   # AuthController (static methods)
│   │   └── product.controller.ts # ProductController (static methods)
│   ├── services/
│   │   ├── user.service.ts     # User CRUD + custom domain errors
│   │   ├── session.service.ts  # Session management + custom errors
│   │   ├── product.service.ts  # Product business logic
│   │   ├── email.service.ts    # Resend email wrapper
│   │   ├── redis.service.ts    # Redis get/set/del helpers
│   │   └── media.service.ts    # Image upload/processing (PixKit)
│   ├── models/
│   │   ├── user.model.ts       # Mongoose User schema (with comparePassword)
│   │   ├── session.model.ts    # Mongoose Session schema (with compareHashToken)
│   │   └── product.model.ts    # Mongoose Product schema
│   ├── middlewares/
│   │   ├── auth.middleware.ts          # AuthGuard factory (AuthUserGuard, AuthAdminGuard)
│   │   ├── validate.middleware.ts      # Zod request body validation
│   │   ├── request-tracing.middleware.ts # X-Request-Id + scoped logger per request
│   │   └── pino.middleware.ts          # HTTP request logging (pino-http)
│   ├── filters/
│   │   └── http-exception.filter.ts   # Global error handler (DOMAIN_ERROR_MAP)
│   ├── emails/
│   │   ├── verification.email.ts  # OTP verification email template
│   │   └── welcome.email.ts       # Welcome email template
│   ├── utils/
│   │   ├── logger.ts       # Pino logger factory (createLogger + rootLogger)
│   │   ├── jwt.util.ts     # JWT sign/verify helpers
│   │   └── cookie.util.ts  # setCookie / clearCookie helpers
│   └── types/
│       ├── express.d.ts    # Express Request augmentation (user, userId, requestId, logger)
│       ├── auth.type.ts    # GoogleUser type
│       └── user.type.ts    # Server-specific user types
├── dist/                   # Build output (gitignored)
├── tsconfig.json
└── package.json
```

Path alias `@/*` → `src/*` (configured in `tsconfig.json`). Use `@/utils/logger` over `../../../utils/logger`.

---

## Coding Principles

### General

- **Production-first implementation only.** No TODO stubs, no placeholder logic.
- Prioritize readability, maintainability, scalability, and performance.
- **Never break the existing project architecture.** Follow the established folder structure, naming conventions, and import patterns.
- Keep code DRY, modular, and reusable. Prefer composition over duplication.
- Remove dead code and unused imports. Never introduce unnecessary dependencies.

### Code Quality

- Write clean, self-documenting code with meaningful names.
- Keep functions small and single-responsibility.
- Extract reusable logic into services or utilities.
- Avoid magic numbers and hardcoded values — use named constants (see `REFRESH_TOKEN_TTL_MS`, `OTP_TTL_SECONDS`, `MAX_OTP_ATTEMPTS` in `auth.controller.ts`).
- Maintain consistent formatting and file organization.

### TypeScript

- **Strict typing only.** The tsconfig has `strict: true` enabled. Never weaken it.
- **Never use `any`** unless absolutely unavoidable. Prefer specific types or `unknown`.
- Prefer inferred types where possible; avoid redundant type annotations.
- **Reuse shared types from `@snitch/types`** — `UserResponseDto`, `ApiSuccess<T>`, `ApiErrorResponse`, etc.
- **Reuse shared schemas from `@snitch/schemas`** — `CreateUserDto`, `LoginUserDto`, `createProductSchema`, etc.
- Avoid duplicate interfaces. Keep types colocated in `src/types/` when only used server-side.
- Module system: **ESM** (`"type": "module"`). Use `import`/`export`, not `require`. All local imports require `.js` extension (Node ESM resolution).

### Before generating code

Always:

1. Analyze the existing implementation across services, controllers, and models.
2. Reuse existing utilities (`createLogger`, `setCookie`, `clearCookie`, `redisGet/Set/Del`).
3. Follow the current architecture and naming patterns.
4. Match the project's coding style (static controller methods, function-based services, custom error classes).
5. Optimize for production — validate inputs, handle edge cases, log appropriately.
6. Avoid introducing breaking changes to the API response structure.
7. Improve code quality without unnecessary refactoring.

---

## Conventions

### Controllers — Thin and Focused

Controllers are **classes with static methods** that handle HTTP concerns only:

```ts
// ✅ Correct pattern — controller delegates to services
export class AuthController {
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as LoginUserDto;
      const user = await userFindByEmailPassword({ email, password });
      // ... token generation, cookie setting, response
      res.status(200).json({ success: true, message: '...', data: { ... } });
    } catch (error) {
      next(error); // ALWAYS forward errors — never swallow
    }
  };
}
```

**Rules:**

- Business logic belongs in **services**, not controllers.
- Always forward errors via `next(error)` — the `globalErrorFilter` handles formatting.
- Use `req.body as SomeDto` for typed access after the `validate()` middleware has run.

### Services — Business Logic Layer

Services are **exported functions** (not classes) that encapsulate business logic:

```ts
// ✅ Correct pattern
export async function userCreate(params: IUserCreate): Promise<UserWithoutPassword> {
  try {
    const createdUser = await userModel.create(params);
    return createdUser.toObject();
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new UserAlreadyExistsError();
    }
    throw new DatabaseOperationError('userCreate', error);
  }
}
```

**Rules:**

- Each service file creates its own logger: `const logger = createLogger('SERVICE-NAME');`
- Re-throw known domain errors, wrap unexpected errors in `DatabaseOperationError`.
- Use `isXxxError()` guard functions to avoid catching your own domain errors.

### Custom Errors — Domain Error Pattern

Every service defines its own custom error classes with `statusCode` and `name`:

```ts
export class UserNotFoundError extends Error {
  public readonly statusCode = 404;
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
    this.name = 'UserNotFoundError';
  }
}
```

**Rules:**

- **Never `throw new Error('msg')`** for expected failures. Always use a named custom error.
- Each custom error must have a `statusCode` property and a descriptive `name`.
- Register the error in the `DOMAIN_ERROR_MAP` inside `filters/http-exception.filter.ts`.
- Custom errors live in the **service file** they originate from (not in a separate errors folder).

### Global Error Filter — `globalErrorFilter`

All errors flow through `src/filters/http-exception.filter.ts`:

- **ZodError** → `400` with structured `fields` array (`{ field, message }`).
- **Domain errors** → matched via `DOMAIN_ERROR_MAP` to HTTP status codes.
- **Unknown errors** → `500`.
- Stack traces only included when `NODE_ENV === 'development'`.
- `5xx` errors logged as `error`, `4xx` as `warn`.

**When adding a new custom error:** Add it to the `DOMAIN_ERROR_MAP`:

```ts
const DOMAIN_ERROR_MAP = new Map<ErrorClass, number>([
  // ... existing entries
  [YourNewError, 400], // ← add here
]);
```

### Validation — Zod in Routes

Validation happens at the **route layer** via the `validate()` middleware:

```ts
// routes/auth.route.ts
router.post('/register', validate(createUserSchema), AuthController.register);
```

**Rules:**

- Schemas come from `@snitch/schemas` — never define new Zod schemas in the server codebase.
- **Exception:** Multipart/form-data routes skip the `validate()` middleware — validation happens inside the controller after Multer processes the request (see `product.controller.ts`).
- The `validate()` middleware replaces `req.body` with the parsed result for clean, typed access downstream.

### Logging

- Structured JSON via `pino` (`@/utils/logger`).
- **Factory function:** `createLogger('CONTEXT-NAME')` creates a scoped child logger.
- **Request-scoped logger:** `req.logger` (attached by `requestTracingMiddleware`) includes `reqId`, `method`, and `url`.
- In development: pretty-printed via `pino-pretty`.
- **Redaction:** Passwords, tokens, API keys, and auth headers are automatically redacted.
- **No `console.log`** in committed code.
- Never log secrets, tokens, or full request bodies that may contain them.

### Secrets

- Read from `process.env` only inside `config/config.ts`.
- Everywhere else, import the typed config object: `import config from '@/config/config.js';`

### Tests

- Jest. Place specs next to source as `*.test.ts` or under `__tests__/`.

### Formatting

- Prettier (root config). Run `pnpm format` before committing.

---

## API Response Structure

All API responses follow a consistent shape defined in `@snitch/types`:

```ts
// Success (with data)
{ success: true, message: "...", data: { ... } }

// Success (no data)
{ success: true, message: "..." }

// Error
{ success: false, error: { name: "...", message: "...", fields?: [...] } }
```

**Rules:**

- Always include `success: true | false` as the top-level discriminator.
- Use proper HTTP status codes: `200` (OK), `201` (Created), `400` (Validation), `401` (Unauthorized), `404` (Not Found), `409` (Conflict), `429` (Rate Limit), `500` (Server Error), `502` (Upstream Error).
- Field validation errors **must** be structured as `{ field: string, message: string }[]` for frontend mapping via `setFormErrors()`.
- Preserve backward compatibility unless intentionally changing APIs.

---

## Auth flow (current)

- Access token: short-lived JWT, sent as `Authorization: Bearer <token>`.
- Refresh token: longer-lived JWT, stored in an httpOnly cookie (`__snitch_rt`).
- Session model tracks each device — tokens are hashed via bcrypt before storage.
- Logout revokes the session in MongoDB. Logout-all revokes all sessions for the user.
- Passwords hashed with `bcryptjs`.
- Google OAuth via Passport (`passport-google-oauth20`).

**Auth middleware pattern — `AuthGuard` factory:**

```ts
// Creates role-based guards with Redis-cached existence checks (5-min TTL)
export const AuthUserGuard = AuthGuard(['USER', 'ADMIN']);
export const AuthAdminGuard = AuthGuard(['ADMIN']);
```

When adding a new auth-protected route, mount `AuthUserGuard` or `AuthAdminGuard` on it.

---

## Database

- Mongo via mongoose. Connection options live in `src/config/database.config.ts`. Mongoose strict mode is on — unknown fields throw.
- Indexes: declare on the schema (`schema.index({ field: 1 }, { unique: true })`); don't create them at runtime in controllers.
- Models export the document interface (`IUser`), creation interface (`IUserCreate`), and utility types (`UserWithoutPassword`).
- Migrations: none yet — schema changes ship as code. For destructive changes, write a one-off script.

**Rules:**

- Validate before writing. Never trust client input.
- Prevent duplicate data — use unique indexes and check with `exists()` before creation.
- Ensure transactional safety where needed (multi-document updates).
- Keep schema and shared validation (`@snitch/schemas`) in sync.

## Redis

- Single `ioredis` client from `src/config/redis.config.ts`.
- Access via service helpers: `redisGet(key)`, `redisSet({ key, value, ttl })`, `redisDel({ key })`.
- Namespaced keys: `otp:<email>`, `otp:attempts:<email>`, `auth:exists:<userId>`.
- **All keys must have a TTL** — no unbounded growth.

---

## HTTP & security

- Helmet sets sensible default headers.
- CORS restricted via `CORS_ORIGIN`; credentials enabled.
- `cookie-parser` is mounted for signed cookies.
- Rate limit on auth endpoints — tune via `express-rate-limit` + `rate-limit-redis`.
- Body size limit: 1mb for JSON.
- File uploads: Multer with memory storage, 5MB limit, image-only filter. Max 50 files per request.
- Request tracing: every request gets a unique `X-Request-Id` (forwarded from client or generated).

---

## File Uploads (Multer + PixKit)

Product images use multipart/form-data with a specific convention:

- `images` field: flat array of image files.
- `data` field: JSON string of the product payload (including `imageIndices` per color).
- Multer runs **before** the controller — `req.body` contains text fields, `req.files` contains images.
- The controller parses the `data` field, validates with Zod, then processes images via `media.service.ts`.

---

## Deployment

1. `pnpm install --frozen-lockfile`
2. `pnpm build` → `dist/`
3. `pnpm start:prod` (or run `node dist/server.js` with a process manager like `pm2` / `systemd`).

Health check: `GET /api/health` returns `{ success: true, status: 'ok' }`.

---

## Error Handling Principles

- **Never swallow errors.** Always `next(error)` in controllers or re-throw in services.
- Return actionable validation errors with per-field detail.
- Differentiate error categories:
  - **Validation errors** (`400`) — malformed input, schema failures.
  - **Authentication errors** (`401`) — invalid credentials, expired tokens, unverified email.
  - **Authorization errors** (`401`) — role mismatch.
  - **Not Found errors** (`404`) — missing resources.
  - **Conflict errors** (`409`) — duplicates.
  - **Server errors** (`500`) — unexpected failures, database operation errors.
- Log useful debugging information without exposing sensitive data.
- Never expose internal error details to clients in production (stack traces only in development).

---

## Performance

- Avoid unnecessary database queries — use `exists()` over `findOne()` when you only need existence.
- Cache auth existence checks in Redis (5-minute TTL) to throttle DB hits.
- Use `.lean()` + `.exec()` on Mongoose queries when you don't need document methods.
- Use `.select('-password')` to exclude sensitive fields from query results.
- Optimize imports — don't import entire modules when you need a single export.
- Prefer efficient algorithms over premature micro-optimizations.

---

## Documentation

- Add JSDoc for public utilities, services, middleware, and complex logic.
- Keep comments meaningful; avoid obvious comments.
- Update this file when architecture changes.

---

## Things to avoid

- Don't `import` from `dist/` — always from `@/...` or relative `src/` paths.
- Don't swallow errors silently — let the `globalErrorFilter` format them.
- Don't add new top-level deps without updating the root `pnpm-lock.yaml` via the workspace.
- Don't use `console.log` — use `createLogger()` from `@/utils/logger`.
- Don't read `process.env` outside of `src/config/config.ts`.
- Don't define Zod schemas in the server — they live in `@snitch/schemas`.
- Don't define shared types in the server — they live in `@snitch/types`.
- Don't use generic `Error` for expected failures — use custom error classes.
- Don't bypass the `validate()` middleware for JSON routes.
- Don't store raw tokens — always hash before persisting to the session model.
- Don't use `npm` or `yarn` — only `pnpm`.
