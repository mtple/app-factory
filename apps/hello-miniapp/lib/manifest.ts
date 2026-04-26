import { buildFarcasterManifest, type MiniAppConfig } from "@app-factory/farcaster";
import { helloMiniAppConfig } from "../app/config";

export function buildHelloMiniAppManifest(config: MiniAppConfig = helloMiniAppConfig) {
  return buildFarcasterManifest(config);
}

export const helloMiniAppManifest = buildHelloMiniAppManifest();
export { buildFarcasterManifest };
