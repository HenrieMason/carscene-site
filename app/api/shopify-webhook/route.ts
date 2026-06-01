import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifyShopifyWebhook(rawBody: string, hmacHeader: string | null): boolean {
  if (!hmacHeader || !process.env.SHOPIFY_WEBHOOK_SECRET) return false;

  const digest = crypto
    .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET)
    .update(rawBody, "utf8")
    .digest("base64");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(digest, "utf8"),
      Buffer.from(hmacHeader, "utf8")
    );
  } catch {
    return false;
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Shopify webhook route exists" });
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const hmac = req.headers.get("x-shopify-hmac-sha256");
  const topic = req.headers.get("x-shopify-topic");

  const isValid = verifyShopifyWebhook(rawBody, hmac);

  if (!isValid) {
    console.log("Invalid Shopify webhook");
    return NextResponse.json({ error: "Invalid webhook" }, { status: 401 });
  }

  const order = JSON.parse(rawBody);

  console.log("SHOPIFY WEBHOOK RECEIVED");
  console.log("Topic:", topic);
  console.log("Order:", order.name);
  console.log("Email:", order.email);

  for (const item of order.line_items || []) {
    console.log("ITEM TITLE:", item.title);
    console.log("VARIANT ID:", item.variant_id);
    console.log("QUANTITY:", item.quantity);

    const properties = item.properties || [];
    console.log("RAW PROPERTIES:", JSON.stringify(properties, null, 2));

    const dream9DesignUrl = properties.find(
      (p: { name: string; value: string }) => p.name === "Dream 9 Design URL"
    )?.value;

    const dream9Product = properties.find(
      (p: { name: string; value: string }) => p.name === "Dream 9 Product"
    )?.value;

    const dream9Size = properties.find(
      (p: { name: string; value: string }) => p.name === "Dream 9 Size"
    )?.value;

    console.log("DREAM 9 DESIGN URL:", dream9DesignUrl);
    console.log("DREAM 9 PRODUCT:", dream9Product);
    console.log("DREAM 9 SIZE:", dream9Size);
  }

  return NextResponse.json({ ok: true });
}