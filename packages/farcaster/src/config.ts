import { z } from "zod";

export const farcasterAccountAssociationSchema = z.object({
  header: z.string(),
  payload: z.string(),
  signature: z.string()
});

export const miniAppConfigSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  primaryCategory: z.string().min(1),
  baseUrl: z.string().url(),
  homePath: z.string().min(1).startsWith("/"),
  iconPath: z.string().min(1).startsWith("/"),
  splashImagePath: z.string().min(1).startsWith("/"),
  splashBackgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  embedImagePath: z.string().min(1).startsWith("/"),
  embedButtonTitle: z.string().min(1).max(32),
  webhookPath: z.string().min(1).startsWith("/"),
  accountAssociation: farcasterAccountAssociationSchema.nullable()
});

export type FarcasterAccountAssociation = z.infer<typeof farcasterAccountAssociationSchema>;
export type MiniAppConfig = z.infer<typeof miniAppConfigSchema>;
