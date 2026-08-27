import { describe, expect, it } from "vitest";
import { completeSkillDownload, fetchSkillBundle } from "../lib/skill-download";

describe("fetchSkillBundle", () => {
  it("returns a named payload only after a successful response", async () => {
    const request = async () => new Response(new Blob(["bundle"]), {
      status: 200,
      headers: { "content-disposition": 'attachment; filename="list-builder.tar"' },
    });

    const payload = await fetchSkillBundle("/api/portal/skills/list-builder/download", request as typeof fetch);

    expect(payload?.fileName).toBe("list-builder.tar");
    expect(payload?.blob.size).toBeGreaterThan(0);
  });

  it("returns no payload for failed or empty downloads", async () => {
    const failed = async () => new Response("No access", { status: 403 });
    const empty = async () => new Response(new Blob([]), { status: 200 });

    await expect(fetchSkillBundle("/api/portal/skills/list-builder/download", failed as typeof fetch)).resolves.toBeNull();
    await expect(fetchSkillBundle("/api/portal/skills/list-builder/download", empty as typeof fetch)).resolves.toBeNull();
  });

  it("confirms analytics only after a successful payload", async () => {
    let confirmations = 0;
    const confirm = () => { confirmations += 1; };
    const success = async () => new Response(new Blob(["bundle"]), { status: 200 });
    const failure = async () => new Response("No access", { status: 403 });

    await expect(completeSkillDownload("/download", confirm, failure as typeof fetch)).resolves.toBe(false);
    expect(confirmations).toBe(0);

    await expect(completeSkillDownload("/download", confirm, success as typeof fetch)).resolves.toBe(true);
    expect(confirmations).toBe(1);
  });
});
