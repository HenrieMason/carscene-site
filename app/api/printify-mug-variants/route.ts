import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MUG_BLUEPRINT_ID = 478;
const MUG_PRINT_PROVIDER_ID = 99;

export async function GET() {
  if (!process.env.PRINTIFY_API_TOKEN) {
    return NextResponse.json(
      { error: "Missing PRINTIFY_API_TOKEN" },
      { status: 500 }
    );
  }

  const response = await fetch(
    `https://api.printify.com/v1/catalog/blueprints/${MUG_BLUEPRINT_ID}/print_providers/${MUG_PRINT_PROVIDER_ID}/variants.json`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  return NextResponse.json({
    blueprint_id: MUG_BLUEPRINT_ID,
    print_provider_id: MUG_PRINT_PROVIDER_ID,
    variants: data,
  });
}