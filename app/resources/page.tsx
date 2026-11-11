import Link from "next/link";
import Navbar from "../components/Navbar";

export default function ResourcesPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar />
      <main id="main-content">
        <section className="resources-hero" aria-labelledby="resources-title">
          <div className="resources-hero-inner">
            <p className="eyebrow">416th Civil Affairs Battalion · Participant information</p>
            <h1 id="resources-title">Participant resources</h1>
            <p>A central place for preparation material, event documents, answers to common questions, and organizer-approved updates for the Norwegian Foot March in Oceanside.</p>
          </div>
        </section>

        <div className="resources-content">
          <section className="resources-section" aria-labelledby="downloads-title">
            <div className="resources-section-heading">
              <p className="eyebrow">Documents &amp; downloads</p>
              <h2 id="downloads-title">Resource library</h2>
              <p>Only materials currently available are linked below. Additional participant documents will be added after release by the event organizers.</p>
            </div>
            <div className="resource-grid">
              <article className="resource-card">
                <span className="resource-status">Available · General preparation</span>
                <h3>Norwegian Foot March Training Guide</h3>
                <p>A 10-page training and preparation guide covering endurance, rucking, equipment preparation, hydration, fueling, and recovery. It is not the official event instruction packet.</p>
                <a className="btn btn-primary" href="/norwegian-foot-march-training-guide.pdf" download>Download PDF <span aria-hidden="true">↓</span></a>
              </article>
              <article className="resource-card">
                <span className="resource-status">Forthcoming · Official document</span>
                <h3>Participant information packet</h3>
                <p>The event-specific packet will be posted here once the organizers provide and approve the final document.</p>
              </article>
              <article className="resource-card">
                <span className="resource-status">Forthcoming · Event document</span>
                <h3>Route and checkpoint information</h3>
                <p>The approved course map, distance, start and finish details, and checkpoint information will be added when available.</p>
              </article>
              <article className="resource-card">
                <span className="resource-status">Forthcoming · Event document</span>
                <h3>Participant standards and requirements</h3>
                <p>Final eligibility, equipment, inspection, and completion requirements will be published after organizer confirmation.</p>
              </article>
            </div>
          </section>

          <section className="resources-section" aria-labelledby="guidance-title">
            <div className="resources-section-heading">
              <p className="eyebrow">Before event day</p>
              <h2 id="guidance-title">Where to find information</h2>
            </div>
            <ul className="resource-list">
              <li><strong>Event schedule and timeline</strong><span>Home page · Event Information</span></li>
              <li><strong>Age-group time standards</strong><span>Home page · Standards &amp; Requirements selector</span></li>
              <li><strong>Training overview</strong><span>Home page · Training &amp; Preparation</span></li>
              <li><strong>Official announcements</strong><span>Home page · Event Updates</span></li>
            </ul>
          </section>

          <section className="resources-section" aria-labelledby="faq-link-title">
            <div className="resources-section-heading">
              <p className="eyebrow">Common questions</p>
              <h2 id="faq-link-title">Frequently asked questions</h2>
              <p>Find answers and direct links on the <Link href="/#faq">main event FAQ section</Link>.</p>
            </div>
          </section>

          <Link className="resource-backlink" href="/">← Return to event home</Link>
        </div>
      </main>
      <footer className="site-footer">
        <div className="footer-main"><div className="footer-brand"><span className="footer-unit">416th</span><div><p className="footer-title">Norwegian Foot March</p><p className="footer-subtitle">Oceanside, California · 23 January 2027</p></div></div><div className="footer-links"><Link href="/">Event home</Link><Link href="/#event-info">Event information</Link><Link href="/#preparation">Preparation</Link><Link href="/#updates">Updates</Link></div></div>
        <div className="footer-bottom"><span>416th Civil Affairs Battalion</span><span>Official event information · Details subject to confirmation</span></div>
      </footer>
    </>
  );
}
