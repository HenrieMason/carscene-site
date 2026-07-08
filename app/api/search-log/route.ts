import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    hasUrl: !!process.env.SUPABASE_URL,
    hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    url: process.env.SUPABASE_URL,
    keyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 12),
  });
}