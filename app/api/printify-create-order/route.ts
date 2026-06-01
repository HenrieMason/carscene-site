import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SHOP_ID = "27277637";
const PRODUCT_ID = "6a1d04e7ec6cc8a96c0bc87d";
const VARIANT_ID = 101888;

export async function GET() {
  const response = await fetch(
    `https://api.printify.com/v1/shops/${SHOP_ID}/orders.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_id: `dream9-test-${Date.now()}`,
        label: "Dream 9 Test Order",
        line_items: [
          {
            product_id: PRODUCT_ID,
            variant_id: VARIANT_ID,
            quantity: 1,
          },
        ],
        shipping_method: 1,
        send_shipping_notification: false,
        address_to: {
          first_name: "Mason",
          last_name: "Henrie",
          email: "masonhenrie2003@gmail.com",
          phone: "",
          country: "US",
          region: "OR",
          address1: "255 Foots Creek Rd",
          address2: "",
          city: "Gold Hill",
          zip: "97525",
        },
      }),
    }
  );

  const data = await response.json();

  return NextResponse.json({
    ok: response.ok,
    status: response.status,
    data,
  });
}