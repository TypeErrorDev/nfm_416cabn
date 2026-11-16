import { checkBotId } from "botid/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const allowedBranches = [
  "Army",
  "Navy",
  "Air Force",
  "Marine Corps",
  "Space Force",
  "Coast Guard",
  "CIV",
] as const;

type RegistrationPayload = {
  full_name: string;
  email: string;
  age: number;
  gender: "women" | "men";
  participating_for_time: boolean;
  branch: (typeof allowedBranches)[number];
  unit: string | null;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  website?: string;
};

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > maxLength) return null;
  return cleaned;
}

function validatePayload(value: unknown): RegistrationPayload | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const body = value as Record<string, unknown>;
  const full_name = cleanText(body.full_name, 160);
  const email = cleanText(body.email, 254)?.toLowerCase() ?? null;
  const emergency_contact_name = cleanText(body.emergency_contact_name, 160);
  const emergency_contact_relationship = cleanText(body.emergency_contact_relationship, 80);
  const emergency_contact_phone = cleanText(body.emergency_contact_phone, 30);
  const unitValue = body.unit === null || body.unit === "" ? null : cleanText(body.unit, 160);

  if (
    !full_name ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !Number.isInteger(body.age) ||
    Number(body.age) < 1 ||
    Number(body.age) > 120 ||
    (body.gender !== "women" && body.gender !== "men") ||
    typeof body.participating_for_time !== "boolean" ||
    typeof body.branch !== "string" ||
    !allowedBranches.includes(body.branch as (typeof allowedBranches)[number]) ||
    !emergency_contact_name ||
    !emergency_contact_relationship ||
    !emergency_contact_phone ||
    !/^[+\d().\s-]{7,30}$/.test(emergency_contact_phone) ||
    emergency_contact_phone.replace(/\D/g, "").length < 7 ||
    (body.branch !== "CIV" && !unitValue) ||
    (body.branch === "CIV" && body.unit !== null && body.unit !== "" && !unitValue)
  ) {
    return null;
  }

  return {
    full_name,
    email,
    age: Number(body.age),
    gender: body.gender,
    participating_for_time: body.participating_for_time,
    branch: body.branch as RegistrationPayload["branch"],
    unit: unitValue,
    emergency_contact_name,
    emergency_contact_relationship,
    emergency_contact_phone,
  };
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Unsupported content type." }, { status: 415 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 10_000) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (rawBody.length > 10_000) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body && typeof body === "object" && !Array.isArray(body)) {
    const honeypot = (body as Record<string, unknown>).website;
    if (typeof honeypot === "string" && honeypot.trim()) {
      return NextResponse.json({ success: true });
    }
  }

  const payload = validatePayload(body);
  if (!payload) {
    return NextResponse.json(
      { error: "Please review the registration fields and try again." },
      { status: 400 },
    );
  }

  try {
    const botCheck = await checkBotId();
    if (botCheck.isBot) {
      return NextResponse.json(
        { error: "Registration could not be verified. Please try again in a browser." },
        { status: 403 },
      );
    }
  } catch (error) {
    console.error("Bot verification failed:", error);
    return NextResponse.json(
      { error: "Registration verification is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) {
    console.error("Registration endpoint is missing Supabase public configuration.");
    return NextResponse.json({ error: "Registration is temporarily unavailable." }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  const { error } = await supabase.from("participants").insert(payload);
  if (error) {
    console.error("Participant insert failed:", error.code, error.message);
    return NextResponse.json(
      { error: "We could not save your registration. Please try again or contact the organizers." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
