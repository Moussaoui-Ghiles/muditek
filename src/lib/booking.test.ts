import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BOOKING_URL } from "./booking";

const OBSOLETE_BOOKING_PATTERN = /outlook\.office\.com\/bookwithme/i;

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".test.ts")
      ? [path]
      : [];
  });
}

describe("public booking destination", () => {
  it("uses the canonical Calendly event", () => {
    expect(BOOKING_URL).toBe("https://calendly.com/biz-ghiless/30min");
  });

  it("contains no obsolete Microsoft Bookings URL", () => {
    const obsoleteFiles = sourceFiles(join(process.cwd(), "src")).filter((path) =>
      OBSOLETE_BOOKING_PATTERN.test(readFileSync(path, "utf8")),
    );

    expect(obsoleteFiles).toEqual([]);
  });
});
