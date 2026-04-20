export default function WelcomePage() {
  return (
    <main className="min-h-[100dvh] bg-[#0c0c0e] text-[#e8e8ec] flex items-center justify-center px-6">
      <div className="max-w-md">
        <h1 className="text-3xl font-bold tracking-tight mb-3">You&apos;re in.</h1>
        <p className="text-[#a0a0a6] text-lg leading-relaxed mb-10">
          Check your email for the portal link. That&apos;s where everything lives.
        </p>
        <div className="border-t border-[#232326] pt-6 space-y-4 text-[15px] text-[#a0a0a6]">
          <div className="flex gap-4"><span className="text-xs font-bold font-[family-name:var(--font-geist-mono)] text-[#e8e8ec] mt-0.5 shrink-0">01</span> Check your inbox</div>
          <div className="flex gap-4"><span className="text-xs font-bold font-[family-name:var(--font-geist-mono)] text-[#e8e8ec] mt-0.5 shrink-0">02</span> Log in with your subscriber email</div>
          <div className="flex gap-4"><span className="text-xs font-bold font-[family-name:var(--font-geist-mono)] text-[#e8e8ec] mt-0.5 shrink-0">03</span> Download and install</div>
          <div className="flex gap-4"><span className="text-xs font-bold font-[family-name:var(--font-geist-mono)] text-[#e8e8ec] mt-0.5 shrink-0">04</span> New drops monthly</div>
        </div>
        <p className="text-sm text-[#636366] mt-8">No email? Check spam.</p>
      </div>
    </main>
  );
}
