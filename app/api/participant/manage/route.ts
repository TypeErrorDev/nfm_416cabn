import { createHash } from "node:crypto";
import { checkBotId } from "botid/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Unsupported content type." }, { status: 415 });
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 5000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const input = body as Record<string, unknown>;
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const code = typeof input.management_code === "string" ? input.management_code.trim().toUpperCase() : "";
  const action = input.action;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      !/^[A-Z0-9_-]{20,32}$/.test(code) || (action !== "withdraw" && action !== "non_timed")) {
    return NextResponse.json({ error: "Enter a valid email, management code, and requested change." }, { status: 400 });
  }

  try {
    const botCheck = await checkBotId();
    if (botCheck.isBot) return NextResponse.json({ error: "Request could not be verified." }, { status: 403 });
  } catch {
    return NextResponse.json({ error: "Verification is temporarily unavailable." }, { status: 503 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Registration management is unavailable." }, { status: 503 });

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  const codeHash = createHash("sha256").update(code).digest("hex");
  const { data, error } = await supabase.rpc("manage_participant_registration", {
    p_email: email,
    p_code_hash: codeHash,
    p_action: action,
  });
  if (error) {
    console.error("Participant management failed:", error.code, error.message);
    return NextResponse.json({ error: "We could not update the registration. Please contact the organizers." }, { status: 500 });
  }
  if (data !== true) {
    return NextResponse.json({ error: "We could not match that email and code to an eligible registration. Check your details or contact the organizers." }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
