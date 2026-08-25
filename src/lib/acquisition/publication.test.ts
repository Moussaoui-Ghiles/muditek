import { afterEach, describe, expect, it } from "vitest";
import { isAcquisitionPreviewEnvironment } from "./publication";

const originalNodeEnv = process.env.NODE_ENV;
const originalVercelEnv = process.env.VERCEL_ENV;

afterEach(() => {
  if (originalNodeEnv === undefined) Reflect.deleteProperty(process.env, "NODE_ENV");
  else Object.assign(process.env, { NODE_ENV: originalNodeEnv });
  if (originalVercelEnv === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = originalVercelEnv;
});

describe("acquisition publication environment", () => {
  it("allows review pages in preview deployments", () => {
    Object.assign(process.env, { NODE_ENV: "production", VERCEL_ENV: "preview" });
    expect(isAcquisitionPreviewEnvironment()).toBe(true);
  });

  it("allows review pages in local development", () => {
    Object.assign(process.env, { NODE_ENV: "development" });
    delete process.env.VERCEL_ENV;
    expect(isAcquisitionPreviewEnvironment()).toBe(true);
  });

  it("fails closed when the deployment environment is missing", () => {
    Object.assign(process.env, { NODE_ENV: "production" });
    delete process.env.VERCEL_ENV;
    expect(isAcquisitionPreviewEnvironment()).toBe(false);
  });
});
