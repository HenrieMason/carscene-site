import { kv } from "@vercel/kv";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SHOP_ID = "27277637";
const PRINT_PROVIDER_ID = 99;

const POSTER_BLUEPRINT_ID = 1220;
const POSTER_VARIANT_ID = 101888;

const SHIRT_BLUEPRINT_ID = 706;

const SHIRT_VARIANT_IDS = {
  White: {
    S: 73199,
    M: 73203,
    L: 73207,
    XL: 73211,
    "2XL": 73215,
  },

  Black: {
    S: 73196,
    M: 73200,
    L: 73204,
    XL: 73208,
    "2XL": 73212,
  },

  "Blue Spruce": {
    S: 78896,
    M: 78897,
    L: 78898,
    XL: 78899,
    "2XL": 78900,
  },

  "True Navy": {
    // Printify calls this color "Navy"
    S: 73197,
    M: 73201,
    L: 73205,
    XL: 73209,
    "2XL": 73213,
  },

  Orchid: {
    S: 79036,
    M: 79037,
    L: 79038,
    XL: 79039,
    "2XL": 79040,
  },
} as const;

const CARSCENE_LOGO_URLS = {
  White:
    "https://res.cloudinary.com/dvcxnicew/image/upload/v1780373150/Red_Transparent-1_mffebp.png",

  Black:
    "https://res.cloudinary.com/dvcxnicew/image/upload/v1783589209/TransparentWhite_eqsijo.png",

  "Blue Spruce":
    "https://res.cloudinary.com/dvcxnicew/image/upload/v1783589209/TransparentWhite_eqsijo.png",

  "True Navy":
    "https://res.cloudinary.com/dvcxnicew/image/upload/v1783589209/TransparentWhite_eqsijo.png",

  Orchid:
    "https://res.cloudinary.com/dvcxnicew/image/upload/v1783589209/TransparentWhite_eqsijo.png",
} as const;

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

function verifyShopifyWebhook(
  rawBody: string,
  hmacHeader: string | null
): boolean {
  if (!hmacHeader || !process.env.SHOPIFY_WEBHOOK_SECRET) {
    return false;
  }

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
  return NextResponse.json({
    ok: true,
    message: "Shopify webhook route exists",
  });
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const hmac = req.headers.get("x-shopify-hmac-sha256");
  const topic = req.headers.get("x-shopify-topic");
  const webhookId = req.headers.get("x-shopify-webhook-id");

  console.log("WEBHOOK ID:", webhookId);

  const isValid = verifyShopifyWebhook(rawBody, hmac);

  if (!webhookId) {
    return NextResponse.json(
      { error: "Missing webhook id" },
      { status: 400 }
    );
  }

  /*
   * Verify the webhook BEFORE creating the duplicate lock.
   * This prevents an invalid webhook from permanently locking
   * the same webhook ID.
   */
  if (!isValid) {
    console.log("Invalid Shopify webhook");

    return NextResponse.json(
      { error: "Invalid webhook" },
      { status: 401 }
    );
  }

  const lockKey = `shopify-webhook:${webhookId}`;

  const alreadyProcessing = await kv.get(lockKey);

  if (alreadyProcessing) {
    console.log("Duplicate Shopify webhook skipped:", webhookId);

    return NextResponse.json({
      ok: true,
      duplicate: true,
    });
  }

  await kv.set(lockKey, "processing", {
    ex: 60 * 60 * 24 * 7,
  });

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

    const properties: ShopifyLineItemProperty[] =
      item.properties || [];

    console.log(
      "RAW PROPERTIES:",
      JSON.stringify(properties, null, 2)
    );

    /*
     * ----------------------------------------------------
     * DESIGN TYPE
     * ----------------------------------------------------
     *
     * Dream 3 should send:
     *
     * Design Type = Dream 3
     *
     * Dream 9 can send:
     *
     * Design Type = Dream 9
     *
     * If Design Type isn't present, we default to Dream 9
     * so existing Dream 9 orders continue working.
     */

    const designType =
      properties.find(
        (p: ShopifyLineItemProperty) =>
          p.name === "Design Type"
      )?.value || "Dream 9";

    const isDream3 = designType === "Dream 3";

    /*
     * ----------------------------------------------------
     * DESIGN URL
     * ----------------------------------------------------
     *
     * Supports all three property names:
     *
     * Design URL
     * Dream 3 Design URL
     * Dream 9 Design URL
     */

    const designUrl =
      properties.find(
        (p: ShopifyLineItemProperty) =>
          p.name === "Design URL"
      )?.value ||
      properties.find(
        (p: ShopifyLineItemProperty) =>
          p.name === "Dream 3 Design URL"
      )?.value ||
      properties.find(
        (p: ShopifyLineItemProperty) =>
          p.name === "Dream 9 Design URL"
      )?.value;

    /*
     * ----------------------------------------------------
     * PRODUCT TYPE
     * ----------------------------------------------------
     */

    const product =
      properties.find(
        (p: ShopifyLineItemProperty) =>
          p.name === "Product"
      )?.value ||
      properties.find(
        (p: ShopifyLineItemProperty) =>
          p.name === "Dream 3 Product"
      )?.value ||
      properties.find(
        (p: ShopifyLineItemProperty) =>
          p.name === "Dream 9 Product"
      )?.value;

    /*
     * ----------------------------------------------------
     * SIZE
     * ----------------------------------------------------
     */

    const size =
      properties.find(
        (p: ShopifyLineItemProperty) =>
          p.name === "Size"
      )?.value ||
      properties.find(
        (p: ShopifyLineItemProperty) =>
          p.name === "Dream 3 Size"
      )?.value ||
      properties.find(
        (p: ShopifyLineItemProperty) =>
          p.name === "Dream 9 Size"
      )?.value;

    /*
     * ----------------------------------------------------
     * COLOR
     * ----------------------------------------------------
     */

    const color =
      properties.find(
        (p: ShopifyLineItemProperty) =>
          p.name === "Color"
      )?.value ||
      properties.find(
        (p: ShopifyLineItemProperty) =>
          p.name === "Dream 3 Color"
      )?.value ||
      properties.find(
        (p: ShopifyLineItemProperty) =>
          p.name === "Dream 9 Color"
      )?.value;

    console.log("DESIGN TYPE:", designType);
    console.log("IS DREAM 3:", isDream3);
    console.log("DESIGN URL:", designUrl);
    console.log("PRODUCT:", product);
    console.log("SIZE:", size);
    console.log("COLOR:", color);

    /*
     * Ignore normal Shopify products that aren't
     * Dream 3 / Dream 9 custom products.
     */

    if (!designUrl || !product) {
      console.log(
        "Skipping unsupported custom item:",
        item.title
      );

      continue;
    }

    const result = await createPrintifyOrder({
      orderId: order.id,
      lineItemId: item.id,
      orderName: order.name,
      email: order.email,
      imageUrl: designUrl,
      productType: product,
      size: size || "18x24",
      color: color || "White",
      designType,
      shippingAddress: order.shipping_address,
    });

    console.log(
      "PRINTIFY RESULT:",
      JSON.stringify(result, null, 2)
    );

    results.push(result);
  }

  return NextResponse.json({
    ok: true,
    results,
  });
}

async function createPrintifyOrder({
  orderId,
  lineItemId,
  orderName,
  email,
  imageUrl,
  productType,
  size,
  color,
  designType,
  shippingAddress,
}: {
  orderId: number | string;
  lineItemId: number | string;
  orderName: string;
  email: string;
  imageUrl: string;
  productType: string;
  size: string;
  color: string;
  designType: string;
  shippingAddress: ShopifyShippingAddress;
}) {
  if (!process.env.PRINTIFY_API_TOKEN) {
    throw new Error("Missing PRINTIFY_API_TOKEN");
  }

  if (!shippingAddress) {
    throw new Error(
      "Missing Shopify shipping address"
    );
  }

  /*
   * ----------------------------------------------------
   * DETERMINE PRODUCT
   * ----------------------------------------------------
   */

  const isShirt = productType === "Shirt";
  const isDream3 = designType === "Dream 3";

  console.log("PRINTIFY DESIGN TYPE:", designType);
  console.log("IS SHIRT:", isShirt);
  console.log("IS DREAM 3:", isDream3);

  /*
   * Different external IDs for Dream 3 / Dream 9.
   */

  const designSlug = isDream3
    ? "dream3"
    : "dream9";

  const externalId =
    `shopify-${designSlug}-${orderId}-item-${lineItemId}`;

  console.log(
    "PRINTIFY EXTERNAL ID:",
    externalId
  );

  /*
   * ----------------------------------------------------
   * VARIANT
   * ----------------------------------------------------
   */

  const shirtColor =
    color as keyof typeof SHIRT_VARIANT_IDS;

  const shirtSize =
    size as keyof (typeof SHIRT_VARIANT_IDS)[keyof typeof SHIRT_VARIANT_IDS];

  const variantId = isShirt
    ? SHIRT_VARIANT_IDS[shirtColor]?.[shirtSize]
    : POSTER_VARIANT_ID;

  console.log(
    "SELECTED PRINTIFY VARIANT:",
    {
      designType,
      productType,
      color,
      size,
      shirtColor,
      shirtSize,
      variantId,
    }
  );

  if (!variantId) {
    throw new Error(
      `Missing Printify variant for ${productType} color ${color} size ${size}`
    );
  }

  /*
   * ----------------------------------------------------
   * UPLOAD CUSTOM DESIGN
   * ----------------------------------------------------
   */

  const imageResponse = await fetch(
    "https://api.printify.com/v1/uploads/images.json",
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        file_name:
          `${orderName.replace(
            "#",
            `${designSlug}-`
          )}-${productType.toLowerCase()}.png`,

        url: imageUrl,
      }),
    }
  );

  const imageData =
    await imageResponse.json();

  if (!imageResponse.ok) {
    return {
      ok: false,
      step: "upload-image",
      status: imageResponse.status,
      data: imageData,
    };
  }

  /*
   * ----------------------------------------------------
   * UPLOAD CARSCENE LOGO
   * ----------------------------------------------------
   *
   * DREAM 9 SHIRT:
   * Upload logo because it goes on front.
   *
   * DREAM 3 SHIRT:
   * DO NOT upload logo.
   *
   * POSTER:
   * No logo.
   */

  /*
   * ----------------------------------------------------
   * BUILD PRINTIFY PLACEHOLDERS
   * ----------------------------------------------------
   */

  let placeholders;

  /*
   * DREAM 3 SHIRT
   *
   * FRONT:
   * Dream 3 custom graphic
   *
   * BACK:
   * Nothing
   */

  if (isShirt) {
    placeholders = [
        {
        position: "front",
        images: [
            {
            id: imageData.id,
            x: 0.5,
            y: 0.50,
            scale: 0.85,
            angle: 0,
            },
        ],
        },
    ];
    }

  /*
   * POSTER
   */

  else {
    placeholders = [
      {
        position: "front",

        images: [
          {
            id: imageData.id,
            x: 0.5,
            y: 0.45,
            scale: 1,
            angle: 0,
          },
        ],
      },
    ];
  }

  /*
   * ----------------------------------------------------
   * CREATE PRINTIFY PRODUCT
   * ----------------------------------------------------
   */

  const productResponse = await fetch(
    `https://api.printify.com/v1/shops/${SHOP_ID}/products.json`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${process.env.PRINTIFY_API_TOKEN}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        title:
          `${designType} ${productType} ${orderName}`,

        description:
          `Custom ${designType} ${productType.toLowerCase()} ` +
          `for Shopify order ${orderName}. ` +
          `Color: ${color}. Size: ${size}.`,

        blueprint_id: isShirt
          ? SHIRT_BLUEPRINT_ID
          : POSTER_BLUEPRINT_ID,

        print_provider_id:
          PRINT_PROVIDER_ID,

        variants: [
          {
            id: variantId,

            price: isShirt
              ? 2999
              : 1999,

            is_enabled: true,
          },
        ],

        print_areas: [
          {
            variant_ids: [variantId],

            placeholders,
          },
        ],
      }),
    }
  );

  const productData =
    await productResponse.json();

  if (!productResponse.ok) {
    return {
      ok: false,
      step: "create-product",
      status: productResponse.status,
      data: productData,
    };
  }

  /*
   * ----------------------------------------------------
   * CREATE PRINTIFY ORDER
   * ----------------------------------------------------
   */

  const orderResponse = await fetch(
    `https://api.printify.com/v1/shops/${SHOP_ID}/orders.json`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${process.env.PRINTIFY_API_TOKEN}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        external_id:
          externalId,

        label:
          `${designType} ${productType} ${orderName}`,

        line_items: [
          {
            product_id:
              productData.id,

            variant_id:
              variantId,

            quantity: 1,
          },
        ],

        shipping_method: 1,

        send_shipping_notification:
          false,

        address_to: {
          first_name:
            shippingAddress.first_name ||
            "Customer",

          last_name:
            shippingAddress.last_name ||
            "",

          email,

          phone:
            shippingAddress.phone ||
            "",

          country:
            shippingAddress.country_code ||
            "US",

          region:
            shippingAddress.province_code ||
            shippingAddress.province ||
            "",

          address1:
            shippingAddress.address1 ||
            "",

          address2:
            shippingAddress.address2 ||
            "",

          city:
            shippingAddress.city ||
            "",

          zip:
            shippingAddress.zip ||
            "",
        },
      }),
    }
  );

  const orderData =
    await orderResponse.json();

  if (
    !orderResponse.ok &&
    orderResponse.status === 400
  ) {
    console.log(
      "Likely duplicate Printify order:",
      orderData
    );
  }

  return {
    ok: orderResponse.ok,
    step: "create-order",
    status: orderResponse.status,

    design_type:
      designType,

    uploaded_image_id:
      imageData.id,

    uploaded_logo_id: null,

    product_id:
      productData.id,

    printify_order:
      orderData,

    productType,
    size,
  };
}