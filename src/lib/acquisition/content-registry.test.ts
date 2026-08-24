import { afterEach, describe, expect, it } from "vitest";
import {
  ACQUISITION_PAGES,
  getAcquisitionPage,
  getAcquisitionPathsForSitemap,
  getPublishedAcquisitionPages,
  getRenderableAcquisitionPage,
  readAcquisitionMarkdown,
} from "./content-registry";

const originalNodeEnv = process.env.NODE_ENV;
const originalVercelEnv = process.env.VERCEL_ENV;

afterEach(() => {
  Object.assign(process.env, { NODE_ENV: originalNodeEnv });
  if (originalVercelEnv === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = originalVercelEnv;
});

describe("acquisition content registry", () => {
  it("contains the planned source-backed page families", () => {
    expect(ACQUISITION_PAGES.filter((page) => page.family === "operational-workflow")).toHaveLength(10);
    expect(ACQUISITION_PAGES.filter((page) => page.family === "definition-economics")).toHaveLength(10);
    expect(ACQUISITION_PAGES.filter((page) => page.family === "template")).toHaveLength(8);
    expect(ACQUISITION_PAGES.filter((page) => page.family === "signal-method")).toHaveLength(5);
  });

  it("assigns one canonical and one primary query to every page", () => {
    expect(new Set(ACQUISITION_PAGES.map((page) => page.canonicalPath)).size).toBe(ACQUISITION_PAGES.length);
    expect(new Set(ACQUISITION_PAGES.map((page) => page.primaryQuery.toLowerCase())).size).toBe(ACQUISITION_PAGES.length);
  });

  it("renders published pages in production and adds them to the sitemap", () => {
    Object.assign(process.env, { NODE_ENV: "production", VERCEL_ENV: "production" });
    expect(getRenderableAcquisitionPage("operational-workflow", "define-outbound-icp")?.status).toBe("published");
    expect(getPublishedAcquisitionPages()).toHaveLength(45);
    expect(getAcquisitionPathsForSitemap()).toHaveLength(45);
  });

  it("renders published pages on previews", () => {
    Object.assign(process.env, { NODE_ENV: "production", VERCEL_ENV: "preview" });
    expect(getRenderableAcquisitionPage("operational-workflow", "define-outbound-icp")?.status).toBe("published");
  });

  it("renders published pages during a local production build", () => {
    Object.assign(process.env, { NODE_ENV: "production" });
    delete process.env.VERCEL_ENV;
    expect(getRenderableAcquisitionPage("operational-workflow", "define-outbound-icp")?.status).toBe("published");
  });

  it("reads the registered Markdown source", () => {
    const page = getAcquisitionPage("operational-workflow", "define-outbound-icp");
    expect(page).toBeDefined();
    expect(readAcquisitionMarkdown(page!)).toContain("## Define the account first");
  });

  it("has a non-empty source file for every assigned content page", () => {
    const assigned = ACQUISITION_PAGES.filter((page) => page.family !== "commercial-decision");
    expect(assigned).toHaveLength(33);
    for (const page of assigned) expect(readAcquisitionMarkdown(page).length).toBeGreaterThan(300);
  });
});
