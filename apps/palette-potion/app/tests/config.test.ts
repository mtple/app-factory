import { describe, expect, it } from "vitest";
import { palettePotionConfig } from "../config";

describe("palette potion config", () => {
  it("matches the app slug and uses required PNG assets", () => {
    expect(palettePotionConfig.slug).toBe("palette-potion");
    expect(palettePotionConfig.name.length).toBeLessThanOrEqual(32);
    expect(palettePotionConfig.embedButtonTitle.length).toBeLessThanOrEqual(32);
    expect(palettePotionConfig.iconPath).toBe("/assets/icon.png");
    expect(palettePotionConfig.splashImagePath).toBe("/assets/splash.png");
    expect(palettePotionConfig.embedImagePath).toBe("/assets/embed.png");
  });
});
