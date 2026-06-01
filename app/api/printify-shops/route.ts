import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.PRINTIFY_API_TOKEN) {
    return NextResponse.json(
      { error: "Missing PRINTIFY_API_TOKEN" },
      { status: 500 }
    );
  }

  const response = await fetch("https://api.printify.com/v1/shops.json", {
    headers: {
      Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
    },
  });

  const data = await response.json();

  return NextResponse.json({
    ok: response.ok,
    status: response.status,
    data,
  });
}