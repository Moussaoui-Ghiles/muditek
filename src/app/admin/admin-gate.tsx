import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminGate({ forbidden }: { forbidden?: boolean }) {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    null;

  const subtitle = forbidden
    ? `Signed in as ${email ?? "unknown"} — not on the admin allowlist.`
    : email
      ? `Signed in as ${email} — but session didn't carry. Sign in again.`
      : "Sign in with your admin email to continue.";

  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground text-lg font-bold">
            M
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Muditek Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>

        <Card className="p-6 space-y-3">
          {email ? (
            <SignOutButton redirectUrl="/sign-in?redirect_url=/admin">
              <Button className="w-full" variant="outline">
                Sign out
              </Button>
            </SignOutButton>
          ) : (
            <Button
              className="w-full"
              nativeButton={false}
              render={<Link href="/sign-in?redirect_url=/admin" />}
            >
              Sign in
            </Button>
          )}
          {email && !forbidden && (
            <p className="text-xs text-muted-foreground text-center">
              Sign out then sign in again to refresh the session.
            </p>
          )}
          {forbidden && (
            <p className="text-xs text-muted-foreground text-center">
              Sign out and use an allowlisted address.
            </p>
          )}
        </Card>
      </div>
    </main>
  );
}
