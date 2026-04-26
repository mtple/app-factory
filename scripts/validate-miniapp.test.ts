import { describe, expect, it } from "vitest";
import { validateMiniApp } from "./validate-miniapp";

describe("validateMiniApp", () => {
  it("validates the hello mini app in development mode", async () => {
    await expect(validateMiniApp("hello-miniapp")).resolves.toMatchObject({ ok: true });
  });

  it("requires HTTPS in production mode", async () => {
    const result = await validateMiniApp("hello-miniapp", { production: true });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("Production validation requires baseUrl to use HTTPS.");
  });
});
