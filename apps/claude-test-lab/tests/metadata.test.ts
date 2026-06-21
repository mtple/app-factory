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

  it("exports the default metadata", () => {
    expect(claudeTestLabMetadata).toEqual(buildClaudeTestLabMetadata());
  });
});
