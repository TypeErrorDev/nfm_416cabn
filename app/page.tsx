import Navbar from "./components/Navbar";
import StandardsSelector from "./components/StandardsSelector";

const eventFacts = [
  { label: "Date", value: "23 January 2027" },
  { label: "Location", value: "Oceanside, California" },
  { label: "Host unit", value: "416th Civil Affairs Battalion" },
  { label: "Registration", value: "Open" },
];

const scheduleItems = [
  { time: "TIME TBD", title: "Participant check-in", description: "Check-in location and reporting instructions will be published when confirmed." },
  { time: "TIME TBD", title: "Formation and briefing", description: "Event-day safety brief and participant instructions." },
  { time: "TIME TBD", title: "March start", description: "Start time, release procedure, and any waves will be announced." },
  { time: "TIME TBD", title: "Finish and accountability", description: "Finish-line procedures and participant accountability details will be provided." },
];

const routeItems = [
  { label: "Route map", value: "To be published" },
  { label: "March distance", value: "To be confirmed" },
  { label: "Start / finish", value: "Location forthcoming" },
  { label: "Water / aid stations", value: "Locations forthcoming" },
];

const standards = [
  { title: "Eligibility", text: "Participant eligibility and any age, status, or registration requirements will be listed after organizer confirmation." },
  { title: "Uniform and equipment", text: "The approved uniform, ruck configuration, dry-weight standard, and inspection process will be published in the event instructions." },
  { title: "Completion criteria", text: "The official distance and completion verification process will be provided in the participant instructions." },
];

const trainingTopics = [
  { title: "Build endurance gradually", text: "The guide recommends combining running and rucking, developing aerobic endurance, and increasing weekly distance progressively rather than making sudden jumps." },
  { title: "Prepare your feet and equipment", text: "Train in the footwear and socks you plan to use. Break in boots, identify friction points, and practice carrying a properly fitted and secured ruck." },
  { title: "Plan hydration and fueling", text: "The guide emphasizes practicing hydration and nutrition during training and making food and fluids accessible while moving. Individual needs and conditions vary." },
  { title: "Recover and taper", text: "The guide recommends reducing training workload during event week, prioritizing rest, and allowing time for recovery after the march." },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar />
      <main id="main-content">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">416th Civil Affairs Battalion · Oceanside, California</p>
              <p className="hero-kicker">Norsk Fotmarsj</p>
              <h1 id="hero-title" className="hero-title">Norwegian<br />Foot March</h1>
              <p className="hero-description">
                An endurance march rooted in Norwegian military tradition.
                Prepare with purpose, take on the distance, and earn the
                accomplishment one step at a time.
              </p>
              <dl className="hero-facts">
                {eventFacts.map((fact) => (
                  <div className="hero-fact" key={fact.label}>
                    <dt>{fact.label}</dt><dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="hero-actions">
                <a className="btn btn-primary" href="/register">Register now <span aria-hidden="true">↗</span></a>
                <a className="btn btn-ghost" href="#event-info">Event information</a>
                <a className="btn btn-ghost" href="#preparation">Training &amp; preparation</a>
              </div>
              <p className="hero-note">Event-specific instructions will be updated as details are confirmed.</p>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="hero-sun" />
              <div className="hero-contour contour-one" />
              <div className="hero-contour contour-two" />
              <div className="hero-contour contour-three" />
              <svg className="runner-art" viewBox="0 0 560 210" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g fill="#090D08">
                  <path d="M93 72c-7 0-12 6-12 13 0 6 5 11 11 11 7 0 12-5 12-12 0-6-5-12-11-12Zm-9 29 15-2 14 18 19 8-3 8-24-8-12-12-4 25 14 29-9 4-17-29-1-24-12 15-8 23-9-3 7-29 20-27Z" />
                  <path d="M238 83c-7 0-12 6-12 13 0 6 5 11 11 11 7 0 12-5 12-12 0-6-5-12-11-12Zm-9 29 15-2 14 18 19 8-3 8-24-8-12-12-4 25 14 29-9 4-17-29-1-24-12 15-8 23-9-3 7-29 20-27Z" />
                  <path d="M383 68c-7 0-12 6-12 13 0 6 5 11 11 11 7 0 12-5 12-12 0-6-5-12-11-12Zm-9 29 15-2 14 18 19 8-3 8-24-8-12-12-4 25 14 29-9 4-17-29-1-24-12 15-8 23-9-3 7-29 20-27Z" />
                </g>
              </svg>
              <div className="hero-ground" />
            </div>
          </div>
        </section>

        <section className="fact-strip" aria-label="Event at a glance">
          {eventFacts.slice(0, 3).map((fact, index) => (
            <div className="fact-tile" key={fact.label}>
              <span className="fact-index">0{index + 1}</span>
              <span className="fact-value">{fact.value}</span>
              <span className="fact-label">{fact.label}</span>
            </div>
          ))}
          <div className="fact-tile"><span className="fact-index">04</span><span className="fact-value">Open</span><span className="fact-label">Registration</span></div>
        </section>

        <section id="history" className="content-section history-section" aria-labelledby="history-title">
          <div className="section-heading">
            <p className="eyebrow">The tradition</p>
            <h2 id="history-title">A march built on endurance</h2>
          </div>
          <div className="history-grid">
            <div className="history-lead">
              <p className="lead-copy">The Norwegian Foot March is a military endurance event with roots in Norway. It challenges participants to cover a demanding distance on foot while meeting the standards established for the march.</p>
              <p>More than a test of physical ability, the march calls for preparation, resilience, and steady determination. Every participant brings their own reason for taking on the challenge; the shared experience is the commitment to finish.</p>
            </div>
            <div className="tradition-list">
              <article className="tradition-item"><span className="tradition-mark" aria-hidden="true">01</span><div><h3>Tradition</h3><p>A longstanding Norwegian military tradition carried forward by participants around the world.</p></div></article>
              <article className="tradition-item"><span className="tradition-mark" aria-hidden="true">02</span><div><h3>Endurance</h3><p>A challenge that rewards preparation, pacing, and perseverance from start to finish.</p></div></article>
              <article className="tradition-item"><span className="tradition-mark" aria-hidden="true">03</span><div><h3>Accomplishment</h3><p>An opportunity to test yourself alongside fellow service members and members of the community.</p></div></article>
            </div>
          </div>
        </section>

        <section id="event-info" className="content-section event-section" aria-labelledby="event-title">
          <div className="section-heading">
            <p className="eyebrow">Know before you go</p>
            <h2 id="event-title">Event information</h2>
            <p className="section-intro">This page is a planning framework. Items marked forthcoming are placeholders, not final event instructions.</p>
          </div>

          <div className="info-block">
            <div className="info-block-heading"><div><p className="eyebrow">Event day</p><h3>Schedule &amp; timeline</h3></div><span className="placeholder-tag">Draft · Times TBD</span></div>
            <ol className="timeline-list">
              {scheduleItems.map((item, index) => (
                <li className="timeline-item" key={item.title}>
                  <span className="timeline-number">0{index + 1}</span>
                  <div className="timeline-time">{item.time}</div>
                  <div className="timeline-copy"><h4>{item.title}</h4><p>{item.description}</p></div>
                </li>
              ))}
            </ol>
          </div>

          <div id="route-and-checkpoints" className="info-block route-block">
            <div className="info-block-heading"><div><p className="eyebrow">Course details</p><h3>Route &amp; checkpoints</h3></div><span className="placeholder-tag">Route pending</span></div>
            <div className="route-placeholder" role="note" aria-label="Route map placeholder">
              <div className="route-placeholder-lines" aria-hidden="true"><span /><span /><span /></div>
              <div className="route-placeholder-content"><span className="route-pin" aria-hidden="true">+</span><strong>Official route map</strong><span>Map and checkpoint details will be added after organizer approval.</span></div>
            </div>
            <dl className="route-facts">
              {routeItems.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
            </dl>
          </div>

          <div id="standards" className="info-block">
            <div className="info-block-heading"><div><p className="eyebrow">Participant guidance</p><h3>Standards &amp; requirements</h3></div><span className="placeholder-tag">Confirmation pending</span></div>
            <div className="standards-selector-intro">
              <p>Select an age group and standard category to preview the requirements that will apply. Official event-specific values are pending organizer confirmation.</p>
            </div>
            <StandardsSelector />
            <div className="detail-grid standards-detail-grid">
              {standards.map((item, index) => <article className="detail-card" key={item.title}><span className="detail-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p><span className="detail-status">Official guidance forthcoming</span></article>)}
            </div>
          </div>
          <div className="notice-band"><span className="notice-symbol" aria-hidden="true">i</span><p>Do not treat placeholder times, route information, or standards as final. Follow the official instructions released by the event organizers.</p></div>
        </section>

        <section id="preparation" className="content-section preparation-section" aria-labelledby="preparation-title">
          <div className="section-heading">
            <p className="eyebrow">Prepare with purpose</p>
            <h2 id="preparation-title">Training &amp; preparation</h2>
            <p className="section-intro">A practical overview drawn from the uploaded <em>Norwegian Foot March Training and Preparation Guide</em>. Use it as general preparation material, not as a substitute for individualized medical or coaching advice.</p>
            <a className="btn btn-primary training-download" href="/norwegian-foot-march-training-guide.pdf" download>Download training packet <span aria-hidden="true">↓</span></a>
          </div>
          <div className="prep-grid">
            {trainingTopics.map((item, index) => <article className="prep-card" key={item.title}><span className="detail-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
          <div className="prep-callout">
            <div><p className="eyebrow">Important</p><h3>Train progressively and listen to your body.</h3></div>
            <p>The source guide discusses endurance, equipment, hydration, fueling, and recovery. It does not establish this event&apos;s official course, schedule, participant standards, or medical protocol. Those details will be published separately once approved.</p>
          </div>
          <p className="source-note">Source: Norwegian Foot March Training and Preparation Guide, provided for this event planning project (10 pages).</p>
        </section>

        <section id="updates" className="content-section updates-section" aria-labelledby="updates-title">
          <div className="updates-heading"><div><p className="eyebrow">From the organizers</p><h2 id="updates-title">Event updates</h2></div><p>Announcements and participant guidance will be published here as they become available.</p></div>
          <article className="update-card"><div className="update-meta"><span>416th Civil Affairs Battalion</span><span>Event notice</span></div><h3>Norwegian Foot March · Oceanside</h3><p>The event website is being prepared. Check back for confirmed details and the official participant information packet.</p></article>
        </section>

        <section id="faq" className="content-section faq-section" aria-labelledby="faq-title">
          <div className="section-heading">
            <p className="eyebrow">Participant information</p>
            <h2 id="faq-title">Frequently asked questions</h2>
            <p className="section-intro">Quick answers and direct links to the information participants need most.</p>
          </div>
          <div className="homepage-faq">
            <details><summary>How do I register?</summary><p>Registration is open. Use the <a href="/register">Norwegian Foot March registration page</a> to access the form. This is the permanent registration address; the form will be placed here when it is ready.</p></details>
            <details><summary>Where can I find the route map?</summary><p>Visit <a href="#route-and-checkpoints">Route &amp; Checkpoints</a> in Event Information. The official map, distance, start and finish locations, and checkpoint details will be posted there once approved.</p></details>
            <details><summary>Which completion time applies to me?</summary><p>Use the <a href="#standards">Standards &amp; Requirements</a> section. Select your age group and standard category in the dropdowns to display the time supplied for this event. Review the final participant instructions for any additional requirements.</p></details>
            <details><summary>How should I prepare for the march?</summary><p>Review the <a href="#preparation">Norwegian Foot March Training and Preparation Packet</a>. It covers progressive endurance training, rucking, footwear and equipment preparation, hydration, fueling, and recovery. It is general preparation guidance, not a substitute for the official event instructions.</p></details>
            <details><summary>Who can I contact with questions?</summary><p>Use the <a href="#contact">Organizer Contact</a> section below. The official point of contact and contact method will be added once provided by the organizers.</p></details>
          </div>
        </section>
        <section id="contact" className="content-section contact-section" aria-labelledby="contact-title">
          <div className="section-heading">
            <p className="eyebrow">Need assistance?</p>
            <h2 id="contact-title">Organizer contact</h2>
            <p className="section-intro">Official contact details will be published here when confirmed by the event organizers.</p>
          </div>
          <div className="contact-placeholder"><h3>Contact information forthcoming</h3><p>The event point of contact and preferred method for participant questions will be listed here. No personal or unofficial contact details are displayed.</p></div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-main"><div className="footer-brand"><span className="footer-unit">416th</span><div><p className="footer-title">Norwegian Foot March</p><p className="footer-subtitle">Oceanside, California · 23 January 2027</p></div></div><div className="footer-links"><a href="#history">History</a><a href="#event-info">Event information</a><a href="#preparation">Preparation</a><a href="#updates">Updates</a><a href="#faq">FAQ</a><a href="#contact">Contact</a><a href="#main-content">Back to top ↑</a></div></div>
        <div className="footer-bottom"><span>416th Civil Affairs Battalion</span><span>Official event information · Details subject to confirmation</span></div>
      </footer>
    </>
  );
}
