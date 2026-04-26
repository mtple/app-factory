import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

type CreateOptions = {
  slug: string;
  name: string;
  category: string;
};

function parseArgs(argv: string[]): CreateOptions {
  const slug = argv[0];
  if (!slug) {
    throw new Error('Usage: pnpm create:miniapp <slug> --name "My App" --category utility');
  }

  const nameIndex = argv.indexOf("--name");
  const categoryIndex = argv.indexOf("--category");

  return {
    slug,
    name: nameIndex >= 0 ? argv[nameIndex + 1] ?? "" : "",
    category: categoryIndex >= 0 ? argv[categoryIndex + 1] ?? "" : "utility"
  };
}

function toTitle(slug: string): string {
  return slug
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function slugToPackageName(slug: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Invalid slug "${slug}". Use lowercase letters, numbers, and hyphens.`);
  }

  return slug;
}

async function writeText(filePath: string, content: string) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

export async function createMiniApp(options: CreateOptions, rootDir = process.cwd()) {
  const slug = slugToPackageName(options.slug);
  const name = options.name || toTitle(slug);
  const category = options.category || "utility";
  const appDir = path.join(rootDir, "apps", slug);

  if (existsSync(appDir)) {
    throw new Error(`App already exists: apps/${slug}`);
  }

  await writeText(
    path.join(appDir, "package.json"),
    `${JSON.stringify(
      {
        name: slug,
        private: true,
        type: "module",
        scripts: {
          build: "next build",
          dev: "next dev",
          test: "vitest run --passWithNoTests",
          typecheck: "tsc -p tsconfig.json --noEmit"
        },
        dependencies: {
          "@app-factory/farcaster": "workspace:*",
          "@app-factory/ui": "workspace:*",
          "@farcaster/miniapp-sdk": "^0.3.0",
          next: "^16.2.4",
          react: "^19.2.5",
          "react-dom": "^19.2.5",
          zod: "^4.3.6"
        },
        devDependencies: {
          "@types/react": "^19.2.7",
          "@types/react-dom": "^19.2.3",
          autoprefixer: "^10.4.22",
          postcss: "^8.5.6",
          tailwindcss: "^3.4.17",
          typescript: "^6.0.3",
          vitest: "^4.1.5"
        }
      },
      null,
      2
    )}\n`
  );

  await writeText(
    path.join(appDir, "tsconfig.json"),
    `{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "incremental": true,
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "es2022"],
    "plugins": [{ "name": "next" }],
    "types": ["node", "vitest"]
  },
  "include": ["next-env.d.ts", "app/**/*.ts", "app/**/*.tsx", "next.config.mjs", "tailwind.config.ts"],
  "exclude": ["node_modules"]
}
`
  );

  await writeText(
    path.join(appDir, "next-env.d.ts"),
    `/// <reference types="next" />
/// <reference types="next/image-types/global" />
`
  );

  await writeText(
    path.join(appDir, "next.config.mjs"),
    `import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig = {
  turbopack: {
    root: repoRoot
  },
  transpilePackages: ["@app-factory/farcaster", "@app-factory/ui"]
};

export default nextConfig;
`
  );

  await writeText(
    path.join(appDir, "postcss.config.cjs"),
    `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
`
  );

  await writeText(
    path.join(appDir, "tailwind.config.ts"),
    `import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: []
};

export default config;
`
  );

  await writeText(
    path.join(appDir, "app", "config.ts"),
    `import { miniAppConfigSchema } from "@app-factory/farcaster";

export const ${slug.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase())}Config = miniAppConfigSchema.parse({
  slug: "${slug}",
  name: "${name}",
  subtitle: "A Farcaster Mini App",
  description: "${name} built with App Factory.",
  primaryCategory: "${category}",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  homePath: "/",
  iconPath: "/assets/icon.svg",
  splashImagePath: "/assets/splash.svg",
  splashBackgroundColor: "#0F172A",
  embedImagePath: "/assets/embed.svg",
  embedButtonTitle: "Open ${name.slice(0, 20)}",
  webhookPath: "/api/webhook",
  accountAssociation: null
});
`
  );

  await writeText(
    path.join(appDir, "app", "layout.tsx"),
    `import type { Metadata } from "next";
import { buildMiniAppMetaTag } from "@app-factory/farcaster";
import "./globals.css";
import { ${slug.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase())}Config as miniAppConfig } from "./config";

const meta = buildMiniAppMetaTag(miniAppConfig);

export const metadata: Metadata = {
  title: miniAppConfig.name,
  description: miniAppConfig.description,
  other: { [meta.name]: meta.content }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`
  );

  await writeText(
    path.join(appDir, "app", "page.tsx"),
    `import { Card } from "@app-factory/ui";
import { ${slug.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase())}Config as miniAppConfig } from "./config";
import { MiniAppShell } from "./client/MiniAppShell";

export default function HomePage() {
  return (
    <MiniAppShell>
      <main className="min-h-dvh bg-slate-50 px-5 py-8 text-slate-950">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
          <h1 className="text-2xl font-bold">{miniAppConfig.name}</h1>
          <Card>
            <p className="text-base leading-7 text-slate-700">{miniAppConfig.description}</p>
          </Card>
        </div>
      </main>
    </MiniAppShell>
  );
}
`
  );

  await writeText(
    path.join(appDir, "app", "client", "MiniAppShell.tsx"),
    `"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function MiniAppShell({ children }: { children: ReactNode }) {
  const readySentRef = useRef(false);

  useEffect(() => {
    if (readySentRef.current) return;
    readySentRef.current = true;
    void import("@farcaster/miniapp-sdk")
      .then(({ sdk }) => sdk.actions.ready())
      .catch(() => {
        readySentRef.current = false;
      });
  }, []);

  return <>{children}</>;
}
`
  );

  await writeText(
    path.join(appDir, "app", ".well-known", "farcaster.json", "route.ts"),
    `import { buildFarcasterManifest } from "@app-factory/farcaster";
import { ${slug.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase())}Config as miniAppConfig } from "../../config";

export function GET() {
  return Response.json(buildFarcasterManifest(miniAppConfig));
}
`
  );

  await writeText(
    path.join(appDir, "app", "api", "webhook", "route.ts"),
    `export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  return Response.json({ ok: true, receivedAt: new Date().toISOString(), body });
}
`
  );

  await writeText(
    path.join(appDir, "app", "globals.css"),
    `@tailwind base;
@tailwind components;
@tailwind utilities;
`
  );

  for (const asset of ["icon", "splash", "embed"]) {
    await writeText(
      path.join(appDir, "public", "assets", `${asset}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="48" fill="#0F172A"/><text x="256" y="284" text-anchor="middle" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="54" font-weight="700">${name}</text></svg>\n`
    );
  }

  return appDir;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createMiniApp(parseArgs(process.argv.slice(2)))
    .then((appDir) => {
      console.log(`Created ${path.relative(process.cwd(), appDir)}`);
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    });
}
