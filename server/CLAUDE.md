# Server (snitch-backend)

Node.js + TypeScript + Express 5 backend for the snitch monorepo. Uses MongoDB (mongoose) for persistence, Redis (ioredis) for cache / queue, JWT for auth, bcryptjs for password hashing, Resend for transactional email, and cookie-parser for session cookies.

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

| Script | What it does |
| --- | --- |
| `pnpm dev` | Run with `tsx watch` (auto-restart on file change). |
| `pnpm build` | Type-check and emit JS to `dist/` via `tsc`. |
| `pnpm start` | Run the compiled `dist/index.js` with Node. |
| `pnpm start:prod` | Run compiled output with `NODE_ENV=production` set explicitly. |
| `pnpm lint` | ESLint over `src/`. |
| `pnpm lint:fix` | ESLint with `--fix`. |
| `pnpm type-check` | `tsc --noEmit` only — no JS emitted, useful in CI. |
| `pnpm format` | Prettier write across the directory. |
| `pnpm format:check` | Prettier check (read-only) — used in CI. |
| `pnpm clean` | Delete `dist/`. |
| `pnpm test` | Jest test runner. |
| `pnpm test:watch` | Jest watch mode. |

Root-level equivalents exist: `pnpm dev:server`, `pnpm build:server`, `pnpm lint` (runs client + server).

---

## Environment variables

Loaded via `dotenv` at boot. Required keys (see `.env.example`):

- `NODE_ENV` — `development` | `production` | `test`
- `PORT` — HTTP port (default `4000`)
- `MONGO_URI` — MongoDB connection string
- `REDIS_URL` — Redis connection string
- `JWT_SECRET` — symmetric secret for signing access/refresh tokens
- `JWT_ACCESS_TTL` / `JWT_REFRESH_TTL` — token lifetimes (e.g. `15m`, `7d`)
- `COOKIE_SECRET` — signed-cookie secret
- `CORS_ORIGIN` — comma-separated allowed origins
- `RESEND_API_KEY` — Resend email API key
- `RESEND_FROM` — verified sender address
- `LOG_LEVEL` — `fatal` | `error` | `warn` | `info` | `debug` | `trace` (default `info`)

Never commit a real `.env` — only `.env.example`.

---

## Project layout

```
server/
├── src/
│   ├── index.ts         # entry — loads env, starts HTTP server
│   ├── app.ts           # express app factory (middleware, routes)
│   ├── config/          # env parsing, db/redis clients
│   ├── routes/          # route modules (router per resource)
│   ├── controllers/     # thin HTTP handlers
│   ├── services/        # business logic (db + redis + email)
│   ├── models/          # mongoose schemas
│   ├── middlewares/     # auth, error, rate-limit, validate
│   ├── utils/           # logger, jwt, async wrapper, custom errors
│   └── types/           # ambient + shared TS types
├── dist/                # build output (gitignored)
├── tsconfig.json
└── package.json
```

Path alias `@/*` → `src/*` (configured in `tsconfig.json`). Use `@/utils/logger` over `../../../utils/logger`.

---

## Conventions

- **Module system**: ESM (`"type": "module"`). Use `import`/`export`, not `require`.
- **Strict TypeScript**: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride` are on. Don't weaken them.
- **Errors**: throw `AppError` (or subclass with `statusCode` + `code`) from services; the global error middleware turns them into JSON. Never `throw new Error('msg')` for expected failures.
- **Async handlers**: wrap with `asyncHandler` from `@/utils/asyncHandler` so rejected promises hit the error middleware.
- **Validation**: validate request body / params / query with `zod` schemas in the route layer, not inside controllers.
- **Logging**: use the shared `logger` (`@/utils/logger`). No `console.log` in committed code.
- **Secrets**: read from `process.env` only inside `config/`. Everywhere else, import the typed config object.
- **Tests**: jest. Place specs next to source as `*.test.ts` or under `__tests__/`.
- **Formatting**: Prettier (root config). Run `pnpm format` before committing.

---

## Auth flow (current)

- Access token: short-lived JWT, sent as `Authorization: Bearer <token>`.
- Refresh token: longer-lived JWT, stored in an httpOnly + secure + sameSite cookie (`refresh_token`).
- Logout clears the cookie and revokes the refresh token in Redis (`refresh:<jti>` → revoked set with TTL = remaining lifetime).
- Passwords hashed with `bcryptjs` (cost factor `12`).

When adding a new auth-protected route, mount the `requireAuth` middleware on it.

---

## Database

- Mongo via mongoose. Connection options live in `src/config/mongo.ts`. Mongoose strict mode is on — unknown fields throw.
- Indexes: declare on the schema (`schema.index({ field: 1 }, { unique: true })`); don't create them at runtime in controllers.
- Migrations: none yet — schema changes ship as code. For destructive changes, write a one-off script in `src/scripts/`.

## Redis

- Single `ioredis` client from `src/config/redis.ts`. Use namespaced keys: `auth:refresh:<jti>`, `rate:<ip>:<route>`, `cache:<resource>:<id>`.
- All keys must have a TTL — no unbounded growth.

---

## HTTP & security

- Helmet sets sensible default headers.
- CORS restricted via `CORS_ORIGIN`; credentials enabled.
- `cookie-parser` is mounted with the signed-cookie secret.
- Rate limit on `/api/auth/*` (login, register, refresh) — tune in `src/config/rateLimit.ts`.
- Body size limit: 1mb for JSON, lower for auth endpoints.

---

## Logging

- Structured JSON via `pino` (`@/utils/logger`).
- In development: pretty-printed via `pino-pretty` when `NODE_ENV !== 'production'`.
- Never log secrets, tokens, or full request bodies that may contain them.

---

## Deployment

1. `pnpm install --frozen-lockfile`
2. `pnpm build` → `dist/`
3. `pnpm start:prod` (or run `node dist/index.js` with a process manager like `pm2` / `systemd`).

Container builds live in `../docker/`. The production image runs as a non-root user and only includes `dist/` + prod `node_modules`.

Health check: `GET /health` returns `{ status: 'ok', uptime, mongo, redis }`.

---

## Things to avoid

- Don't `import` from `dist/` — always from `@/...` or relative `src/` paths.
- Don't swallow errors silently — let the global error handler format them.
- Don't add new top-level deps without updating the root `pnpm-lock.yaml` via the workspace.
- Don't bypass the `asyncHandler` wrapper for async route handlers.
