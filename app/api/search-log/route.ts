import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json({
    ok: true,
    message: "search log route is working",
  });
}