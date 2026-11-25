/**
 * What Vite read from the .env file of the mode it runs in. Undefined outside Vite: the setup file
 * imports this module in Node, to read the feature flags, and there is no `import.meta.env` there.
 */
const viteEnv = import.meta.env as Record<string, string | undefined> | undefined;

export const environment = {
  // The address of your Ulabase service, e.g. 'https://<srvid>.ulabase.app'. It comes from
  // VITE_API_URL, which Vite reads from the file of the mode it runs in: .env.development for
  // `npm run dev`, .env.production for `npm run build`. `npx ulabase setup --srv <srvid>` writes
  // the first. Empty shows the "configure your service" screen.
  apiUrl: viteEnv?.VITE_API_URL ?? '',
  features: {
    emailRegistration: true,
    passwordReset: true,
    oauthLogin: false, // Google sign-in: off until you create its OAuth client (README, "Google sign-in")
    oauthProviders: ['google'] as const,
    teamInvitations: true,
  },
};
