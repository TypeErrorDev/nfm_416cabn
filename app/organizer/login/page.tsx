import Link from "next/link";
import OrganizerLoginForm from "./OrganizerLoginForm";

export default function OrganizerLoginPage() {
  return <main className="organizer-page"><div className="organizer-panel"><p className="eyebrow">416th Civil Affairs Battalion · Restricted access</p><h1>Organizer sign in</h1><p>Sign in with an account that has been authorized by the event administrators.</p><OrganizerLoginForm /><Link className="organizer-back-link" href="/">Return to event website</Link></div></main>;
}
