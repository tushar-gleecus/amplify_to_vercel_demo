"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RevalidateButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [elapsed, setElapsed] = useState<string | null>(null);
  const router = useRouter();

  const handleRevalidate = async () => {
    setStatus("loading");
    setElapsed(null);
    const start = Date.now();

    try {
      const res = await fetch("/api/revalidate", { method: "POST" });
      const ms = Date.now() - start;

      if (!res.ok) throw new Error("Revalidation failed");

      setElapsed(`${ms}ms`);
      setStatus("done");
      // Trigger Next.js to re-fetch the server component
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        id="manual-revalidate-btn"
        onClick={handleRevalidate}
        disabled={status === "loading"}
        className="py-3 px-8 rounded-xl bg-white text-black font-bold text-sm hover:bg-slate-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
      >
        {status === "loading" ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Invalidating cache...
          </>
        ) : (
          <>
            <span>⚡</span> Trigger Revalidation Now
          </>
        )}
      </button>

      {status === "done" && elapsed && (
        <div className="text-center">
          <p className="text-emerald-400 font-bold text-lg">✓ Cache invalidated in {elapsed}</p>
          <p className="text-slate-400 text-xs mt-1">Page data refreshed from Sanity ↑</p>
        </div>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm">Revalidation failed — check console</p>
      )}
    </div>
  );
}
