import { describe, expect, it } from "vitest";
import { miniAppConfigSchema } from "@app-factory/farcaster";
import { createMockMiniAppConfig } from ".";

describe("createMockMiniAppConfig", () => {
  it("creates a valid overrideable config", () => {
    const config = createMockMiniAppConfig({ slug: "custom-app", name: "Custom App" });

    expect(miniAppConfigSchema.parse(config)).toMatchObject({
      slug: "custom-app",
      name: "Custom App"
    });
  });
});
