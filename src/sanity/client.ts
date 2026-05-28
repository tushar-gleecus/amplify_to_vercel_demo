import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "v1rb7aqk",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-02-19",
  useCdn: false,
});

// defineLive() sets up the full Live Content API integration:
// - sanityFetch: server-side fetch that auto-registers Sanity sync tags
// - SanityLive: client component that opens a persistent SSE connection
//   and calls router.refresh() automatically when Sanity publishes content
export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Server-only token — used by sanityFetch() in Server Components
  serverToken: process.env.SANITY_API_READ_TOKEN,
  // Browser-safe token — used by <SanityLive /> to subscribe to live events
  browserToken: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
