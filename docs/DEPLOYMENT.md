# Deployment

The starter app is ready for Vercel.

1. Set the app root to `apps/<slug>`.
2. Use pnpm install and the app build command.
3. Set `NEXT_PUBLIC_BASE_URL` to the public HTTPS origin.
4. Fill account association values when the Farcaster account association has been created.
5. Run `pnpm validate:miniapp <slug> --production` before publishing.

The manifest is served from `/.well-known/farcaster.json`.
