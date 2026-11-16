import { randomBytes, createHash } from "node:crypto";
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

const allowedAssignments = [
  "Water / First Aid Station 1",
  "Water / First Aid Station 2",
  "Water / First Aid Station 3",
  "Start / Registration",
  "Turnaround",
  "Finish Line",
] as const;

type CommonPayload = {
  full_name: string;
  email: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
};

type ParticipantPayload = CommonPayload & {
  age: number;
  gender: "women" | "men";
  participating_for_time: boolean;
  branch: (typeof allowedBranches)[number];
  unit: string | null;
};

type VolunteerPayload = CommonPayload & {
  assignment: (typeof allowedAssignments)[number];
};

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > maxLength) return null;
  return cleaned;
}

function validateCommon(body: Record<string, unknown>): CommonPayload | null {
  const full_name = cleanText(body.full_name, 160);
  const email = cleanText(body.email, 254)?.toLowerCase() ?? null;
  const emergency_contact_name = cleanText(body.emergency_contact_name, 160);
  const emergency_contact_relationship = cleanText(body.emergency_contact_relationship, 80);
  const emergency_contact_phone = cleanText(body.emergency_contact_phone, 30);

  if (
    !full_name ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !emergency_contact_name ||
    !emergency_contact_relationship ||
    !emergency_contact_phone ||
    !/^[+\d().\s-]{7,30}$/.test(emergency_contact_phone) ||
    emergency_contact_phone.replace(/\D/g, "").length < 7
  ) return null;

  return {
    full_name,
    email,
    emergency_contact_name,
    emergency_contact_relationship,
    emergency_contact_phone,
  };
}

function validateParticipant(body: Record<string, unknown>, common: CommonPayload): ParticipantPayload | null {
  const unitValue = typeof body.unit === "string" && body.unit.trim()
    ? cleanText(body.unit, 160)
    : null;

  if (
    typeof body.age !== "number" ||
    !Number.isInteger(body.age) ||
    body.age < 1 ||
    body.age > 120 ||
    (body.gender !== "women" && body.gender !== "men") ||
    typeof body.participating_for_time !== "boolean" ||
    typeof body.branch !== "string" ||
    !allowedBranches.includes(body.branch as (typeof allowedBranches)[number]) ||
    (body.branch !== "CIV" && !unitValue)
  ) return null;

  return {
    ...common,
    age: body.age,
    gender: body.gender,
    participating_for_time: body.participating_for_time,
    branch: body.branch as ParticipantPayload["branch"],
    unit: unitValue,
  };
}

function validateVolunteer(body: Record<string, unknown>, common: CommonPayload): VolunteerPayload | null {
  if (
    typeof body.assignment !== "string" ||
    !allowedAssignments.includes(body.assignment as (typeof allowedAssignments)[number])
  ) return null;

  return { ...common, assignment: body.assignment as VolunteerPayload["assignment"] };
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

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid registration details." }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  if (typeof record.website === "string" && record.website.trim()) {
    return NextResponse.json({ success: true });
  }

  const registrationType = record.registration_type;
  if (registrationType !== "participant" && registrationType !== "volunteer") {
    return NextResponse.json({ error: "Choose participant or volunteer registration." }, { status: 400 });
  }

  const common = validateCommon(record);
  if (!common) {
    return NextResponse.json({ error: "Please review the required contact and emergency contact fields." }, { status: 400 });
  }

  const participant = registrationType === "participant" ? validateParticipant(record, common) : null;
  const volunteer = registrationType === "volunteer" ? validateVolunteer(record, common) : null;
  if ((registrationType === "participant" && !participant) || (registrationType === "volunteer" && !volunteer)) {
    return NextResponse.json({ error: "Please review the registration fields and try again." }, { status: 400 });
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
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  if (volunteer) {
    const { error } = await supabase.from("volunteers").insert(volunteer);
    if (error) {
      console.error("Volunteer insert failed:", error.code, error.message);
      return NextResponse.json(
        { error: "We could not save your volunteer registration. Please try again or contact the organizers." },
        { status: 500 },
      );
    }
    return NextResponse.json({ success: true, registrationType: "volunteer" }, { status: 201 });
  }

  // A 128-bit random code is shown once. Only its SHA-256 hash is persisted.
  const managementCode = randomBytes(16).toString("base64url").toUpperCase();
  const registrationCodeHash = createHash("sha256").update(managementCode).digest("hex");
  const { error } = await supabase.from("participants").insert({
    ...participant,
    registration_code_hash: registrationCodeHash,
  });

  if (error) {
    console.error("Participant insert failed:", error.code, error.message);
    return NextResponse.json(
      { error: "We could not save your registration. Please try again or contact the organizers." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { success: true, registrationType: "participant", managementCode },
    { status: 201 },
  );
}
