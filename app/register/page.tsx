import Link from "next/link";
import RegistrationForm from "./RegistrationForm";

export default function RegistrationPage() {
  return (
    <main className="registration-page">
      <div className="registration-card registration-card-wide">
        <p className="eyebrow">Ares Company · Oceanside, California</p>
        <h1>Norwegian Foot March Registration</h1>
        <p className="registration-lead">
          Submit your participant information for the Norwegian Foot March scheduled for
          January 23, 2027, in Oceanside, California.
        </p>
        <div className="registration-notice">
          <strong>Event-day overview</strong>
          <p>
            Registration and check-in are 4:00–4:30 AM at the western trailhead of the San Luis Rey River Bike Trail on January 23, 2027. Formation and the safety briefing are at 4:45 AM, and the march begins from that same trailhead at 5:30 AM. The course is 30K (18.64 miles), with an 11:30 AM completion cutoff. Participation is free. Advance registration is encouraged; walk-up registration is also accepted during check-in.
          </p>
        </div>
        <RegistrationForm />
        <div className="confirmation-actions"><Link className="btn btn-ghost registration-home-link" href="/">Return to event home</Link><Link className="btn btn-ghost" href="/manage-registration">Already registered? Manage your registration</Link></div>
      </div>
    </main>
  );
}
