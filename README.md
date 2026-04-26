# App Factory

App Factory is a pnpm monorepo for Farcaster Mini Apps. It provides a reusable app template, shared Farcaster metadata helpers, validation scripts, and a starter `hello-miniapp` built with Next.js App Router, React, Tailwind, Zod, Vitest, and `@farcaster/miniapp-sdk`.

## Quick Start

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm validate:miniapp hello-miniapp
pnpm catalog
```

## Create a Mini App

```bash
pnpm create:miniapp my-music-app --name "My Music App" --category music
pnpm validate:miniapp my-music-app
pnpm catalog
```

Each app owns its runtime config in `apps/<slug>/app/config.ts`. Apps may also expose a compatibility entrypoint at `apps/<slug>/miniapp.config.ts` that re-exports the same config for tools that expect a root-level Mini App config. Public assets live in `apps/<slug>/public/assets`, with optional root aliases in `apps/<slug>/public`.

## Workspace Layout

- `apps/hello-miniapp`: starter Farcaster Mini App.
- `packages/farcaster`: typed config schema and Mini App helper functions.
- `packages/ui`: small shared React UI components.
- `packages/testing`: testing fixtures and helpers.
- `scripts`: scaffolding, validation, listing, and catalog generation.
- `docs`: Mini App template, deployment notes, and Snap handoff guidance.
