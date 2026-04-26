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

export const helloMiniAppConfig = miniAppConfigSchema.parse({
  slug: "hello-miniapp",
  name: "Hello Mini App",
  subtitle: "A practical Farcaster starter",
  description: "A lightweight starter Mini App for App Factory.",
  primaryCategory: "utility",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  homePath: "/",
  iconPath: "/assets/icon.svg",
  splashImagePath: "/assets/splash.svg",
  splashBackgroundColor: "#0F172A",
  embedImagePath: "/assets/embed.svg",
  embedButtonTitle: "Open Hello",
  webhookPath: "/api/webhook",
  accountAssociation
});
