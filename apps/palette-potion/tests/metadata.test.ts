import { describe, expect, it } from "vitest";
import { buildMiniAppEmbed } from "@app-factory/farcaster";
import { palettePotionConfig } from "../app/config";
import { buildPalettePotionMetadata, palettePotionMetadata } from "../lib/metadata";

describe("palette potion metadata helpers", () => {
  it("builds Next metadata with the fc:miniapp embed", () => {
    const metadata = buildPalettePotionMetadata();
    const content = metadata.other?.["fc:miniapp"];

    expect(metadata.title).toBe(palettePotionConfig.name);
    expect(metadata.description).toBe(palettePotionConfig.description);
    expect(typeof content).toBe("string");
    expect(JSON.parse(content as string)).toEqual(buildMiniAppEmbed(palettePotionConfig));
  });

  it("includes full OG and Twitter metadata for a 1200x800 image", () => {
    const other = buildPalettePotionMetadata().other ?? {};

    expect(other["og:title"]).toBe(palettePotionConfig.name);
    expect(other["og:image"]).toMatch(/embed\.png$/);
    expect(other["og:image:width"]).toBe("1200");
    expect(other["og:image:height"]).toBe("800");
    expect(other["twitter:card"]).toBe("summary_large_image");
    expect(other["twitter:image"]).toMatch(/embed\.png$/);
  });

  it("exports the default metadata", () => {
    expect(palettePotionMetadata).toEqual(buildPalettePotionMetadata());
  });
});
