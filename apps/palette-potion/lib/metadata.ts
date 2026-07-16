import type { Metadata, Viewport } from "next";
import { buildWebMetadata, type MiniAppConfig } from "@app-factory/farcaster";
import { palettePotionConfig } from "../app/config";

export function buildPalettePotionMetadata(config: MiniAppConfig = palettePotionConfig): Metadata {
  return {
    title: config.name,
    description: config.description,
    other: buildWebMetadata(config)
  };
}

export function buildPalettePotionViewport(config: MiniAppConfig = palettePotionConfig): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    themeColor: config.splashBackgroundColor
  };
}

export const palettePotionMetadata = buildPalettePotionMetadata();
export const palettePotionViewport = buildPalettePotionViewport();
