// This is the On-Demand ISR revalidation endpoint
// On Vercel → this works perfectly, invalidating only affected cached pages
// On AWS Amplify → this silently does nothing (the core problem!)

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // This single call tells Vercel's edge cache to invalidate
    // ONLY pages that use the "news" tag — no full rebuild needed!
    revalidateTag("news");

    return NextResponse.json({
      revalidated: true,
      message: "Cache invalidated for tag: news",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { revalidated: false, error: String(err) },
      { status: 500 }
    );
  }
}
