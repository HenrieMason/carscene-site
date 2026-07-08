import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const query = String(body.query || "").trim().toLowerCase();
    const resultsCount = Number(body.results_count ?? 0);

    if (query.length < 3) {
      return NextResponse.json({ ok: true });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.error("MISSING SUPABASE ENV:", {
        hasUrl: !!supabaseUrl,
        hasKey: !!serviceKey,
      });

      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const cleanUrl = supabaseUrl.replace(/\/+$/, "");

    const response = await fetch(`${cleanUrl}/rest/v1/dream9_search_logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        query,
        results_count: resultsCount,
        was_no_results: resultsCount === 0,
      }),
    });

    if (!response.ok) {
      const text = await response.text();

      console.error("SEARCH LOG ERROR:", {
        status: response.status,
        url: `${cleanUrl}/rest/v1/dream9_search_logs`,
        response: text,
      });

      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("SEARCH LOG API ERROR:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}