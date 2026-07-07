# Snitch — Frontend Client (`client/`)

## What is Snitch?

**Snitch** ek **premium fashion clothing e-commerce platform** hai. Ye sirf ek shopping site nahi — ye ek **brand experience** hai. Har interaction, scroll, hover aur transition ko is tarah design kiya gaya hai ki user ko ek luxury fashion store ka feel aaye — digital mein.

Design philosophy ka core teen pillars hain:

1. **Award-Worthy UI/UX** — Har screen intentional, opinionated aur visually striking honi chahiye. Generic layouts avoid karo.
2. **Motion as Language** — Animation sirf decoration nahi hai. Ye user ko guide karta hai, feedback deta hai aur brand personality communicate karta hai.
3. **Micro-interactions** — Chhoti chhoti details — button press, hover state, cart update, image zoom — yahi cheezein ek ordinary app ko premium feel deti hain.

> **Design Principle:** Agar koi element static lag raha hai, toh wo incomplete hai.

---

## Monorepo Architecture — FUNDAMENTAL RULES

> ⚠️ Ye section sabse important hai. Inhe todna = architecture break karna.

Snitch ek **pnpm workspace monorepo** hai. Structure:

```
snitch/                          ← root workspace
├── client/                      ← React frontend (ye folder)
├── server/                      ← NestJS backend
└── packages/
    ├── schemas/  (@snitch/schemas)   ← Zod schemas — single source of truth
    └── types/    (@snitch/types)     ← Shared TypeScript interfaces/types
```

### Rule 1: Zod schemas SIRF `packages/schemas` mein

```
❌ GALAT — client/src/features/auth/schema/auth.form.schema.ts mein z.object({...})
✅ SAHI  — packages/schemas/src/user.schema.ts mein z.object({...})
```

**Kyun?** Server aur client dono ek hi schema se validate karte hain. Agar client apna alag schema banaye, to dono diverge ho jayenge silently.

**Form-specific schemas ka kya?** Multi-step form ke liye sub-schemas bhi `@snitch/schemas` se compose karo (`.pick()`, `.omit()`, `.partial()`). Client ke `features/*/schema/` folder sirf **compose** karta hai, naya schema ground-up nahi banata.

```ts
// ✅ SAHI — packages/schemas se compose karo
import { createUserSchema } from '@snitch/schemas';

export const registerStep1Schema = createUserSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  contact: true,
  password: true,
});
export type RegisterStep1Values = z.infer<typeof registerStep1Schema>;
```

### Rule 2: Global TypeScript types SIRF `packages/types` mein

```
❌ GALAT — client/src/types/User.ts mein interface User { ... }
✅ SAHI  — packages/types/src/user.type.ts mein interface User { ... }
```

`@snitch/types` mein:

- API response shapes (`UserResponseDto`, `ApiSuccess<T>`, etc.)
- Domain entities (`User`, `Product`, `Order`)
- JWT payloads
- Shared enums

`client/src/types/` mein SIRF client-only UI types:

- Component prop types
- Local UI state types (jo server ke saath share nahi hotein)

### Rule 3: `zod` client mein seedha install mat karo

Client `zod` ko **`@snitch/schemas` ke zariye** access karta hai:

```ts
// ✅ SAHI — z ko @snitch/schemas se import karo
import { z, createUserSchema } from '@snitch/schemas';

// ❌ GALAT — seedha zod se import mat karo
import { z } from 'zod';
```

**Kyun?** pnpm workspace mein `@snitch/schemas` ka `zod` already resolve hota hai. Client mein alag `zod` install karne se **two zod instances** ban sakte hain → schema instance mismatch errors.

`client/package.json` mein `zod` dependency **nahi honi chahiye**.

### Rule 4: `@snitch/schemas` aur `@snitch/types` import karo, copy mat karo

```ts
// ✅ SAHI
import { UserResponseDto } from '@snitch/types';
import { loginUserSchema, LoginUserDto } from '@snitch/schemas';

// ❌ GALAT — same interface dobara define karna
interface UserResponseDto { ... } // client ke andar locally
```

---

## Tech Stack

### Core Framework

| Technology     | Version | Purpose                                    |
| -------------- | ------- | ------------------------------------------ |
| **React**      | v19     | UI library — concurrent features enabled   |
| **TypeScript** | ~v6     | Strict type safety throughout              |
| **Vite**       | v8      | Lightning-fast HMR dev server + build tool |

---

### Styling & Design System

| Technology            | Version | Purpose                                                       |
| --------------------- | ------- | ------------------------------------------------------------- |
| **Tailwind CSS**      | v4      | Utility-first CSS — design tokens ka base                     |
| **@tailwindcss/vite** | v4      | Tailwind Vite plugin (PostCSS-free setup)                     |
| **tw-animate-css**    | v1.4    | Pre-built Tailwind animation utilities                        |
| **Geist Font**        | v5      | Variable font — `@fontsource-variable/geist` se load hota hai |

#### Tailwind v4 — Important Notes

Tailwind v4 mein **`tailwind.config.js` nahi hota** — sab CSS ke andar hota hai:

```css
/* src/styles/global.css */
@import 'tailwindcss';
@import 'tw-animate-css';

@theme {
  /* ─── Custom Design Tokens ─── */
  --font-sans: 'Geist Variable', system-ui, sans-serif;

  --color-brand-50: oklch(0.97 0.01 270);
  --color-brand-500: oklch(0.55 0.22 270);
  --color-brand-900: oklch(0.2 0.15 270);

  /* ─── Custom Easing ─── */
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-sharp: cubic-bezier(0.4, 0, 0.2, 1);

  /* ─── Duration Scale ─── */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-brand: 800ms;
}
```

#### Kab Custom CSS Add Karo?

| Situation                          | Approach                                                                         |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| Brand token (color, font, spacing) | `@theme {}` block mein add karo                                                  |
| Custom animation (`@keyframes`)    | `global.css` mein `@layer base {}` ke andar                                      |
| One-off utility                    | Tailwind class use karo, CSS file mat banao                                      |
| Complex component animation        | `@layer components {}` mein, sirf agar Tailwind classes se express nahi ho sakta |

> **Rule:** Custom `.css` files ya `style={}` props **mat banao** jab tak Tailwind classes se kaam na chal sake. Agar custom CSS chahiye, `global.css` ke `@theme` ya `@layer` blocks mein hi add karo.

---

### UI Component Library — shadcn-First Approach

> **MANDATORY RULE:** Koi bhi component banane se pehle shadcn check karo.

#### Component Decision Flow

```
Kya component chahiye?
        │
        ▼
shadcn mein hai? ──YES──► npx shadcn add <component>  ──► customize karo (src/components/ui/)
        │
       NO
        │
        ▼
Radix UI primitive available hai? ──YES──► Radix primitive + Tailwind styling
        │
       NO
        │
        ▼
Custom component banao (src/components/ ya feature/components/)
Tailwind + cva + cn() use karo — no custom CSS files
```

#### Available shadcn Components (check karo pehle)

```bash
# Koi component add karo
npx shadcn add <component-name>

# Common examples:
npx shadcn add button input form label
npx shadcn add dialog sheet drawer
npx shadcn add dropdown-menu context-menu
npx shadcn add select combobox
npx shadcn add card badge separator
npx shadcn add carousel    # Product gallery
npx shadcn add toast       # Notifications
npx shadcn add skeleton    # Loading states
npx shadcn add avatar      # User profiles
npx shadcn add tabs        # Multi-step / filter
npx shadcn add table       # Order lists
```

shadcn components `src/components/ui/` mein hote hain — **inhe seedha edit karo**, ye vendor files nahi hain.

| Technology                         | Purpose                                                                      |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| **shadcn/ui**                      | Customizable, accessible component library — source code seedha project mein |
| **Radix UI**                       | shadcn ke neeche headless primitives (Dialog, Dropdown, Tooltip, etc.)       |
| **Lucide React**                   | Icon library — shadcn ka default icon set                                    |
| **class-variance-authority (cva)** | Component variants (size, color, state) elegantly manage karta hai           |
| **clsx + tailwind-merge**          | Dynamic conditional classes + class conflict resolution                      |

```json
// components.json — shadcn config
{
  "style": "radix-nova",
  "baseColor": "neutral",
  "iconLibrary": "lucide",
  "cssVariables": true,
  "aliases": {
    "ui": "src/components/ui",
    "utils": "src/lib/utils"
  }
}
```

---

### Animation & Motion

Snitch mein motion ek first-class citizen hai. Ye libraries aur patterns use karo:

| Tool                           | Use Case                                                            |
| ------------------------------ | ------------------------------------------------------------------- |
| **tw-animate-css**             | Entry/exit animations — `animate-fade-in`, `animate-slide-up`, etc. |
| **CSS `@keyframes`**           | Custom brand-specific animations `global.css` mein define karo      |
| **Tailwind `transition-*`**    | Hover states, color transitions, scale effects                      |
| **CSS `view-transition-name`** | Page transitions ke liye (React Router v7+ compatible)              |

**Micro-interaction checklist — har interactive element pe apply karo:**

- [ ] Hover state — scale, color ya shadow change
- [ ] Active/Press state — subtle scale-down (e.g. `active:scale-95`)
- [ ] Focus-visible state — styled ring for accessibility
- [ ] Loading state — skeleton (`<Skeleton />` from shadcn) ya shimmer
- [ ] Empty/Error state — animated illustration ya icon

---

### State Management

| Technology        | Version | Purpose                                       |
| ----------------- | ------- | --------------------------------------------- |
| **Redux Toolkit** | v2      | Global state — auth, cart, wishlist, UI state |
| **React Redux**   | v9      | React ke saath Redux integrate karna          |

**Current Slices:**

| Slice  | File                                | Manages                    |
| ------ | ----------------------------------- | -------------------------- |
| `auth` | `features/auth/state/auth.slice.ts` | User session, login/logout |

**Typed hooks hamesha use karo:**

```ts
import { useAppDispatch, useAppSelector } from '@/store/hooks';
// Never use plain useDispatch/useSelector
```

---

### Routing

| Technology       | Version | Purpose                                     |
| ---------------- | ------- | ------------------------------------------- |
| **React Router** | v8      | `createBrowserRouter` — data-driven routing |

**Current Routes** (`src/routes/AppRoutes.tsx`):

| Path        | Component      | Description          |
| ----------- | -------------- | -------------------- |
| `/`         | `HomePage`     | Landing / storefront |
| `/login`    | `LoginPage`    | Auth — login         |
| `/register` | `RegisterPage` | Auth — registration  |
| `*`         | `404Page`      | Not found fallback   |

> Route-level code splitting add karna hai — `lazy()` + `<Suspense>` use karo naye pages ke liye.

---

### HTTP Client

| Technology | Purpose                                                              |
| ---------- | -------------------------------------------------------------------- |
| **Axios**  | REST API calls — configured instance `src/lib/axiosInstance.ts` mein |

`axiosInstance.ts` mein ye configured hai:

- Base URL (`.env` se)
- Request/Response interceptors
- Auth token auto-attach
- Error handling

---

## Folder Structure

```
client/
├── src/
│   ├── components/           # Shared, reusable UI components
│   │   └── ui/               # shadcn components (source-owned, editable)
│   │       └── button.tsx
│   │
│   ├── features/             # Feature modules — har feature self-contained hai
│   │   └── auth/
│   │       ├── components/   # Auth UI — LoginForm, RegisterForm, etc.
│   │       ├── hook/         # useAuth, useLoginForm, etc.
│   │       ├── schema/       # ⚠️ SIRF compose karo @snitch/schemas se — naya schema mat banao
│   │       ├── service/      # authService.ts — API functions
│   │       └── state/        # auth.slice.ts — Redux slice
│   │
│   ├── lib/
│   │   ├── axiosInstance.ts  # Pre-configured Axios client
│   │   └── utils.ts          # cn() — clsx + tailwind-merge
│   │
│   ├── pages/                # Route-level page shells
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── 404Page.tsx
│   │
│   ├── routes/
│   │   └── AppRoutes.tsx     # React Router — createBrowserRouter config
│   │
│   ├── store/
│   │   ├── store.ts          # Redux store — reducer combinations
│   │   └── hooks.ts          # useAppDispatch & useAppSelector (typed)
│   │
│   ├── styles/
│   │   └── global.css        # ← SINGLE CSS FILE: shadcn vars + @theme tokens + @layer base
│   │                         #   (index.css mat banao — sab yahan aata hai)
│   │
│   ├── types/                # ⚠️ SIRF client-only UI types — global types @snitch/types mein
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry — Provider + RouterProvider setup
│
├── components.json           # shadcn/ui configuration
├── vite.config.ts            # Vite config — aliases + plugins
├── tsconfig.app.json         # TypeScript config
└── .env                      # Environment variables (VITE_API_URL, etc.)
```

> **Note on `styles/`:** Tailwind v4 mein ek hi CSS file (`global.css`) kaafi hai. Multiple CSS files avoid karo — sab tokens `@theme {}` mein, sab custom CSS `@layer {}` mein.

---

## Path Aliases

`vite.config.ts` mein configured — **hamesha use karo, relative paths avoid karo:**

```ts
'@'           →  src/
'@components' →  src/components/
'@features'   →  src/features/
'@api'        →  src/api/
'@hooks'      →  src/hooks/
'@lib'        →  src/lib/
'@utils'      →  src/lib/utils
```

```ts
// ✅ Correct
import { Button } from '@components/ui/button';
import { useAppSelector } from '@/store/hooks';
import { loginUserSchema } from '@snitch/schemas';
import { UserResponseDto } from '@snitch/types';

// ❌ Avoid
import { Button } from '../../components/ui/button';
import { z } from 'zod'; // seedha zod mat import karo
```

---

## Dev Commands

```bash
# Dev server start karo (http://localhost:5173)
npm run dev

# TypeScript type check (no emit)
npm run type-check

# Production build (tsc + vite build)
npm run build

# ESLint run karo
npm run lint

# Prettier format karo
npm run format
```

---

## Design & Code Conventions

### UI/UX — Non-Negotiable Rules

1. **Har button, link aur interactive element pe hover + active state ZAROOR honi chahiye.**
2. **Page entry animations** — components `animate-fade-in` ya custom `@keyframes` se enter karein.
3. **Image hover** — product images pe zoom (`scale-105`) + overlay transition.
4. **Form feedback** — real-time validation, success/error states animated honge.
5. **Loading states** — spinner mat use karo — skeleton screens ya shimmer effects use karo.
6. **Empty states** — "No results" jaise screens illustrated aur animated hongi.

### Component Banane Ka Order (mandatory)

1. **shadcn check karo** → `npx shadcn add <name>` → customize karo
2. **Radix UI check karo** → headless primitive + Tailwind styling
3. **Custom banao** → `cva` + `cn()` + Tailwind — no custom CSS files

### Icons

```ts
// Hamesha lucide-react use karo
import { ShoppingBag, Heart, Search, ChevronRight } from 'lucide-react';

// Size convention:
// sm icons: size={16}
// default: size={20}
// large/hero: size={24}
```

### CSS Classes — `cn()` utility

```ts
import { cn } from '@/lib/utils';

// Conditional classes
<div className={cn(
  "base-class transition-all duration-300",
  isActive && "bg-foreground text-background",
  variant === "ghost" && "bg-transparent hover:bg-muted"
)} />
```

### Naya Feature Banana

Naya feature add karte waqt ye exact folder structure follow karo:

```
features/<feature-name>/
├── components/     # UI components (only for this feature)
├── hook/           # Custom React hooks
├── schema/         # ⚠️ @snitch/schemas se compose karo — ground-up mat banao
├── service/        # API call functions (use axiosInstance)
└── state/          # Redux slice (if global state needed)
```

#### Schema Example (feature/schema/ mein)

```ts
// features/product/schema/product.form.schema.ts
// ✅ @snitch/schemas se compose karo
import { z, createProductSchema } from '@snitch/schemas';

export const productDraftSchema = createProductSchema.partial();
export type ProductDraftValues = z.infer<typeof productDraftSchema>;
```

### Environment Variables

`.env` mein:

```
VITE_API_URL=http://localhost:3000/api
```

Access karo:

```ts
const baseURL = import.meta.env.VITE_API_URL;
```

> **Note:** Sirf `VITE_` prefix wale variables browser mein accessible hote hain.

---

## Quick Reference — "Kahan Kya Banao?"

| Cheez                            | Kahan banao                                                |
| -------------------------------- | ---------------------------------------------------------- |
| Zod schema (validation)          | `packages/schemas/src/`                                    |
| Form sub-schema (compose/pick)   | `features/<name>/schema/` — import from `@snitch/schemas`  |
| Shared TypeScript type/interface | `packages/types/src/`                                      |
| Component-level prop type        | Component file ke andar hi                                 |
| Shared UI component              | `src/components/` (ya `src/components/ui/` agar shadcn se) |
| Feature-specific component       | `features/<name>/components/`                              |
| Global CSS token (color, font)   | `src/styles/global.css` → `@theme {}`                      |
| Custom animation                 | `src/styles/global.css` → `@layer base { @keyframes ... }` |
| Custom CSS file                  | ❌ Mat banao — Tailwind classes use karo                   |
| `zod` direct install in client   | ❌ Mat karo — `@snitch/schemas` se import karo             |
