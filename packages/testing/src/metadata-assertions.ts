import {
  buildFarcasterManifest,
  buildMiniAppEmbed,
  type FarcasterManifest,
  type MiniAppConfig,
  type MiniAppMetaTag
} from "@app-factory/farcaster";

export function parseMiniAppMetaTag(meta: MiniAppMetaTag) {
  return JSON.parse(meta.content) as ReturnType<typeof buildMiniAppEmbed>;
}

export function assertMiniAppMetaTag(meta: MiniAppMetaTag, config: MiniAppConfig): void {
  const actual = parseMiniAppMetaTag(meta);
  const expected = buildMiniAppEmbed(config);

  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error("Mini App metadata does not match the expected embed payload.");
  }
}

export function assertFarcasterManifest(manifest: FarcasterManifest, config: MiniAppConfig): void {
  const expected = buildFarcasterManifest(config);

  if (JSON.stringify(manifest) !== JSON.stringify(expected)) {
    throw new Error("Farcaster manifest does not match the expected config-derived manifest.");
  }
}
