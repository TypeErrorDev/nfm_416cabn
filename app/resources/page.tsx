import Link from "next/link";
import Navbar from "../components/Navbar";
import Image from "next/image";

export default function ResourcesPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar />
      <main id="main-content">
        <section className="resources-hero" aria-labelledby="resources-title">
          <div className="resources-hero-inner">
            <p className="eyebrow">Ares Company · Participant information</p>
            <h1 id="resources-title">Participant resources</h1>
            <p>A central place for preparation material, event documents, answers to common questions, and organizer-approved updates for the Norwegian Foot March in Oceanside.</p>
          </div>
        </section>

        <div className="resources-content">
          <section className="resources-section" aria-labelledby="route-gallery-title">
            <div className="resources-section-heading">
              <p className="eyebrow">Course reference</p>
              <h2 id="route-gallery-title">Route maps</h2>
              <p>The 30K course follows the San Luis Rey Riverwalk Bike Path as an out-and-back route. Registration, check-in, and the march start are at the Mance Buchanon Park Playground; the finish is at O&apos;Side Rock Garden.</p>
            </div>
            <div className="route-gallery">
              <figure className="route-gallery-overview">
                <Image src="/route-sequence.svg" alt="Overall route map for the Norwegian Foot March along the San Luis Rey Riverwalk Bike Path" width={1600} height={1000} />
                <figcaption><strong>Revised route sequence</strong><span>Playground → Rock Garden → eastern turnaround → Playground</span></figcaption>
              </figure>
              <div className="route-gallery-details">
                <figure><Image src="/route-start-area.jpg" alt="Detailed route map view showing one section of the course" width={1200} height={900} /><figcaption><strong>Route detail 1</strong><span>Course detail from the event route map</span></figcaption></figure>
                <figure><Image src="/route-inland-turnaround.jpg" alt="Detailed route map view showing another section of the course" width={1200} height={900} /><figcaption><strong>Route detail 2</strong><span>Course detail from the event route map</span></figcaption></figure>
                <figure><Image src="/route-finish-area.jpg" alt="Detailed route map view showing a further section of the course" width={1200} height={900} /><figcaption><strong>Route detail 3</strong><span>Course detail from the event route map</span></figcaption></figure>
              </div>
              <p className="route-gallery-note">These maps are visual references. Follow event-day instructions and volunteer direction; the maps do not replace the safety briefing.</p>
            </div>
          </section>

          <section className="resources-section" aria-labelledby="downloads-title">
            <div className="resources-section-heading">
              <p className="eyebrow">Documents &amp; downloads</p>
              <h2 id="downloads-title">Resource library</h2>
              <p>Event information for the January 23, 2027 Norwegian Foot March in Oceanside, California.</p>
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
                <span className="resource-status">Available · Route reference</span>
                <h3>Route maps</h3>
                <p>View the full course overview and three detailed map views in the Route Maps section above.</p>
                <Link className="btn btn-primary" href="#route-gallery-title">View route maps</Link>
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
              <li><strong>Event schedule and timeline</strong><span>Trailhead registration/check-in 4:00–4:30 AM · Formation 4:45 AM at the trailhead · Start 5:30 AM from the same trailhead · Cutoff 11:30 AM</span></li>
              <li><strong>Age-group time standards</strong><span>Home page · Standards &amp; Requirements selector</span></li>
              <li><strong>Training overview</strong><span>Home page · Training &amp; Preparation</span></li>
              <li><strong>Official announcements</strong><span>Home page · Event Updates</span></li>
              <li><strong>Route</strong><span>30K / 18.64 miles · Start and registration at the Mance Buchanon Park Playground of the San Luis Rey River Bike Trail · beachfront finish at O&apos;Side Rock Garden</span></li>
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
        <div className="footer-main"><div className="footer-brand"><Image src="/ares%20logo.jpg" alt="Ares Company logo" width={42} height={42} className="footer-unit-logo" /><div><p className="footer-title">Norwegian Foot March</p><p className="footer-subtitle">Oceanside, California · 23 January 2027</p></div></div><div className="footer-links"><Link href="/">Event home</Link><Link href="/#event-info">Event information</Link><Link href="/#preparation">Preparation</Link><Link href="/#updates">Updates</Link></div></div>
        <div className="footer-bottom"><span>Ares Company</span><span>Official event information · Details subject to confirmation</span></div>
      </footer>
    </>
  );
}
