import { describe, expect, it } from "vitest";
import { GET as getManifest } from "../.well-known/farcaster.json/route";
import { GET as getWebhook, POST as postWebhook } from "../api/webhook/route";

describe("claude test lab routes", () => {
  it("serves the Farcaster manifest", async () => {
    const response = getManifest();
    const json = await response.json();

    expect(json.miniapp).toMatchObject({
      version: "1",
      name: "Claude Test Lab",
      homeUrl: "http://localhost:3001/"
    });
  });

  it("serves webhook health", async () => {
    const response = getWebhook();

    await expect(response.json()).resolves.toEqual({
      ok: true,
      endpoint: "claude-test-lab webhook"
    });
  });

  it("accepts webhook POST events", async () => {
    const response = await postWebhook(
      new Request("http://localhost:3001/api/webhook", {
        method: "POST",
        body: JSON.stringify({ event: "test" })
      })
    );
    const json = await response.json();

    expect(json).toMatchObject({
      ok: true,
      body: { event: "test" }
    });
    expect(json.receivedAt).toEqual(expect.any(String));
  });
});
