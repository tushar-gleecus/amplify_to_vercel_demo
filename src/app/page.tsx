import type { Metadata } from "next";
import PublishButton from "@/components/PublishButton";

export const metadata: Metadata = {
  title: "On-Demand ISR Demo | Vercel vs AWS Amplify",
  description: "A live demonstration of why Vercel's On-Demand ISR is critical for Sanity CMS-powered websites — and why AWS Amplify can't deliver the same experience.",
};

// This fetches content from our simulated CMS endpoint
// The crucial part: `tags: ["news"]` registers this fetch with Vercel's cache
// When revalidateTag("news") is called, this page is instantly refreshed
async function getLatestNews() {
  const port = process.env.PORT || 3002;
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${port}`;

  const res = await fetch(`${baseUrl}/api/news`, {
    next: { tags: ["news"] }, // This is what makes On-Demand ISR work on Vercel
  });

  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json() as Promise<{
    headline: string;
    publishedAt: string;
    callCount: number;
  }>;
}

export default async function Home() {
  const news = await getLatestNews();
  const pageRenderedAt = new Date().toISOString();

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#cc2936] rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-red-900/40">
              AU
            </div>
            <span className="font-semibold text-white tracking-tight">Anurag University — ISR Demo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono hidden sm:block">powered by</span>
            <svg viewBox="0 0 76 65" fill="white" className="w-4 h-4">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            <span className="text-xs font-bold text-white">Vercel</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">

        {/* Hero */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-mono text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live ISR Demo — No Full Rebuild Required
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Content updates in{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              under 2 seconds
            </span>
            <br />
            <span className="text-slate-400 text-3xl sm:text-4xl">not 6 minutes.</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            This page demonstrates the key reason Anurag University should move from{" "}
            <span className="text-orange-400 font-semibold">AWS Amplify</span> to{" "}
            <span className="text-white font-semibold">Vercel</span> — On-Demand Incremental Static Regeneration.
          </p>
        </section>

        {/* Live News Card - The actual ISR demo */}
        <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 overflow-hidden shadow-2xl">
          <div className="bg-white/5 border-b border-white/10 px-6 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-slate-500 text-xs font-mono ml-2">anurag.edu.in — Live Website (Statically Cached)</span>
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
              <span className="text-xs font-mono bg-[#cc2936]/20 text-[#ff6b76] border border-[#cc2936]/30 px-3 py-1 rounded-full">
                📰 Latest News
              </span>
              <span className="text-xs font-mono text-slate-500">
                CMS fetch #{news.callCount}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mt-4 mb-3 leading-snug">
              {news.headline}
            </h2>

            <p className="text-sm text-slate-400 font-mono">
              Content published at:{" "}
              <span className="text-cyan-400">
                {new Date(news.publishedAt).toLocaleTimeString("en-IN", {
                  hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit"
                })}
              </span>
            </p>
          </div>

          <div className="bg-black/20 border-t border-white/5 px-6 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs font-mono text-slate-600">
              Page rendered at:{" "}
              <span className="text-slate-400">
                {new Date(pageRenderedAt).toLocaleTimeString("en-IN", {
                  hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit"
                })}
              </span>
              <span className="ml-2 text-slate-600">← this is the ISR cache timestamp</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ✓ Statically served from Vercel edge
            </span>
          </div>
        </section>

        {/* The Interactive Demo */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Try It — Simulate Publishing to Sanity CMS
            </h2>
            <p className="text-slate-400 text-sm">
              Click the buttons below to see the difference in how each platform handles a content update
            </p>
          </div>
          <PublishButton />
        </section>

        {/* How it works */}
        <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">How On-Demand ISR Works on Vercel</h2>

          <div className="space-y-3">
            {[
              { step: "1", label: "Page is built once at deploy time", detail: "The news headline is fetched from Sanity and cached on Vercel's global edge network. Visitors get sub-50ms responses from the nearest PoP." },
              { step: "2", label: "Editor publishes new content in Sanity", detail: "The editor hits 'Publish' in Sanity CMS. Sanity immediately fires a webhook to this website's /api/revalidate endpoint." },
              { step: "3", label: "revalidateTag(\"news\") is called", detail: "A single line of Next.js code tells Vercel: 'invalidate all cached pages that use the \"news\" tag'. This takes milliseconds." },
              { step: "4", label: "Next visitor gets fresh content", detail: "The very next request to this page triggers a background re-render. Fresh content, zero full rebuild, zero developer involvement." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-bold flex-shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{item.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-sm overflow-x-auto">
            <p className="text-slate-500 text-xs mb-3">// src/app/api/revalidate/route.ts — the entire solution</p>
            <p><span className="text-purple-400">import</span> <span className="text-yellow-300">{"{ revalidateTag }"}</span> <span className="text-purple-400">from</span> <span className="text-green-400">&apos;next/cache&apos;</span><span className="text-slate-400">;</span></p>
            <p className="mt-2"><span className="text-purple-400">export async function</span> <span className="text-blue-400">POST</span><span className="text-white">() {"{"}</span></p>
            <p className="ml-4"><span className="text-yellow-300">revalidateTag</span><span className="text-white">(</span><span className="text-green-400">&apos;news&apos;</span><span className="text-white">);</span> <span className="text-slate-600">{"// ← This is all it takes on Vercel"}</span></p>
            <p className="ml-4"><span className="text-purple-400">return</span> <span className="text-yellow-300">Response</span><span className="text-white">.</span><span className="text-blue-400">json</span><span className="text-white">({"{ revalidated: true }"});</span></p>
            <p><span className="text-white">{"}"}</span></p>
            <p className="mt-3 text-orange-400 text-xs">{"// On AWS Amplify: this file exists but revalidateTag() is silently ignored."}</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-slate-600 text-xs font-mono py-4 border-t border-white/5">
          Demo built for Anurag University infrastructure review — 2025
        </footer>
      </div>
    </main>
  );
}
