export default async function NewsletterConfirmationPage({
  params,
}: {
  params: Promise<{ issueId: string; token: string }>;
}) {
  const { issueId, token } = await params;

  return (
    <main className="min-h-screen bg-[#0b0b0c] px-6 py-20 text-zinc-100">
      <section className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          Muditek newsletter
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">
          Keep receiving the practical builds?
        </h1>
        <p className="mt-4 leading-7 text-zinc-300">
          Confirm once and I&apos;ll keep sending the workflows, playbooks, and tools.
          If you leave this page, nothing changes.
        </p>
        <form
          action={`/api/newsletter/confirm/${encodeURIComponent(issueId)}/${encodeURIComponent(token)}`}
          method="post"
          className="mt-8"
        >
          <button
            type="submit"
            className="h-11 rounded-full bg-zinc-100 px-6 text-sm font-semibold text-zinc-950 hover:bg-white"
          >
            Keep me on the list
          </button>
        </form>
        <p className="mt-5 text-sm text-zinc-500">
          This extra click prevents email-security scanners from confirming on your behalf.
        </p>
      </section>
    </main>
  );
}
