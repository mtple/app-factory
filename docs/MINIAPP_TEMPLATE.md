# Mini App Template

Create a new app with:

```bash
pnpm create:miniapp my-music-app --name "My Music App" --category music
```

The generated app includes:

- `app/config.ts` with the typed Mini App config, plus optional `miniapp.config.ts` re-export compatibility.
- `app/layout.tsx` with `fc:miniapp` metadata.
- `app/page.tsx` and `app/client/MiniAppShell.tsx`.
- `app/.well-known/farcaster.json/route.ts`.
- `app/api/webhook/route.ts`.
- `public/assets` SVG placeholders, with optional root-level public aliases for compatibility.
- `app/tests` Vitest coverage for config and routes.

Update the app copy, assets, and `baseUrl` before deploying.
