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

Is project mein **4 specialized skill files** hain `client/.agents/skills/` folder mein. Ye skills AI agent ko project-specific, production-quality decisions lene mein help karti hain.

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

## Coding Principles

### General

- **Production-first implementation only.** No TODO stubs, no placeholder logic, no `console.log`.
- Prioritize readability, maintainability, scalability, and performance.
- **Never break the existing project architecture.** Follow the established folder structure, naming conventions, and import patterns.
- Keep code DRY, modular, and reusable. Prefer composition over duplication.
- Remove dead code and unused imports. Never introduce unnecessary dependencies.

### Code Quality

- Write clean, self-documenting code with meaningful variable, function, and component names.
- Keep functions and components small and single-responsibility.
- Extract reusable logic into hooks (`features/*/hook/`), utilities (`utils/`, `lib/`), services (`features/*/service/`), or shared components (`components/`).
- Avoid magic numbers and hardcoded values — use constants and enums where appropriate.
- Maintain consistent formatting and file organization.

### TypeScript

- **Strict typing only.** Never weaken the tsconfig.
- **Never use `any`** unless absolutely unavoidable. Prefer specific types or `unknown`.
- Prefer inferred types where possible; avoid redundant annotations.
- **Reuse shared types from `@snitch/types`** — `UserResponseDto`, `ApiSuccess<T>`, `ApiErrorResponse`, etc.
- **Reuse shared schemas from `@snitch/schemas`** — never define Zod schemas in the client.
- Avoid duplicate interfaces. Keep types colocated when only locally used (component props in the component file).

### React

- Follow the current **feature-based architecture** (`features/*/`).
- Prefer reusable components — check shadcn/Radix first, then build custom.
- Use **React Hook Form + Zod** (via `@hookform/resolvers`) for all forms.
- Use `setFormErrors()` from `@/utils/form-errors.util.ts` to map backend validation errors to form fields.
- Memoize only when it provides measurable value — don't pre-optimize.
- Keep components focused and avoid prop drilling — use Redux for global state, component composition for local concerns.
- Maintain responsive, accessible UI. Mobile-first layouts.
- Preserve current design system and styling patterns.
- Use **sonner** (via `showToast` from `@/lib/toast`) for all notifications — never use `alert()` or raw `toast()`.

### Before generating code

Always:

1. Analyze the existing implementation across features, components, and hooks.
2. Reuse existing utilities (`cn()`, `showToast`, `setFormErrors`, `api` from axiosInstance).
3. Follow the current architecture and naming patterns.
4. Match the project's coding style.
5. Optimize for production — validate inputs, handle loading/error states.
6. Avoid introducing breaking changes.
7. Improve code quality without unnecessary refactoring.

---

## Monorepo Architecture — FUNDAMENTAL RULES

> ⚠️ Ye section sabse important hai. Inhe todna = architecture break karna.

Snitch ek **pnpm workspace monorepo** hai. Structure:

```
snitch/                          ← root workspace
├── client/                      ← React frontend (ye folder)
├── server/                      ← Express backend
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

- API response shapes (`UserResponseDto`, `ApiSuccess<T>`, `ApiNormalResponse`, `ApiErrorResponse`)
- Domain entities (`User`)
- JWT payloads (`JwtPayload`)
- Shared enums and auth types

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

> **Rule:** Custom `.css` files ya `style={}` props **mat banao** jab tak Tailwind classes se kaam na chal sake. Agar custom CSS chahiye, `global.css` ya `index.css` ke `@theme` ya `@layer` blocks mein hi add karo.

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
pnpm dlx shadcn add <component-name>

# Common examples:
pnpm dlx shadcn add button input form label
pnpm dlx shadcn add dialog sheet drawer
pnpm dlx shadcn add dropdown-menu context-menu
pnpm dlx shadcn add select combobox
pnpm dlx shadcn add card badge separator
pnpm dlx shadcn add carousel    # Product gallery
pnpm dlx shadcn add toast       # Notifications
pnpm dlx shadcn add skeleton    # Loading states
pnpm dlx shadcn add avatar      # User profiles
pnpm dlx shadcn add tabs        # Multi-step / filter
pnpm dlx shadcn add table       # Order lists
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
| **motion** (Framer Motion)     | Complex component animations, layout animations, gestures           |
| **CSS `@keyframes`**           | Custom brand-specific animations `global.css` mein define karo      |
| **Tailwind `transition-*`**    | Hover states, color transitions, scale effects                      |
| **CSS `view-transition-name`** | Page transitions ke liye (React Router v8 compatible)               |

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

| Slice     | File                                        | Manages                    |
| --------- | ------------------------------------------- | -------------------------- |
| `auth`    | `features/auth/state/auth.slice.ts`         | User session, login/logout |
| `product` | `features/inventory/state/product.slice.ts` | Product/inventory state    |

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

| Path                                 | Component            | Layout        | Description                        |
| ------------------------------------ | -------------------- | ------------- | ---------------------------------- |
| `/`                                  | `HomePage`           | `RootLayout`  | Landing / storefront               |
| `/login`                             | `LoginPage`          | `RootLayout`  | Auth — login (nested)              |
| `/register`                          | `RegisterPage`       | `RootLayout`  | Auth — registration (nested)       |
| `/admin/dashboard`                   | `Dashboard`          | `AdminLayout` | Admin dashboard (protected)        |
| `/admin/inventory`                   | `InventoryPage`      | `AdminLayout` | Product inventory list (protected) |
| `/admin/inventory/create`            | `CreateProductPage`  | `AdminLayout` | Create product (protected)         |
| `/admin/inventory/edit/:productId`   | `EditProductPage`    | `AdminLayout` | Edit product (protected)           |
| `/admin/categories`                  | `CategoryPage`       | `AdminLayout` | Category list (protected)          |
| `/admin/categories/create`           | `CreateCategoryPage` | `AdminLayout` | Create category (protected)        |
| `/admin/categories/edit/:categoryId` | `EditCategoryPage`   | `AdminLayout` | Edit category (protected)          |
| `/admin/orders`                      | _(placeholder)_      | `AdminLayout` | Orders — not yet implemented       |
| `/admin/customers`                   | _(placeholder)_      | `AdminLayout` | Customers — not yet implemented    |
| `/admin/reviews`                     | _(placeholder)_      | `AdminLayout` | Reviews — not yet implemented      |
| `/admin/coupons`                     | _(placeholder)_      | `AdminLayout` | Coupons — not yet implemented      |
| `/admin/analytics`                   | _(placeholder)_      | `AdminLayout` | Analytics — not yet implemented    |
| `*`                                  | `NotFoundPage`       | —             | Not found fallback                 |

**Protected routes** use `<ProtectedRoute allowedRoles={['ADMIN']} />` wrapper.

> Route-level code splitting add karna hai — `lazy()` + `<Suspense>` use karo naye pages ke liye.

---

### HTTP Client

| Technology | Purpose                                                              |
| ---------- | -------------------------------------------------------------------- |
| **Axios**  | REST API calls — configured instance `src/lib/axiosInstance.ts` mein |

`axiosInstance.ts` mein ye configured hai:

- Base URL: `/api` (proxied via Vite dev server to `VITE_API_BASE_URL`)
- **Request interceptors:**
  - `X-Request-Id` auto-generated for every request (tracing)
  - `Authorization: Bearer <token>` auto-attached from Redux auth state
- **Response interceptors:**
  - Automatic token refresh on `401` (silent re-auth)
  - Queues concurrent requests during refresh (no duplicate refresh calls)
  - Handles multipart retry (FormData boundary fix)
  - Dispatches `logout()` + `setSessionExpired(true)` if refresh fails

**Usage:**

```ts
import { api } from '@/lib/axiosInstance';

// ✅ Always use the configured instance
const response = await api.post('/auth/login', { email, password });

// ❌ Never use raw axios
import axios from 'axios';
axios.post('/api/auth/login', ...); // loses interceptors, auth, tracing
```

---

### Notifications — Sonner (via `showToast`)

All user-facing notifications use the centralized `showToast` wrapper from `@/lib/toast`:

```ts
import { showToast } from '@/lib/toast';

showToast.success('Profile updated!');
showToast.error('Something went wrong', { description: err.message });
showToast.info('New feature available');
showToast.warning('Session expires soon');
showToast.loading('Saving…');
showToast.dismiss(id);
showToast.dismissAll();
```

**Rules:**

- Never use raw `toast()` from sonner directly.
- Never use `alert()` or `window.confirm()`.
- The `<Toaster>` component is mounted once in `App.tsx` — don't add it elsewhere.

---

### Form Error Handling — Backend → Frontend Mapping

The API returns structured field errors: `{ field: string, message: string }[]`.

Use `setFormErrors()` from `@/utils/form-errors.util.ts` to map them to React Hook Form:

```ts
import { setFormErrors, FieldErrorItem } from '@/utils/form-errors.util';

// In your form submission handler:
catch (error) {
  const fields = error.response?.data?.error?.fields as FieldErrorItem[];
  if (fields) {
    setFormErrors(fields, form.setError);
  }
}
```

This supports nested field paths (e.g. `colors.0.sku`) for complex forms.

---

## Folder Structure

```
client/
├── src/
│   ├── components/           # Shared, reusable UI components
│   │   ├── ui/               # shadcn components (source-owned, editable)
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx    # Toaster component
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── tooltip.tsx
│   │   ├── auth/             # Auth-related shared components (ProtectedRoute)
│   │   └── navbar/           # Navigation components
│   │
│   ├── features/             # Feature modules — har feature self-contained hai
│   │   ├── auth/
│   │   │   ├── components/   # Auth UI — LoginForm, RegisterForm, etc.
│   │   │   ├── hook/         # useAuth, useLoginForm, useAuthToast, etc.
│   │   │   ├── schema/       # ⚠️ SIRF compose karo @snitch/schemas se — naya schema mat banao
│   │   │   ├── service/      # auth.api.ts — API functions
│   │   │   └── state/        # auth.slice.ts — Redux slice
│   │   ├── admin/
│   │   │   └── components/   # Admin-specific UI components
│   │   ├── category/
│   │   │   ├── components/   # CategoryFormLayout, CategoryTable, CategoryHeader, etc.
│   │   │   ├── hook/         # useCategoryList, useCreateCategory, useEditCategory
│   │   │   ├── schema/       # category.form.schema.ts (composed from @snitch/schemas)
│   │   │   └── service/      # category.api.ts — categoryService CRUD functions
│   │   ├── home/
│   │   │   ├── components/   # Homepage UI components
│   │   │   └── data/         # Static data for homepage
│   │   └── inventory/
│   │       ├── components/   # Product management UI
│   │       │   ├── sections/ # Form sections — BasicInfo, Pricing, ColorVariants, etc.
│   │       │   └── shared/   # FormFieldWrapper and other shared form components
│   │       ├── hook/         # useProduct, useInventory, useCreateProduct, useEditProduct
│   │       ├── schema/       # product.form.schema.ts (composed from @snitch/schemas)
│   │       ├── service/      # product.api.ts — API functions
│   │       ├── state/        # product.slice.ts — Redux slice
│   │       └── types/        # inventory.ts — client-only types (Category mapping, etc.)
│   │
│   ├── hooks/                # Shared custom hooks (app-wide)
│   │   └── useDebounce.ts    # Debounce hook for search inputs
│   │
│   ├── layouts/
│   │   ├── RootLayout.tsx    # Public layout (navbar + outlet)
│   │   └── AdminLayout.tsx   # Admin layout (sidebar + outlet)
│   │
│   ├── lib/
│   │   ├── axiosInstance.ts  # Pre-configured Axios client with interceptors
│   │   ├── toast.ts          # showToast — centralized notification wrapper
│   │   └── utils.ts          # cn() — clsx + tailwind-merge
│   │
│   ├── pages/                # Route-level page shells
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── 404Page.tsx
│   │   └── (admin)/          # Admin pages (route-grouped)
│   │       ├── Dashboard.tsx
│   │       ├── (inventory)/
│   │       │   ├── InventoryPage.tsx
│   │       │   ├── CreateProductPage.tsx
│   │       │   └── EditProductPage.tsx
│   │       └── (category)/
│   │           ├── CategoryPage.tsx
│   │           ├── CreateCategoryPage.tsx
│   │           └── EditCategoryPage.tsx
│   │
│   ├── routes/
│   │   └── AppRoutes.tsx     # React Router — createBrowserRouter config
│   │
│   ├── store/
│   │   ├── store.ts          # Redux store — reducer combinations
│   │   └── hooks.ts          # useAppDispatch & useAppSelector (typed)
│   │
│   ├── styles/
│   │   ├── global.css        # Tailwind imports + @theme tokens + @layer base
│   │   └── index.css         # shadcn CSS variables + component layer styles
│   │
│   ├── utils/
│   │   └── form-errors.util.ts # setFormErrors — backend→form error mapper
│   │
│   ├── App.tsx               # Root component (Toaster + RouterProvider + auth init)
│   └── main.tsx              # Entry — Provider + setupInterceptors + render
│
├── .agents/                  # AI agent skills and instructions
│   └── skills/               # 4 specialized skill files
│       ├── frontend-design/
│       ├── motion-design/
│       ├── tailwind-design-system/
│       └── vercel-react-best-practices/
├── components.json           # shadcn/ui configuration
├── vite.config.ts            # Vite config — aliases + proxy + plugins
├── tsconfig.app.json         # TypeScript config
└── .env                      # Environment variables (VITE_API_BASE_URL, etc.)
```

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
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { api } from '@/lib/axiosInstance';

// ❌ Avoid
import { Button } from '../../components/ui/button';
import { z } from 'zod'; // seedha zod mat import karo
import { toast } from 'sonner'; // use showToast wrapper instead
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
7. **Follow existing design language** — preserve spacing, typography, and color consistency.
8. **Mobile-first responsive layouts** — design for mobile, enhance for desktop.
9. **Accessibility** should not be compromised — focus states, ARIA labels, keyboard navigation.

### Component Banane Ka Order (mandatory)

1. **shadcn check karo** → `pnpm dlx shadcn add <name>` → customize karo
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
├── service/        # API call functions (use api from axiosInstance)
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
VITE_API_BASE_URL=http://localhost:4000
```

Access karo:

```ts
const baseURL = import.meta.env.VITE_API_BASE_URL;
```

> **Note:** Sirf `VITE_` prefix wale variables browser mein accessible hote hain.

---

## Error Handling

- **Never swallow errors.** Always handle them with user feedback (toast or form error).
- Return actionable validation errors — use `setFormErrors()` for field-level mapping.
- Differentiate error types:
  - **Validation errors** — show per-field messages in the form.
  - **Auth errors** (`401`) — handled by axios interceptor (auto-refresh or logout).
  - **Business errors** — show toast with server message.
  - **Network errors** — show generic connectivity toast.
- Log useful debugging information in development only — never expose sensitive data.

---

## Performance

- Avoid unnecessary renders — don't create new objects/arrays in JSX.
- Optimize imports and bundle size — use specific imports (`import { X } from 'lucide-react'`).
- Lazy load routes and heavy components with `React.lazy()` + `<Suspense>`.
- Use `motion` (Framer Motion) judiciously — don't animate everything.
- Prefer CSS animations (Tailwind `transition-*`, `animate-*`) over JavaScript animations for simple effects.
- Use `useAppSelector` with specific selectors, not `state => state.someSlice` (avoid re-renders on unrelated state changes).

---

## Documentation

- Add JSDoc for public utilities, hooks, services, and complex logic.
- Keep comments meaningful; avoid obvious comments.
- Update this file when architecture changes.

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
| Raw `toast()` from sonner        | ❌ Mat karo — `showToast` from `@/lib/toast` use karo      |
| Raw `axios` import               | ❌ Mat karo — `api` from `@/lib/axiosInstance` use karo    |
| `useSelector` / `useDispatch`    | ❌ Mat karo — `useAppSelector` / `useAppDispatch` use karo |
