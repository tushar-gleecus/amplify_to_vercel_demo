import { defineLive } from "next-sanity/live";
import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Server-only token — used by sanityFetch() in Server Components
  serverToken: process.env.SANITY_API_READ_TOKEN,
  // Browser-safe token — used by <SanityLive /> to subscribe to live events
  browserToken: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
