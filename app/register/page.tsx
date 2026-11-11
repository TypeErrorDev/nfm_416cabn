import Link from "next/link";

export default function RegistrationPage() {
  return (
    <main className="registration-page">
      <div className="registration-card">
        <p className="eyebrow">416th Civil Affairs Battalion · Oceanside, California</p>
        <h1>Norwegian Foot March Registration</h1>
        <p>Registration is open. The registration form is being prepared for this page and will be published at this permanent address.</p>
        <p>Please check back here for the form. Event-specific schedule, route, and participant instructions will be posted as they are confirmed.</p>
        <Link className="btn btn-ghost" href="/">Return to event home</Link>
      </div>
    </main>
  );
}
