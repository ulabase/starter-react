---
type: Guide
title: Ulabase Starter — React Quickstart
description: Quickstart guide for the Ulabase React starter. Covers what the repo provides, how to set it up (basic or with the consents gate), and where to find documentation on architecture, domain logic, operations, and testing.
tags: [quickstart, react, ulabase, starter]
verified:
  - by: openwiki/0.7.2
    at: 2026-10-28T14:05:51.205Z
sources:
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-23775c3de52f3ab95a13cb8b
    resource: repo://README.md
  - id: openwiki-source-a3fd7ec517783a7d5d8842d0
    resource: repo://src/consents-signal.ts
  - id: openwiki-source-eaae96b81373abab97667f4f
    resource: repo://src/environments/environment.ts
  - id: openwiki-source-218c8734c88d36610ad967a5
    resource: repo://src/pages/auth/oauth-buttons/OAuthButtons.tsx
  - id: openwiki-source-25246136842acdbaf0ab42fd
    resource: repo://src/pages/invitations/accept/Accept.tsx
  - id: openwiki-source-d246777daf29ea6fdf9f8b53
    resource: repo://src/pages/shell/Shell.tsx
  - id: openwiki-source-1fbe522af6db54c1e9016bae
    resource: repo://src/pages/teams/new/NewTeam.tsx
  - id: openwiki-source-d5277d8efe8978259c7811b5
    resource: repo://src/pages/teams/Teams.tsx
  - id: openwiki-source-07aa4341cebe71bfc8fd2890
    resource: repo://src/routes.tsx
  - id: openwiki-source-c1d5327fe44e08cda82fcf83
    resource: repo://ulabase.setup.consents.ts
  - id: openwiki-source-34f568b222540eb11aa44859
    resource: repo://ulabase.setup.ts
generated: { by: "openwiki/0.7.2", at: "2026-10-28T14:05:51.205Z" }
---

# Ulabase Starter — React Quickstart

A React app with sign-up, login, Google and GitHub sign-in, email verification, password reset,
teams and invitations — working, not sketched. Clone it, point it at a free
[Ulabase](https://ulabase.com) service, and you have the boring half of an
application already done.

Works for multi-tenant SaaS (invitations, teams) and simpler apps (auth only).
There is no server of yours to write, deploy, or pay for.

## What's Included

- **Signup, login, logout** — email/password and OAuth sign-in (Google is provisioned by setup; the UI also knows GitHub)
- **Email verification, password reset**
- **Team invitations** — one page (`/invitations/accept`) branching into a new-user "set password" form (calls `auth.activate()`) or an existing-user "log in and accept" form
- **Teams** — list, create, and detail pages (members, invitations, settings); opening a team on `/teams` switches the active team via `auth.switchTeam()`
- **Consents gate** — optional server-side enforcement: users must accept Terms of Service and Privacy Policy before using the app (status `451` from a Guards rule)
- **Authenticated shell** with placeholder for your app content
- **Lazy-loaded routes** with code splitting

## Quick Setup

Two paths, one app. Choose based on whether you need the consents gate.

```mermaid
flowchart TD
    A["Clone & npm install"] --> B["Edit environment.ts"]
    B --> C{"Need consents gate?"}
    C -- No --> D["ulabase setup --srv id"]
    C -- Yes --> E["ulabase setup --srv id --file ulabase.setup.consents.ts"]
    D --> F["npm run dev"]
    E --> F
```

The two setup paths through the Ulabase CLI. Both are idempotent check-then-apply.

### Prerequisites

1. A **free Ulabase service** — [create one at ulabase.com](https://ulabase.com).
2. [Node.js](https://nodejs.org) 22.18 or later (it runs the TypeScript setup file).

### 1. Clone and install

```bash
git clone https://github.com/ulabase/starter-react.git
cd starter-react
npm install
```

### 2. Point to your service

Create a free service at [ulabase.com](https://ulabase.com). Its id is the six characters at
the start of its URL — that is the `<srvId>` below.

The app reads its service URL from `src/environments/environment.ts`:

```ts
apiUrl: 'https://xxxxxx.ulabase.app',
```

`ulabase setup` writes that line for you (its final step rewrites only the `apiUrl` line).
If you paste the URL in yourself, keep the local edit out of `git status` with:

```bash
git update-index --assume-unchanged src/environments/environment.ts
```

> Use the URL of **your service**, not `api.ulabase.com`. That second one is Ulabase's own
> control panel, and pointing the app at it makes every request fail.

### 3. Set the service up

The app needs things of its service: the accounts feature installed, sign-up and password reset
switched on, your origin allowed to call it. The `ulabase` CLI puts them there from a setup file
in this repo, so there is no console checklist to follow.

```bash
npm install -g ulabase
ulabase login                              # paste a token from ulabase.com
ulabase setup --srv <srvId>                # uses ulabase.setup.ts by default
```

`<srvId>` is the six-character id of your service — the first label of its URL. Every step is a
check and an apply, so running it twice writes nothing. `--dry-run` tells you what a service is
missing without touching it.

**What `ulabase.setup.ts` does:**

| Step | Effect |
|------|--------|
| Accounts feature installed | Installs the `accounts` feature if missing (an "already installed" 409 counts as success) |
| Branding carries the app name | Sets `branding.name` to `APP_NAME` (default `Ulabase Starter`) — shown on the sign-in page and in the service's emails; the rest of the branding config is preserved |
| Accounts configured to match the app | Derives the server toggles from `environment.ts` (`registration` and `verification` from `emailRegistration`, `password-reset`, `invitations`, `oauth`) and sets `frontend-url` / `frontend-app-url` to `APP_URL` (default `http://localhost:5173`) |
| Google OAuth credentials | When `oauthLogin` is on and `google` is in `oauthProviders`, ensures `client-id` and `client-secret` are set (read from `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` only when the service does not already hold them) |
| App origin allowed | Installs `origin-allowlist` and adds the app URL to `allowed-origins` (added, never replaced) |
| App points at the service | Rewrites only the `apiUrl` line in `src/environments/environment.ts` with the service URL — last on purpose, so a half-finished setup still shows the config screen |

Feature flags in `environment.ts` are the single source of truth — the setup reads them and
configures the service to match. Re-running after changing flags keeps the two in sync.

#### Optional: add the consents gate

Want users to accept Terms of Service and a Privacy Policy before they can use the app? Use the
consents setup file instead:

```bash
ulabase setup --srv <srvId> --file ulabase.setup.consents.ts
```

This imports all steps from `ulabase.setup.ts` — except `appPointsAtService`, which it re-runs
last so the app is pointed at the service only after the gate is in place — and appends the
gate's documents. The two versions the gate demands live in one place: `TOS_VERSION` and
`PP_VERSION` constants at the top of the file (both `'2026-07-01'` in the starter). Bumping
them and re-running the setup re-publishes the rule.

| Step | Effect |
|------|--------|
| User schema stored | Stores `userConsentsSchema`, allowing `latestConsents` and `consents` fields on the user document |
| Users collection validated | Binds the schema to `/users` via `jsonSchema.schemaId` |
| Consent permission | Grants `user` role a scoped `PATCH /users/{userId}` for consents only, with a `mergeRequest` that stamps `latestConsents` and pushes onto the `consents` history server-side |
| JWT claims | Adds `latestConsents/tos` and `latestConsents/pp` to the `auth` feature's `account-properties-claims` (added, not replaced) so the Guards rule can read them from the token |
| Guards feature installed | Installs the `guards` feature if missing |
| Guards rule | Blocks authenticated users with `451` when either version does not match — excludes `/auth`, `/token`, and the acceptance PATCH |

The rule deliberately does **not** exempt `/users/me`: blocking that read is what makes the gate
work with no probing on the client's side. Without this file, no request is ever answered `451`,
so the consents overlay never renders. The app carries the client code either way — an unasked
question is the absence of a rule on the server, not a flag in the client.

Either way, replace `public/terms.html` and `public/privacy.html` — they are placeholders.

For a full walkthrough of the consents gate (server-side enforcement, client-side overlay,
version management), see [Auth & Teams](domain/auth-and-teams.md) and
[Service Setup](operations/service-setup.md).

### 4. Start it

```bash
npm run dev
```

Sign up, check your inbox, and you are in.

### NPM Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check (`tsc -b`) then produce `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run tests with Vitest |

## Feature Flags

The `environment.ts` file contains feature flags that control which routes and UI elements are
available. These flags must match your service's *Sign-up Mgmt → Features* toggles.

| Flag | Default | Effect |
|------|---------|--------|
| `emailRegistration` | `true` | Enables the signup route (also enabled by `oauthLogin`) and email verification |
| `passwordReset` | `true` | Enables forgot/reset password routes |
| `oauthLogin` | `false` | Enables OAuth login buttons for the listed providers |
| `oauthProviders` | `['google']` | Array of OAuth providers to display |
| `teamInvitations` | `true` | Enables team invitation acceptance route |

**Google sign-in, when you want it.** The app starts with email and password, so it runs
without any Google setup. To add the Google button:

1. In the Google Cloud console, create an OAuth client of type *Web application* with this
   redirect URI: `https://<srvId>.ulabase.app/auth/oauth/callback/google`.
2. In `src/environments/environment.ts`, set `oauthLogin: true` (`oauthProviders` already lists `google`).
3. Run the setup again with the client's credentials. They go to the service, never into the app:

```bash
GOOGLE_CLIENT_ID=… GOOGLE_CLIENT_SECRET=… ulabase setup --srv <srvId>
```

**Other providers (GitHub, …).** The UI renders one button per entry in `oauthProviders`
(`OAuthButtons` carries Google and GitHub icons and accepts any provider string), but
`ulabase.setup.ts` provisions **Google** credentials only. Adding `'github'` to
`oauthProviders` shows the button; GitHub's OAuth client credentials are not read by the setup
file and must be configured on the service itself.

## Project Structure

```
src/
  main.tsx                ← Entrypoint: RhAuthProvider + BrowserRouter
  App.tsx                 ← Fragment token capture + config gate
  routes.tsx              ← Route map with lazy loading and feature-flag gating
  ConfigPage.tsx          ← Shown when apiUrl is not a valid Ulabase service URL
  styles.css              ← Design tokens + the DISPOSABLE default skin
  just-signed-up.ts       ← Module-level flag for post-signup welcome
  oauth-url.ts            ← OAuth authorize URL builder
  consents-signal.ts      ← Module-level 451 flag (get/set/subscribe) + the onError handler that raises it
  ConsentsGate.tsx        ← The blocking overlay, mounted at the app root
  environments/
    environment.ts        ← apiUrl + feature flags
  ui/alert/               ← Shared feedback component
  pages/
    shell/                ← Authenticated frame: header, nav, user menu, theme toggle
    home/                 ← Getting-started showcase with feature flags grid and auth.api() demo — replace with your content
    auth/                 ← login, signup, verify, forgot/reset password, OAuth buttons
    invitations/accept/   ← One page, three flows (new user, logged-in, missing params)
    teams/                ← list, detail (members/invites/settings), new
    account/              ← Profile + change password
public/
  terms.html, privacy.html ← PLACEHOLDER legal documents — replace them
```

## Documentation Map

| If you want to know… | Go to |
|----------------------|--------|
| How the app is wired — bootstrap, auth provider, routing, fragment token capture, config gating, ConsentsGate placement | [Architecture Overview](architecture/overview.md) |
| What each source file does | [Source Map](source-map.md) |
| How authentication, teams, invitations, and the consents gate work end to end | [Auth & Teams](domain/auth-and-teams.md) |
| How `ulabase.setup.ts` and `ulabase.setup.consents.ts` configure the service, and how to re-run them | [Service Setup](operations/service-setup.md) |
| How to publish new Terms/Privacy versions, diagnose permanently-blocked users, and fix origin or feature-flag drift | [Operations Runbook](operations/runbook.md) |
| What to test with Vitest — and what the setup files' check/apply already covers | [Testing Guidance](testing/guidance.md) |

## Key Dependencies

| Package | Version | Role |
|---------|---------|------|
| `@ulabase/kit-react` | `^0.13.6` | Auth provider (`RhAuthProvider`), guards (`AuthGuard`, `PublicGuard`), `useAuth()` hook, token management |
| `@ulabase/cli` | `^0.13.6` | `ulabase` CLI for declarative service setup (`ulabase setup --srv <srvId>`) |
| `react` | `^18.3.0` | UI framework |
| `react-dom` | `^18.3.0` | React renderer for the web |
| `react-router-dom` | `^6.28.0` | Routing with `useRoutes`, lazy loading, nested routes |
| `vite` | `^6.0.0` | Build tool and dev server |
| `vitest` | `^2.0.0` | Test runner |

**Note:** `@ulabase/kit` (framework-agnostic API client) is a dependency of `@ulabase/kit-react`
and not listed directly in `package.json`.

## Something not working?

**Everything fails, and the console says the origin is not allowed.** The service only answers
pages it has been told about. Re-run `ulabase setup` after changing where the app is served from, or
add the origin under *Service → Origin Allowlist*.

**A page is missing and its link is gone.** The feature flags in `environment.ts` must match the
service's *Sign-up Mgmt → Features* toggles. `ulabase setup` reads the flags from that same file and
sets the service to match, so re-running it is usually the fix.

**`401` on a request you wrote yourself.** A plain `fetch` carries no session. Use `auth.api()`,
which attaches it — see [NOTES.md](../NOTES.md#reading-your-own-data).

**`ulabase` runs something about OpenShift.** A different, retired tool of the same name is first in
your `PATH`. `type -a ulabase` shows both.

## Backlog

- **No test files exist** — Vitest is configured but no `.test.ts` or `.spec.ts` files have been written. Source anchor: `package.json` → `"test": "vitest"`. Deferred because the project is in its initial commit phase.
- **Account page** (`pages/account/Account.tsx`) provides profile and password management — extend as needed.
- **Additional OAuth providers** — the UI can show a button for any provider in `oauthProviders`, but setup provisions Google credentials only; other providers need service-side configuration. See the Feature Flags section above.
