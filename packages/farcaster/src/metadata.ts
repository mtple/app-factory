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

export function buildWebMetadata(config: MiniAppConfig): Record<string, string> {
  const description = config.description ?? "";
  const ogImage = absoluteUrl(config.baseUrl, config.embedImagePath);
  const ogUrl = absoluteUrl(config.baseUrl, config.homePath);
  const miniAppMeta = buildMiniAppMetadata(config);

  return {
    ...miniAppMeta,
    "og:title": config.name,
    "og:description": description,
    "og:image": ogImage,
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:url": ogUrl,
    "og:type": "website",
    "og:site_name": config.name,
    "twitter:card": "summary_large_image",
    "twitter:title": config.name,
    "twitter:description": description,
    "twitter:image": ogImage
  };
}
