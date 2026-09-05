import { Suspense } from "react";
import LeadsTable from "./leads-table";
import BookingRequestsTable from "./booking-requests-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeadsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 space-y-10">
      <section className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Call requests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Everyone who filled the form on /book before picking a Calendly slot. Click a row for the full answers. Fit is the go/no-go checklist scored automatically.
          </p>
        </header>
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-xl" />}>
          <BookingRequestsTable />
        </Suspense>
      </section>

      <section className="space-y-4">
        <header>
          <h2 className="text-2xl font-semibold tracking-tight">Leads</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Resource signups and portal signups only. Legacy campaign data lives in the archive.
          </p>
        </header>
        <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
          <LeadsTable />
        </Suspense>
      </section>
    </div>
  );
}
