import { clerkClient } from "@clerk/nextjs/server";

export async function ensureClerkUserByEmail(email: string, name?: string | null): Promise<string> {
  const client = await clerkClient();
  const existing = await client.users.getUserList({ emailAddress: [email], limit: 1 });
  if (existing.data.length > 0) return existing.data[0].id;

  const [firstName, ...rest] = (name || "").trim().split(" ");
  const lastName = rest.join(" ") || undefined;

  const user = await client.users.createUser({
    emailAddress: [email],
    skipPasswordRequirement: true,
    skipPasswordChecks: true,
    firstName: firstName || undefined,
    lastName,
  });
  return user.id;
}
