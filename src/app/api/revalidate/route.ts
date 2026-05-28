// Sanity webhook endpoint — CDN cache buster for new visitors.
//
// <SanityLive /> in layout.tsx handles real-time updates for users who
// already have the page open (via SSE + router.refresh()).
//
// This webhook handles the complementary case: new visitors who load the
// page cold from Vercel's Edge CDN. When Sanity publishes, this endpoint
// is called and clears the CDN cache so those visitors also get fresh content.

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Small delay to ensure Sanity has fully persisted the document
    // before Next.js re-fetches it on the next request
    await new Promise((resolve) => setTimeout(resolve, 500));

    let body: { _type?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Sanity may send an empty body on some trigger types
    }

    const tag = body._type || "isr-demo";
    console.log(`[ISR Demo] Webhook received — revalidating tag: "${tag}"`);

    // Use 'max' cache profile — consistent with how next-sanity's SanityLive
    // internally revalidates sync tags via revalidateSyncTagsAction
    revalidateTag(tag, "max" as never);

    return NextResponse.json({
      revalidated: true,
      tag,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { revalidated: false, error: String(err) },
      { status: 500 }
    );
  }
}
