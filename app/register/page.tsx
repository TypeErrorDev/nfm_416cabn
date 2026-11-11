import Link from "next/link";
import RegistrationForm from "./RegistrationForm";

export default function RegistrationPage() {
  return (
    <main className="registration-page">
      <div className="registration-card registration-card-wide">
        <p className="eyebrow">416th Civil Affairs Battalion · Oceanside, California</p>
        <h1>Norwegian Foot March Registration</h1>
        <p className="registration-lead">
          Submit your participant information for the Norwegian Foot March scheduled for
          January 23, 2027, in Oceanside, California.
        </p>
        <div className="registration-notice">
          <strong>Before you register</strong>
          <p>
            Event-day schedule, route details, equipment requirements, and additional
            participant instructions will be published as they are confirmed.
          </p>
        </div>
        <RegistrationForm />
        <Link className="btn btn-ghost registration-home-link" href="/">Return to event home</Link>
      </div>
    </main>
  );
}
