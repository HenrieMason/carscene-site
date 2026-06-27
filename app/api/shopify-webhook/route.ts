import crypto from "crypto";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SHOP_ID = "27277637";
const PRINT_PROVIDER_ID = 99;

const POSTER_BLUEPRINT_ID = 1220;
const POSTER_VARIANT_ID = 101888;

const SHIRT_BLUEPRINT_ID = 706;
const SHIRT_VARIANT_IDS = {
  M: 73203,
  L: 73207,
  XL: 73211,
  "2XL": 73215,
} as const;

const CARSCENE_LOGO_URL =
  "https://res.cloudinary.com/dvcxnicew/image/upload/v1780373150/Red_Transparent-1_mffebp.png";

type ShopifyLineItemProperty = {
  name: string;
  value: string;
};

type ShopifyShippingAddress = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  country_code?: string;
  province_code?: string;
  province?: string;
  address1?: string;
  address2?: string;
  city?: string;
  zip?: string;
};

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

  const webhookId = req.headers.get("x-shopify-webhook-id");
    console.log("WEBHOOK ID:", webhookId);

  const isValid = verifyShopifyWebhook(rawBody, hmac);

  if (!webhookId) {
    return NextResponse.json({ error: "Missing webhook id" }, { status: 400 });
  }

  const lockKey = `shopify-webhook:${webhookId}`;

  const alreadyProcessing = await kv.get(lockKey);

  if (alreadyProcessing) {
    console.log("Duplicate Shopify webhook skipped:", webhookId);
    return NextResponse.json({ ok: true, duplicate: true });
  }

  await kv.set(lockKey, "processing", { ex: 60 * 60 * 24 * 7 });

  if (!isValid) {
    console.log("Invalid Shopify webhook");
    return NextResponse.json({ error: "Invalid webhook" }, { status: 401 });
  }

  const order = JSON.parse(rawBody);

  console.log("SHOPIFY WEBHOOK RECEIVED");
  console.log("Topic:", topic);
  console.log("Order:", order.name);
  console.log("Email:", order.email);

  const results = [];

  for (const item of order.line_items || []) {
    console.log("ITEM TITLE:", item.title);
    console.log("VARIANT ID:", item.variant_id);
    console.log("QUANTITY:", item.quantity);

    const properties = item.properties || [];
    console.log("RAW PROPERTIES:", JSON.stringify(properties, null, 2));

    const dream9DesignUrl = properties.find(
      (p: ShopifyLineItemProperty) => p.name === "Dream 9 Design URL"
    )?.value;

    const dream9Product = properties.find(
      (p: ShopifyLineItemProperty) => p.name === "Dream 9 Product"
    )?.value;

    const dream9Size = properties.find(
      (p: ShopifyLineItemProperty) => p.name === "Dream 9 Size"
    )?.value;

    console.log("DREAM 9 DESIGN URL:", dream9DesignUrl);
    console.log("DREAM 9 PRODUCT:", dream9Product);
    console.log("DREAM 9 SIZE:", dream9Size);

    if (!dream9DesignUrl || !dream9Product) {
      console.log("Skipping non-Dream 9 item:", item.title);
      continue;
    }

    const result = await createPrintifyOrder({
      orderId: order.id,
      lineItemId: item.id,
      orderName: order.name,
      email: order.email,
      imageUrl: dream9DesignUrl,
      productType: dream9Product,
      size: dream9Size || "18x24",
      shippingAddress: order.shipping_address,
    });

    console.log("PRINTIFY RESULT:", JSON.stringify(result, null, 2));
    results.push(result);
  }

  return NextResponse.json({ ok: true, results });
}

async function createPrintifyOrder({
  orderId,
  lineItemId,
  orderName,
  email,
  imageUrl,
  productType,
  size,
  shippingAddress,
}: {
  orderId: number | string;
  lineItemId: number | string;
  orderName: string;
  email: string;
  imageUrl: string;
  productType: string;
  size: string;
  shippingAddress: ShopifyShippingAddress;
}) {
  if (!process.env.PRINTIFY_API_TOKEN) {
    throw new Error("Missing PRINTIFY_API_TOKEN");
  }

  if (!shippingAddress) {
    throw new Error("Missing Shopify shipping address");
  }

  const externalId = `shopify-dream9-${productType.toLowerCase()}-${orderId}-item-${lineItemId}`;
    console.log("PRINTIFY EXTERNAL ID:", externalId);

  const isShirt = productType === "Shirt";

  const variantId = isShirt
    ? SHIRT_VARIANT_IDS[size as keyof typeof SHIRT_VARIANT_IDS]
    : POSTER_VARIANT_ID;

  if (!variantId) {
    throw new Error(`Missing Printify variant for ${productType} size ${size}`);
  }

  const imageResponse = await fetch("https://api.printify.com/v1/uploads/images.json", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file_name: `${orderName.replace("#", "dream9-")}-${productType.toLowerCase()}.png`,
      url: imageUrl,
    }),
  });

  const imageData = await imageResponse.json();

  if (!imageResponse.ok) {
    return {
      ok: false,
      step: "upload-image",
      status: imageResponse.status,
      data: imageData,
    };
  }

  let logoImageData: { id: string } | null = null;

  if (isShirt) {
    const logoResponse = await fetch("https://api.printify.com/v1/uploads/images.json", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_name: "carscene-logo.png",
        url: CARSCENE_LOGO_URL,
      }),
    });

    logoImageData = await logoResponse.json();

    if (!logoResponse.ok) {
      return {
        ok: false,
        step: "upload-logo",
        status: logoResponse.status,
        data: logoImageData,
      };
    }
  }

  const productResponse = await fetch(
    `https://api.printify.com/v1/shops/${SHOP_ID}/products.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `Dream 9 ${productType} ${orderName}`,
        description: `Custom Dream 9 ${productType.toLowerCase()} for Shopify order ${orderName}. Size: ${size}.`,
        blueprint_id: isShirt ? SHIRT_BLUEPRINT_ID : POSTER_BLUEPRINT_ID,
        print_provider_id: PRINT_PROVIDER_ID,
        variants: [
          {
            id: variantId,
            price: isShirt ? 2999 : 1999,
            is_enabled: true,
          },
        ],
        print_areas: [
          {
            variant_ids: [variantId],
            placeholders: isShirt
              ? [
                  {
                    position: "front",
                    images: [
                      {
                        id: logoImageData!.id,
                        x: 0.22,
                        y: 0.08,
                        scale: 0.21,
                        angle: 0,
                      },
                    ],
                  },
                  {
                    position: "back",
                    images: [
                      {
                        id: imageData.id,
                        x: 0.5,
                        y: 0.36,
                        scale: 0.82,
                        angle: 0,
                      },
                    ],
                  },
                ]
              : [
                  {
                    position: "front",
                    images: [
                      {
                        id: imageData.id,
                        x: 0.5,
                        y: 0.5,
                        scale: 1,
                        angle: 0,
                      },
                    ],
                  },
                ],
          },
        ],
      }),
    }
  );

  const productData = await productResponse.json();

  if (!productResponse.ok) {
    return {
      ok: false,
      step: "create-product",
      status: productResponse.status,
      data: productData,
    };
  }

  const orderResponse = await fetch(
    `https://api.printify.com/v1/shops/${SHOP_ID}/orders.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_id: externalId,
        label: `Dream 9 ${productType} ${orderName}`,
        line_items: [
          {
            product_id: productData.id,
            variant_id: variantId,
            quantity: 1,
          },
        ],
        shipping_method: 1,
        send_shipping_notification: false,
        address_to: {
          first_name: shippingAddress.first_name || "Customer",
          last_name: shippingAddress.last_name || "",
          email,
          phone: shippingAddress.phone || "",
          country: shippingAddress.country_code || "US",
          region: shippingAddress.province_code || shippingAddress.province || "",
          address1: shippingAddress.address1 || "",
          address2: shippingAddress.address2 || "",
          city: shippingAddress.city || "",
          zip: shippingAddress.zip || "",
        },
      }),
    }
  );

  const orderData = await orderResponse.json();

  return {
    ok: orderResponse.ok,
    step: "create-order",
    status: orderResponse.status,
    uploaded_image_id: imageData.id,
    uploaded_logo_id: logoImageData?.id || null,
    product_id: productData.id,
    printify_order: orderData,
    productType,
    size,
  };
}