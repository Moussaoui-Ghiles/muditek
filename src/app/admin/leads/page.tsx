import { Suspense } from "react";
import LeadsTable from "./leads-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeadsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Resource unlocks and legacy campaign submissions in one place. Campaign rows
          still open the delivery detail sheet.
        </p>
      </header>
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
        <LeadsTable />
      </Suspense>
    </div>
  );
}
