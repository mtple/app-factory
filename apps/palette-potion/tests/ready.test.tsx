import { describe, expect, it, vi } from "vitest";
import { sendMiniAppReady } from "../app/client/ready";

describe("sendMiniAppReady", () => {
  it("loads the Mini App SDK and calls ready", async () => {
    const ready = vi.fn();

    await sendMiniAppReady(async () => ({
      sdk: {
        actions: {
          ready
        }
      }
    }));

    expect(ready).toHaveBeenCalledOnce();
  });
});
