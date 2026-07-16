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

export const palettePotionConfig = miniAppConfigSchema.parse({
  slug: "palette-potion",
  name: "Palette Potion",
  subtitle: "Brand color lab for builders",
  description:
    "Turn a brand vibe into accessible color tokens, UI previews, CSS variables, and a share-ready palette card.",
  primaryCategory: "productivity",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3002",
  homePath: "/",
  iconPath: "/assets/icon.png",
  splashImagePath: "/assets/splash.png",
  splashBackgroundColor: "#271138",
  embedImagePath: "/assets/embed.png",
  embedButtonTitle: "Open Palette Potion",
  webhookPath: "/api/webhook",
  accountAssociation
});
