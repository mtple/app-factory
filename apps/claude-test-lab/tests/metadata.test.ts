import { describe, expect, it } from "vitest";
import { buildMiniAppEmbed } from "@app-factory/farcaster";
import { claudeTestLabConfig } from "../app/config";
import { buildClaudeTestLabMetadata, claudeTestLabMetadata } from "../lib/metadata";

describe("claude test lab metadata helpers", () => {
  it("builds Next metadata with the fc:miniapp embed", () => {
    const metadata = buildClaudeTestLabMetadata();
    const content = metadata.other?.["fc:miniapp"];

    expect(metadata.title).toBe(claudeTestLabConfig.name);
    expect(metadata.description).toBe(claudeTestLabConfig.description);
    expect(typeof content).toBe("string");
    expect(JSON.parse(content as string)).toEqual(buildMiniAppEmbed(claudeTestLabConfig));
  });

  it("includes og:image pointing to embed.png", () => {
    const metadata = buildClaudeTestLabMetadata();
    const ogImage = metadata.other?.["og:image"];

    expect(typeof ogImage).toBe("string");
    expect(ogImage as string).toMatch(/embed\.png$/);
  });

  it("includes twitter:card as summary_large_image", () => {
    const metadata = buildClaudeTestLabMetadata();
    expect(metadata.other?.["twitter:card"]).toBe("summary_large_image");
  });

  it("includes fc:miniapp meta tag", () => {
    const metadata = buildClaudeTestLabMetadata();
    const fcMiniapp = metadata.other?.["fc:miniapp"];

    expect(typeof fcMiniapp).toBe("string");
    const parsed = JSON.parse(fcMiniapp as string);
    expect(parsed).toHaveProperty("version", "next");
  });

  it("includes full OG metadata", () => {
    const metadata = buildClaudeTestLabMetadata();
    const other = metadata.other ?? {};

    expect(other["og:title"]).toBe(claudeTestLabConfig.name);
    expect(other["og:description"]).toBe(claudeTestLabConfig.description);
    expect(other["og:image:width"]).toBe("1200");
    expect(other["og:image:height"]).toBe("630");
    expect(other["og:type"]).toBe("website");
    expect(other["og:site_name"]).toBe(claudeTestLabConfig.name);
  });

  it("includes Twitter Card metadata", () => {
    const metadata = buildClaudeTestLabMetadata();
    const other = metadata.other ?? {};

    expect(other["twitter:title"]).toBe(claudeTestLabConfig.name);
    expect(other["twitter:description"]).toBe(claudeTestLabConfig.description);
    expect(other["twitter:image"]).toMatch(/embed\.png$/);
  });

  it("exports the default metadata", () => {
    expect(claudeTestLabMetadata).toEqual(buildClaudeTestLabMetadata());
  });
});
