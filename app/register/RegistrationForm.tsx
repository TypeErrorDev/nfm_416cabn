"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type RegistrationStatus = "idle" | "submitting" | "success" | "error";

const branches = ["Army", "Navy", "Air Force", "Marine Corps", "Space Force", "Coast Guard", "CIV"];

export default function RegistrationForm() {
  const [status, setStatus] = useState<RegistrationStatus>("idle");
  const [message, setMessage] = useState("");
  const [confirmedName, setConfirmedName] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const branch = String(data.get("branch") ?? "");
    const unit = String(data.get("unit") ?? "").trim();

    const payload = {
      full_name: String(data.get("full_name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      age: Number(data.get("age")),
      gender: String(data.get("gender") ?? ""),
      participating_for_time: data.get("participating_for_time") === "yes",
      branch,
      unit: unit || null,
      emergency_contact_name: String(data.get("emergency_contact_name") ?? "").trim(),
      emergency_contact_relationship: String(data.get("emergency_contact_relationship") ?? "").trim(),
      emergency_contact_phone: String(data.get("emergency_contact_phone") ?? "").trim(),
    };

    if (branch !== "CIV" && !unit) {
      setStatus("error");
      setMessage("Unit is required for military participants.");
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("participants").insert(payload);
      if (error) throw error;

      setConfirmedName(payload.full_name);
      form.reset();
      setStatus("success");
      setMessage("");
    } catch (error) {
      console.error("Registration submission failed:", error);
      setStatus("error");
      setMessage("We could not submit your registration. Please check your connection and try again. If the problem continues, contact the event organizers.");
    }
  }

  if (status === "success") {
    return (
      <section className="registration-confirmation" aria-labelledby="registration-confirmation-title" aria-live="polite">
        <div className="confirmation-mark" aria-hidden="true">✓</div>
        <p className="eyebrow">416th Civil Affairs Battalion · Participant Registration</p>
        <h2 id="registration-confirmation-title">Registration Confirmed</h2>
        <p className="confirmation-greeting">{confirmedName ? `Thank you, ${confirmedName}.` : "Thank you for registering."}</p>
        <p className="confirmation-message">Your registration has been successfully submitted and recorded for the Norwegian Foot March.</p>
        <div className="confirmation-event-details">
          <div><span>EVENT DATE</span><strong>January 23, 2027</strong></div>
          <div><span>LOCATION</span><strong>Oceanside, California</strong></div>
          <div><span>HOST</span><strong>416th Civil Affairs Battalion</strong></div>
        </div>
        <div className="confirmation-next-steps">
          <strong>What happens next?</strong>
          <p>Continue checking the event website for the confirmed schedule, route, participant standards, and final instructions. This screen confirms receipt of your registration; it is not a completion certificate.</p>
        </div>
        <div className="confirmation-actions">
          <Link className="btn btn-primary" href="/">Return to event home</Link>
          <button className="btn btn-ghost" type="button" onClick={() => { setStatus("idle"); setConfirmedName(""); }}>Register another participant</button>
        </div>
      </section>
    );
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <div className="registration-form-intro">
        <p>Complete each required field to submit your participant information.</p>
        <p className="registration-required-note">Fields marked with * are required.</p>
      </div>

      <fieldset className="registration-fieldset">
        <legend>Participant information</legend>
        <div className="registration-fields">
          <div className="registration-field registration-field-full">
            <label htmlFor="full_name">Full name *</label>
            <input id="full_name" name="full_name" type="text" autoComplete="name" maxLength={160} required />
          </div>
          <div className="registration-field">
            <label htmlFor="email">Email address *</label>
            <input id="email" name="email" type="email" autoComplete="email" maxLength={254} required />
          </div>
          <div className="registration-field">
            <label htmlFor="age">Age *</label>
            <input id="age" name="age" type="number" min="1" max="120" inputMode="numeric" required />
          </div>
          <div className="registration-field">
            <label htmlFor="gender">Standard category *</label>
            <select id="gender" name="gender" defaultValue="" required>
              <option value="" disabled>Select a standard</option>
              <option value="women">Women&apos;s standard</option>
              <option value="men">Men&apos;s standard</option>
            </select>
            <span className="registration-help">Used to identify the applicable event completion-time standard.</span>
          </div>
          <div className="registration-field">
            <label htmlFor="participating_for_time">Are you participating for time? *</label>
            <select id="participating_for_time" name="participating_for_time" defaultValue="" required>
              <option value="" disabled>Select yes or no</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="registration-field">
            <label htmlFor="branch">Branch / affiliation *</label>
            <select id="branch" name="branch" defaultValue="" required>
              <option value="" disabled>Select branch or affiliation</option>
              {branches.map((branch) => <option value={branch} key={branch}>{branch === "CIV" ? "Civilian (CIV)" : branch}</option>)}
            </select>
          </div>
          <div className="registration-field registration-field-full">
            <label htmlFor="unit">Unit (required for military participants)</label>
            <input id="unit" name="unit" type="text" maxLength={160} placeholder="Enter your unit" />
            <span className="registration-help">Military participants must provide a unit. Civilians may leave this field blank.</span>
          </div>
        </div>
      </fieldset>

      <fieldset className="registration-fieldset">
        <legend>Emergency contact</legend>
        <p className="registration-section-description">Provide someone organizers can contact if an emergency occurs during the event.</p>
        <div className="registration-fields">
          <div className="registration-field">
            <label htmlFor="emergency_contact_name">Emergency contact full name *</label>
            <input id="emergency_contact_name" name="emergency_contact_name" type="text" autoComplete="off" maxLength={160} required />
          </div>
          <div className="registration-field">
            <label htmlFor="emergency_contact_relationship">Relationship *</label>
            <input id="emergency_contact_relationship" name="emergency_contact_relationship" type="text" maxLength={80} placeholder="e.g. spouse, parent, friend" required />
          </div>
          <div className="registration-field registration-field-full">
            <label htmlFor="emergency_contact_phone">Emergency contact phone *</label>
            <input id="emergency_contact_phone" name="emergency_contact_phone" type="tel" autoComplete="off" maxLength={30} placeholder="Include area or country code" required />
          </div>
        </div>
      </fieldset>

      <div className="registration-privacy">
        <strong>Privacy notice</strong>
        <p>The information you provide will be used for event registration, participant administration, and emergency contact purposes. Do not enter Social Security numbers, DoD identification numbers, or medical details.</p>
      </div>

      {message && <p className={"registration-feedback registration-feedback-" + status} role="status" aria-live="polite">{message}</p>}

      <button className="btn btn-primary registration-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting registration..." : "Submit registration"}
      </button>
    </form>
  );
}
