import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SanityLive } from "@/sanity/client";

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
            When any content is published, it automatically calls router.refresh()
            — updating the page instantly without any manual browser refresh. */}
        <SanityLive />
      </body>
    </html>
  );
}
