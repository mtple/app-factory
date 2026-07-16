import { describe, expect, it } from "vitest";
import { buildFarcasterManifest } from "@app-factory/farcaster";
import { palettePotionConfig } from "../app/config";
import { palettePotionManifest } from "../lib/manifest";

describe("palette potion manifest", () => {
  it("builds the manifest from config", () => {
    expect(palettePotionManifest).toEqual(buildFarcasterManifest(palettePotionConfig));
  });

  it("uses PNG assets", () => {
    expect(palettePotionManifest.miniapp.iconUrl).toMatch(/icon\.png$/);
    expect(palettePotionManifest.miniapp.imageUrl).toMatch(/embed\.png$/);
    expect(palettePotionManifest.miniapp.splashImageUrl).toMatch(/splash\.png$/);
  });
});
