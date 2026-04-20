import EmailsContent from "./emails-content";

export default function EmailsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Emails</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Every email the system has sent. Filter by type.
        </p>
      </header>
      <EmailsContent />
    </div>
  );
}
