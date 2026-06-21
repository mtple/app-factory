import { miniAppConfigSchema } from "@app-factory/farcaster";

const accountAssociation =
  process.env.FARCASTER_ACCOUNT_ASSOCIATION_HEADER &&
  process.env.FARCASTER_ACCOUNT_ASSOCIATION_PAYLOAD &&
  process.env.FARCASTER_ACCOUNT_ASSOCIATION_SIGNATURE
    ? {
        header: process.env.FARCASTER_ACCOUNT_ASSOCIATION_HEADER,
        payload: process.env.FARCASTER_ACCOUNT_ASSOCIATION_PAYLOAD,
        signature: process.env.FARCASTER_ACCOUNT_ASSOCIATION_SIGNATURE
      }
    : null;

export const claudeTestLabConfig = miniAppConfigSchema.parse({
  slug: "claude-test-lab",
  name: "Claude Test Lab",
  subtitle: "Farcaster Mini App diagnostics",
  description: "A playful test lab that checks SDK readiness, embed metadata, and the manifest route.",
  primaryCategory: "utility",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001",
  homePath: "/",
  iconPath: "/assets/icon.svg",
  splashImagePath: "/assets/splash.svg",
  splashBackgroundColor: "#1E1B4B",
  embedImagePath: "/assets/embed.svg",
  embedButtonTitle: "Open Test Lab",
  webhookPath: "/api/webhook",
  accountAssociation
});
