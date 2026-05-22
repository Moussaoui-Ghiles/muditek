import UsageContent from "./usage-content";

export const dynamic = "force-dynamic";

export default function AdminUsagePage() {
  return (
    <main className="mesh-bg min-h-[calc(100dvh-3rem)]">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <header className="flex flex-col gap-1.5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-medium">
            Platform usage
          </p>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em] leading-tight">
            Who is using the portal.
          </h1>
        </header>
        <UsageContent />
      </div>
    </main>
  );
}
