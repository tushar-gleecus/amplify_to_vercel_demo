import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SanityLive } from "@/sanity/live";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "On-Demand ISR Demo | Vercel vs AWS Amplify",
  description: "Live demo showing why Vercel's On-Demand ISR is essential for Sanity-powered university websites",
};

import { revalidateSyncTagsAction } from "next-sanity/live/server-actions";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* SanityLive opens a persistent SSE connection to Sanity's Live Content API.
            When any content is published, it triggers the server action below. */}
        <SanityLive 
          action={async (unsafeTags) => {
            "use server";
            // 1. Revalidate the Next.js cache tags (using next-sanity's default action)
            await revalidateSyncTagsAction(unsafeTags);
            
            // 2. Wait 1.5 seconds to ensure Vercel's Edge Network has fully propagated 
            // the cache invalidation across all global nodes.
            // Without this delay, the immediate router.refresh() might fetch stale data.
            await new Promise((resolve) => setTimeout(resolve, 1500));
            
            // 3. Trigger router.refresh() in the browser to fetch the new content
            return "refresh";
          }}
        />
      </body>
    </html>
  );
}
