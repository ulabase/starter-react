---
type: Runbook
title: Operations & Runbook
description: Environment configuration, design system and styling, build and deploy workflow, theming, feature flag management, and consents gate operations for the Ulabase React starter.
tags: [operations, runbook, config, styling, build, deploy, theming, consents, gate]
sources:
  - id: openwiki-source-85dc2a049a0943b56218c045
    resource: repo://public/privacy.html
  - id: openwiki-source-ad504d4d06a9b4cc6851d32b
    resource: repo://public/terms.html
  - id: openwiki-source-a3fd7ec517783a7d5d8842d0
    resource: repo://src/consents-signal.ts
  - id: openwiki-source-eaae96b81373abab97667f4f
    resource: repo://src/environments/environment.ts
  - id: openwiki-source-d246777daf29ea6fdf9f8b53
    resource: repo://src/pages/shell/Shell.tsx
  - id: openwiki-source-146419bb9b2415894a6bd677
    resource: repo://src/styles.css
  - id: openwiki-source-c1d5327fe44e08cda82fcf83
    resource: repo://ulabase.setup.consents.ts
generated: { by: "openwiki/0.6.1", at: "2026-10-01T12:12:11.534Z" }
verified:
  - by: openwiki/0.6.1
    at: 2026-10-01T12:12:11.534Z
---

# Operations & Runbook

## Environment Configuration

**File:** `src/environments/environment.ts`

This is the single configuration file for the starter. It contains:

```typescript
export const environment = {
  apiUrl: '',
  features: {
    emailRegistration: true,
    passwordReset: true,
    oauthLogin: false, // Google sign-in: off until you create its OAuth client
    oauthProviders: ['google'] as const,
    teamInvitations: true,
  },
};
```

### apiUrl

Must be a valid Ulabase service URL (`https://<id>.ulabase.app`). The app validates this on startup with `isValidApiBaseUrl()` from `@ulabase/kit-react`. If invalid or empty, a ConfigPage is shown instead of the app.

**After cloning**, tell git to ignore local changes:

```bash
git update-index --assume-unchanged src/environments/environment.ts
```

Then edit the file to point to your own service.

### Feature Flags

See [Auth & Teams — Feature Flags](../domain/auth-and-teams.md#feature-flags) for the complete reference. These must match your Ulabase service's toggles.

## Design System

**File:** `src/styles.css`

The stylesheet is structured in five sections, all clearly marked with comments:

| Section | Content |
|---------|---------|
| 1. Design tokens | CSS custom properties — the single source of color, type, space, and shape |
| 2. Reset & base | Minimal reset and base element styles |
| 3. Skin classes | Component classes (`.card`, `.btn-primary`, `.form-field`, `.auth-page`, etc.) |
| 4. Utility classes | Helpers (`.muted`, `.eyebrow`, `.field-error`, etc.) |
| 5. Page scaffolds | Layout scaffolds for specific page types |

### Design Tokens

All colors, spacing, and typography flow from CSS custom properties in `:root`. Key tokens:

```css
--color-primary: #f8a839;       /* Ulabase amber — primary actions */
--color-link: #1f6f54;          /* Teal — links and success */
--color-bg: #f4f6f8;            /* Page background */
--color-surface: #ffffff;       /* Card/surface background */
--color-text: #14171c;          /* Primary text */
--color-text-muted: #656d7a;    /* Secondary text */
```

### The "Blueprint" Design Language

The default skin is deliberately a **mockup**, not a finished product:

- Flat, crisp surfaces — borders and typography carry the design
- Squared-off radii with a faint dot grid (drafting-sheet aesthetic)
- Small uppercase monospace for UI chrome (labels, back links)
- One accent (amber) for primary actions, teal for links/success

### Two Ways to Customize

1. **Tweak it** — change tokens in section 1, skin classes in section 3
2. **Replace it** — adopt Material / Tailwind / your own: delete sections 3–5 and reskin using the stable vocabulary of semantic class hooks (`.card`, `.btn-primary`, `.form-field`, etc.)

## Theming

**File:** `src/pages/shell/Shell.tsx` (contains `useTheme()` hook)

Light/dark mode is implemented as a hook in the Shell component:

```typescript
const STORAGE_KEY = 'rh-theme';

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const toggle = useCallback(() => {
    setDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return { dark, toggle };
}
```

- Preference is persisted to `localStorage` under key `rh-theme`
- Toggling adds/removes the `dark` class on `<html>`
- Override tokens for `.dark` in `styles.css` to implement dark mode colors

The toggle button is in the user avatar dropdown menu in the Shell header.

## Build & Deploy

### Development

```bash
npm install
npm run dev      # Vite dev server with HMR
```

### Production Build

```bash
npm run build    # Runs tsc -b (type checking) then vite build
npm run preview  # Serve dist/ locally for testing
```

The build produces static files in `dist/`. Deploy this directory to any static hosting (Netlify, Vercel, Cloudflare Pages, S3+CloudFront, etc.).

### CI/CD

**File:** `.github/workflows/openwiki-update.yml`

A GitHub Actions workflow runs OpenWiki documentation updates on a schedule. This does not affect the application build.

## Page-Specific Stylesheets

Each page directory under `src/pages/` contains its own CSS file (e.g., `Shell.css`, `Teams.css`, `Account.css`). These hold **page-specific layout only** — all design tokens and shared styles live in `src/styles.css`.

## Consents Gate Operations

The consents gate blocks authenticated users who have not accepted the current Terms of Service and Privacy Policy. When a user's `latestConsents.tos` or `latestConsents.pp` does not match the server's current versions, the service responds with `451 Unavailable For Legal Reasons` to any authenticated request (including `/users/me`).

### Verifying the Gate

The gate is working correctly when:
1. A user who has not accepted the current versions receives `451` on `/users/me` (or any authenticated endpoint except auth/token paths)
2. After accepting, the user's requests succeed normally
3. The `consents-signal.ts` client module raises the `blocked` flag on `451` responses, triggering the acceptance overlay

### Bumping Versions

When you publish new Terms of Service or Privacy Policy documents:

1. **Edit the version strings** in `ulabase.setup.consents.ts`:
   ```typescript
   const TOS_VERSION = '2026-07-01';  // Update to new date
   const PP_VERSION = '2026-07-01';   // Update to new date
   ```

2. **Update the HTML files** to match:
   - `public/terms.html` — line 59: `<p class="version">Version 2026-07-01</p>`
   - `public/privacy.html` — line 59: `<p class="version">Version 2026-07-01</p>`

3. **Re-run the setup** to push the new versions to the service:
   ```bash
   ulabase setup --srv <srvId> --file ulabase.setup.consents.ts
   ```

4. **Verify the gate** — after setup, all users will be blocked until they accept the new versions. The acceptance overlay will appear on their next request.

### Version Drift

If the versions in `ulabase.setup.consents.ts` do not match the HTML files, or if the server's Guards rule has different versions than the ACL permission's `mergeRequest`, users will be permanently blocked. The acceptance dialog will appear to succeed (no error), but the server will stamp one version while comparing against another, and the user remains blocked indefinitely.

**Prevention:** Always update all three locations together:
- `TOS_VERSION` and `PP_VERSION` in `ulabase.setup.consents.ts`
- Version lines in `public/terms.html` and `public/privacy.html`

**Diagnosis:** If users report being stuck after accepting, check:
1. The Guards rule condition in the Ulabase console
2. The ACL permission's `mergeRequest` in the Ulabase console  
3. Ensure both use identical version strings

## See Also

- [Architecture Overview](../architecture/overview.md) — component tree and config gating
- [Auth & Teams](../domain/auth-and-teams.md) — feature flag definitions
- [Testing Guidance](../testing/guidance.md) — running tests
