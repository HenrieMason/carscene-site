import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(
    "https://api.printify.com/v1/catalog/blueprints/706/print_providers/99/variants.json",
    {
      headers: {
        Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
      },
    }
  );

  const data = await response.json();

  return NextResponse.json(data);
}