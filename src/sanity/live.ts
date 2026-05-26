import { defineLive } from "next-sanity/live";
import { sanityClient } from "./client";

const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

export { sanityFetch, SanityLive };
