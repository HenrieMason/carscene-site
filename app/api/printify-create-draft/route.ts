import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SHOP_ID = "27277637";
const BLUEPRINT_ID = 1220;
const PRINT_PROVIDER_ID = 99;
const POSTER_VARIANT_ID = 101888;

export async function GET() {
  const imageUrl =
    "https://res.cloudinary.com/dvcxnicew/image/upload/v1780285111/vkyiejxnhdst65wq4akl.png";

  const imageResponse = await fetch("https://api.printify.com/v1/uploads/images.json", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file_name: `dream9-${Date.now()}.png`,
      url: imageUrl,
    }),
  });

  const imageData = await imageResponse.json();

  if (!imageResponse.ok) {
    return NextResponse.json({
      ok: false,
      step: "upload-image",
      status: imageResponse.status,
      data: imageData,
    });
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
        title: `Dream 9 Test ${Date.now()}`,
        description: "Test Dream 9 poster created by API.",
        blueprint_id: BLUEPRINT_ID,
        print_provider_id: PRINT_PROVIDER_ID,
        variants: [
          {
            id: POSTER_VARIANT_ID,
            price: 1999,
            is_enabled: true,
          },
        ],
        print_areas: [
          {
            variant_ids: [POSTER_VARIANT_ID],
            placeholders: [
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

  return NextResponse.json({
    ok: productResponse.ok,
    status: productResponse.status,
    uploaded_image_id: imageData.id,
    data: productData,
  });
}