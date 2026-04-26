import { describe, expect, it } from "vitest";
import { buildMiniAppEmbed } from "@app-factory/farcaster";
import { helloMiniAppConfig } from "../app/config";
import { buildHelloMiniAppMetadata, helloMiniAppMetadata } from "../lib/metadata";

describe("hello mini app metadata helpers", () => {
  it("builds Next metadata with the fc:miniapp embed", () => {
    const metadata = buildHelloMiniAppMetadata();
    const content = metadata.other?.["fc:miniapp"];

    expect(metadata.title).toBe(helloMiniAppConfig.name);
    expect(metadata.description).toBe(helloMiniAppConfig.description);
    expect(typeof content).toBe("string");
    expect(JSON.parse(content as string)).toEqual(buildMiniAppEmbed(helloMiniAppConfig));
  });

  it("exports the default hello metadata", () => {
    expect(helloMiniAppMetadata).toEqual(buildHelloMiniAppMetadata());
  });
});
