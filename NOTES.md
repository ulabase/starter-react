# Notes — React starter

The [README](./README.md) gets you running. This is everything else: how the app is put together,
what to change when you make it yours, and how the consents gate works underneath.

## Structure

```
src/
  styles.css              ← design tokens + the DISPOSABLE default skin
  environments/
    environment.ts        ← apiUrl + feature flags
  routes.tsx              ← route map, feature-flag gating, lazy loading
  App.tsx                 ← fragment token capture + config screen
  main.tsx                ← RhAuthProvider + BrowserRouter
  consents-signal.ts      ← the 451 flag + the onError handler that raises it
  ConsentsGate.tsx        ← the blocking overlay, mounted at the app root
public/
  terms.html, privacy.html ← PLACEHOLDER legal documents — replace them
  theme hook              ← light/dark toggle, persisted (in Shell.tsx)
  ui/alert/               ← the one shared feedback component
  pages/
    shell/                ← authenticated frame: header, nav, user menu
    home/                 ← PLACEHOLDER showcase — replace with your content
    auth/                 ← login, signup, verify, forgot/reset password
    invitations/accept/   ← one page, three flows (see below)
    teams/                ← list, detail (members/invites/settings), new
    account/              ← profile + change password
```

### Route map

| Path | Guard | Shown when |
|---|---|---|
| `/auth/login` | `PublicGuard` | always |
| `/auth/signup` | `PublicGuard` | `emailRegistration \|\| oauthLogin` |
| `/auth/verify` | `PublicGuard` | `emailRegistration` |
| `/auth/forgot-password`, `/auth/reset-password` | `PublicGuard` | `passwordReset` |
| `/invitations/accept` | **none** — works signed-in or out | `teamInvitations` |
| `/home`, `/teams`, `/teams/new`, `/teams/:id`, `/account` | `AuthGuard` | always |

Feature flags live in `src/environments/environment.ts` and must match your service's
**Sign-up Mgmt → Features** toggles. A flag that's off removes the route *and* the UI that
links to it.

## Customization

### The default skin is meant to be thrown away

`src/styles.css` holds two things: **design tokens** (section 1) and a **disposable
default skin** (sections 3–5). The look is deliberately a *mockup* — cohesive and
intentional, but obviously a scaffold. `@ulabase/kit-react` ships no UI at all, so
the components and this one stylesheet are the only places styling lives.

Two ways forward. Pick one:

**A. Tweak the skin** — fastest, roughly an hour to something that looks like yours:

1. Change the tokens in `styles.css` section 1 — colours, type scale, spacing, radii. Every
   component reads them, so this re-themes the whole app including dark mode.
2. Adjust the skin classes in section 3 if you want different shapes.
3. Replace the shell layout in `pages/shell/`.
4. Replace `pages/home/` with your own landing content.

**B. Adopt a UI framework** — Material, shadcn/ui, Tailwind, your own:

1. Delete sections 3–5 of `styles.css` (they are marked). Keep section 1 if you want the
   tokens; drop it too if your framework brings its own.
2. Reskin the components using the swap map below.

### Swap map

Components reference a small, stable vocabulary of semantic class hooks. Restyle them, or
replace each element with your framework's component:

| Class hook | Used for | Tailwind (example) | Material (example) |
|---|---|---|---|
| `.card` / `.card-header` | Section container + its title row | `rounded border p-6 mb-6` | `<Card>` |
| `.btn-primary` | The one accented action per form | `px-6 py-2 rounded bg-amber-400 font-semibold` | `<Button variant="contained">` |
| `.btn-secondary` | Quiet bordered action | `px-3 py-2 rounded border text-xs uppercase` | `<Button variant="outlined">` |
| `.btn-danger` / `.btn-danger-text` | Destructive action / inline variant | `… text-red-700 border-red-700` | `<Button variant="outlined" color="error">` |
| `.form-field` / `.form-field-sm` / `.form-row` | Label+control stack; `-sm` is narrow; `-row` lays fields side by side | `flex flex-col gap-1` / `flex gap-3` | `<TextField>` |
| `.password-field` / `.btn-toggle-password` | Password input with a Show/Hide toggle | `relative` / `absolute right-2` | `<TextField>` + end adornment |
| `.form-error` / `.field-error` | Form-level / per-field error | `rounded border border-red-300 bg-red-50 p-3` | `<FormHelperText error>` |
| `.success-msg` | Success feedback | `rounded border border-emerald-300 bg-emerald-50 p-3` | — (usually a snackbar) |
| `.muted` | Secondary/caption text | `text-sm text-gray-500` | `className="body2"` |
| `.badge` | Small status pill | `rounded-full px-2 text-xs uppercase` | `<Chip size="small">` |
| `.back-link` / `.eyebrow` | Back navigation / label above a title | `text-xs uppercase tracking-wide` | — |
| `.placeholder` / `.skeleton` | Empty-slot outline / loading block | `border border-dashed p-6` / `animate-pulse bg-gray-200` | `<LinearProgress>` |
| `.auth-page` / `.auth-card` / `.auth-links` / `.divider` | Centred auth layout | `min-h-screen grid place-items-center` / `w-90 rounded border p-8` | `<Card>` |
| `.config-page` / `.config-card` / `.config-status` / `.config-steps` | "Connect your service" screen | — | — |

Feedback is rendered through one component — `src/ui/alert/Alert.tsx` — which carries no
styles of its own, only the `.success-msg` / `.form-error` hooks plus the correct ARIA
roles. Swap that one component and every success/error message in the app follows.

Page-specific layout (`.team-row`, `.member-row`, `.feature-grid`, …) stays in the
component's own `.css` file and is not part of this contract.

## Reading your own data

Everything the starter does talks to `/auth/*`, `/token` and `/users/me` — the kit handles
those. For your application's own collections, use `auth.api`: it applies the session on the
way out, so you never attach the bearer token by hand.

```tsx
import { useAuth } from '@ulabase/kit-react';
import type { ApiError } from '@ulabase/kit-react';

function Notes() {
  const auth = useAuth();
  const [notes, setNotes] = useState<unknown[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    auth.api('/notes?pagesize=10')
      .then(res => res.json())
      .then(setNotes)
      .catch((err: ApiError) => setError(err.message));
  }, [auth.api]);

  // …
}
```

Pass a path, not a URL. Any non-2xx rejects with an `ApiError` (`{ status, message }`), so a
`403` from an ACL or a `451` from a Guards rule is something you branch on rather than parse.

A plain `fetch` to the same URL is unauthenticated, and the service answers `401` — which
reads as "logged out" rather than "you forgot the header". That is the one mistake worth
knowing about in advance.


## Consents gate

Every user must accept the current Terms of Service and Privacy Policy before they can use
the app. The rule lives on the server, as a **Guards** rule, so it applies to this app, to a
mobile client, to `curl`, and to any API integration — not just to the code below.

The client's only job is to react to a status code. Three files:

| File | Job |
|---|---|
| `src/consents-signal.ts` | Raises a flag on any `451` the API returns. Exported as `consentsOnError`. |
| `src/main.tsx` | Passes it to `RhAuthProvider` as `config.onError`. |
| `src/ConsentsGate.tsx` | The blocking overlay, wrapped around the router in `App.tsx` — **above `AuthGuard`**. |
| `public/terms.html`, `public/privacy.html` | Placeholder legal documents. Static, so a blocked user can read them. |

Nothing in the client knows which versions are current, and nothing reads `latestConsents`
— the permission's `mergeRequest` stamps the versions and the timestamp server-side. Bump
the versions in the console and every user meets the form again on their next request, with
nothing to redeploy here.

`auth.acceptConsents()` (kit ≥ 0.7.0) does the `PATCH`, then `GET /token?renew=true`, then
`GET /users/me`, then `setUser()`. The renewal is not optional: a JWT is a snapshot, and
without a fresh one the rule keeps blocking the user for the whole life of the token they
hold.

The overlay is user experience, not enforcement — remove it with the dev tools and every
request still comes back `451`.

### What makes the gate fire

Nothing you have to arrange. `/users/me` is one of the requests the rule blocks, and restoring
the session is the first thing the app does on load — so a blocked user trips the gate before
anything else happens. No probe, no collection to create, no path to configure.

That is also why the overlay wraps the router in `App.tsx` rather than living inside the
shell: with `/users/me` refused there is no session, so `AuthGuard` bounces the user to the
login page. A gate mounted behind that guard would never be seen.

`onError` is what makes it visible at all. The provider restores the session on mount and
absorbs the failure — `checkSession().catch(() => null)` — because it has to keep the app
usable. Without the hook, a blocked user and a signed-out user look identical.

If your own data requests should raise the flag too — say the terms change while someone is
mid-session — call `setBlocked(true)` when `auth.api` rejects with a `451`. The starter does
not, because it makes no data requests of its own.

### The legal documents

`public/terms.html` and `public/privacy.html` are **placeholders — replace them.** Plain HTML,
no build step, no framework.

They are static files rather than app routes on purpose: a blocked user has no session, so
anything routed through the app would sit behind the gate they are trying to read their way
out of. A file in `public/` is served to anyone, in any state, and opens in a new tab without
booting the app at all.

Each carries `Version 2026-07-01` at the top. That date has to match the one in the Guards rule
and in the ACL permission — change it in all three places together, or users accept one version
while the server records another.

### Server setup

The [README](./README.md#3-set-the-service-up) says which file to apply. What it puts there:

[`ulabase.setup.consents.ts`](./ulabase.setup.consents.ts) is [`ulabase.setup.ts`](./ulabase.setup.ts) with four
documents appended — it imports it, so the accounts steps have one definition and cannot drift.
Applying it to a service already set up with `ulabase.setup.ts` adds the gate and touches nothing
else.

**The versions live in one place.** In the article the two version strings appear four times —
twice in the permission's `mergeRequest`, twice in the rule's condition — and they have to agree
exactly. In the setup file they are `TOS_VERSION` and `PP_VERSION` at the top, and everything is
derived. Publishing new terms is editing two strings and re-running; the `Version 2026-07-01`
line in `public/` is the third place, and the only one left to keep in step by hand.

<details>
<summary>What the four documents are, if you would rather create them by hand</summary>

Enable the **Guards** plugin from *Service → Guards*, then create them in the console. Full
walkthrough: [Add Terms and Privacy Policy Acceptance](https://cloud.restheart.com/blog/require-terms-and-privacy-acceptance)
and the [Guards documentation](https://restheart.org/docs/cloud/guards#_example_gating_on_consents).

1. **A schema** (`userConsentsSchema`) allowing `latestConsents` and `consents` on the user
   document — with neither in `required`, since registration does not write them.
2. **A permission** on `PATCH /users/{userId}`, scoped with `bson-request-whitelist(consents)`
   and carrying the `mergeRequest` that stamps the versions. Without it the acceptance is a
   `403` and the user is locked out for good.
3. **Two JWT claims**: `latestConsents/tos` *and* `latestConsents/pp`. If either is missing,
   the rule blocks every token-authenticated user permanently.
4. **The rule**, blocking with `451` — excluding `/auth` and `/token`, and the acceptance
   `PATCH` itself. Note that `/users/me` is **not** excluded: it is what trips the gate.

Until those exist nothing ever returns `451`, the flag stays down, and the overlay never
renders.

</details>

## Packages used

- [`@ulabase/kit`](https://github.com/ulabase/kit/tree/main/packages/kit) — TypeScript auth logic (framework-agnostic)
- [`@ulabase/kit-react`](https://github.com/ulabase/kit/tree/main/packages/kit-react) — React context, hooks, and guards
