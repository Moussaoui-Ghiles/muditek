import UsersContent from "./users-content";

export const dynamic = "force-dynamic";

export default function AdminUsersPage() {
  return (
    <main className="min-h-[calc(100dvh-3rem)] overflow-x-hidden bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 border-b border-border/60 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              People
            </p>
            <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.03em] sm:text-[34px]">
              Users and lead pools.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Separate the newsletter list, portal accounts, resource signups, and people ready for follow-up.
            </p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-full border border-border/70 bg-secondary/35 px-3 py-1.5 text-[12px] text-muted-foreground">
            <span className="size-2 rounded-full bg-[var(--color-live)] shadow-[0_0_12px_var(--color-live)]" />
            Real database data
          </div>
        </header>
        <UsersContent />
      </div>
    </main>
  );
}
