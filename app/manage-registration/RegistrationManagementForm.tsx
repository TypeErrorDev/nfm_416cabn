"use client";

import { useState, type FormEvent } from "react";

export default function RegistrationManagementForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setMessage("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/participant/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? "").trim(),
          management_code: String(data.get("management_code") ?? "").trim(),
          action: String(data.get("action") ?? ""),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(typeof result?.error === "string" ? result.error : "We could not update your registration.");
      setStatus("success");
      setMessage("Your registration has been updated successfully.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not update your registration. Please try again.");
    }
  }

  return (
    <form className="registration-form" onSubmit={submit}>
      <div className="registration-field">
        <label htmlFor="manage-email">Registration email *</label>
        <input id="manage-email" name="email" type="email" autoComplete="email" maxLength={254} required />
      </div>
      <div className="registration-field">
        <label htmlFor="management-code">Management code *</label>
        <input id="management-code" name="management_code" type="text" autoComplete="off" minLength={20} maxLength={32} required />
      </div>
      <fieldset className="registration-fieldset">
        <legend>Requested change</legend>
        <div className="registration-field">
          <label htmlFor="manage-action">Choose an action *</label>
          <select id="manage-action" name="action" defaultValue="non_timed" required>
            <option value="non_timed">Change to non-timed participation</option>
            <option value="withdraw">Withdraw my registration</option>
          </select>
        </div>
      </fieldset>
      {message && <p className={"registration-feedback registration-feedback-" + status} role="status">{message}</p>}
      <button className="btn btn-primary registration-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Updating..." : "Update registration"}
      </button>
    </form>
  );
}
