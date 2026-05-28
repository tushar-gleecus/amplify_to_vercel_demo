import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/live";

export const metadata: Metadata = {
  title: "On-Demand ISR Demo | Vercel vs AWS Amplify",
  description:
    "A live demonstration of why Vercel's On-Demand ISR is critical for Sanity CMS-powered websites — and why AWS Amplify can't deliver the same experience.",
};

// GROQ query for the single ISR demo document
const ISR_DEMO_QUERY = `*[_type == "isrDemoContent" && _id == "isr-demo-content"][0]{
  headline,
  subtext,
  lastUpdatedLabel,
  badgeText,
  _updatedAt
}`;

type IsrDemoContent = {
  headline: string;
  subtext: string | null;
  lastUpdatedLabel: string | null;
  badgeText: string | null;
  _updatedAt: string;
};

// sanityFetch() is the correct way to fetch Sanity data in a Next.js + Vercel setup.
// It automatically registers Sanity's content sync tags for the query result,
// which means <SanityLive /> in layout.tsx knows exactly when to call router.refresh()
// — giving instant, no-manual-refresh updates when content is published in Sanity Studio.
async function getIsrDemoContent(): Promise<IsrDemoContent | null> {
  const { data } = await sanityFetch({ query: ISR_DEMO_QUERY });
  return (data as IsrDemoContent) || null;
}

export default async function Home() {
  const content = await getIsrDemoContent();
  const pageRenderedAt = new Date().toISOString();

  const headline = content?.headline ?? "No content yet — create the ISR Demo document in Sanity Studio";
  const subtext = content?.subtext ?? null;
  const lastUpdatedLabel = content?.lastUpdatedLabel ?? null;
  const badgeText = content?.badgeText ?? "📢 Breaking News";
  const sanityUpdatedAt = content?._updatedAt ?? null;

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
            Live ISR Demo — Real Sanity CMS Content
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
            Edit the{" "}
            <span className="text-emerald-400 font-semibold">ISR Demo Content</span> document in{" "}
            <span className="text-white font-semibold">Sanity Studio</span> and publish. Watch this page
            update instantly while the Amplify site stays stale.
          </p>
        </section>

        {/* Live Content Card — Real Sanity Data */}
        <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 overflow-hidden shadow-2xl">
          <div className="bg-white/5 border-b border-white/10 px-6 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-slate-500 text-xs font-mono ml-2">vercel-isr-demo.vercel.app — Live from Sanity CMS</span>
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
              <span className="text-xs font-mono bg-[#cc2936]/20 text-[#ff6b76] border border-[#cc2936]/30 px-3 py-1 rounded-full">
                {badgeText}
              </span>
              <span className="text-xs font-mono text-slate-500">
                🟢 Live from Sanity
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mt-4 mb-3 leading-snug">
              {headline}
            </h2>

            {subtext && (
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{subtext}</p>
            )}

            {lastUpdatedLabel && (
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 mt-2">
                <span className="text-emerald-400 text-xs font-mono">✏️ {lastUpdatedLabel}</span>
              </div>
            )}

            {sanityUpdatedAt && (
              <p className="text-sm text-slate-400 font-mono mt-4">
                Sanity published at:{" "}
                <span className="text-cyan-400">
                  {new Date(sanityUpdatedAt).toLocaleTimeString("en-IN", {
                    hour12: true,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </p>
            )}
          </div>

          <div className="bg-black/20 border-t border-white/5 px-6 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs font-mono text-slate-600">
              Page rendered at:{" "}
              <span className="text-slate-400">
                {new Date(pageRenderedAt).toLocaleTimeString("en-IN", {
                  hour12: true,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
              <span className="ml-2 text-slate-600">← ISR cache timestamp</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ✓ Statically served from Vercel edge
            </span>
          </div>
        </section>

        {/* Side-by-side comparison */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Open Both Sites Side-by-Side
            </h2>
            <p className="text-slate-400 text-sm">
              Go to Sanity Studio → ISR Demo Content → change the headline → Publish. Watch the difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vercel side */}
            <div className="relative rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6">
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
                  <p className="text-white font-bold text-sm">This Site (Vercel)</p>
                  <p className="text-emerald-400 text-xs font-mono">On-Demand ISR ✓ + Sanity Webhook</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm mb-5 leading-relaxed">
                Sanity publishes → webhook fires → <span className="text-emerald-400 font-semibold">cache invalidated instantly</span> → next visitor sees fresh content. No rebuild.
              </p>

              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-center">
                <p className="text-emerald-400 text-xs font-mono">⚡ revalidateTag("isr-demo", &#123; expire: 0 &#125;)</p>
                <p className="text-slate-500 text-xs mt-1">Triggered by Sanity webhook on every publish</p>
              </div>
            </div>

            {/* Amplify side */}
            <div className="relative rounded-2xl border border-orange-500/30 bg-orange-950/20 p-6">
              <div className="absolute top-3 right-3">
                <span className="text-xs text-orange-400 font-mono font-semibold bg-orange-500/10 px-2 py-0.5 rounded-full">⚠ NO ON-DEMAND ISR</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#232F3E] rounded-lg flex items-center justify-center shadow">
                  <svg className="w-5 h-5" viewBox="0 0 40 40" fill="none">
                    <path d="M20 5L35 30H5L20 5Z" fill="#FF9900" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">anurag.edu.in/isr-demo (Amplify)</p>
                  <p className="text-orange-400 text-xs font-mono">On-Demand ISR ✗ — 60s cache only</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm mb-5 leading-relaxed">
                Sanity publishes → <span className="text-orange-400 font-semibold">nothing happens immediately</span>. Page shows stale content for up to 60 seconds (time-based revalidation only).
              </p>

              <div className="rounded-xl bg-orange-500/10 border border-orange-500/30 p-3 text-center">
                <p className="text-orange-400 text-xs font-mono">revalidate: 60 — waits for TTL expiry</p>
                <p className="text-slate-500 text-xs mt-1">No webhook support. Needs full redeploy for instant updates.</p>
              </div>
            </div>
          </div>
        </section>



        {/* How it works */}
        <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">How On-Demand ISR Works on Vercel</h2>

          <div className="space-y-3">
            {[
              { step: "1", label: "Page is built once at deploy time", detail: "The ISR Demo Content is fetched from Sanity and cached on Vercel's global edge network. Visitors get sub-50ms responses from the nearest PoP." },
              { step: "2", label: "Editor publishes new content in Sanity", detail: "The editor hits 'Publish' in Sanity Studio. Sanity immediately fires a webhook to this website's /api/revalidate endpoint." },
              { step: "3", label: 'revalidateTag("isr-demo", { expire: 0 }) is called', detail: "A single line of Next.js code tells Vercel: 'immediately expire all cached pages using the \"isr-demo\" tag'. This takes milliseconds." },
              { step: "4", label: "Next visitor gets fresh content", detail: "The very next request to this page fetches fresh data from Sanity. Fresh content, zero full rebuild, zero developer involvement." },
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
            <p className="ml-4"><span className="text-yellow-300">revalidateTag</span><span className="text-white">(</span><span className="text-green-400">&apos;isr-demo&apos;</span><span className="text-white">,</span> <span className="text-yellow-300">{"{ expire: 0 }"}</span><span className="text-white">);</span> <span className="text-slate-600">{"// ← Instant invalidation"}</span></p>
            <p className="ml-4"><span className="text-purple-400">return</span> <span className="text-yellow-300">Response</span><span className="text-white">.</span><span className="text-blue-400">json</span><span className="text-white">{"({ revalidated: true })"}</span><span className="text-slate-400">;</span></p>
            <p><span className="text-white">{"}"}</span></p>
            <p className="mt-3 text-orange-400 text-xs">{"// On AWS Amplify: revalidateTag() is called but has no effect. Cache only expires by TTL."}</p>
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
