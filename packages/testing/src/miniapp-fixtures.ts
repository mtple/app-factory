import type { MiniAppConfig } from "@app-factory/farcaster";

export function createMockMiniAppConfig(overrides: Partial<MiniAppConfig> = {}): MiniAppConfig {
  return {
    slug: "mock-miniapp",
    name: "Mock Mini App",
    subtitle: "A mock mini app",
    description: "A test fixture for mini app helpers.",
    primaryCategory: "utility",
    baseUrl: "https://mock.example",
    homePath: "/",
    iconPath: "/assets/icon.svg",
    splashImagePath: "/assets/splash.svg",
    splashBackgroundColor: "#111827",
    embedImagePath: "/assets/embed.svg",
    embedButtonTitle: "Open Mock",
    webhookPath: "/api/webhook",
    accountAssociation: null,
    ...overrides
  };
}
