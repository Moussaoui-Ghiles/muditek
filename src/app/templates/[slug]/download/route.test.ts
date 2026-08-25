import { describe, expect, it } from "vitest";
import { GET, dynamic, dynamicParams, generateStaticParams } from "./route";

describe("template downloads", () => {
  it("prebuilds every public template so the response does not depend on runtime files", () => {
    const params = generateStaticParams();

    expect(dynamic).toBe("force-static");
    expect(dynamicParams).toBe(false);
    expect(params).toHaveLength(8);
    expect(params).toContainEqual({ slug: "outbound-icp-worksheet" });
  });

  it("returns the editable Markdown with download headers", async () => {
    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ slug: "outbound-icp-worksheet" }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/markdown");
    expect(response.headers.get("content-disposition")).toBe(
      'attachment; filename="outbound-icp-worksheet.md"',
    );
    expect(await response.text()).toContain("## Account rules");
  });
});
