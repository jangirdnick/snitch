# Snitch — Backend Server (`server/`)

## What is This?

**Snitch Backend** is a production-grade **Node.js + TypeScript + Express 5** REST API powering the Snitch fashion e-commerce platform. It follows a **layered architecture** — Routes → Controllers → Services → Models — with custom domain errors, global error filtering, structured logging, and strict monorepo conventions.

> **Architecture Principle:** Every layer has a single responsibility. Controllers never touch the database. Services never touch HTTP. Models never contain business logic.

---

## AI Development Workflow — MANDATORY

> ⚠️ **Before implementing ANY feature, the AI agent MUST follow this checklist. Skipping steps = broken architecture, duplicated code, inconsistent patterns.**

### Pre-Implementation Checklist

```
□ 1. Read EVERY `GEMINI.md` in the monorepo (client/, server/, root)
□ 2. Read `.agents/skills/` if UI/frontend is involved
□ 3. Analyse the existing architecture — understand the layer the change belongs to
□ 4. Search for reusable services, controllers, schemas, utilities, and shared packages
□ 5. Check `@snitch/schemas` for existing Zod schemas
□ 6. Check `@snitch/types` for existing TypeScript types
□ 7. Identify all custom errors in the relevant service + controller
□ 8. Check the `DOMAIN_ERROR_MAP` in `http-exception.filter.ts`
□ 9. Extend existing implementations — NEVER duplicate
□ 10. Explain the implementation plan before writing code
```

### Implementation Rules

- **Reuse first.** Search existing services, utilities, and patterns before creating new code.
- **Extend, don't duplicate.** If `DatabaseOperationError` already exists in `user.service.ts`, import and reuse it — don't create another one.
- **Follow established patterns.** Every controller, service, route, and model follows the exact same structure. Match it.
- **Explain before coding.** State which files will be modified, what patterns are being followed, and why.

---

## Monorepo Architecture — FUNDAMENTAL RULES

Snitch is a **pnpm workspace monorepo**:

```
snitch/                          ← root workspace
├── client/                      ← React frontend
├── server/                      ← Express backend (this folder)
└── packages/
    ├── schemas/  (@snitch/schemas)   ← Zod schemas — single source of truth
    └── types/    (@snitch/types)     ← Shared TypeScript interfaces/types
```

### Rule 1: Zod schemas ONLY in `@snitch/schemas`

```
❌ WRONG — defining z.object({...}) inside server/src/
✅ RIGHT — packages/schemas/src/product.schema.ts
```

**Exception:** Query parameter parsing uses `safeParse()` inline in controllers/routes when the schema already exists in `@snitch/schemas`.

### Rule 2: Shared types ONLY in `@snitch/types`

```
❌ WRONG — interface ApiSuccess<T> { ... } inside server/src/types/
✅ RIGHT — packages/types/src/api.type.ts
```

`server/src/types/` is ONLY for **server-specific** type augmentations:

- `express.d.ts` — Express Request augmentation (`user`, `userId`, `requestId`, `logger`)
- `auth.type.ts` — Google OAuth profile types
- `user.type.ts` — Server-only user types

### Rule 3: Always use `pnpm`

```
❌ npm install axios / yarn add axios
✅ pnpm add axios --filter server
```

### Rule 4: Import from packages, never copy

```ts
// ✅ CORRECT
import { CreateUserDto, loginUserSchema } from '@snitch/schemas';
import { ApiSuccess, UserResponseDto } from '@snitch/types';

// ❌ WRONG — redefining the same interface locally
interface ApiSuccess<T> { ... }
```

---

## Tech Stack

| Technology             | Version | Purpose                                   |
| ---------------------- | ------- | ----------------------------------------- |
| **Node.js**            | ≥20.10  | Runtime                                   |
| **TypeScript**         | ~v6     | Strict type safety (`strict: true`)       |
| **Express**            | v5      | HTTP framework                            |
| **Mongoose**           | v9      | MongoDB ODM                               |
| **ioredis**            | v5      | Redis client                              |
| **jsonwebtoken**       | v9      | JWT sign/verify                           |
| **bcryptjs**           | v3      | Password hashing                          |
| **Passport**           | v0.7    | Google OAuth (`passport-google-oauth20`)  |
| **Multer**             | v2      | File upload handling (memory storage)     |
| **Pino**               | v10     | Structured JSON logging                   |
| **pino-http**          | v11     | HTTP request logging middleware           |
| **Resend**             | v6      | Transactional email                       |
| **Zod**                | v3      | Schema validation (via `@snitch/schemas`) |
| **Helmet**             | v8      | Security headers                          |
| **express-rate-limit** | v8      | Rate limiting                             |
| **rate-limit-redis**   | v6      | Redis-backed rate limit store             |
| **PixKit SDK**         | v0.0.3  | Image upload/CDN/processing               |
| **cookie-parser**      | v1      | HTTP cookie parsing                       |
| **cors**               | v2      | CORS configuration                        |

**Module System:** ESM (`"type": "module"`). All local imports **must** use `.js` extension.

---

## System Architecture

### Request Lifecycle

```
Client Request
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  Express Middleware Pipeline (app.ts)                    │
│                                                         │
│  1. express.json({ limit: '1mb' })                      │
│  2. express.urlencoded({ extended: true })               │
│  3. cookieParser()                                       │
│  4. cors({ origin, credentials })                        │
│  5. passport.initialize()                                │
│  6. requestTracingMiddleware  → X-Request-Id + req.logger│
│  7. httpLogger (pino-http)    → structured HTTP logging  │
└─────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  Route Layer (routes/*.route.ts)                        │
│                                                         │
│  • Define HTTP method + path                            │
│  • Mount middleware: validate(), AuthGuard, multer       │
│  • Delegate to Controller static method                 │
└─────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  Controller Layer (controllers/*.controller.ts)         │
│                                                         │
│  • Parse/validate request params, query, body           │
│  • Delegate business logic to Service functions          │
│  • Format HTTP response (status code + JSON shape)       │
│  • next(error) on failure — NEVER swallow errors         │
└─────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  Service Layer (services/*.service.ts)                  │
│                                                         │
│  • Contains ALL business logic                           │
│  • Calls Mongoose models for database operations         │
│  • Throws custom domain errors for expected failures     │
│  • Wraps unexpected errors in DatabaseOperationError     │
│  • Uses isXxxError() guards to avoid catching own errors │
└─────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  Model Layer (models/*.model.ts)                        │
│                                                         │
│  • Mongoose schema definition                            │
│  • Instance methods (comparePassword, compareHashToken)  │
│  • Pre-save hooks (hashing, slug generation)             │
│  • Indexes (unique, text, compound)                      │
│  • Exports: Document interface, Creation interface       │
└─────────────────────────────────────────────────────────┘
     │
     ▼
  MongoDB / Redis
     │
     ▼ (response bubbles back up)
┌─────────────────────────────────────────────────────────┐
│  Global Error Filter (filters/http-exception.filter.ts) │
│                                                         │
│  • Catches ALL errors from next(error)                   │
│  • ZodError → 400 with structured field errors           │
│  • Domain errors → matched via DOMAIN_ERROR_MAP          │
│  • Fallback statusCode property check                    │
│  • Unknown errors → 500                                  │
│  • 5xx logged as error, 4xx logged as warn               │
│  • Stack trace only in development                       │
└─────────────────────────────────────────────────────────┘
     │
     ▼
  Client Response (consistent JSON shape)
```

### Layer Responsibilities — Summary

| Layer           | File Pattern                  | Responsibility                                                     |
| --------------- | ----------------------------- | ------------------------------------------------------------------ |
| **Routes**      | `routes/*.route.ts`           | HTTP method, path, middleware chain (validate, auth, multer)       |
| **Controllers** | `controllers/*.controller.ts` | HTTP concerns: parse request, call service, format response        |
| **Services**    | `services/*.service.ts`       | Business logic, database calls, custom domain errors               |
| **Models**      | `models/*.model.ts`           | Mongoose schema, document interface, instance methods, hooks       |
| **Middlewares** | `middlewares/*.middleware.ts` | Cross-cutting: auth guards, validation, tracing, logging           |
| **Filters**     | `filters/*.filter.ts`         | Global error handling — formats all errors to consistent API shape |
| **Utils**       | `utils/*.ts`                  | Pure utilities: logger factory, JWT helpers, cookie helpers        |
| **Config**      | `config/*.ts`                 | Environment config, database connection, Redis connection          |
| **Types**       | `types/*.ts`                  | Express augmentation, server-specific type definitions             |
| **Emails**      | `emails/*.email.ts`           | HTML email templates (verification, welcome)                       |

---

## Project Layout

```
server/
├── server.ts               # Entry point — bootstrap, DB connect, graceful shutdown
├── src/
│   ├── app.ts              # Express app factory — middleware pipeline + route mounting
│   │
│   ├── config/
│   │   ├── config.ts       # Typed env config — single source of truth for process.env
│   │   ├── database.config.ts  # MongoDB/Mongoose connection
│   │   └── redis.config.ts     # ioredis client + connection
│   │
│   ├── routes/
│   │   ├── auth.route.ts       # /api/auth/* — register, login, refresh, logout, Google OAuth
│   │   ├── user.route.ts       # /api/user/* — getMe
│   │   ├── product.route.ts    # /api/product/* — public + admin CRUD (AuthAdminGuard)
│   │   └── category.route.ts   # /api/category/* — public + admin CRUD (AuthAdminGuard)
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts      # Auth operations (static methods)
│   │   ├── product.controller.ts   # Product CRUD + image upload/rollback (static methods)
│   │   └── category.controller.ts  # Category CRUD (static methods)
│   │
│   ├── services/
│   │   ├── user.service.ts     # User CRUD + shared error classes (DatabaseOperationError, etc.)
│   │   ├── session.service.ts  # Session management (create, validate, revoke)
│   │   ├── product.service.ts  # Product business logic (CRUD, search, pagination)
│   │   ├── category.service.ts # Category business logic (CRUD, pagination)
│   │   ├── email.service.ts    # Resend email wrapper
│   │   ├── redis.service.ts    # Redis get/set/del/exists helpers
│   │   └── media.service.ts    # Image upload/delete/URL generation (PixKit)
│   │
│   ├── models/
│   │   ├── user.model.ts       # User schema (with comparePassword)
│   │   ├── session.model.ts    # Session schema (with compareHashToken)
│   │   ├── product.model.ts    # Product schema (colors, sizes, images, pricing)
│   │   └── category.model.ts   # Category schema (with auto-slug generation)
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts          # AuthGuard factory → AuthUserGuard, AuthAdminGuard
│   │   ├── validate.middleware.ts      # Zod request body validation
│   │   ├── request-tracing.middleware.ts # X-Request-Id + scoped logger per request
│   │   └── pino.middleware.ts          # HTTP request logging (pino-http)
│   │
│   ├── filters/
│   │   └── http-exception.filter.ts   # Global error handler — DOMAIN_ERROR_MAP
│   │
│   ├── emails/
│   │   ├── verification.email.ts  # OTP verification email template
│   │   └── welcome.email.ts       # Welcome email template
│   │
│   ├── utils/
│   │   ├── logger.ts       # Pino logger factory (createLogger + rootLogger)
│   │   ├── jwt.util.ts     # JWT sign/verify helpers
│   │   └── cookie.util.ts  # setCookie / clearCookie helpers
│   │
│   └── types/
│       ├── express.d.ts    # Express Request augmentation (user, userId, requestId, logger)
│       ├── auth.type.ts    # GoogleUser, Profile types
│       └── user.type.ts    # RequestUser type
│
├── dist/                   # Build output (gitignored)
├── tsconfig.json
└── package.json
```

**Path alias:** `@/*` → `src/*` (configured in `tsconfig.json`).

```ts
// ✅ Always use path alias
import { createLogger } from '@/utils/logger.js';

// ❌ Never use deep relative paths
import { createLogger } from '../../../utils/logger.js';
```

---

## API Routes — Complete Reference

### Auth Routes (`/api/auth/*`)

| Method | Path                       | Middleware             | Controller                             | Description                     |
| ------ | -------------------------- | ---------------------- | -------------------------------------- | ------------------------------- |
| POST   | `/register`                | `validate(createUser)` | `AuthController.register`              | User registration               |
| POST   | `/email/send-verification` | `validate(emailVerif)` | `AuthController.sendEmailVerification` | Send OTP email                  |
| POST   | `/login`                   | `validate(loginUser)`  | `AuthController.login`                 | Login with email/password       |
| POST   | `/session/refresh`         | —                      | `AuthController.refreshToken`          | Refresh access token via cookie |
| POST   | `/logout`                  | —                      | `AuthController.logout`                | Revoke current session          |
| POST   | `/logout-all-deviced`      | —                      | `AuthController.logoutAllDevices`      | Revoke all sessions             |
| GET    | `/google`                  | `passport('google')`   | —                                      | Initiate Google OAuth           |
| GET    | `/google/callback`         | `passport('google')`   | `AuthController.googleCallback`        | Google OAuth callback           |

### User Routes (`/api/user/*`)

| Method | Path      | Middleware      | Controller             | Description      |
| ------ | --------- | --------------- | ---------------------- | ---------------- |
| GET    | `/get/me` | `AuthUserGuard` | `AuthController.getMe` | Get current user |

### Product Routes (`/api/product/*`)

| Method | Path              | Middleware                  | Controller                     | Description                |
| ------ | ----------------- | --------------------------- | ------------------------------ | -------------------------- |
| GET    | `/`               | —                           | `ProductController.getAll`     | Paginated/filtered list    |
| GET    | `/search/:search` | —                           | `ProductController.getSearch`  | Full-text search           |
| GET    | `/limited/:limit` | —                           | `ProductController.getLimited` | Limited fetch (homepage)   |
| GET    | `/id/:id`         | —                           | `ProductController.getById`    | Fetch by MongoDB _id       |
| GET    | `/:slug`          | —                           | `ProductController.getBySlug`  | Fetch by URL slug          |
| POST   | `/`               | `AuthAdminGuard` + `multer` | `ProductController.create`     | Create product (multipart) |
| PUT    | `/:id`            | `AuthAdminGuard` + `multer` | `ProductController.update`     | Update product (multipart) |
| DELETE | `/:id`            | `AuthAdminGuard`            | `ProductController.delete`     | Delete product             |

### Category Routes (`/api/category/*`)

| Method | Path      | Middleware       | Controller                     | Description          |
| ------ | --------- | ---------------- | ------------------------------ | -------------------- |
| GET    | `/`       | —                | `CategoryController.getAll`    | Paginated list       |
| GET    | `/id/:id` | —                | `CategoryController.getById`   | Fetch by MongoDB _id |
| GET    | `/:slug`  | —                | `CategoryController.getBySlug` | Fetch by slug        |
| POST   | `/`       | `AuthAdminGuard` | `CategoryController.create`    | Create category      |
| PUT    | `/:id`    | `AuthAdminGuard` | `CategoryController.update`    | Update category      |
| DELETE | `/:id`    | `AuthAdminGuard` | `CategoryController.delete`    | Delete category      |

### Health Check

| Method | Path          | Response                          |
| ------ | ------------- | --------------------------------- |
| GET    | `/api/health` | `{ success: true, status: 'ok' }` |

---

## Error Handling Architecture

### Design Philosophy

Every error in the system flows through a **single global filter** — `globalErrorFilter` in `filters/http-exception.filter.ts`. Controllers NEVER format error responses directly. They always call `next(error)`.

```
Controller throws/catches error
          │
          ▼
     next(error)
          │
          ▼
  globalErrorFilter
          │
          ├── ZodError?        → 400 + structured field errors
          ├── DOMAIN_ERROR_MAP? → mapped HTTP status code
          ├── .statusCode prop? → use that status code
          └── Unknown?          → 500
          │
          ▼
  Consistent JSON Error Response
```

### Custom Error Pattern

Every service defines its own custom error classes with `statusCode` and `name`:

```ts
// ✅ CORRECT — Custom domain error in service file
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
- Each custom error **must** have a `statusCode` property and a descriptive `name`.
- **Register** the error in the `DOMAIN_ERROR_MAP` inside `filters/http-exception.filter.ts`.
- Custom errors live in the **same file** where they originate (service file or controller file).
- Use `Object.setPrototypeOf(this, new.target.prototype)` when extending Error in newer patterns.

### Error Guard Pattern

Every service uses a guard function to prevent re-catching its own domain errors:

```ts
function isProductError(error: unknown): boolean {
  return (
    error instanceof ProductNotFoundError ||
    error instanceof ProductOperationError ||
    error instanceof DatabaseOperationError
  );
}

// In service functions:
catch (error) {
  if (isProductError(error)) throw error;  // ← re-throw domain errors as-is
  logger.error({ err: error }, 'Unexpected error');
  throw new DatabaseOperationError('operationName', error);  // ← wrap unknown errors
}
```

### Complete Error Registry — DOMAIN_ERROR_MAP

All custom errors currently registered in the global filter:

| Error Class               | Source File              | HTTP Status | Category       |
| ------------------------- | ------------------------ | ----------- | -------------- |
| **User Errors**           |                          |             |                |
| `UserNotFoundError`       | `user.service.ts`        | 404         | Not Found      |
| `UserAlreadyExistsError`  | `user.service.ts`        | 409         | Conflict       |
| `InvalidCredentialsError` | `user.service.ts`        | 401         | Authentication |
| `EmailNotVerifiedError`   | `user.service.ts`        | 401         | Authentication |
| `UnauthorizedError`       | `user.service.ts`        | 401         | Authorization  |
| `ValidationError`         | `user.service.ts`        | 400         | Validation     |
| `DatabaseOperationError`  | `user.service.ts`        | 500         | Server Error   |
| **Session Errors**        |                          |             |                |
| `SessionNotFoundError`    | `session.service.ts`     | 404         | Not Found      |
| `SessionCompareError`     | `session.service.ts`     | 401         | Authentication |
| `SessionInvalidError`     | `session.service.ts`     | 401         | Authentication |
| **Product Errors**        |                          |             |                |
| `ProductNotFoundError`    | `product.service.ts`     | 404         | Not Found      |
| `ProductFieldsError`      | `product.controller.ts`  | 400         | Validation     |
| `ProductRequestError`     | `product.controller.ts`  | 400         | Validation     |
| `ProductCreateError`      | `product.controller.ts`  | 500         | Server Error   |
| `ProductUpdateError`      | `product.controller.ts`  | 500         | Server Error   |
| `ProductConflictError`    | `product.controller.ts`  | 409         | Conflict       |
| **Category Errors**       |                          |             |                |
| `CategoryNotFoundError`   | `category.service.ts`    | 404         | Not Found      |
| `CategoryOperationError`  | `category.service.ts`    | 500         | Server Error   |
| `CategoryFieldsError`     | `category.controller.ts` | 400         | Validation     |
| `CategoryRequestError`    | `category.controller.ts` | 400         | Validation     |
| **Email Errors**          |                          |             |                |
| `EmailDeliveryError`      | `email.service.ts`       | 502         | Upstream Error |
| **Media Errors**          |                          |             |                |
| `MediaNotFoundError`      | `media.service.ts`       | 404         | Not Found      |
| `MediaOperationError`     | `media.service.ts`       | 500         | Server Error   |
| `ImageProcessingError`    | `media.service.ts`       | 500         | Server Error   |
| **Utility Errors**        |                          |             |                |
| `CookieOprationError`     | `cookie.util.ts`         | 500         | Server Error   |

> **IMPORTANT:** When adding a new custom error, you MUST register it in the `DOMAIN_ERROR_MAP`. If you don't, the filter will fall back to checking `.statusCode` on the error object, and if that's missing, it defaults to 500.

### How to Add a New Custom Error

```ts
// 1. Define in your service file
export class OrderNotFoundError extends Error {
  public readonly statusCode = 404;
  constructor(orderId: string) {
    super(`Order not found: ${orderId}`);
    this.name = 'OrderNotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// 2. Add to guard function in same file
function isOrderError(error: unknown): boolean {
  return error instanceof OrderNotFoundError || error instanceof DatabaseOperationError;
}

// 3. Register in filters/http-exception.filter.ts DOMAIN_ERROR_MAP
import { OrderNotFoundError } from '@/services/order.service.js';

const DOMAIN_ERROR_MAP = new Map<ErrorClass, number>([
  // ... existing entries
  [OrderNotFoundError, 404], // ← ADD HERE
]);
```

### When to Use Each Error Type

| Situation                               | Error Type                | HTTP Status |
| --------------------------------------- | ------------------------- | ----------- |
| Resource not found in DB                | `XxxNotFoundError`        | 404         |
| Duplicate resource (unique constraint)  | `XxxAlreadyExistsError`   | 409         |
| Wrong password / expired token          | `InvalidCredentialsError` | 401         |
| Missing/invalid auth token              | `UnauthorizedError`       | 401         |
| Role doesn't have access                | `UnauthorizedError`       | 401         |
| Email not verified                      | `EmailNotVerifiedError`   | 401         |
| Zod schema validation failure           | Let `ZodError` propagate  | 400         |
| Custom field validation (non-Zod)       | `XxxFieldsError`          | 400         |
| Bad request parameter                   | `XxxRequestError`         | 400         |
| Idempotency conflict                    | `XxxConflictError`        | 409         |
| Database write failure                  | `DatabaseOperationError`  | 500         |
| External service failure (email, media) | `XxxDeliveryError`        | 502         |
| Unexpected internal error               | `DatabaseOperationError`  | 500         |

### API Response Structure

All API responses follow a consistent shape defined in `@snitch/types`:

```ts
// Success (with data)
{ success: true, message: "...", data: { ... } }

// Success (no data)
{ success: true, message: "..." }

// Error
{
  success: false,
  error: {
    name: "UserNotFoundError",
    message: "User not found: abc123",
    fields?: [{ field: "email", message: "Email already exists" }],
    stack?: "..."  // only in development
  }
}
```

**Rules:**

- Always include `success: true | false` as the top-level discriminator.
- Use proper HTTP status codes.
- Field validation errors **must** be structured as `{ field: string, message: string }[]` for frontend mapping via `setFormErrors()`.
- Stack traces only included when `NODE_ENV === 'development'`.
- `5xx` errors logged as `error`, `4xx` as `warn`.

---

## Coding Conventions

### Controllers — Thin and Focused

Controllers are **classes with static methods** that handle HTTP concerns only:

```ts
export class AuthController {
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as LoginUserDto;
      const user = await userFindByEmailPassword({ email, password });
      // ... token generation, cookie setting
      res.status(200).json({ success: true, message: '...', data: { ... } });
    } catch (error) {
      next(error); // ALWAYS forward — never swallow
    }
  };
}
```

**Rules:**

- Business logic belongs in **services**, not controllers.
- Always forward errors via `next(error)`.
- Use `req.body as SomeDto` for typed access after `validate()` middleware.
- Parse query params with `schema.safeParse(req.query)` and throw `XxxFieldsError` on failure.

### Services — Business Logic Layer

Services are **exported functions** (not classes) that encapsulate business logic:

```ts
export async function userCreate(params: IUserCreate): Promise<UserWithoutPassword> {
  try {
    const createdUser = await userModel.create(params);
    return createdUser.toObject();
  } catch (error) {
    if (isDuplicateKeyError(error)) throw new UserAlreadyExistsError();
    throw new DatabaseOperationError('userCreate', error);
  }
}
```

**Rules:**

- Each service creates its own logger: `const logger = createLogger('SERVICE-NAME');`
- Re-throw known domain errors, wrap unexpected errors in `DatabaseOperationError`.
- Use `isXxxError()` guard functions to avoid catching own domain errors.
- Import `DatabaseOperationError` from `user.service.ts` (shared base error).
- Use `.lean().exec()` on Mongoose queries when you don't need document methods.

### Validation — Zod at the Route Layer

```ts
// routes/auth.route.ts
router.post('/register', validate(createUserSchema), AuthController.register);
```

**Rules:**

- Schemas come from `@snitch/schemas` — never define new Zod schemas in the server.
- The `validate()` middleware replaces `req.body` with the parsed result.
- **Multipart routes skip `validate()`** — validation happens inside the controller after Multer (see `product.controller.ts`).
- Query params validated inline via `schema.safeParse(req.query)` in the controller.

### Logging — Pino

- Structured JSON via `pino` (`@/utils/logger`).
- **Factory:** `createLogger('CONTEXT-NAME')` creates a scoped child logger.
- **Request-scoped:** `req.logger` includes `reqId`, `method`, `url`.
- **Redaction:** Passwords, tokens, API keys, auth headers automatically redacted.
- **No `console.log`** — always use `createLogger()`.
- In development: pretty-printed via `pino-pretty`.

### Config — Single Source of Truth

- Read `process.env` **only** inside `config/config.ts`.
- Everywhere else: `import config from '@/config/config.js';`
- `requireENV()` and `requireENVNumber()` throw at startup if variables are missing.

```ts
// ✅ CORRECT
import config from '@/config/config.js';
const port = config.PORT;

// ❌ WRONG
const port = process.env.PORT;
```

---

## Auth System

### Token Architecture

- **Access token:** Short-lived JWT (15 min), sent as `Authorization: Bearer <token>`.
- **Refresh token:** Long-lived JWT (7 days), stored in httpOnly cookie (`__snitch_rt`).
- **Session model** tracks each device — tokens hashed via bcrypt before storage.
- Logout revokes session in MongoDB. Logout-all revokes all sessions for the user.

### Auth Middleware — `AuthGuard` Factory

```ts
// Creates role-based guards with Redis-cached existence checks (5-min TTL)
export const AuthUserGuard = AuthGuard(['USER', 'ADMIN']);
export const AuthAdminGuard = AuthGuard(['ADMIN']);
```

**Flow:**

1. Extract Bearer token from Authorization header
2. Verify JWT, check role against `allowedRoles`
3. Check Redis cache (`auth:exists:<userId>`) for recent verification
4. If not cached → verify user exists in DB → cache for 5 min
5. Hydrate `req.user` and `req.userId`

### Password Security

- Hashed with `bcryptjs` (10 salt rounds).
- Password stored with `select: false` — excluded from queries by default.
- Explicit `select('+password')` required when comparison is needed.

---

## Database — MongoDB + Mongoose

- Connection options in `config/database.config.ts`. Mongoose strict mode is on.
- **Indexes:** Declare on schema (`schema.index({ field: 1 }, { unique: true })`). Never create at runtime.
- **Models export:** Document interface (`IUser`), creation interface (`IUserCreate`), utility types (`UserWithoutPassword`).
- **Current models:** `User`, `Session`, `Product`, `Category`.

**Rules:**

- Validate before writing — never trust client input.
- Use unique indexes and `exists()` checks to prevent duplicates.
- Use transactions for multi-document writes (see product create).
- Keep schemas synced with `@snitch/schemas`.
- Use `.lean()` + `.exec()` when document methods aren't needed.
- Use `.select('-password')` to exclude sensitive fields.

---

## Redis

- Single `ioredis` client from `config/redis.config.ts`.
- Helpers: `redisGet`, `redisSet`, `redisDel`, `redisExists`, `redisGetObject`, `redisSetObject`.
- **All keys must have a TTL** — no unbounded growth.

**Current key namespaces:**

| Pattern                            | TTL   | Purpose                         |
| ---------------------------------- | ----- | ------------------------------- |
| `otp:<email>`                      | 5 min | Email OTP code                  |
| `otp:attempts:<email>`             | 5 min | OTP attempt counter             |
| `auth:exists:<userId>`             | 5 min | Auth guard user existence cache |
| `idempotency:product:create:<key>` | 24 hr | Idempotent product creation     |

---

## File Uploads — Multer + PixKit

Product images use **multipart/form-data** with a specific convention:

- `images` field: flat array of image files.
- `data` field: JSON string of the product payload (including `imageIndices` per color).
- Multer runs **before** controller — `req.body` has text fields, `req.files` has images.
- Controller: parse `data` → attach files via `imageIndices` → Zod validate → upload to PixKit → persist.

**Rollback pattern:** If DB write fails after images are uploaded, the controller performs best-effort cleanup of all uploaded cloud assets using `Promise.allSettled()`.

---

## HTTP & Security

| Feature               | Implementation                                        |
| --------------------- | ----------------------------------------------------- |
| **Security Headers**  | Helmet with default config                            |
| **CORS**              | Restricted via `CORS_ORIGIN`, credentials enabled     |
| **Cookie Parsing**    | `cookie-parser` for httpOnly refresh token cookie     |
| **Rate Limiting**     | `express-rate-limit` + `rate-limit-redis` on auth     |
| **Body Size**         | 1 MB limit for JSON                                   |
| **File Upload**       | Multer: memory storage, 5 MB limit, image-only filter |
| **Request Tracing**   | `X-Request-Id` (forwarded from client or UUID)        |
| **Graceful Shutdown** | SIGINT/SIGTERM handlers with 10s timeout              |
| **Process Safety**    | `uncaughtException` and `unhandledRejection` handlers |

---

## Environment Variables

Required keys (see `.env.example`):

| Variable               | Type   | Description                           |
| ---------------------- | ------ | ------------------------------------- |
| `NODE_ENV`             | string | `development` / `production` / `test` |
| `PORT`                 | number | HTTP port (default `4000`)            |
| `MONGODB_URI`          | string | MongoDB connection string             |
| `CORS_ORIGIN`          | string | Allowed origin for CORS               |
| `JWT_SECRET`           | string | Symmetric secret for JWT signing      |
| `RESEND_API_KEY`       | string | Resend email API key                  |
| `REDIS_HOST`           | string | Redis connection host                 |
| `REDIS_PORT`           | number | Redis connection port                 |
| `REDIS_PASSWORD`       | string | Redis password                        |
| `GOOGLE_CLIENT_ID`     | string | Google OAuth client ID                |
| `GOOGLE_CLIENT_SECRET` | string | Google OAuth client secret            |
| `PIXKIT_PUBLIC_KEY`    | string | PixKit media service public key       |
| `PIXKIT_SECRET_KEY`    | string | PixKit media service secret key       |
| `PIXKIT_PROJECT_ID`    | string | PixKit project identifier             |

Never commit a real `.env` — only `.env.example`.

---

## Performance Best Practices

- Use `exists()` over `findOne()` when you only need a boolean check.
- Cache auth existence checks in Redis (5-min TTL).
- Use `.lean()` + `.exec()` on Mongoose queries when document methods aren't needed.
- Use `.select()` to exclude unnecessary fields (especially `-password`).
- Use `countDocuments(filter)` with `Promise.all` alongside the main query for pagination.
- Use `Promise.allSettled()` for non-critical parallel operations (image cleanup).
- Declare indexes on schemas — never create indexes at runtime.
- Use MongoDB transactions for multi-document writes.
- Keep request bodies lean — use `limit: '1mb'` for JSON parsing.

---

## Scripts

| Script              | Description                                             |
| ------------------- | ------------------------------------------------------- |
| `pnpm dev`          | Run with `tsx watch` — auto-restart on file change      |
| `pnpm build`        | Type-check + emit JS to `dist/` via `tsc` + `tsc-alias` |
| `pnpm start`        | Run compiled `dist/server.js`                           |
| `pnpm start:prod`   | Run with `NODE_ENV=production`                          |
| `pnpm lint`         | ESLint over `src/`                                      |
| `pnpm lint:fix`     | ESLint with `--fix`                                     |
| `pnpm type-check`   | `tsc --noEmit` — no JS emitted                          |
| `pnpm format`       | Prettier write                                          |
| `pnpm format:check` | Prettier check (read-only)                              |
| `pnpm clean`        | Delete `dist/`                                          |
| `pnpm test`         | Jest test runner                                        |
| `pnpm test:watch`   | Jest watch mode                                         |

Root-level equivalents: `pnpm dev:server`, `pnpm build:server`.

---

## Adding a New Feature — Step-by-Step

Follow this exact order when adding a new feature module (e.g., "orders"):

### 1. Schema (if new validation needed)

```
packages/schemas/src/order.schema.ts
```

Define Zod schemas + export DTO types. Export from `packages/schemas/src/index.ts`.

### 2. Types (if new shared types needed)

```
packages/types/src/order.type.ts
```

Define response DTOs. Export from `packages/types/src/index.ts`.

### 3. Model

```
server/src/models/order.model.ts
```

Mongoose schema + document interface. Include indexes.

### 4. Service

```
server/src/services/order.service.ts
```

- Define custom errors (`OrderNotFoundError`, etc.)
- Define error guard (`isOrderError()`)
- Implement business logic functions
- Import `DatabaseOperationError` from `user.service.ts`

### 5. Controller

```
server/src/controllers/order.controller.ts
```

- Static methods in a class
- Parse request, delegate to service, format response
- Define controller-scoped errors if needed (`OrderFieldsError`, etc.)

### 6. Route

```
server/src/routes/order.route.ts
```

- Mount middleware chain: `validate()`, `AuthGuard`, etc.
- Import controller, wire up HTTP methods + paths

### 7. Register in `app.ts`

```ts
import orderRoute from './routes/order.route.js';
apiRouter.use('/order', orderRoute);
```

### 8. Register errors in `http-exception.filter.ts`

```ts
import { OrderNotFoundError } from '@/services/order.service.js';
// Add to DOMAIN_ERROR_MAP
[OrderNotFoundError, 404],
```

---

## Quality Standards — Non-Negotiable

Every backend implementation **must**:

- [ ] Reuse existing code before creating new modules
- [ ] Never duplicate business logic
- [ ] Maintain strict TypeScript typing (`strict: true`, no `any`)
- [ ] Follow SOLID principles
- [ ] Be modular and scalable
- [ ] Pass `pnpm lint`, `pnpm type-check`, and `pnpm build`
- [ ] Preserve backward compatibility on API responses
- [ ] Include proper validation (Zod), logging (Pino), and error handling
- [ ] Never swallow errors — always `next(error)` or re-throw
- [ ] Never expose sensitive data in responses or logs
- [ ] Use `pnpm` — never `npm` or `yarn`

---

## Things to Avoid

| ❌ Don't                                      | ✅ Do                                                 |
| --------------------------------------------- | ----------------------------------------------------- |
| Import from `dist/`                           | Use `@/...` path alias                                |
| Swallow errors silently                       | Let `globalErrorFilter` handle them                   |
| Add deps without workspace                    | `pnpm add <pkg> --filter server`                      |
| Use `console.log`                             | Use `createLogger()` from `@/utils/logger`            |
| Read `process.env` directly                   | Import typed `config` from `@/config/config.js`       |
| Define Zod schemas in server                  | Use `@snitch/schemas`                                 |
| Define shared types in server                 | Use `@snitch/types`                                   |
| Use generic `Error` for expected failures     | Use custom error classes with `statusCode` and `name` |
| Bypass `validate()` for JSON routes           | Always validate request bodies                        |
| Store raw tokens                              | Always hash before persisting to session model        |
| Use `npm` or `yarn`                           | Use `pnpm` exclusively                                |
| Forget to register errors in DOMAIN_ERROR_MAP | Add every new custom error to the filter              |
| Create duplicate error classes                | Import existing ones (e.g., `DatabaseOperationError`) |
| Put business logic in controllers             | Keep it in services                                   |
| Use `findOne()` for existence checks          | Use `exists()` for boolean checks                     |
