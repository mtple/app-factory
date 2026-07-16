type MiniAppSdkModule = {
  sdk: {
    actions: {
      ready: () => void | Promise<void>;
    };
  };
};

export async function sendMiniAppReady(
  loader: () => Promise<MiniAppSdkModule> = () => import("@farcaster/miniapp-sdk")
) {
  const { sdk } = await loader();
  await sdk.actions.ready();
}
