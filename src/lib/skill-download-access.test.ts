import { describe, expect, it } from "vitest";
import { decideSkillDownloadAccess } from "./skill-download-access";

describe("skill download access", () => {
  it("allows public core bundles without an account", () => {
    expect(decideSkillDownloadAccess("public", false, false)).toEqual({ allowed: true, status: 200 });
  });

  it("requires an account for advanced bundles", () => {
    expect(decideSkillDownloadAccess("account", false, false)).toEqual({
      allowed: false,
      status: 401,
      error: "Sign in required.",
    });
  });

  it("requires an active free membership after authentication", () => {
    expect(decideSkillDownloadAccess("account", true, false)).toEqual({
      allowed: false,
      status: 403,
      error: "Active portal membership required.",
    });
    expect(decideSkillDownloadAccess("account", true, true)).toEqual({ allowed: true, status: 200 });
  });

  it("never exposes removed content", () => {
    expect(decideSkillDownloadAccess("none", true, true)).toEqual({
      allowed: false,
      status: 410,
      error: "This bundle is no longer available.",
    });
  });
});
