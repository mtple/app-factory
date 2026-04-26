import type { MiniAppConfig } from "./config";
import type { ComposeUrlOptions } from "./types";
import { absoluteUrl } from "./url";

export function buildComposeUrl(config: MiniAppConfig, options: ComposeUrlOptions = {}): string {
  const url = new URL("https://warpcast.com/~/compose");
  const embeds = options.embeds ?? [absoluteUrl(config.baseUrl, config.homePath)];

  if (options.text) {
    url.searchParams.set("text", options.text);
  }

  for (const embed of embeds) {
    url.searchParams.append("embeds[]", embed);
  }

  return url.toString();
}
