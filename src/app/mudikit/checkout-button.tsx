"use client";

import { useState } from "react";

export function CheckoutButton({ email, label }: { email?: string; label: string }) {
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email ? { email } : {}),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
        alert(data.error || "Checkout unavailable. Try again later.");
      }
    } catch {
      setLoading(false);
      alert("Network error. Try again.");
    }
  }

  return (
    <button
      onClick={go}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#e8e8ec] text-[#0a0a0c] text-sm font-bold tracking-wide rounded-md transition-all duration-150 hover:bg-white active:scale-[0.99] disabled:opacity-60"
    >
      {loading ? "Opening checkout..." : label}
      {!loading && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 7H11M8 4L11 7L8 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
