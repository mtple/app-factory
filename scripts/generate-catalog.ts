import { writeFile } from "node:fs/promises";
import path from "node:path";
import { buildFarcasterManifest } from "@app-factory/farcaster";
import { listMiniApps } from "./list-miniapps";
import { validateMiniApp } from "./validate-miniapp";

export async function generateCatalog(rootDir = process.cwd()) {
  const slugs = await listMiniApps(rootDir);
  const apps = [];

  for (const slug of slugs) {
    const result = await validateMiniApp(slug, { rootDir });
    if (!result.ok || !result.config) {
      throw new Error(`Cannot catalog invalid mini app "${slug}": ${result.errors.join("; ")}`);
    }

    apps.push({
      slug,
      name: result.config.name,
      subtitle: result.config.subtitle,
      description: result.config.description,
      primaryCategory: result.config.primaryCategory,
      baseUrl: result.config.baseUrl,
      manifest: buildFarcasterManifest(result.config).miniapp
    });
  }

  const catalog = {
    generatedAt: new Date().toISOString(),
    apps
  };

  await writeFile(path.join(rootDir, "miniapp-catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);
  return catalog;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateCatalog()
    .then((catalog) => {
      console.log(`Generated miniapp-catalog.json with ${catalog.apps.length} app(s).`);
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    });
}
