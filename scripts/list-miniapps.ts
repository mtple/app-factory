import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

export async function listMiniApps(rootDir = process.cwd()): Promise<string[]> {
  const appsDir = path.join(rootDir, "apps");
  if (!existsSync(appsDir)) {
    return [];
  }

  const entries = await readdir(appsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const apps = await listMiniApps();
  for (const app of apps) {
    console.log(app);
  }
}
