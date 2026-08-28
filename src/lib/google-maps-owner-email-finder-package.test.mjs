import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { auditRows } from "../../content/skills/google-maps-owner-email-finder/scripts/audit-results.mjs";
import {
  csvCell,
  isUnsafeIp,
  normalizeWebsite,
  parseCsv,
  parsePageEvidence,
  readResponseBody,
  readCompanies,
} from "../../content/skills/google-maps-owner-email-finder/scripts/collect-website-evidence.mjs";

describe("Google Maps owner and email finder package", () => {
  it("collects an explicit owner and public email", () => {
    const found = parsePageEvidence(`
      <html><head><title>Example Roofing</title></head><body>
        <p>Jane Smith is the owner of Example Roofing.</p>
        <a href="mailto:jane@example-roofing.test">Email Jane</a>
      </body></html>
    `, "https://example-roofing.test/about");

    assert.equal(found.title, "Example Roofing");
    assert.equal(found.roleSnippets.length, 1);
    assert.match(found.roleSnippets[0], /Jane Smith is the owner/);
    assert.deepEqual(found.emails, ["jane@example-roofing.test"]);
  });

  it("keeps conflicting and unknown evidence reviewable", () => {
    const conflicting = parsePageEvidence(`
      <p>Jane Smith is the owner of Example Roofing.</p>
      <p>John Smith is the owner of Example Roofing.</p>
    `, "https://example-roofing.test/team");
    assert.match(conflicting.roleSnippets.join(" "), /Jane Smith/);
    assert.match(conflicting.roleSnippets.join(" "), /John Smith/);

    const unknown = parsePageEvidence(
      "<p>Serving Austin with roof repairs since 2004.</p>",
      "https://example-roofing.test",
    );
    assert.deepEqual(unknown.roleSnippets, []);
    assert.deepEqual(unknown.emails, []);
  });

  it("removes telemetry, placeholder and no-reply addresses", () => {
    const page = parsePageEvidence(`
      <p>Contact info@real-roofing.test.</p>
      <a href="mailto:office@real-roofing.test?subject=Estimate">Email the office</a>
      <script>window.telemetry = "debug@real-roofing.test"</script>
      <p>user@domain.com you@email.com noreply@real-roofing.test</p>
      <p>tracker@sentry.io trace@sentry.wixpress.com hash@sentry-next.wixpress.com</p>
      <p>%20info@real-roofing.test</p>
    `, "https://real-roofing.test/contact");

    assert.deepEqual(page.emails, ["info@real-roofing.test", "office@real-roofing.test"]);
  });

  it("blocks unsafe URLs and parses the CSV contract", () => {
    assert.equal(isUnsafeIp("127.0.0.1"), true);
    assert.equal(isUnsafeIp("10.2.3.4"), true);
    assert.equal(isUnsafeIp("192.168.1.5"), true);
    assert.equal(isUnsafeIp("198.51.100.4"), true);
    assert.equal(isUnsafeIp("::ffff:10.2.3.4"), true);
    assert.equal(isUnsafeIp("8.8.8.8"), false);
    assert.equal(isUnsafeIp("2606:4700:4700::1111"), false);
    assert.throws(() => normalizeWebsite("file:///etc/passwd"), /HTTP or HTTPS/);
    assert.throws(() => normalizeWebsite("http://localhost"), /Local websites/);

    assert.deepEqual(readCompanies("company_name,website\nExample,https://example.com\n"), [
      { rowNumber: 2, companyName: "Example", website: "https://example.com" },
    ]);
    assert.equal(parseCsv('name,notes\n"Example, Inc.","Said ""hello"""\n')[1][0], "Example, Inc.");
    assert.equal(csvCell("=1+1"), "'=1+1");
    assert.equal(csvCell("Normal Roofing"), "Normal Roofing");
  });

  it("stops reading an oversized chunked response", async () => {
    const response = new Response(new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("1234"));
        controller.enqueue(new TextEncoder().encode("5678"));
        controller.close();
      },
    }));

    await assert.rejects(() => readResponseBody(response, 6), /larger than 2 MB/);
  });

  it("audits valid, unknown and invalid owner rows", () => {
    const headers = [
      "company_name", "website", "owner_name", "owner_role", "owner_status", "evidence_url", "evidence_text", "public_email", "email_status", "email_source_url", "notes",
    ];
    const emailEvidence = new Map([
      ["https://example.com/contact", new Set(["jane@example.org"])],
    ]);
    assert.deepEqual(auditRows([
      headers,
      ["Example Roofing", "https://example.com", "Jane Smith", "Owner", "explicit", "https://example.com/about", "Jane Smith is the owner.", "jane@example.org", "published_unverified", "https://example.com/contact", ""],
      ["Unknown Roofing", "https://unknown.example", "", "", "unknown", "", "", "", "", "", "No evidence"],
    ], emailEvidence), []);

    const fabricatedEmail = auditRows([
      headers,
      ["Example Roofing", "https://example.com", "Jane Smith", "Owner", "explicit", "https://example.com/about", "Jane Smith is the owner.", "guessed@example.org", "published_unverified", "https://example.com/contact", ""],
    ], emailEvidence);
    assert.ok(fabricatedEmail.some((issue) => issue.includes("does not appear in the saved source-page evidence")));

    const invalidIssues = auditRows([
      headers,
      ["Conflict Roofing", "https://example.com", "Jane Smith", "Founder", "explicit", "https://example.com/about", "Jane founded the company.", "jane@example.org", "verified", "", ""],
    ]);
    assert.ok(invalidIssues.some((issue) => issue.includes("lacks owner or proprietor language")));
    assert.ok(invalidIssues.some((issue) => issue.includes("published_unverified")));
    assert.ok(invalidIssues.some((issue) => issue.includes("source URL")));

    const unsupportedStatus = auditRows([
      headers,
      ["Leadership Roofing", "https://example.com", "Jane Smith", "CEO", "supported", "https://example.com/about", "Jane Smith is CEO.", "", "", "", ""],
    ]);
    assert.ok(unsupportedStatus.some((issue) => issue.includes("invalid owner_status")));

    const unrelatedEvidence = auditRows([
      headers,
      ["Example Roofing", "https://example.com", "Jane Smith", "Owner", "explicit", "https://directory.example.org/jane", "Jane Smith is the owner.", "jane@example.org", "published_unverified", "https://directory.example.org/contact", ""],
    ]);
    assert.ok(unrelatedEvidence.some((issue) => issue.includes("owner evidence URL must match")));
    assert.ok(unrelatedEvidence.some((issue) => issue.includes("email source URL must match")));
  });
});
