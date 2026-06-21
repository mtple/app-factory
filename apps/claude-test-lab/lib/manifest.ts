import { buildFarcasterManifest, type MiniAppConfig } from "@app-factory/farcaster";
import { claudeTestLabConfig } from "../app/config";

export function buildClaudeTestLabManifest(config: MiniAppConfig = claudeTestLabConfig) {
  return buildFarcasterManifest(config);
}

export const claudeTestLabManifest = buildClaudeTestLabManifest();
export { buildFarcasterManifest };
