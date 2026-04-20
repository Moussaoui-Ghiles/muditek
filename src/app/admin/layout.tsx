import AdminGate from "./admin-gate";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminAccess } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await getAdminAccess();

  return (
    <div className="mudikit-dark min-h-[100dvh] bg-background text-foreground">
      {!access.authorized ? (
        <AdminGate forbidden={access.reason === "forbidden"} />
      ) : (
        <AdminShell email={access.email} method={access.method}>
          {children}
        </AdminShell>
      )}
    </div>
  );
}
