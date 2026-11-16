import type { Metadata } from "next";
import Link from "next/link";
import RegistrationManagementForm from "./RegistrationManagementForm";

export const metadata: Metadata = {
  title: "Manage Registration | Ares Company",
  description: "Manage your Norwegian Foot March participant registration.",
};

export default function ManageRegistrationPage() {
  return (
    <main className="registration-page">
      <div className="registration-card registration-card-wide">
        <div className="registration-heading">
          <p className="eyebrow">Ares Company · Participant services</p>
          <h1>Manage your registration</h1>
          <p>Use the email address and one-time management code provided when you registered.</p>
        </div>
        <RegistrationManagementForm />
        <p className="registration-section-description">If you lost your management code, contact the event organizers. For security, codes cannot be retrieved.</p>
        <Link className="organizer-back-link" href="/register">Back to registration</Link>
      </div>
    </main>
  );
}
