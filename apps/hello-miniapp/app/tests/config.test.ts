import { describe, expect, it } from "vitest";
import { buildMiniAppMetaTag, miniAppConfigSchema } from "@app-factory/farcaster";
import { helloMiniAppConfig } from "../config";

describe("hello mini app config", () => {
  it("is valid", () => {
    expect(miniAppConfigSchema.parse(helloMiniAppConfig)).toEqual(helloMiniAppConfig);
  });

  it("builds fc:miniapp metadata", () => {
    const meta = buildMiniAppMetaTag(helloMiniAppConfig);

    expect(meta.name).toBe("fc:miniapp");
    expect(JSON.parse(meta.content)).toMatchObject({
      version: "next",
      button: {
        title: "Open Hello",
        action: {
          type: "launch_miniapp"
        }
      }
    });
  });
});
