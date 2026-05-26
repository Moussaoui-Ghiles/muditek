import NurtureContent from "./nurture-content";

export default function NurturePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Nurture</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Read-only status for the automated sequence. Manual sends are disabled.
        </p>
      </header>
      <NurtureContent />
    </div>
  );
}
