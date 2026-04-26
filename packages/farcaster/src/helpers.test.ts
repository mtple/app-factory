import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  buildComposeUrl,
  buildFarcasterManifest,
  buildMiniAppEmbed,
  buildMiniAppMetaTag,
  miniAppConfigSchema,
  type MiniAppConfig
} from ".";

const config: MiniAppConfig = {
  slug: "hello-miniapp",
  name: "Hello Mini App",
  subtitle: "A tiny Farcaster starter",
  description: "A tiny Farcaster Mini App starter.",
  primaryCategory: "utility",
  baseUrl: "https://hello.example",
  homePath: "/",
  iconPath: "/assets/icon.svg",
  splashImagePath: "/assets/splash.svg",
  splashBackgroundColor: "#4F46E5",
  embedImagePath: "/assets/embed.svg",
  embedButtonTitle: "Open Hello",
  webhookPath: "/api/webhook",
  accountAssociation: {
    header: "header",
    payload: "payload",
    signature: "signature"
  }
};

describe("mini app config schema", () => {
  it("accepts the required config shape", () => {
    expect(miniAppConfigSchema.parse(config)).toEqual(config);
  });
});

describe("absoluteUrl", () => {
  it("joins root-relative paths with the configured base URL", () => {
    expect(absoluteUrl("https://hello.example/base", "/assets/icon.svg")).toBe(
      "https://hello.example/base/assets/icon.svg"
    );
  });

  it("leaves already absolute URLs unchanged", () => {
    expect(absoluteUrl("https://hello.example", "https://cdn.example/icon.svg")).toBe(
      "https://cdn.example/icon.svg"
    );
  });
});

describe("Farcaster metadata helpers", () => {
  it("builds an fc:miniapp embed payload", () => {
    expect(buildMiniAppEmbed(config)).toMatchObject({
      version: "next",
      imageUrl: "https://hello.example/assets/embed.svg",
      button: {
        title: "Open Hello",
        action: {
          type: "launch_miniapp",
          name: "Hello Mini App",
          url: "https://hello.example/",
          splashImageUrl: "https://hello.example/assets/splash.svg"
        }
      }
    });
  });

  it("serializes the embed into a meta tag", () => {
    const meta = buildMiniAppMetaTag(config);
    expect(meta.name).toBe("fc:miniapp");
    expect(JSON.parse(meta.content)).toEqual(buildMiniAppEmbed(config));
  });

  it("builds the Farcaster manifest", () => {
    expect(buildFarcasterManifest(config)).toMatchObject({
      accountAssociation: config.accountAssociation,
      miniapp: {
        version: "1",
        name: "Hello Mini App",
        homeUrl: "https://hello.example/",
        iconUrl: "https://hello.example/assets/icon.svg",
        webhookUrl: "https://hello.example/api/webhook"
      }
    });
  });

  it("builds a Warpcast compose URL with the app embedded", () => {
    const composeUrl = new URL(buildComposeUrl(config, { text: "Try this" }));
    expect(composeUrl.origin).toBe("https://warpcast.com");
    expect(composeUrl.searchParams.get("text")).toBe("Try this");
    expect(composeUrl.searchParams.get("embeds[]")).toBe("https://hello.example/");
  });
});
