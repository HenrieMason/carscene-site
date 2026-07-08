import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const query = String(body.query || "").trim().toLowerCase();
    const resultsCount = Number(body.results_count ?? 0);

    if (query.length < 3) {
      return NextResponse.json({ ok: true });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from("dream9_search_logs").insert({
      query,
      results_count: resultsCount,
      was_no_results: resultsCount === 0,
    });

    if (error) {
      console.error("SEARCH LOG ERROR:", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("SEARCH LOG API ERROR:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}