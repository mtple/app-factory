import type { Metadata, Viewport } from "next";
import { buildMiniAppMetaTag, type MiniAppConfig } from "@app-factory/farcaster";
import { helloMiniAppConfig } from "../app/config";

export function buildHelloMiniAppMetadata(config: MiniAppConfig = helloMiniAppConfig): Metadata {
  const miniappMeta = buildMiniAppMetaTag(config);

  return {
    title: config.name,
    description: config.description,
    other: {
      [miniappMeta.name]: miniappMeta.content
    }
  };
}

export function buildHelloMiniAppViewport(config: MiniAppConfig = helloMiniAppConfig): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    themeColor: config.splashBackgroundColor
  };
}

export const helloMiniAppMetadata = buildHelloMiniAppMetadata();
export const helloMiniAppViewport = buildHelloMiniAppViewport();
