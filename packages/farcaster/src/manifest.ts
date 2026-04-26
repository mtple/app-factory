import type { MiniAppConfig } from "./config";
import type { FarcasterManifest } from "./types";
import { absoluteUrl } from "./url";

export function buildFarcasterManifest(config: MiniAppConfig): FarcasterManifest {
  return {
    accountAssociation: config.accountAssociation,
    miniapp: {
      version: "1",
      name: config.name,
      subtitle: config.subtitle,
      description: config.description,
      primaryCategory: config.primaryCategory,
      homeUrl: absoluteUrl(config.baseUrl, config.homePath),
      iconUrl: absoluteUrl(config.baseUrl, config.iconPath),
      imageUrl: absoluteUrl(config.baseUrl, config.embedImagePath),
      buttonTitle: config.embedButtonTitle,
      splashImageUrl: absoluteUrl(config.baseUrl, config.splashImagePath),
      splashBackgroundColor: config.splashBackgroundColor,
      webhookUrl: absoluteUrl(config.baseUrl, config.webhookPath)
    }
  };
}

export const buildMiniAppManifest = buildFarcasterManifest;
