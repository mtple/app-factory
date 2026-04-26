# App Factory Agent Notes

This repository is a TypeScript monorepo for building Farcaster Mini Apps.

## Commands

- `pnpm install` installs workspace dependencies.
- `pnpm typecheck` runs TypeScript checks across the repo.
- `pnpm test` runs Vitest across packages and apps.
- `pnpm build` builds packages and apps through Turborepo.
- `pnpm validate:miniapp hello-miniapp` validates the hello app config for local development.
- `pnpm validate:miniapp hello-miniapp --production` additionally requires HTTPS public URLs.
- `pnpm catalog` regenerates `miniapp-catalog.json`.

## Conventions

- Mini app configs live in `apps/<slug>/app/config.ts`.
- Static mini app assets live in `apps/<slug>/public/assets`.
- Shared Farcaster metadata and manifest helpers live in `packages/farcaster`.
- Keep generated apps lightweight and dependency-minimal unless the app itself requires more.
- Do not commit secrets. Use `.env.example` for documented variables only.
