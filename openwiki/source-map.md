---
type: Source Map
title: Source Map
description: File-by-file inventory of the Ulabase React starter, mapping every repository file to its purpose and cross-referencing the wiki pages that explain it.
tags: [source-map, reference, files]
sources:
  - id: openwiki-source-da4c48207f961ff0d7aa1fff
    resource: repo://.github/openwiki-retry.mjs
  - id: openwiki-source-47f38fcb8c1752310057a5c1
    resource: repo://.github/workflows/no-service-url.yml
  - id: openwiki-source-6d4b4e707b8d60b6ccfa3425
    resource: repo://.github/workflows/openwiki-update.yml
  - id: openwiki-source-8037e2358a2c4f9b2c722a11
    resource: repo://AGENTS.md
  - id: openwiki-source-a2371d6362e5db4bc834ad03
    resource: repo://CLAUDE.md
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
  - id: openwiki-source-95bfccfd0c712f6e72040e0d
    resource: repo://src/main.tsx
  - id: openwiki-source-07aa4341cebe71bfc8fd2890
    resource: repo://src/routes.tsx
  - id: openwiki-source-c1d5327fe44e08cda82fcf83
    resource: repo://ulabase.setup.consents.ts
  - id: openwiki-source-34f568b222540eb11aa44859
    resource: repo://ulabase.setup.ts
generated: { by: "openwiki/0.7.2", at: "2026-10-28T14:05:51.205Z" }
verified:
  - by: openwiki/0.7.2
    at: 2026-10-28T14:05:51.205Z
---

# Source Map

Complete inventory of repository files. Each entry states what the file is for and links to the page where that area is explained in depth. A dash in the See Also column means the file carries no behaviour of its own beyond styles or type references.

## Root Config & Build

| File | Purpose | See Also |
|------|---------|----------|
| `package.json` | Project metadata, dependencies (`@ulabase/kit-react`, `react`, `react-dom`, `react-router-dom`), dev dependencies (`@ulabase/cli`, `@vitejs/plugin-react`, `typescript`, `vite`, `vitest`), and scripts `dev`, `build` (`tsc -b && vite build`), `preview`, `test`. | [Operations](operations/runbook.md) |
| `package-lock.json` | npm lockfile — do not edit manually. | — |
| `tsconfig.json` | TypeScript config: ES2020 target, ESNext modules, `moduleResolution: bundler`, `allowImportingTsExtensions`, `jsx: react-jsx`, `noEmit` (Vite compiles), `strict`, `noUnusedLocals`/`noUnusedParameters`. Includes only `src`. | — |
| `vite.config.ts` | Vite config: minimal — just the `@vitejs/plugin-react` plugin. | [Testing](testing/guidance.md) |
| `index.html` | SPA shell: `<div id="root">` and a single module script pointing at `/src/main.tsx`. | [Architecture](architecture/overview.md) |
| `.gitignore` | Ignores `node_modules`, `dist`, `tsconfig.tsbuildinfo`, `*.local`, `.DS_Store`. | [Operations](operations/runbook.md) |
| `LICENSE` | MIT license. | — |
| `README.md` | Human-facing introduction: what the starter contains, how to run it, and the Google sign-in walkthrough referenced by `environment.ts`. | [Quickstart](quickstart.md) |
| `NOTES.md` | Long-form design notes for the starter (rationale and sequencing of the setup work). Not consumed by the build. | [Quickstart](quickstart.md) |
| `starter-home-page.png` | Screenshot of the starter home page, referenced by the README. | — |
| `conversation_history/` | Empty directory; nothing is authored here. | — |

## Entrypoint & App Shell

| File | Purpose | See Also |
|------|---------|----------|
| `src/main.tsx` | React root creation. Renders `<StrictMode>` → `<BrowserRouter>` → `<RhAuthProvider config={{ apiBaseUrl: environment.apiUrl, onError: consentsOnError }}>` → `<App />`, and imports `styles.css`. Passing `onError` is what lets a `451` raise the consents flag. | [Architecture](architecture/overview.md) |
| `src/App.tsx` | Validates `environment.apiUrl` with `isValidApiBaseUrl()`, consumes the fragment token and `?flow=signup` marker on mount, then renders `ConfigPage` when the URL is invalid or the `useRoutes()` tree wrapped in `<ConsentsGate>`. | [Architecture](architecture/overview.md) |
| `src/ConfigPage.tsx` | Setup wizard shown when `apiUrl` is not a valid `https://` service URL. Three guided steps: create a free service at `ulabase.com`, run `npx ulabase login` and `npx ulabase setup --srv <id>` from this folder, then reload. | [Operations](operations/runbook.md) |
| `src/routes.tsx` | Route definitions as `RouteObject[]`: lazy-loaded page components inside `SuspenseWrapper`, `PublicGuard`/`AuthGuard` wrappers, and feature-flag conditional inclusion of signup, verify, forgot/reset-password and invitation routes. | [Auth & Teams](domain/auth-and-teams.md) |

## Environment & Utilities

| File | Purpose | See Also |
|------|---------|----------|
| `src/environments/environment.ts` | **Central config**: `apiUrl` (the Ulabase service URL, empty by default so the setup wizard shows) plus `features` (`emailRegistration`, `passwordReset`, `oauthLogin`, `oauthProviders`, `teamInvitations`). Read by the app, by `routes.tsx`, and by `ulabase.setup.ts`. | [Auth & Teams](domain/auth-and-teams.md), [Operations](operations/runbook.md) |
| `src/just-signed-up.ts` | Module-level boolean with `isJustSignedUp()`/`setJustSignedUp()`. Set when `?flow=signup` is seen during fragment-token capture; `Shell` reads it once and clears it. | [Auth & Teams](domain/auth-and-teams.md) |
| `src/oauth-url.ts` | `oauthUrl(provider)` builds `${environment.apiUrl}/auth/oauth/authorize/${provider}?noauthchallenge`. | [Auth & Teams](domain/auth-and-teams.md#oauth-login) |
| `src/vite-env.d.ts` | Vite client type reference (`/// <reference types="vite/client" />`). | — |

## Styling

| File | Purpose | See Also |
|------|---------|----------|
| `src/styles.css` | Global stylesheet: design tokens, reset/base styles, skin classes, utilities, page scaffolds. Explicitly a disposable default skin — replace or re-theme it. | [Operations](operations/runbook.md#design-system) |

Page-level stylesheets live next to their components: `src/pages/shell/Shell.css`, `src/pages/home/Home.css`, `src/pages/account/Account.css`, `src/pages/teams/Teams.css`, `src/pages/teams/new/NewTeam.css`, `src/pages/teams/detail/TeamDetail.css`, `src/pages/auth/oauth-buttons/OAuthButtons.css`, and `src/ConsentsGate.css`. Each is imported by its sibling component.

## UI Components

| File | Purpose | See Also |
|------|---------|----------|
| `src/ui/alert/Alert.tsx` | Shared feedback banner. Props: `type` ("error"/"success"), `children`, `onClose`, `dismissible?` (default `true`), `autoDismiss?` (default `4000` ms; `0` disables). Uses `.form-error`/`.success-msg` hooks with `alert`/`status` ARIA roles. | [Auth & Teams](domain/auth-and-teams.md) |

## Page Components

### Shell (Authenticated Frame)

| File | Purpose | See Also |
|------|---------|----------|
| `src/pages/shell/Shell.tsx` | Authenticated layout: header with the active team name, nav links, avatar dropdown (profile, account, theme toggle, logout), `<Outlet>` for child routes. Owns the `useTheme()` hook persisting light/dark to `localStorage` under `rh-theme`. | [Operations](operations/runbook.md#theming) |
| `src/pages/shell/Shell.css` | Shell layout and header/menu styles. | — |

### Home

| File | Purpose | See Also |
|------|---------|----------|
| `src/pages/home/Home.tsx` | Getting-started page: welcome hero, feature-flag status grid derived from `environment.features` with links to team/account pages, customization guide, and an interactive `auth.api('/demo')` fetch demo. Also the catch-all route element. | [Auth & Teams](domain/auth-and-teams.md) |
| `src/pages/home/Home.css` | Home page styles. | — |

### Auth Pages

| File | Purpose | See Also |
|------|---------|----------|
| `src/pages/auth/login/Login.tsx` | Email/password login with touched-based validation. Shows `OAuthButtons` when `oauthLogin` is enabled and maps the `error` search param (`invalid_token`) to a message. Navigates to `/` on success; distinguishes 401. | [Auth & Teams](domain/auth-and-teams.md#login) |
| `src/pages/auth/signup/Signup.tsx` | Registration form (first name, last name, email, password ≥ 8). Derives a team name from the first name and calls `auth.register()`. Shows a "check your email" confirmation and maps 409 to a duplicate-email message. | [Auth & Teams](domain/auth-and-teams.md#signup) |
| `src/pages/auth/verify/Verify.tsx` | Email verification. Reads `email`, `token`, `error` from the query string, calls `auth.verify()` and redirects to the returned URL; handles missing params and expired links. | [Auth & Teams](domain/auth-and-teams.md#email-verification) |
| `src/pages/auth/forgot-password/ForgotPassword.tsx` | Requests a reset email via `auth.forgotPassword()`. Always shows the same confirmation, because the API answers 202 regardless of whether the address exists. | [Auth & Teams](domain/auth-and-teams.md#password-reset) |
| `src/pages/auth/reset-password/ResetPassword.tsx` | Sets a new password from the `email`/`token` query params via `auth.resetPassword()`; reports missing params and 401 expiry. | [Auth & Teams](domain/auth-and-teams.md#password-reset) |
| `src/pages/auth/oauth-buttons/OAuthButtons.tsx` | Renders one link per configured provider using `oauthUrl()`, with inline Google/GitHub icons and a `Continue with …` label. | [Auth & Teams](domain/auth-and-teams.md#oauth-login) |
| `src/pages/auth/oauth-buttons/OAuthButtons.css` | OAuth button styles. | — |

### Invitations

| File | Purpose | See Also |
|------|---------|----------|
| `src/pages/invitations/accept/Accept.tsx` | One page, three flows: missing params → error; new user → set password via `auth.activate()`; existing user → log in and accept. Loads the invitation with `auth.getInvitation()`. Not wrapped in a guard, so it works signed in or out. | [Auth & Teams](domain/auth-and-teams.md#invitations) |

### Teams

| File | Purpose | See Also |
|------|---------|----------|
| `src/pages/teams/Teams.tsx` | Team list. Loads teams with `auth.loadTeams()`, switches the active team via `auth.switchTeam()` when opening an inactive one, and links to team detail and new team. | [Auth & Teams](domain/auth-and-teams.md#team-management) |
| `src/pages/teams/Teams.css` | Team list styles. | — |
| `src/pages/teams/new/NewTeam.tsx` | Create-team form calling `auth.createTeam()`, then navigating to `/teams`. | [Auth & Teams](domain/auth-and-teams.md#team-management) |
| `src/pages/teams/new/NewTeam.css` | New-team form styles. | — |
| `src/pages/teams/detail/TeamDetail.tsx` | Full team management: member list with role change/remove (owner only), invite form, pending invitations with a 5-minute resend cooldown (`RESEND_COOLDOWN_MS`), team name/description settings, and delete with confirmation. | [Auth & Teams](domain/auth-and-teams.md) |
| `src/pages/teams/detail/TeamDetail.css` | Team detail styles. | — |

### Account

| File | Purpose | See Also |
|------|---------|----------|
| `src/pages/account/Account.tsx` | Profile editing (`auth.updateProfile()`, seeded from `auth.checkSession()` on mount) and password change (`auth.changePassword()`, new password ≥ 8). | [Auth & Teams](domain/auth-and-teams.md#reading-your-own-data) |
| `src/pages/account/Account.css` | Account page styles. | — |

## Consents Gate

| File | Purpose | See Also |
|------|---------|----------|
| `src/consents-signal.ts` | Client-side consents signal: module-level `blocked` flag with `isBlocked()`/`setBlocked()`/`subscribe()`, and `consentsOnError()` which raises the flag on any HTTP 451. Has no knowledge of which versions are current — the server decides. | [Auth & Teams](domain/auth-and-teams.md) |
| `src/ConsentsGate.tsx` | Blocking overlay rendered above the router. Shows the two acceptance checkboxes, calls `auth.acceptConsents()`, then reloads the app (`/` when the block happened on an `/auth` page) or refreshes the session. Also offers sign-out. User experience only — the rule lives on the server. | [Auth & Teams](domain/auth-and-teams.md) |
| `src/ConsentsGate.css` | Overlay styles: fixed positioning above header/dropdown/nav, modal card with checkboxes and actions. | — |
| `public/privacy.html` | Static Privacy Policy page linked from the acceptance form. Self-contained HTML with inline styles and the same theme toggle. | [Auth & Teams](domain/auth-and-teams.md) |
| `public/terms.html` | Static Terms of Service page linked from the acceptance form. Self-contained HTML with inline styles and the same theme toggle. | [Auth & Teams](domain/auth-and-teams.md) |

## Service Setup

| File | Purpose | See Also |
|------|---------|----------|
| `ulabase.setup.ts` | Base declarative service configuration for `@ulabase/cli`. Every step has a `check` and an `apply` so re-runs are idempotent. It imports `environment.ts` and derives the server's `registration`/`verification`/`password-reset`/`invitations`/`oauth` flags from the app's feature flags. Steps in order: install the `accounts` feature (a 409 "already installed" is tolerated as success), set the branding name from `APP_NAME`, sync `frontend-url`/`frontend-app-url` and the derived feature flags into the accounts config, add Google OAuth credentials only when the app offers Google (resolved from the environment at apply time), and add the app origin to `origin-allowlist` (added, never replaced, so a service reached from several origins keeps them all). Exports `appPointsAtService`, a final step that rewrites only the `apiUrl` line of `environment.ts`. | [Service Setup](operations/service-setup.md) |
| `ulabase.setup.consents.ts` | The same setup plus the consents gate. It imports `accounts` from `ulabase.setup.ts` and reuses `accounts.steps` (minus `appPointsAtService`), then adds six steps: store the user schema `userConsentsSchema` (compared canonically so an outdated schema shows as outstanding), attach it to the `/users` collection via the `/users/_meta` `jsonSchema.schemaId`, create the `userCanPatchOwnConsents` permission whose `mergeRequest` stamps `TOS_VERSION`/`PP_VERSION` and `@now` server-side, add the two `latestConsents/*` account claims to the auth config's `account-properties-claims`, install the `guards` feature, and install the `consentsGate` rule (status `451`, `on_error: allow`). Versions are constants, so publishing new terms means editing two strings and re-running. `appPointsAtService` runs last. | [Service Setup](operations/service-setup.md), [Auth & Teams](domain/auth-and-teams.md) |

## CI/CD

| File | Purpose |
|------|---------|
| `.github/workflows/no-service-url.yml` | Runs on pushes and PRs to `main` in `ulabase/starter-react` only. Greps `src/environments/*.ts` for a non-empty `apiUrl` and fails if one is committed, so no real service URL reaches the public starter. |
| `.github/workflows/openwiki-update.yml` | Refreshes the wiki nightly (cron `17 7 * * *`, 07:17 UTC — off the hour because GitHub delayed the earlier `0 3` schedule), on release tags, and on manual dispatch. Scheduled runs exit early when nothing outside `openwiki/`/`AGENTS.md`/`CLAUDE.md` has changed since the last wiki update; release and manual runs always proceed. It runs `openwiki code --init`/`--update` with the model pinned to DeepInfra only (`OPENWIKI_OPENROUTER_PROVIDER_ONLY=deepinfra`), injects `.github/openwiki-retry.mjs` via `NODE_OPTIONS --import` to back off 429s, opens a PR limited to `openwiki`, `AGENTS.md` and `CLAUDE.md`, then auto-merges it. |
| `.github/openwiki-retry.mjs` | Fetch wrapper preloaded into OpenWiki via `NODE_OPTIONS --import`. Retries OpenRouter `chat/completions` responses that come back `429` (DeepInfra's shared pool answers `429 engine_overloaded` without a `Retry-After`) with delays 30/60/120/240/480 s. Only replayable string bodies are retried; streams and `Request` objects are consumed by the first attempt and pass through untouched. |
| `AGENTS.md` | Agent instructions for OpenWiki runs: retrieve the wiki just-in-time rather than preloading it, treat source and tests as authoritative, and avoid hand-editing generated pages. |
| `CLAUDE.md` | One-line pointer that includes `AGENTS.md`, so both agent conventions stay in one place. |

## Relationship Between Files

- `src/environments/environment.ts` is the single source of truth for both sides: the app reads `apiUrl` and `features` at runtime, and `ulabase.setup.ts` imports the same module to derive server configuration. `ulabase.setup.ts` also rewrites the `apiUrl` line in place, so the file is both input and output of setup.
- `src/main.tsx` wires `consents-signal.ts` into the auth provider, and `src/App.tsx` positions `ConsentsGate` above the router — the two halves of the client gate.
- `src/routes.tsx` is the only place that maps URLs to the page components under `src/pages/`, and its conditional entries are driven by the same `features` object.
