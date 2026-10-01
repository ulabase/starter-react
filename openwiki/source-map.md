---
type: Source Map
title: Source Map
description: File-by-file inventory of the Ulabase React starter, mapping every source file to its purpose and cross-referencing documentation.
tags: [source-map, reference, files]
verified:
  - by: openwiki/0.6.1
    at: 2026-10-01T10:27:11.499Z
sources:
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-def8b68a3bfae964ad61c3db
    resource: repo://src/ConfigPage.tsx
  - id: openwiki-source-a3fd7ec517783a7d5d8842d0
    resource: repo://src/consents-signal.ts
  - id: openwiki-source-41263ba637a35415c845f5fb
    resource: repo://src/ConsentsGate.css
  - id: openwiki-source-9674080b0675d512256b80bc
    resource: repo://src/ConsentsGate.tsx
  - id: openwiki-source-eaae96b81373abab97667f4f
    resource: repo://src/environments/environment.ts
  - id: openwiki-source-c1d5327fe44e08cda82fcf83
    resource: repo://ulabase.setup.consents.ts
  - id: openwiki-source-34f568b222540eb11aa44859
    resource: repo://ulabase.setup.ts
generated: { by: "openwiki/0.6.1", at: "2026-10-01T10:27:11.499Z" }
---

# Source Map

Complete inventory of repository source files. Each entry links to the page where that area is explained in depth.

## Root Config & Build

| File | Purpose | See Also |
|------|---------|----------|
| `package.json` | Project metadata, dependencies (`@ulabase/kit-react`, `react`, `react-router-dom`), scripts (`dev`, `build`, `preview`, `test`) | [Operations](operations/runbook.md) |
| `package-lock.json` | Lockfile — do not edit manually | — |
| `tsconfig.json` | TypeScript config: ES2020 target, ESNext modules, strict mode, JSX React, `noEmit` (Vite compiles) | — |
| `vite.config.ts` | Vite config: minimal — just the `@vitejs/plugin-react` plugin | [Testing](testing/guidance.md) |
| `index.html` | SPA shell: mounts `#root` div, links `/src/main.tsx` as entry module | — |
| `.gitignore` | Ignores `node_modules`, `dist`, `.env*`, IDE files | — |

## Entrypoint & App Shell

| File | Purpose | See Also |
|------|---------|----------|
| `src/main.tsx` | React root creation. Renders `<StrictMode>` → `<BrowserRouter>` → `<RhAuthProvider>` → `<App />`. Imports `styles.css`. | [Architecture](architecture/overview.md) |
| `src/App.tsx` | Fragment token capture on mount, API URL validation gate, renders `ConfigPage` or route tree via `useRoutes()` | [Architecture](architecture/overview.md) |
| `src/ConfigPage.tsx` | Setup wizard shown when `apiUrl` is invalid. Guides user to create a service at `cloud.ulabase.com` and edit `environment.ts`. | [Operations](operations/runbook.md) |
| `src/routes.tsx` | Route definitions as `RouteObject[]`. Lazy-loaded components, feature-flag conditional inclusion, `AuthGuard`/`PublicGuard` wrappers. | [Architecture](architecture/overview.md) |

## Environment & Utilities

| File | Purpose | See Also |
|------|---------|----------|
| `src/environments/environment.ts` | **Central config**: `apiUrl` (Ulabase service URL) + `features` object (feature flags) | [Auth & Teams](domain/auth-and-teams.md#feature-flags), [Operations](operations/runbook.md) |
| `src/just-signed-up.ts` | Module-level boolean flag. Set to `true` when `?flow=signup` query param is detected in fragment token capture. Shell reads and clears it to show a welcome message. | [Auth & Teams](domain/auth-and-teams.md) |
| `src/oauth-url.ts` | Builds OAuth authorize URL: `${apiUrl}/auth/oauth/authorize/${provider}?noauthchallenge` | [Auth & Teams](domain/auth-and-teams.md#oauth-login) |

## Styling

| File | Purpose | See Also |
|------|---------|----------|
| `src/styles.css` | **Design tokens** (section 1), reset/base styles (section 2), skin classes (section 3), utility classes (section 4), page scaffolds (section 5). Explicitly a disposable mockup — meant to be replaced. | [Operations](operations/runbook.md#design-system) |
| `src/vite-env.d.ts` | Vite client type reference | — |

## UI Components

| File | Purpose | See Also |
|------|---------|----------|
| `src/ui/alert/Alert.tsx` | Shared feedback component. Props: `type` ("error"/"success"), `children`, `onClose`, `dismissible?` (default `true`), `autoDismiss?` (default `4000`ms). Auto-dismisses after the timeout. Uses `.form-error` / `.success-msg` class hooks and correct ARIA roles (`alert` / `status`). | [Auth & Teams](domain/auth-and-teams.md) |

## Page Components

### Shell (Authenticated Frame)

| File | Purpose | See Also |
|------|---------|----------|
| `src/pages/shell/Shell.tsx` | Authenticated layout: header with team name, nav links, user avatar dropdown menu (profile, account, theme toggle, logout), `<Outlet>` for child routes. Contains `useTheme()` hook for light/dark mode persisted to `localStorage`. | [Operations](operations/runbook.md#theming) |
| `src/pages/shell/Shell.css` | Shell-specific layout styles | — |

### Home

| File | Purpose | See Also |
|------|---------|----------|
| `src/pages/home/Home.tsx` | **Getting-started page**. Welcome hero, feature-flag status grid (on/off badges linked to team/account pages), 5-step customization guide, and an interactive `auth.api('/demo')` fetch demo. Replace with your own landing content. | [Auth & Teams](domain/auth-and-teams.md#reading-your-own-data) |
| `src/pages/home/Home.css` | Home page styles | — |

### Auth Pages

| File | Purpose | See Also |
|------|---------|----------|
| `src/pages/auth/login/Login.tsx` | Email/password login form. Shows OAuth buttons if `oauthLogin` is enabled. Form validation (email format, required fields), error display, loading state. Reads `error` search param for `invalid_token` message. Links to signup and forgot-password. | [Auth & Teams](domain/auth-and-teams.md#login) |
| `src/pages/auth/signup/Signup.tsx` | Registration form with first name, last name, email, password. Auto-generates team name. On success shows "Check your email" confirmation. OAuth buttons shown when enabled. Handles 409 duplicate email. | [Auth & Teams](domain/auth-and-teams.md#signup) |
| `src/pages/auth/verify/Verify.tsx` | Email verification page. Reads `email`, `token`, and `error` from URL search params. Handles missing params and error states. Calls `auth.verify(email, token)` which returns a redirect URL. | [Auth & Teams](domain/auth-and-teams.md#email-verification) |
| `src/pages/auth/forgot-password/ForgotPassword.tsx` | Request password reset email. | [Auth & Teams](domain/auth-and-teams.md#password-reset) |
| `src/pages/auth/reset-password/ResetPassword.tsx` | Set new password using reset token from email link. | [Auth & Teams](domain/auth-and-teams.md#password-reset) |
| `src/pages/auth/oauth-buttons/OAuthButtons.tsx` | Renders OAuth provider buttons (Google, etc.). Builds URLs via `oauthUrl()`. | [Auth & Teams](domain/auth-and-teams.md#oauth-login) |
| `src/pages/auth/oauth-buttons/OAuthButtons.css` | OAuth button styles | — |

### Invitations

| File | Purpose | See Also |
|------|---------|----------|
| `src/pages/invitations/accept/Accept.tsx` | **One page, three flows**: (1) missing params → error, (2) new user → set password form (`auth.activate()`), (3) existing user → login + accept (`auth.acceptInvite()`). No route guard — works signed-in or out. | [Auth & Teams](domain/auth-and-teams.md#invitations) |

### Teams

| File | Purpose | See Also |
|------|---------|----------|
| `src/pages/teams/Teams.tsx` | Team list. Shows all user's teams with role, active badge, switch button. Links to team detail and new team. | [Auth & Teams](domain/auth-and-teams.md#team-management) |
| `src/pages/teams/detail/TeamDetail.tsx` | Full team management: member list with role change/remove (owner), invite form, pending invitations with resend cooldown (5 min), team name/description settings, and delete team with confirmation dialog. | [Auth & Teams](domain/auth-and-teams.md#team-detail-teamsid) |
| `src/pages/teams/new/NewTeam.tsx` | Create new team form. | [Auth & Teams](domain/auth-and-teams.md#team-management) |
| `src/pages/teams/*.css` | Team-specific layout styles | — |

### Account

| File | Purpose | See Also |
|------|---------|----------|
| `src/pages/account/Account.tsx` | User profile management (first name, last name via `auth.updateProfile()`) + change password form (`auth.changePassword()`). Loads profile via `auth.checkSession()` on mount. | [Auth & Teams](domain/auth-and-teams.md#reading-your-own-data) |
| `src/pages/account/Account.css` | Account page styles | — |

## CI/CD

| File | Purpose |
|------|---------|
| `.github/workflows/openwiki-update.yml` | GitHub Actions workflow: runs OpenWiki documentation update daily at 04:00 UTC, creates PR with changes |
| `AGENTS.md` / `CLAUDE.md` | Agent instruction files for OpenWiki documentation runs |

## Service Setup

| File | Purpose | See Also |
|------|---------|----------|
| `ulabase.setup.ts` | Declarative service configuration using `@ulabase/cli`. Imports `environment.ts` to derive feature flags and configures accounts, OAuth, and origin allowlist. | [Service Setup](operations/service-setup.md#base-setup-file-ulabasesetupts) |
| `ulabase.setup.consents.ts` | Extends `ulabase.setup.ts` with consents gate: adds user schema, permission for consents patching, JWT claims, and guards rule. Defines `TOS_VERSION` and `PP_VERSION` constants. | [Service Setup](operations/service-setup.md#consents-gate-setup-ulabasesetupconsentsts), [Auth & Teams](domain/auth-and-teams.md) |

## Consents Gate

| File | Purpose | See Also |
|------|---------|----------|
| `src/consents-signal.ts` | Client-side consents signal: manages `blocked` state flag, provides `subscribe()` for listeners, and `consentsOnError()` that sets blocked on HTTP 451 from the API. | [Auth & Teams](domain/auth-and-teams.md) |
| `src/ConsentsGate.tsx` | Blocking overlay component that replaces the app when user hasn't accepted current Terms/Privacy Policy. Sits above the router, renders acceptance form with checkboxes, calls `auth.acceptConsents()` and refreshes session. | [Auth & Teams](domain/auth-and-teams.md) |
| `src/ConsentsGate.css` | Styles for consents overlay: fixed positioning, z-index above header/dropdown/nav, modal card with checkboxes and action buttons. | — |
