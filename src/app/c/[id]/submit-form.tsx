"use client";

import { useState } from "react";

export default function SubmitForm({
  campaignId,
  title,
  keyword,
  postUrl,
}: {
  campaignId: string;
  title: string;
  keyword: string;
  postUrl: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, campaignId, comment: comment.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus("error"); setMessage(data.error || "Something went wrong"); return; }
      setStatus("success");
      setMessage(data.message);
    } catch { setStatus("error"); setMessage("Something went wrong. Try again."); }
  }

  if (status === "success") {
    return (
      <div className="py-4">
        <h2 className="text-lg font-bold mb-2">Submitted</h2>
        <p className="text-sm text-[#a0a0a6] mb-4">{message}</p>
        <div className="border border-[#232326] rounded-lg p-4 mb-4">
          <p className="text-sm text-[#a0a0a6] mb-3">Make sure you&apos;ve:</p>
          <ul className="space-y-2 text-sm text-[#a0a0a6]">
            <li className="flex gap-2"><span className="text-[#e8e8ec]">+</span> Commented <span className="font-bold text-[#e8e8ec]">&ldquo;{keyword}&rdquo;</span></li>
            <li className="flex gap-2"><span className="text-[#e8e8ec]">+</span> Liked the post</li>
          </ul>
          <a href={postUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-4 py-2.5 bg-[#e8e8ec] text-[#0c0c0e] text-sm font-bold rounded-lg hover:bg-white active:scale-[0.98] transition-all duration-150 cursor-pointer">
            Go to post &rarr;
          </a>
        </div>
        <p className="text-xs text-[#636366]">
          Already done? We&apos;ll verify and send <span className="text-[#a0a0a6]">{title}</span> within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#a0a0a6] mb-1.5">Full name</label>
        <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="As it appears on LinkedIn" disabled={status === "loading"}
          className="w-full px-4 py-3 bg-[#0c0c0e] border border-[#232326] rounded-lg text-[#e8e8ec] placeholder:text-[#636366] focus:outline-none focus:border-[#e8e8ec] transition-colors disabled:opacity-50" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#a0a0a6] mb-1.5">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" disabled={status === "loading"}
          className="w-full px-4 py-3 bg-[#0c0c0e] border border-[#232326] rounded-lg text-[#e8e8ec] placeholder:text-[#636366] focus:outline-none focus:border-[#e8e8ec] transition-colors disabled:opacity-50" />
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-[#a0a0a6] mb-1.5">Note <span className="text-[#636366]">(optional)</span></label>
        <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Anything you'd like to share..." disabled={status === "loading"} rows={2}
          className="w-full px-4 py-3 bg-[#0c0c0e] border border-[#232326] rounded-lg text-[#e8e8ec] placeholder:text-[#636366] focus:outline-none focus:border-[#e8e8ec] transition-colors disabled:opacity-50 resize-none text-sm" />
      </div>
      {status === "error" && <p className="text-sm text-red-400">{message}</p>}
      <button type="submit" disabled={status === "loading"}
        className="w-full py-3.5 bg-[#e8e8ec] text-[#0c0c0e] font-bold rounded-lg hover:bg-white active:scale-[0.98] transition-all duration-150 disabled:opacity-50 cursor-pointer">
        {status === "loading" ? "Submitting..." : `Get ${title}`}
      </button>
      <p className="text-xs text-[#636366] text-center">Use the same name as your LinkedIn profile.</p>
    </form>
  );
}
