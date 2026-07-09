# Snitch — Frontend Client (`client/`)

## What is Snitch?

**Snitch** ek **premium fashion clothing e-commerce platform** hai. Ye sirf ek shopping site nahi — ye ek **brand experience** hai. Har interaction, scroll, hover aur transition ko is tarah design kiya gaya hai ki user ko ek luxury fashion store ka feel aaye — digital mein.

Design philosophy ka core teen pillars hain:

1. **Award-Worthy UI/UX** — Har screen intentional, opinionated aur visually striking honi chahiye. Generic layouts avoid karo.
2. **Motion as Language** — Animation sirf decoration nahi hai. Ye user ko guide karta hai, feedback deta hai aur brand personality communicate karta hai.
3. **Micro-interactions** — Chhoti chhoti details — button press, hover state, cart update, image zoom — yahi cheezein ek ordinary app ko premium feel deti hain.

> **Design Principle:** Agar koi element static lag raha hai, toh wo incomplete hai.

---

## AI Skills — `.agents/skills/`

> ⚠️ **MANDATORY:** Koi bhi UI, animation, ya React component kaam shuru karne se pehle relevant skill file ZAROOR padho. Skills ke bina kaam karna = generic, template-level output.

Is project mein **3 specialized skill files** hain `client/.agents/skills/` folder mein. Ye skills AI agent ko project-specific, production-quality decisions lene mein help karti hain.

---

### Skill 1 — `frontend-design`

**File:** `.agents/skills/frontend-design/SKILL.md`

**Kab use karo:**

- Naya page ya section design karna ho
- Existing UI ko visually improve karna ho
- Color palette, typography, layout decisions leni ho
- Hero section, landing page, marketing page banana ho
- Design feel generic ya templated lag rahi ho

**Kya sikhata hai:**

- Opinionated, distinctive visual choices kaise karo
- Typography pairs (display + body face)
- Layout planning — ASCII wireframes + design tokens
- Writing copy that serves design (labels, CTAs, empty states)
- Self-critique process — design review before building

```
Trigger examples:
- "Naya ProductPage banana hai"
- "LoginPage ka UI improve karo"
- "Hero section redesign karo"
- "Ye design generic lag raha hai, improve karo"
```

---

### Skill 2 — `motion-design`

**File:** `.agents/skills/motion-design/SKILL.md`

**Kab use karo:**

- Koi bhi animation banana ho (entry, exit, hover, press)
- Page transitions implement karna ho
- Scroll-triggered reveals, parallax effects
- Loading states, success/error animations
- Marquee, carousel, infinite scroll animations
- Motion ke liye easing ya duration decide karna ho

**Kya sikhata hai:**

- Motion Personality archetypes: **Premium** (is project ke liye default), Playful, Corporate, Energetic
- Duration table — kab kitna time lagao
- Easing selection — entrance = ease-out, exit = ease-in
- Disney animation principles (anticipation, follow-through, squash/stretch)
- 3 motion layers: Primary + Secondary + Ambient
- 1/3 rule — ek waqt mein kitne elements animate ho sakate hain

**Is project ka Motion Personality: `Premium`**

```
Duration: 350–600ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Overshoot: 0%
Feel: elegant, minimal, luxury, sophisticated
```

```
Trigger examples:
- "Animation add karo is button pe"
- "Page transition implement karo"
- "Marquee smooth karo"
- "Hover micro-interaction chahiye"
- "Loading state banana hai"
```

---

### Skill 3 — `vercel-react-best-practices`

**File:** `.agents/skills/vercel-react-best-practices/SKILL.md`

**Kab use karo:**

- Naya React component likhna ho
- Data fetching implement karna ho (API calls, useEffect)
- Bundle size optimize karna ho
- Re-render issues fix karne ho
- Performance improve karna ho
- Heavy component lazy load karna ho

**Kya sikhata hai (70 rules, 8 categories):**

| Priority | Category                  | Impact   |
| -------- | ------------------------- | -------- |
| 1        | Eliminating Waterfalls    | CRITICAL |
| 2        | Bundle Size Optimization  | CRITICAL |
| 3        | Server-Side Performance   | HIGH     |
| 4        | Client-Side Data Fetching | MED-HIGH |
| 5        | Re-render Optimization    | MEDIUM   |
| 6        | Rendering Performance     | MEDIUM   |
| 7        | JavaScript Performance    | LOW-MED  |
| 8        | Advanced Patterns         | LOW      |

```
Trigger examples:
- "useEffect mein API call hai"
- "Component slow lag raha hai"
- "Bundle size bahut bada ho gaya"
- "Re-render zyada ho rahe hain"
- "Lazy load karna hai"
```

---

### Skill 4 — `tailwind-design-system`

**File:** `.agents/skills/tailwind-design-system/SKILL.md`

**Kab use karo:**

- Tailwind v4 `@theme` mein naye design tokens add karne ho
- Color palette, radius, spacing, animation tokens define karne ho
- Dark mode implement karna ho (`@custom-variant dark`)
- Component variants CVA se banana ho
- Tailwind v3 se v4 mein migrate karna ho
- `global.css` / `index.css` ka design system structure improve karna ho
- OKLCH colors use karne ho

**Kya sikhata hai:**

- Tailwind v4 ka CSS-first configuration (`@theme {}` block)
- v3 → v4 migration — `tailwind.config.ts` → `@theme` mein
- Semantic color tokens OKLCH format mein
- `@keyframes` inside `@theme` for animation tokens
- Dark mode: `@custom-variant dark (&:where(.dark, .dark *))`
- Design token hierarchy: Brand → Semantic → Component

**Tailwind v3 vs v4 quick reference:**

| v3 Pattern                       | v4 Pattern                    |
| -------------------------------- | ----------------------------- |
| `tailwind.config.ts`             | `@theme {}` in CSS            |
| `@tailwind base/components`      | `@import "tailwindcss"`       |
| `darkMode: "class"`              | `@custom-variant dark (...)`  |
| `theme.extend.colors`            | `@theme { --color-*: value }` |
| `require("tailwindcss-animate")` | `@keyframes` inside `@theme`  |

```
Trigger examples:
- "Naya color token add karna hai @theme mein"
- "Dark mode implement karo"
- "OKLCH color system banana hai"
- "Tailwind mein custom radius/spacing add karo"
- "Animation token define karna hai"
- "Design system consistent nahi lag raha"
```

---

### Quick Decision — Kaunsi Skill Kab?

| Task                                    | Skill                               |
| --------------------------------------- | ----------------------------------- |
| Naya UI page/section banana             | `frontend-design`                   |
| Existing component ka look improve karo | `frontend-design`                   |
| Animation, transition, motion add karo  | `motion-design`                     |
| Hover, press, scroll effects            | `motion-design`                     |
| Infinite marquee, carousel              | `motion-design`                     |
| React component banana                  | `vercel-react-best-practices`       |
| API call / data fetching                | `vercel-react-best-practices`       |
| Performance optimize karna              | `vercel-react-best-practices`       |
| Bundle size ghataani hai                | `vercel-react-best-practices`       |
| Complex animated UI section             | `frontend-design` + `motion-design` |
| Tailwind token add karna (@theme)       | `tailwind-design-system`            |
| Dark mode implement karna               | `tailwind-design-system`            |
| OKLCH colors, radius, spacing           | `tailwind-design-system`            |
| Component variants (CVA) banana         | `tailwind-design-system`            |
| Design system consistent banana         | `tailwind-design-system`            |

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

> ⚠️ **MANDATORY: Sirf `pnpm` use karo. `npm` ya `yarn` bilkul mat use karo.**
> Is project mein `pnpm` workspace hai — `npm` se install karne par lockfile corrupt ho sakta hai aur workspace links toot sakte hain.

```bash
# ─── Client commands (client/ folder se) ─────────────────────────────────────

# Dev server start karo (http://localhost:5173)
pnpm dev

# TypeScript type check (no emit)
pnpm type-check

# Production build (tsc + vite build)
pnpm build

# ESLint run karo
pnpm lint

# Prettier format karo
pnpm format

# ─── Root-level commands (root snitch/ folder se) ─────────────────────────────

# Client + Server dono saath start karo
pnpm dev

# Sirf client start karo
pnpm dev:client

# Sirf server start karo
pnpm dev:server

# Sab packages mein type-check
pnpm type-check

# Naya package install karo (hamesha root se)
pnpm add <package-name> --filter client

# shadcn component add karo
pnpm dlx shadcn add <component-name>
```

| Command           | Galat ❌             | Sahi ✅                   |
| ----------------- | -------------------- | ------------------------- |
| Dev server        | `npm run dev`        | `pnpm dev`                |
| Package install   | `npm install axios`  | `pnpm add axios`          |
| shadcn component  | `npx shadcn add ...` | `pnpm dlx shadcn add ...` |
| One-time tool run | `npx some-tool`      | `pnpm dlx some-tool`      |

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
