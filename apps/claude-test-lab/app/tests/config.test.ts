import { describe, expect, it } from "vitest";
import { buildMiniAppMetaTag, miniAppConfigSchema } from "@app-factory/farcaster";
import { claudeTestLabConfig } from "../config";

describe("claude test lab config", () => {
  it("is valid", () => {
    expect(miniAppConfigSchema.parse(claudeTestLabConfig)).toEqual(claudeTestLabConfig);
  });

  it("has the correct slug", () => {
    expect(claudeTestLabConfig.slug).toBe("claude-test-lab");
  });

  it("builds fc:miniapp metadata", () => {
    const meta = buildMiniAppMetaTag(claudeTestLabConfig);

    expect(meta.name).toBe("fc:miniapp");
    expect(JSON.parse(meta.content)).toMatchObject({
      version: "next",
      button: {
        title: "Open Test Lab",
        action: {
          type: "launch_miniapp"
        }
      }
    });
  });
});
