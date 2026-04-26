import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { buildFarcasterManifest, miniAppConfigSchema, type MiniAppConfig } from "@app-factory/farcaster";

type ValidationResult = {
  ok: boolean;
  errors: string[];
  config?: MiniAppConfig;
};

function parseArgs(argv: string[]) {
  const slug = argv.find((arg) => !arg.startsWith("--"));
  return {
    slug,
    production: argv.includes("--production")
  };
}

async function loadConfig(rootDir: string, slug: string): Promise<MiniAppConfig> {
  const configPath = path.join(rootDir, "apps", slug, "app", "config.ts");
  if (!existsSync(configPath)) {
    throw new Error(`Missing config: apps/${slug}/app/config.ts`);
  }

  const mod = (await import(pathToFileURL(configPath).toString())) as Record<string, unknown>;
  const config = Object.values(mod).find((value) => {
    const result = miniAppConfigSchema.safeParse(value);
    return result.success;
  });

  if (!config) {
    throw new Error(`No valid MiniAppConfig export found in apps/${slug}/app/config.ts`);
  }

  return miniAppConfigSchema.parse(config);
}

function assetExists(rootDir: string, slug: string, assetPath: string): boolean {
  return existsSync(path.join(rootDir, "apps", slug, "public", assetPath.replace(/^\//, "")));
}

export async function validateMiniApp(
  slug: string,
  options: { production?: boolean; rootDir?: string } = {}
): Promise<ValidationResult> {
  const rootDir = options.rootDir ?? process.cwd();
  const errors: string[] = [];

  try {
    const config = await loadConfig(rootDir, slug);
    const parsed = miniAppConfigSchema.safeParse(config);

    if (!parsed.success) {
      errors.push(...parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`));
    }

    if (config.slug !== slug) {
      errors.push(`Config slug "${config.slug}" does not match requested slug "${slug}".`);
    }

    if (options.production && !config.baseUrl.startsWith("https://")) {
      errors.push("Production validation requires baseUrl to use HTTPS.");
    }

    for (const assetPath of [config.iconPath, config.splashImagePath, config.embedImagePath]) {
      if (!assetExists(rootDir, slug, assetPath)) {
        errors.push(`Missing public asset: ${assetPath}`);
      }
    }

    const manifest = buildFarcasterManifest(config);
    for (const [key, value] of Object.entries({
      homeUrl: manifest.miniapp.homeUrl,
      iconUrl: manifest.miniapp.iconUrl,
      imageUrl: manifest.miniapp.imageUrl,
      splashImageUrl: manifest.miniapp.splashImageUrl,
      webhookUrl: manifest.miniapp.webhookUrl
    })) {
      if (!/^https?:\/\//.test(value)) {
        errors.push(`Manifest ${key} is not absolute: ${value}`);
      }
    }

    return { ok: errors.length === 0, errors, config };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return { ok: false, errors };
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { slug, production } = parseArgs(process.argv.slice(2));

  if (!slug) {
    console.error("Usage: pnpm validate:miniapp <slug> [--production]");
    process.exit(1);
  }

  const result = await validateMiniApp(slug, { production });
  if (result.ok) {
    console.log(`Mini app "${slug}" is valid${production ? " for production" : ""}.`);
  } else {
    console.error(`Mini app "${slug}" failed validation:`);
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
  }
}
