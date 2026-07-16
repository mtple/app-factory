import { describe, expect, it } from "vitest";
import { GET as manifestGet } from "../.well-known/farcaster.json/route";
import { POST as webhookPost } from "../api/webhook/route";
import { POST as brewPost } from "../api/brew/route";

describe("palette potion routes", () => {
  it("serves the Farcaster manifest", async () => {
    const response = manifestGet();
    const json = await response.json();
    expect(json.miniapp.name).toBe("Palette Potion");
  });

  it("serves the webhook route", async () => {
    const response = await webhookPost(new Request("http://localhost/api/webhook", { method: "POST", body: JSON.stringify({ hello: true }) }));
    const json = await response.json();
    expect(json.ok).toBe(true);
  });

  it("brews a deterministic palette without live secrets", async () => {
    const response = await brewPost(
      new Request("http://localhost/api/brew", {
        method: "POST",
        body: JSON.stringify({ vibe: "warm trusted creative tool", audience: "builders", industry: "software", avoid: "muddy" })
      })
    );
    const json = await response.json();
    expect(json.ok).toBe(true);
    expect(json.result.swatches).toHaveLength(6);
    expect(json.result.cssVariables).toContain("--pp-primary");
  });
});
