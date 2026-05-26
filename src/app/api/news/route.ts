// Simulates a Sanity CMS content endpoint
// Each call returns the current headline + exact timestamp it was fetched

import { NextResponse } from "next/server";

const headlines = [
  "Anurag University Ranks Among Top 50 Private Universities in India 2025",
  "New AI & Machine Learning Lab Inaugurated at School of Engineering",
  "Anurag University Students Win National Hackathon Championship",
  "Record 95% Placement Rate Achieved for 2024 Batch",
  "Anurag University Partners with Microsoft for Cloud Computing Program",
  "International Conference on Emerging Technologies Hosted Successfully",
  "Anurag University Receives NAAC A+ Accreditation",
  "New Research Centre for Renewable Energy Launched on Campus",
];

let callCount = 0;

export async function GET(request: Request) {
  const headline = headlines[callCount % headlines.length];
  callCount++;

  return NextResponse.json({
    headline,
    publishedAt: new Date().toISOString(),
    callCount,
  });
}
