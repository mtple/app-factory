import type { Metadata, Viewport } from "next";
import { buildMiniAppMetaTag, type MiniAppConfig } from "@app-factory/farcaster";
import { claudeTestLabConfig } from "../app/config";

export function buildClaudeTestLabMetadata(config: MiniAppConfig = claudeTestLabConfig): Metadata {
  const miniappMeta = buildMiniAppMetaTag(config);

  return {
    title: config.name,
    description: config.description,
    other: {
      [miniappMeta.name]: miniappMeta.content
    }
  };
}

export function buildClaudeTestLabViewport(config: MiniAppConfig = claudeTestLabConfig): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    themeColor: config.splashBackgroundColor
  };
}

export const claudeTestLabMetadata = buildClaudeTestLabMetadata();
export const claudeTestLabViewport = buildClaudeTestLabViewport();
