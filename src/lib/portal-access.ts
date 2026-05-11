export const PORTAL_ROLES = ["free", "mudikit", "client", "admin"] as const;

export type PortalRole = (typeof PORTAL_ROLES)[number];

export type PortalAccess = {
  roles: PortalRole[];
  isAdmin: boolean;
  isClient: boolean;
  isMudikit: boolean;
  isFree: boolean;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function adminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => normalizeEmail(email))
      .filter(Boolean)
  );
}

export function buildPortalAccess(input: {
  email: string;
  membershipRoles: string[];
  hasActiveSubscription: boolean;
}): PortalAccess {
  const roles = new Set<PortalRole>(["free"]);

  for (const role of input.membershipRoles) {
    if ((PORTAL_ROLES as readonly string[]).includes(role)) {
      roles.add(role as PortalRole);
    }
  }

  if (input.hasActiveSubscription) roles.add("mudikit");
  if (adminEmails().has(normalizeEmail(input.email))) roles.add("admin");

  const resolved = Array.from(roles);

  return {
    roles: resolved,
    isAdmin: roles.has("admin"),
    isClient: roles.has("client"),
    isMudikit: roles.has("mudikit") || roles.has("admin"),
    isFree: roles.has("free"),
  };
}
