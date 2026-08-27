import { describe, expect, it } from "vitest";
import { canonicalLibraryResponse, config } from "./proxy";

describe("canonical public library routing", () => {
  it("does not send public hero media through account middleware", () => {
    expect(config.matcher[0]).toContain("mp4|webm|m4v|mov");
  });

  it("returns 410 for a removed canonical asset", () => {
    const response = canonicalLibraryResponse(
      new Request("https://muditek.com/playbooks/reddit-client-acquisition-hermes"),
    );

    expect(response?.status).toBe(410);
  });

  it("uses a permanent redirect for a duplicate canonical asset", () => {
    const response = canonicalLibraryResponse(
      new Request("https://muditek.com/playbooks/openclaw-outbound?utm_source=test"),
    );

    expect(response?.status).toBe(308);
    expect(response?.headers.get("location")).toBe(
      "https://muditek.com/playbooks/google-maps-outbound?utm_source=test",
    );
  });

  it("does not intercept published or unknown canonical assets", () => {
    expect(
      canonicalLibraryResponse(
        new Request("https://muditek.com/skills/cold-offer-review"),
      ),
    ).toBeNull();
    expect(
      canonicalLibraryResponse(
        new Request("https://muditek.com/playbooks/not-a-real-asset"),
      ),
    ).toBeNull();
  });
});
