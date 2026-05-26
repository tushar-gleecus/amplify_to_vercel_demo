"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PublishButton() {
  const [status, setStatus] = useState<"idle" | "publishing" | "done" | "amplify">("idle");
  const [revalidateTime, setRevalidateTime] = useState<string | null>(null);
  const [amplifyTimer, setAmplifyTimer] = useState(0);
  const router = useRouter();

  const handleVercelPublish = async () => {
    setStatus("publishing");
    const start = Date.now();

    try {
      await fetch("/api/revalidate", { method: "POST" });
      const elapsed = Date.now() - start;
      setRevalidateTime(`${elapsed}ms`);
      setStatus("done");
      // Refresh the server component data
      router.refresh();
    } catch {
      setStatus("idle");
    }
  };

  const handleAmplifyPublish = () => {
    setStatus("amplify");
    setAmplifyTimer(0);
    const interval = setInterval(() => {
      setAmplifyTimer((t) => {
        if (t >= 100) {
          clearInterval(interval);
          setStatus("idle");
          return 0;
        }
        return t + 1;
      });
    }, 3600); // simulate ~6 min build at 3.6s per %
  };

  return (
    <div className="space-y-8">
      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Vercel Side */}
        <div className="relative rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 overflow-hidden">
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-emerald-400 font-mono font-semibold">LIVE</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow">
              <svg viewBox="0 0 76 65" fill="white" className="w-4 h-4">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Hosted on Vercel</p>
              <p className="text-emerald-400 text-xs font-mono">On-Demand ISR ✓</p>
            </div>
          </div>

          <p className="text-slate-300 text-sm mb-5 leading-relaxed">
            Editor publishes in Sanity → webhook fires → cache invalidated → <span className="text-emerald-400 font-semibold">live site updates instantly</span>. No developer needed.
          </p>

          {status === "done" ? (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-center">
              <p className="text-emerald-400 text-2xl font-bold mb-1">✓ Published!</p>
              <p className="text-emerald-300 text-sm">Cache invalidated in <span className="font-mono font-bold">{revalidateTime}</span></p>
              <p className="text-slate-400 text-xs mt-1">Page refreshed with new content ↑</p>
            </div>
          ) : (
            <button
              onClick={handleVercelPublish}
              disabled={status === "publishing" || status === "amplify"}
              className="w-full py-3 px-6 rounded-xl bg-white text-black font-bold text-sm hover:bg-slate-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {status === "publishing" ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Invalidating cache...
                </>
              ) : (
                <>
                  <span>🚀</span> Simulate Sanity Publish → Vercel
                </>
              )}
            </button>
          )}
        </div>

        {/* Amplify Side */}
        <div className="relative rounded-2xl border border-orange-500/30 bg-orange-950/20 p-6 overflow-hidden">
          <div className="absolute top-3 right-3">
            <span className="text-xs text-orange-400 font-mono font-semibold bg-orange-500/10 px-2 py-0.5 rounded-full">⚠ NO ISR</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#232F3E] rounded-lg flex items-center justify-center shadow">
              <svg className="w-5 h-5" viewBox="0 0 40 40" fill="none">
                <path d="M20 5L35 30H5L20 5Z" fill="#FF9900"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Hosted on AWS Amplify</p>
              <p className="text-orange-400 text-xs font-mono">On-Demand ISR ✗ Not Supported</p>
            </div>
          </div>

          <p className="text-slate-300 text-sm mb-5 leading-relaxed">
            Editor publishes in Sanity → <span className="text-orange-400 font-semibold">nothing happens</span>. Developer must manually trigger a full site re-deploy (5–8 mins).
          </p>

          {status === "amplify" ? (
            <div className="rounded-xl bg-orange-500/10 border border-orange-500/30 p-4">
              <div className="flex justify-between text-xs text-orange-300 mb-2 font-mono">
                <span>🔄 Full site rebuilding...</span>
                <span>{amplifyTimer}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${amplifyTimer}%` }}
                />
              </div>
              <p className="text-slate-400 text-xs mt-2 text-center">
                ~{Math.max(0, Math.ceil((100 - amplifyTimer) * 3.6))}s remaining
              </p>
            </div>
          ) : (
            <button
              onClick={handleAmplifyPublish}
              disabled={status === "publishing"}
              className="w-full py-3 px-6 rounded-xl bg-[#FF9900] text-black font-bold text-sm hover:bg-orange-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              <span>🔄</span> Simulate Sanity Publish → Amplify
            </button>
          )}
        </div>
      </div>

      {/* Reset note */}
      {status === "done" && (
        <p className="text-center text-slate-500 text-xs">
          Click publish again to cycle to the next news headline →
        </p>
      )}
    </div>
  );
}
