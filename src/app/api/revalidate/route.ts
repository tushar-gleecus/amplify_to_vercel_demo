// This is the On-Demand ISR revalidation endpoint
// Called by Sanity webhook when content is published
// On Vercel → works perfectly, invalidating cached pages instantly
// On AWS Amplify → this silently does nothing (the core problem!)

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Add a small delay to ensure Sanity's persistence is finished before Next.js re-fetches
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Next.js 16: revalidateTag requires a second argument.
    // { expire: 0 } = immediate expiry — required for webhook-triggered revalidation
    revalidateTag("isr-demo", { expire: 0 });

    return NextResponse.json({
      revalidated: true,
      message: "Cache invalidated for tag: isr-demo",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { revalidated: false, error: String(err) },
      { status: 500 }
    );
  }
}
