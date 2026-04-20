import NewsletterContent from "./newsletter-content";

export default function NewsletterPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Newsletter</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compose, preview, and send newsletter issues via Resend. Track opens, clicks, and unsubs.
        </p>
      </div>
      <NewsletterContent />
    </div>
  );
}
