import { describe, expect, it } from "vitest";
import { buildFarcasterManifest } from "@app-factory/farcaster";
import { helloMiniAppConfig } from "../app/config";
import { buildHelloMiniAppManifest, helloMiniAppManifest } from "../lib/manifest";

describe("hello mini app manifest helpers", () => {
  it("builds the Farcaster manifest from the hello config", () => {
    expect(buildHelloMiniAppManifest()).toEqual(buildFarcasterManifest(helloMiniAppConfig));
  });

  it("exports the default hello manifest", () => {
    expect(helloMiniAppManifest.miniapp).toMatchObject({
      version: "1",
      name: "Hello Mini App",
      iconUrl: "http://localhost:3000/assets/icon.svg"
    });
  });
});
