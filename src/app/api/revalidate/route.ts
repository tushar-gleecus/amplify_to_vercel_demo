// This is the On-Demand ISR revalidation endpoint
// Called by Sanity webhook when content is published
// On Vercel → works perfectly, invalidating cached pages instantly
// On AWS Amplify → this silently does nothing (the core problem!)

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    revalidateTag("isr-demo");

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
