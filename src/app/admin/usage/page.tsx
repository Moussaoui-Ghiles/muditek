import UsageContent from "./usage-content";

export const dynamic = "force-dynamic";

export default function AdminUsagePage() {
  return (
    <main className="min-h-[calc(100dvh-3rem)] overflow-x-hidden bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 border-b border-border/60 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Portal usage
            </p>
            <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.03em] sm:text-[34px]">
              What people do inside the portal.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Signed-in activity, resource demand, downloads, tool runs, and recent events.
            </p>
          </div>
        </header>
        <UsageContent />
      </div>
    </main>
  );
}
