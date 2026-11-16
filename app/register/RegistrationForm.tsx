"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type RegistrationStatus = "idle" | "submitting" | "success" | "error";
type RegistrationType = "participant" | "volunteer";

const branches = ["Army", "Navy", "Air Force", "Marine Corps", "Space Force", "Coast Guard", "CIV"];
const assignments = [
  "Water / First Aid Station 1",
  "Water / First Aid Station 2",
  "Water / First Aid Station 3",
  "Start / Registration",
  "Turnaround",
  "Finish Line",
];

export default function RegistrationForm() {
  const [status, setStatus] = useState<RegistrationStatus>("idle");
  const [registrationType, setRegistrationType] = useState<RegistrationType>("participant");
  const [message, setMessage] = useState("");
  const [confirmedName, setConfirmedName] = useState("");
  const [managementCode, setManagementCode] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const common = {
      full_name: String(data.get("full_name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      emergency_contact_name: String(data.get("emergency_contact_name") ?? "").trim(),
      emergency_contact_relationship: String(data.get("emergency_contact_relationship") ?? "").trim(),
      emergency_contact_phone: String(data.get("emergency_contact_phone") ?? "").trim(),
      website: String(data.get("website") ?? ""),
    };

    const payload = registrationType === "participant"
      ? {
          ...common,
          registration_type: "participant",
          age: Number(data.get("age")),
          gender: String(data.get("gender") ?? ""),
          participating_for_time: data.get("participating_for_time") === "yes",
          branch: String(data.get("branch") ?? ""),
          unit: String(data.get("unit") ?? "").trim() || null,
        }
      : {
          ...common,
          registration_type: "volunteer",
          assignment: String(data.get("assignment") ?? ""),
        };

    if (registrationType === "participant" && String(data.get("branch") ?? "") !== "CIV" && !String(data.get("unit") ?? "").trim()) {
      setStatus("error");
      setMessage("Unit is required for military participants.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(typeof result?.error === "string" ? result.error : "Registration could not be submitted.");
      }

      setConfirmedName(common.full_name);
      setManagementCode(typeof result?.managementCode === "string" ? result.managementCode : "");
      form.reset();
      setRegistrationType("participant");
      setStatus("success");
      setMessage("");
    } catch (error) {
      console.error("Registration submission failed:", error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not submit your registration. Please check your connection and try again. If the problem continues, contact the event organizers.");
    }
  }

  if (status === "success") {
    const isVolunteer = !managementCode;
    return (
      <section className="registration-confirmation" aria-labelledby="registration-confirmation-title" aria-live="polite">
        <div className="confirmation-mark" aria-hidden="true">✓</div>
        <p className="eyebrow">Ares Company · {isVolunteer ? "Volunteer Registration" : "Participant Registration"}</p>
        <h2 id="registration-confirmation-title">Registration Confirmed</h2>
        <p className="confirmation-greeting">{confirmedName ? `Thank you, ${confirmedName}.` : "Thank you for registering."}</p>
        <p className="confirmation-message">
          {isVolunteer
            ? "Your volunteer registration has been submitted. The organizers have your assignment and emergency contact information."
            : "Your participant registration has been successfully submitted and recorded for the Norwegian Foot March."}
        </p>
        {!isVolunteer && (
          <div className="confirmation-next-steps" role="group" aria-label="Registration management code">
            <strong>Your registration management code</strong>
            <p>This code is shown only once. Save it somewhere secure. You will need this code and your registration email address to manage your registration online. The organizers cannot retrieve a lost code.</p>
            <p className="registration-management-code">{managementCode}</p>
            <button className="btn btn-ghost" type="button" onClick={() => void navigator.clipboard?.writeText(managementCode)}>Copy management code</button>
          </div>
        )}
        <div className="confirmation-event-details">
          <div><span>EVENT DATE</span><strong>January 23, 2027</strong></div>
          <div><span>LOCATION</span><strong>Oceanside, California</strong></div>
          <div><span>HOST</span><strong>Ares Company</strong></div>
        </div>
        <div className="confirmation-next-steps">
          <strong>What happens next?</strong>
          <p>Continue checking the event website for the confirmed schedule, route, and final instructions. This screen confirms receipt of your registration; it is not a completion certificate.</p>
        </div>
        <div className="confirmation-actions">\n          {!isVolunteer && <Link className="btn btn-ghost" href="/manage-registration">Manage your registration</Link>}
          <Link className="btn btn-primary" href="/">Return to event home</Link>
          <button className="btn btn-ghost" type="button" onClick={() => { setStatus("idle"); setConfirmedName(""); setManagementCode(""); }}>Register another person</button>
        </div>
      </section>
    );
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <div className="registration-honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field blank</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="registration-form-intro">
        <p>Choose whether you are registering to march or volunteer. Volunteer registration is separate from participant registration.</p>
        <p className="registration-required-note">Fields marked with * are required.</p>
      </div>

      <fieldset className="registration-fieldset">
        <legend>Registration type</legend>
        <div className="registration-field">
          <label htmlFor="registration_type">I want to *</label>
          <select
            id="registration_type"
            value={registrationType}
            onChange={(event) => setRegistrationType(event.target.value as RegistrationType)}
          >
            <option value="participant">Register as a participant</option>
            <option value="volunteer">Register as a volunteer</option>
          </select>
          <span className="registration-help">Choose one. You cannot register as both a participant and a volunteer through the same registration.</span>
        </div>
      </fieldset>

      <fieldset className="registration-fieldset">
        <legend>{registrationType === "participant" ? "Participant information" : "Volunteer information"}</legend>
        <div className="registration-fields">
          <div className="registration-field registration-field-full">
            <label htmlFor="full_name">Full name *</label>
            <input id="full_name" name="full_name" type="text" autoComplete="name" maxLength={160} required />
          </div>
          <div className="registration-field registration-field-full">
            <label htmlFor="email">Email address *</label>
            <input id="email" name="email" type="email" autoComplete="email" maxLength={254} required />
          </div>

          {registrationType === "participant" ? (
            <>
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
            </>
          ) : (
            <div className="registration-field registration-field-full">
              <label htmlFor="assignment">Preferred volunteer assignment *</label>
              <select id="assignment" name="assignment" defaultValue="" required>
                <option value="" disabled>Select an assignment</option>
                {assignments.map((assignment) => <option value={assignment} key={assignment}>{assignment}</option>)}
              </select>
              <span className="registration-help">The organizers will use this selection to plan volunteer coverage.</span>
            </div>
          )}
        </div>
      </fieldset>

      <fieldset className="registration-fieldset">
        <legend>Emergency contact</legend>
        <p className="registration-section-description">Provide someone organizers can contact if an emergency occurs during the event. This is required for participants and volunteers.</p>
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
        <p>The information you provide will be used for event registration, volunteer administration, and emergency contact purposes. Do not enter Social Security numbers, DoD identification numbers, or medical details.</p>
      </div>

      {message && <p className={"registration-feedback registration-feedback-" + status} role="status" aria-live="polite">{message}</p>}

      <button className="btn btn-primary registration-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting registration..." : registrationType === "participant" ? "Submit participant registration" : "Submit volunteer registration"}
      </button>
    </form>
  );
}
