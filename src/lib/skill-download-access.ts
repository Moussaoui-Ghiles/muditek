import type { LibraryAccess } from "./library-manifest";

export type SkillDownloadDecision =
  | { allowed: true; status: 200 }
  | { allowed: false; status: 401 | 403 | 410; error: string };

export function decideSkillDownloadAccess(
  access: LibraryAccess,
  isAuthenticated: boolean,
  hasActiveMembership: boolean,
): SkillDownloadDecision {
  if (access === "none") {
    return { allowed: false, status: 410, error: "This bundle is no longer available." };
  }
  if (access === "public") return { allowed: true, status: 200 };
  if (!isAuthenticated) return { allowed: false, status: 401, error: "Sign in required." };
  if (!hasActiveMembership) {
    return { allowed: false, status: 403, error: "Active portal membership required." };
  }
  return { allowed: true, status: 200 };
}
