import DashboardContent from "./dashboard-content";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="mesh-bg">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10 space-y-8">
        <header className="flex flex-col gap-1.5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-medium">
            Home
          </p>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em] leading-tight">
            What needs operating today.
          </h1>
        </header>
        <DashboardContent />
      </div>
    </div>
  );
}
