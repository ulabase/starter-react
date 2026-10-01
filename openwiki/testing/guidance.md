---
type: Guide
title: Testing Guidance
description: Vitest setup, recommended test strategy, and how to run tests for the Ulabase React starter, including consents gate testing.
tags: [testing, vitest, guidance, consents]
verified:
  - by: openwiki/0.6.1
    at: 2026-10-01T12:12:11.534Z
sources:
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-a3fd7ec517783a7d5d8842d0
    resource: repo://src/consents-signal.ts
  - id: openwiki-source-9674080b0675d512256b80bc
    resource: repo://src/ConsentsGate.tsx
  - id: openwiki-source-eaae96b81373abab97667f4f
    resource: repo://src/environments/environment.ts
  - id: openwiki-source-440d3aa4e5dbdff8211c15e3
    resource: repo://src/just-signed-up.ts
  - id: openwiki-source-62327449da47479a80c27d31
    resource: repo://src/oauth-url.ts
  - id: openwiki-source-69233b952dc2ecb1c3d6e3c1
    resource: repo://src/pages/auth/forgot-password/ForgotPassword.tsx
  - id: openwiki-source-c9161dbd621f22e3073aa0a1
    resource: repo://src/pages/auth/login/Login.tsx
  - id: openwiki-source-bbbc426be9a626165e738dce
    resource: repo://src/pages/auth/reset-password/ResetPassword.tsx
  - id: openwiki-source-9b67846f4bc6291f7850560e
    resource: repo://src/pages/auth/signup/Signup.tsx
  - id: openwiki-source-25246136842acdbaf0ab42fd
    resource: repo://src/pages/invitations/accept/Accept.tsx
  - id: openwiki-source-07aa4341cebe71bfc8fd2890
    resource: repo://src/routes.tsx
  - id: openwiki-source-c1d5327fe44e08cda82fcf83
    resource: repo://ulabase.setup.consents.ts
  - id: openwiki-source-34f568b222540eb11aa44859
    resource: repo://ulabase.setup.ts
  - id: openwiki-source-5e1b077422a94ae165e88e4e
    resource: repo://vite.config.ts
generated: { by: "openwiki/0.6.1", at: "2026-10-01T12:12:11.534Z" }
---

# Testing Guidance

## Current Status

**No test files exist yet.** Vitest is configured as a dependency (`^2.0.0` in `devDependencies`) and the `npm test` script runs `vitest`, but there are no `.test.ts` or `.spec.ts` files in the repository.

> **Note**: The `src/environments/environment.ts` file still contains a RESTHeart Cloud comment reference. The product is Ulabase, and services live at `https://<id>.ulabase.app`. This is a source code issue that should be addressed separately.

## Vitest Setup

Vitest is already configured:

```json
// package.json
{
  "scripts": {
    "test": "vitest"
  },
  "devDependencies": {
    "vitest": "^2.0.0"
  }
}
```

The Vite config (`vite.config.ts`) is minimal — Vitest uses it automatically. No additional Vitest config file is needed to start.

## Recommended Test Strategy

### Unit Tests: Utilities

The simplest targets for initial tests:

| File | What to Test |
|------|-------------|
| `src/just-signed-up.ts` | `setJustSignedUp(true)` → `isJustSignedUp()` returns `true`; reset to `false` returns `false` |
| `src/oauth-url.ts` | `oauthUrl('google')` returns the correct URL pattern |
| `src/consents-signal.ts` | `setBlocked(true)` → `isBlocked()` returns `true`; subscribe/unsubscribe lifecycle; `consentsOnError` with 451 sets blocked, other statuses do not |

### Component Tests: Auth Pages

Auth pages have the most logic (form validation, error handling, loading states). Use Vitest + `@testing-library/react`:

| Component | Key Test Cases |
|-----------|---------------|
| `Login` | Renders email/password fields; shows validation errors on blur; handles 401 with specific message; calls `auth.login` on submit; shows OAuth buttons when `oauthLogin` is enabled |
| `Signup` | Form validation (first/last name, email, password min 8 chars); calls `auth.register()`; shows "Check your email" confirmation on success; handles 409 duplicate email; shows OAuth buttons when enabled |
| `Accept` | Missing params → error; new user flow → password form; existing user flow → login + accept; 404 → expired message |
| `ForgotPassword` | Submits email; shows success message |
| `ResetPassword` | Validates token from URL; submits new password |

### Component Tests: Consents Gate

Test the consents gate overlay and its integration with the signal system:

| Component | Key Test Cases |
|-----------|---------------|
| `ConsentsGate` | Overlay renders when blocked; checkboxes gate accept button; `acceptConsents()` call flow; sign-out clears blocked state |

Detailed test scenarios for `ConsentsGate`:

1. **Overlay rendering**: When `isBlocked()` returns `true`, the overlay replaces children with a blocking dialog
2. **Checkbox gating**: "I accept" button is disabled until both Terms of Service and Privacy Policy checkboxes are checked
3. **Acceptance flow**: Clicking "I accept" calls `auth.acceptConsents()`, then `auth.checkSession()`, then `setBlocked(false)`
4. **Error handling**: If `auth.acceptConsents()` throws, shows "We could not record your acceptance" error message
5. **Sign-out flow**: Clicking "Sign out" clears blocked flag and calls `auth.logout()`
6. **Busy state**: During acceptance, button shows "Saving…" and is disabled

### Integration Tests: Routing

Test that routes are correctly gated:

- Unauthenticated user visiting `/home` → redirected to `/auth/login` (via `AuthGuard`)
- Authenticated user visiting `/auth/login` → redirected to `/` (via `PublicGuard`)
- Feature flag `passwordReset: false` → `/auth/forgot-password` route not registered

### What to Avoid

- Don't test `@ulabase/kit-react` internals — the kit has its own tests
- Don't snapshot-test disposable skin CSS — the starter is designed to be reskinned
- Don't test Ulabase service-side Guards rule logic — covered by `ulabase.setup.consents.ts` and its check/apply idempotency

## Consents Flow Testing

The consents gate is a critical user flow that requires coordinated testing between the signal module and the UI component.

### Signal Module Tests (`src/consents-signal.ts`)

Test the pub/sub mechanism that translates 451 errors into blocked state:

```typescript
// Test setBlocked and isBlocked
it('setBlocked(true) makes isBlocked() return true', () => {
  setBlocked(false);
  expect(isBlocked()).toBe(false);
  setBlocked(true);
  expect(isBlocked()).toBe(true);
});

// Test subscribe/unsubscribe lifecycle
it('subscribe receives state changes and unsubscribe stops them', () => {
  const listener = vi.fn();
  const unsubscribe = subscribe(listener);
  
  setBlocked(true);
  expect(listener).toHaveBeenCalledWith(true);
  
  unsubscribe();
  setBlocked(false);
  expect(listener).toHaveBeenCalledTimes(1); // No second call
});

// Test consentsOnError only responds to 451
it('consentsOnError sets blocked only for 451 status', () => {
  setBlocked(false);
  
  consentsOnError({ status: 451, message: 'Unavailable' } as ApiError);
  expect(isBlocked()).toBe(true);
  
  setBlocked(false);
  consentsOnError({ status: 401, message: 'Unauthorized' } as ApiError);
  expect(isBlocked()).toBe(false);
});
```

### Component Tests (`src/ConsentsGate.tsx`)

Test the overlay UI and its interaction with the auth system:

1. **Mount behavior**: Component subscribes to `consents-signal` on mount
2. **Blocked state**: When blocked, renders overlay with checkboxes and buttons
3. **Unblocked state**: When not blocked, renders children unchanged
4. **Button gating**: Accept button disabled until both checkboxes checked
5. **Acceptance flow**: Mock `auth.acceptConsents()` and `auth.checkSession()`, verify sequence
6. **Error states**: Mock failures, verify error messages
7. **Sign-out**: Verify `setBlocked(false)` and `auth.logout()` are called

## Adding Tests

Create test files alongside source files using the `.test.ts` or `.test.tsx` convention:

```
src/
  just-signed-up.test.ts
  oauth-url.test.ts
  consents-signal.test.ts
  pages/
    auth/
      login/
        Login.test.tsx
    shell/
      Shell.test.tsx
```

Run tests:

```bash
npm test          # Watch mode (Vitest default)
npm test -- --run # Single run
```

## See Also

- [Architecture Overview](../architecture/overview.md) — understanding the component tree for test setup
- [Operations & Runbook](../operations/runbook.md) — build and dev workflow
- [Auth & Teams](../domain/auth-and-teams.md) — detailed consents flow and feature flag definitions
