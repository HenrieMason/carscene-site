import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SHOP_ID = "27277637";
const PRODUCT_ID = "6a1b0d7e4525ffd5730feadd";

export async function GET() {
  const response = await fetch(
    `https://api.printify.com/v1/shops/${SHOP_ID}/products/${PRODUCT_ID}.json`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
      },
    }
  );

  const data = await response.json();

  return NextResponse.json({
    ok: response.ok,
    status: response.status,
    id: data.id,
    title: data.title,
    blueprint_id: data.blueprint_id,
    print_provider_id: data.print_provider_id,
    variants: data.variants,
    print_areas: data.print_areas,
  });
}