# earlyroom — Claude Code Project Context
## Read this before touching any file

---

## WHAT THIS PROJECT IS

earlyroom is an AI-powered housekeeping operations platform for 3–4 star hotels.
It is a B2B SaaS product built by Albor Digital LLC.

**Core value proposition:** Get rooms ready earlier. Sell them faster.

The primary user is a hotel housekeeping supervisor or GM. The product:
1. Automatically generates balanced room assignments every morning (replaces 20 min manual process)
2. Gives housekeepers a mobile task list — no printed sheets
3. Shows real-time room status to supervisors and front desk
4. Tracks early room availability rate as a revenue metric for GMs

**Target customer:** Independent and franchised hotels with 60–150 rooms (3–4 star, midscale).

---

## TECH STACK

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (existing classes only — see rules below) |
| Database | Supabase (Postgres + Auth + Realtime + RLS) |
| Deployment | Vercel |
| Payments | Stripe (not yet wired) |
| Animation | motion/react (already installed) |
| AI | Anthropic Claude API (for assignment engine) |

**Project folder:** `/Users/gus/Documents/APPS/earlyroom`

---

## REPOSITORY STRUCTURE

```
earlyroom/
├── app/
│   ├── (auth)/                   ← Login, signup, reset — NO Navbar/Footer
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (onboarding)/             ← 3-step onboarding — NO Navbar/Footer
│   │   └── onboarding/
│   │       ├── hotel/page.tsx
│   │       ├── rooms/page.tsx
│   │       └── team/page.tsx
│   ├── dashboard/                ← App shell — NO public Navbar/Footer
│   │   ├── layout.tsx            ← Dashboard header + auth guard
│   │   ├── page.tsx              ← Supervisor view
│   │   └── housekeeper/
│   │       └── page.tsx          ← Mobile housekeeper view
│   ├── how-it-works/
│   │   ├── general-managers/page.tsx
│   │   └── housekeeping/page.tsx
│   ├── legal/
│   │   ├── terms/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── disclaimer/page.tsx
│   │   └── cookies/page.tsx
│   ├── api/
│   │   └── assignments/
│   │       ├── generate/route.ts ← POST — runs assignment algorithm
│   │       └── rebalance/route.ts
│   ├── layout.tsx                ← Root layout (public pages only)
│   └── page.tsx                  ← Marketing homepage
├── components/
│   ├── dashboard/
│   │   └── sign-out-button.tsx
│   ├── features-one/             ← Bento feature grid section
│   ├── features-two/             ← Device skeletons section
│   ├── ui/                       ← shadcn primitives — DO NOT EDIT
│   ├── hero.tsx
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── pricing.tsx
│   ├── faqs.tsx
│   ├── cta.tsx
│   ├── logo-cloud.tsx
│   ├── testimonials.tsx
│   ├── heading.tsx
│   ├── subheading.tsx
│   ├── container.tsx
│   ├── button.tsx
│   ├── badge.tsx
│   └── ...
├── lib/
│   ├── supabase/
│   │   ├── client.ts             ← Browser client
│   │   ├── server.ts             ← Server client (async, uses cookies)
│   │   └── middleware.ts         ← Session refresh + route protection
│   └── utils.ts
├── public/
│   └── early_room.png            ← earlyroom isotype logo
├── middleware.ts                 ← Protects /dashboard and /onboarding routes
└── .env.local                    ← Never commit. Contains Supabase + Stripe keys.
```

---

## DATABASE SCHEMA (Supabase)

**7 core tables:**

```
hotels          — one row per property
users           — extends auth.users, has hotel_id + role + speed_factor
rooms           — room inventory per hotel
cleaning_jobs   — one row per room per day (the operational record)
assignments     — daily assignment snapshot per housekeeper
room_status_log — append-only status change log
subscriptions   — Stripe billing per hotel
invitations     — pending team member invites
```

**User roles:** `owner` | `manager` | `supervisor` | `housekeeper` | `front_desk`

**Job statuses:** `assigned` | `in_progress` | `ready_for_inspection` | `inspected` | `no_service` | `skipped`

**Room types:** `standard`(25m) | `queen`(30m) | `king`(35m) | `double`(35m) | `suite`(45m) | `studio`(30m) | `accessible`(35m)

**Key relationships:**
- Every table has `hotel_id` — this is the multi-tenant isolation key
- `cleaning_jobs.assigned_to` → `users.id`
- `cleaning_jobs.room_id` → `rooms.id`
- `assignments.job_ids` → array of `cleaning_jobs.id`

**RLS helper functions (already in Supabase):**
- `get_my_hotel_id()` — returns current user's hotel_id without recursion
- `get_my_role()` — returns current user's role without recursion

**Realtime enabled on:** `cleaning_jobs`, `room_status_log`, `assignments`

---

## SUPABASE CLIENT USAGE

```ts
// Browser/client components
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

// Server components and API routes
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
```

Never use the service role key client-side. Never import server client in client components.

---

## ASSIGNMENT ALGORITHM (core product logic)

The algorithm runs in `app/api/assignments/generate/route.ts` as a POST endpoint.

**8 steps:**
1. Calculate effective cleaning time per room (base time + 10min if departure)
2. Sort rooms by difficulty descending (heaviest first), priority rooms always first
3. Group by floor for walking cluster optimization
4. Greedy assignment — each room goes to housekeeper with lowest current load
5. Adjust for speed_factor — `adjusted_time = room_time / housekeeper.speed_factor`
6. Rebalance pass — swap rooms if max deviation > 10 minutes
7. Priority rooms (VIP/early check-in) always scheduled first
8. Write results to `assignments` table, update `cleaning_jobs.assigned_to`

**Balance score:** `100 - (max_deviation * 2)` — shown on supervisor dashboard.

**Do not simplify this algorithm.** It is the core differentiator.

---

## CODING RULES — READ BEFORE EVERY CHANGE

### CSS and Styling
- Use ONLY Tailwind classes already present in the existing codebase
- Do NOT add new CSS files
- Do NOT add `<style>` blocks
- Do NOT use arbitrary values like `w-[347px]` unless already used in the project
- Existing inline styles (boxShadow on buttons, WebkitTextStroke in footer) are allowed
- Dark mode via existing `dark:` classes only

### Components
- Use existing components: `Container`, `Heading`, `Subheading`, `Button`, `Badge`
- Do NOT create new design system components — extend existing ones
- Do NOT edit files in `components/ui/` — these are shadcn primitives

### Pages and Layouts
- Public pages (`/`, `/pricing`, `/how-it-works/*`, `/legal/*`) use root layout with `Navbar` + `Footer`
- Auth pages (`/login`, `/signup`, `/reset-password`) use `(auth)/layout.tsx` — NO Navbar/Footer
- Onboarding pages use `(onboarding)/layout.tsx` — NO Navbar/Footer
- Dashboard pages use `app/dashboard/layout.tsx` — NO public Navbar/Footer, own header

### No emojis
- Nowhere. Not in UI, not in comments.

### Animations
- Import from `motion/react` only — already installed
- Do not install framer-motion separately

### Supabase queries
- Always handle errors — check `error` before using `data`
- Use `.single()` only when you expect exactly one row
- For RLS-protected inserts, the user must be authenticated

---

## ENVIRONMENT VARIABLES

```
NEXT_PUBLIC_SUPABASE_URL        — Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   — Supabase anon public key
SUPABASE_SERVICE_ROLE_KEY       — Server only, never expose client-side
NEXT_PUBLIC_APP_URL             — http://localhost:3000 in dev
STRIPE_SECRET_KEY               — Not yet active
ANTHROPIC_API_KEY               — For Claude API calls in assignment engine
```

---

## CURRENT BUILD STATUS

```
Phase 1 — Foundation        ✅ Complete
  - Supabase schema + RLS
  - Auth (login, signup, reset password)
  - Onboarding (hotel, rooms, team)
  - Marketing site live at earlyroom.io

Phase 2 — Dashboard         🔄 In progress
  - Supervisor dashboard
  - Housekeeper mobile view
  - Assignment algorithm API route

Phase 3 — Mobile HK View    ⏸ Pending Phase 2
Phase 4 — AI Assignment     ⏸ Pending Phase 2
Phase 5 — Launch Prep       ⏸ Pending
```

---

## KNOWN ISSUES AND DECISIONS

**RLS recursion fix:** The `users` table policies use `get_my_hotel_id()` and `get_my_role()` security definer functions instead of subqueries. This prevents infinite recursion. Do not revert to subquery-based policies.

**Auto job creation:** On first dashboard load, if no `cleaning_jobs` exist for today, the supervisor page auto-creates one job per active room. This is the MVP approach until PMS sync is built.

**Invitations:** Team member invitations are written to the `invitations` table. Email sending is not yet wired (requires Resend or similar). This is Phase 3 work.

**No Google/Apple OAuth:** Deliberate decision. B2B hotel tool — managers use email/password.

**Logo:** The earlyroom isotype is at `/public/early_room.png`. Used as `<Image src="/early_room.png" width={28} height={28} />` with the text "earlyroom" next to it.

---

## CONTACT AND OWNERSHIP

Product: earlyroom.io
Company: Albor Digital LLC
Lead: Gustavo (business direction, customer insights)
Architecture: Defined via browser Claude sessions (see conversation history for decisions)

When in doubt about a product decision, implement the simpler option and flag it.
When in doubt about a technical decision, follow the existing patterns in the codebase.
