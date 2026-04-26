import type { MiniAppConfig } from "./config";
import type { MiniAppEmbed, MiniAppMetaTag } from "./types";
import { absoluteUrl } from "./url";

export function buildMiniAppEmbed(config: MiniAppConfig): MiniAppEmbed {
  return {
    version: "next",
    imageUrl: absoluteUrl(config.baseUrl, config.embedImagePath),
    button: {
      title: config.embedButtonTitle,
      action: {
        type: "launch_miniapp",
        name: config.name,
        url: absoluteUrl(config.baseUrl, config.homePath),
        splashImageUrl: absoluteUrl(config.baseUrl, config.splashImagePath),
        splashBackgroundColor: config.splashBackgroundColor
      }
    }
  };
}

export function buildMiniAppMetaTag(config: MiniAppConfig): MiniAppMetaTag {
  return {
    name: "fc:miniapp",
    content: JSON.stringify(buildMiniAppEmbed(config))
  };
}

export function buildMiniAppMetadata(config: MiniAppConfig): Record<MiniAppMetaTag["name"], string> {
  const meta = buildMiniAppMetaTag(config);
  return { [meta.name]: meta.content };
}
