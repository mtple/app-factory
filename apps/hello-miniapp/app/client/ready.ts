import { loadMiniAppSdk, readyMiniApp, type MiniAppReadySdk } from "@app-factory/farcaster";

function loadFarcasterMiniAppSdk() {
  return import("@farcaster/miniapp-sdk") as Promise<{ sdk: MiniAppReadySdk }>;
}

export async function sendMiniAppReady(loadSdk = loadFarcasterMiniAppSdk): Promise<void> {
  const sdk = await loadMiniAppSdk(loadSdk);
  await readyMiniApp(sdk);
}
