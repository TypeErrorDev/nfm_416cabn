import Link from "next/link";
import Navbar from "../components/Navbar";

const questions = [
  {
    question: "When will registration open?",
    answer: "Registration information has not yet been released. Check the event updates on the home page and this resource hub for organizer-approved announcements.",
  },
  {
    question: "Where can I find the event schedule and route?",
    answer: "The event schedule, route, distance, start and finish locations, and checkpoint information are still awaiting organizer confirmation. They will be published in the Event Information section when approved.",
  },
  {
    question: "Which completion time applies to me?",
    answer: "The standards selector on the Event Information section displays the age-group and category times supplied for this event. Confirm the complete official requirements in the final participant instructions before relying on a time standard.",
  },
  {
    question: "What uniform, rucksack, or equipment should I bring?",
    answer: "The approved uniform, rucksack configuration, dry-weight requirement, and inspection process have not yet been confirmed for this event. Please wait for the official participant instructions rather than treating general training material as an event requirement.",
  },
  {
    question: "Where can I get help with a participant question?",
    answer: "The event's official point of contact and contact method have not yet been published. Contact information will be added here once provided by the organizers.",
  },
];

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

          <section className="resources-section" aria-labelledby="faq-title">
            <div className="resources-section-heading">
              <p className="eyebrow">Common questions</p>
              <h2 id="faq-title">Frequently asked questions</h2>
              <p>Answers will be expanded as official event information is released. Items not yet confirmed are identified below.</p>
            </div>
            <div className="resource-faq">
              {questions.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="resources-section" aria-labelledby="contact-title">
            <div className="resources-section-heading">
              <p className="eyebrow">Need assistance?</p>
              <h2 id="contact-title">Organizer contact</h2>
            </div>
            <div className="resource-contact">
              <h3>Contact information forthcoming</h3>
              <p>The official event point of contact and preferred method for participant questions will be posted here once confirmed. No personal or unofficial contact details are listed.</p>
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
