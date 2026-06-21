import { describe, expect, it } from "vitest";
import { buildFarcasterManifest } from "@app-factory/farcaster";
import { claudeTestLabConfig } from "../app/config";
import { buildClaudeTestLabManifest, claudeTestLabManifest } from "../lib/manifest";

describe("claude test lab manifest helpers", () => {
  it("builds the Farcaster manifest from the config", () => {
    expect(buildClaudeTestLabManifest()).toEqual(buildFarcasterManifest(claudeTestLabConfig));
  });

  it("exports the default manifest", () => {
    expect(claudeTestLabManifest.miniapp).toMatchObject({
      version: "1",
      name: "Claude Test Lab",
      iconUrl: "http://localhost:3001/assets/icon.png"
    });
  });
});
