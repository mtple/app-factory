import type { MiniAppConfig } from "./config";

export type MiniAppEmbed = {
  version: "next";
  imageUrl: string;
  button: {
    title: string;
    action: {
      type: "launch_miniapp";
      name: string;
      url: string;
      splashImageUrl: string;
      splashBackgroundColor: string;
    };
  };
};

export type MiniAppMetaTag = {
  name: "fc:miniapp";
  content: string;
};

export type FarcasterManifest = {
  accountAssociation: MiniAppConfig["accountAssociation"];
  miniapp: {
    version: "1";
    name: string;
    subtitle: string;
    description: string;
    primaryCategory: string;
    homeUrl: string;
    iconUrl: string;
    imageUrl: string;
    buttonTitle: string;
    splashImageUrl: string;
    splashBackgroundColor: string;
    webhookUrl: string;
  };
};

export type ComposeUrlOptions = {
  text?: string;
  embeds?: string[];
};
