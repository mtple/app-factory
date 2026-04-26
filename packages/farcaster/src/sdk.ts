export type MiniAppReadySdk = {
  actions: {
    ready: () => Promise<void> | void;
  };
};

export async function readyMiniApp(sdk: MiniAppReadySdk): Promise<void> {
  await sdk.actions.ready();
}

export async function loadMiniAppSdk<TSdk extends MiniAppReadySdk>(
  loadSdk: () => Promise<{ sdk: TSdk }>
): Promise<TSdk> {
  const { sdk } = await loadSdk();
  return sdk;
}
