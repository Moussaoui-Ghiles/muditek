import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

afterEach(() => vi.unstubAllGlobals());

describe("DNS tool endpoint", () => {
  it("rejects invalid domains and missing DKIM selectors before DNS", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect((await GET(new NextRequest("http://localhost/api/tools/dns?type=spf&domain=localhost"))).status).toBe(400);
    expect((await GET(new NextRequest("http://localhost/api/tools/dns?type=dkim&domain=example.com"))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("follows SPF includes, reports cycles, and does not invent a score", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL | Request) => {
      const url = new URL(String(input));
      const name = url.searchParams.get("name");
      const data = name === "example.com" ? '"v=spf1 include:_spf.example.com -all"' : '"v=spf1 include:example.com ~all"';
      return new Response(JSON.stringify({ Status: 0, Answer: [{ name, type: 16, data }] }), { status: 200 });
    }));
    const response = await GET(new NextRequest("http://localhost/api/tools/dns?type=spf&domain=example.com"));
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.records).toEqual(["v=spf1 include:_spf.example.com -all"]);
    expect(payload.checkedDomains).toEqual(["example.com", "_spf.example.com"]);
    expect(payload.cycles).toEqual(["example.com"]);
    expect(payload).not.toHaveProperty("score");
  });
});
