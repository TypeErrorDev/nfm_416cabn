import Navbar from "./components/Navbar";
import StandardsSelector from "./components/StandardsSelector";
import ParticipantCount from "./components/ParticipantCount";
import Image from "next/image";

const eventFacts = [
  { label: "Date", value: "23 January 2027" },
  { label: "Location", value: "Oceanside, California" },
  { label: "Host unit", value: "Ares Company" },
  { label: "Registration", value: "Open" },
];

const scheduleItems = [
  { time: "4:00–4:30 AM", title: "Participant check-in and first ruck weigh-in", description: "Report to the Mance Buchanon Park Playground (pending park-use approval) for registration, accountability, and the initial 25 lb dry-weight rucksack inspection. Check-in, formation, briefing, and the official march start all take place at the park." },
  { time: "4:45 AM", title: "Opening formation and safety briefing", description: "Participants receive the event-day briefing and final instructions." },
  { time: "5:30 AM", title: "Official march start", description: "The 18.6-mile march begins at the Mance Buchanon Park Playground (pending park-use approval), which is also the registration and check-in location." },
  { time: "11:30 AM", title: "Completion cutoff", description: "Six hours after the official start. Participants must report to the finish-line table and complete the finish procedures by this time." },
];

const routeItems = [
  { label: "Route", value: "San Luis Rey Riverwalk Bike Path · out-and-back" },
  { label: "March distance", value: "18.6 miles" },
  { label: "Start / finish", value: "Mance Buchanon Park Playground" },
  { label: "Turnarounds", value: "O'Side Rock Garden, then eastern trail turnaround" },
  { label: "Route support", value: "Three volunteer-staffed water/first-aid stations, serving both directions" },
];

const standards = [
  { title: "Uniform and footwear", text: "Military participants wear their service-specific military uniform and military-issued boots. Civilians wear comparable clothing and sturdy footwear suitable for the march." },
  { title: "Rucksack and safety equipment", text: "Military participants use a military-issued rucksack; civilians may use a non-military-issued rucksack. All rucks must weigh at least 25 lb dry, excluding water, and are weighed before and after the march. A headlamp/light source and reflective belt worn around the rucksack are required." },
  { title: "Personal sustainment", text: "Participants bring their own water, snacks/energy food, and personal first-aid supplies. Refill water and basic CLS supplies will be available at support stations; volunteer-provided snacks and bottled water are subject to availability." },
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
              <p className="eyebrow">Ares Company · Oceanside, California</p>
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

        <ParticipantCount />

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
            <div className="info-block-heading"><div><p className="eyebrow">Event day</p><h3>Schedule &amp; timeline</h3></div><span className="placeholder-tag">Event schedule</span></div>
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
            <div className="info-block-heading"><div><p className="eyebrow">Course details</p><h3>Route &amp; checkpoints</h3></div><span className="placeholder-tag">CONOP route</span></div>
            <div className="route-gallery" aria-label="Route maps">
              <figure className="route-gallery-overview">
                <Image src="/route-overview.png" alt="Overall route map for the Norwegian Foot March along the San Luis Rey Riverwalk Bike Path" width={1600} height={1000} priority />
                <figcaption><strong>Revised route sequence</strong><span>Mance Buchanon Park → O'Side Rock Garden turnaround → Easternmost Bike Trail point turnaround → Mance Buchanon Park</span></figcaption>
              </figure>
              <div className="route-gallery-details">
                <figure>
                  <Image src="/route-start.png" alt="Start location at Mance Buchanon Park Playground" width={1200} height={900} />
                  <figcaption><strong>Starting Point</strong><span>Mance Buchanon Park Playground</span></figcaption>
                </figure>
                <figure>
                  <Image src="/route-turnaround-1.png" alt="Turnaround Point 1 at O'Side Rock Garden traffic circle" width={1200} height={900} />
                  <figcaption><strong>Turnaround Point 1</strong><span>O'Side Rock Garden / Traffic Circle</span></figcaption>
                </figure>
                <figure>
                  <Image src="/route-turnaround-2.png" alt="Turnaround Point 2 at the easternmost bike trail point" width={1200} height={900} />
                  <figcaption><strong>Turnaround Point 2</strong><span>Easternmost Bike Trail Point</span></figcaption>
                </figure>
                <figure>
                  <Image src="/route-finish.png" alt="Finish line at Mance Buchanon Park Playground" width={1200} height={900} />
                  <figcaption><strong>Finish Line</strong><span>Mance Buchanon Park Playground</span></figcaption>
                </figure>
              </div>
              <p className="route-gallery-note">Use the event-day instructions and volunteer direction at checkpoints. Map images are provided as visual references and do not replace the safety briefing.</p>
            </div>
            <dl className="route-facts">
              {routeItems.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
            </dl>
          </div>

          <div id="standards" className="info-block">
            <div className="info-block-heading"><div><p className="eyebrow">Participant guidance</p><h3>Standards &amp; requirements</h3></div><span className="placeholder-tag">Participant requirements</span></div>
            <div className="standards-selector-intro">
              <p>Select your age group and standard category to view the applicable time standard. The 11:30 AM event cutoff is separate from the official age-category time requirement.</p>
            </div>
            <StandardsSelector />
            <div className="detail-grid standards-detail-grid">
              {standards.map((item, index) => <article className="detail-card" key={item.title}><span className="detail-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p><span className="detail-status">Event guidance</span></article>)}
            </div>
          </div>
          <div className="info-block safety-block">
            <div className="info-block-heading"><div><p className="eyebrow">Route safety</p><h3>Support and participant responsibilities</h3></div></div>
            <div className="detail-grid">
              <article className="detail-card"><h3>Water and first aid</h3><p>Three volunteer-staffed water/first-aid stations will be placed at approximately three-mile intervals and serve participants in both directions. Water refill jugs and basic CLS supplies are planned. Bottled water and volunteer-provided snacks are subject to availability.</p></article>
              <article className="detail-card"><h3>Bring your own supplies</h3><p>Participants are responsible for carrying their own water, snacks or energy food, and personal first-aid supplies. Do not rely on event-provided snacks or supplies as your sole sustainment plan.</p></article>
              <article className="detail-card"><h3>Route conduct</h3><p>The course uses a paved shared bike path. Pedestrians have the right of way, but participants should make room for cyclists. A road guard will control the route&apos;s single road crossing. The path is drivable for emergencies only.</p></article>
              <article className="detail-card"><h3>Medical concerns and withdrawal</h3><p>Notify station volunteers if injured, experiencing possible dehydration, or withdrawing. Volunteers will report serious concerns to emergency services. Participants who withdraw are responsible for arranging their own transportation unless emergency assistance is needed.</p></article>
            </div>
            <p className="section-intro">Local emergency dispatch will be notified about the event. Any on-site emergency-services presence is subject to availability and is not guaranteed. Carrying a fully charged cell phone is strongly recommended but not required.</p>
          </div>
          <div className="notice-band"><span className="notice-symbol" aria-hidden="true">i</span><p>Event details may be updated by the organizers. The event-wide completion cutoff is 11:30 AM; earning the official Norwegian Foot March certificate requires meeting the applicable age-group and category time standard.</p></div>
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
        </section>

        <section id="updates" className="content-section updates-section" aria-labelledby="updates-title">
          <div className="updates-heading"><div><p className="eyebrow">From the organizers</p><h2 id="updates-title">Event updates</h2></div><p>Announcements and participant guidance will be published here as they become available.</p></div>
          <article className="update-card"><div className="update-meta"><span>Ares Company</span><span>Event Update</span></div><h3>Norwegian Foot March · Oceanside</h3><p>The event has been approved by the Norwegian Embassy, and registration for the event is now OPEN</p></article>
        </section>

        <section id="faq" className="content-section faq-section" aria-labelledby="faq-title">
          <div className="section-heading">
            <p className="eyebrow">Participant information</p>
            <h2 id="faq-title">Frequently asked questions</h2>
            <p className="section-intro">Quick answers and direct links to the information participants need most.</p>
          </div>
          <div className="homepage-faq">
            <details><summary>How do I register?</summary><p>Online advance registration is encouraged and remains open through event day. Walk-up registration is also accepted during the 4:00–4:30 AM check-in window. Participation is free.</p></details>
            <details><summary>Where does the march start and finish?</summary><p>Registration, check-in, formation, and the march start are all at the Mance Buchanon Park Playground (pending park-use approval). The march finishes at O&apos;Side Rock Garden near the beach.</p></details>
            <details><summary>Which completion time applies to me?</summary><p>Use the <a href="#standards">Standards &amp; Requirements</a> section. Select your age group and standard category in the dropdowns to display the time supplied for this event. Review the final participant instructions for any additional requirements.</p></details>
            <details><summary>How should I prepare for the march?</summary><p>Review the <a href="#preparation">Norwegian Foot March Training and Preparation Packet</a>. It covers progressive endurance training, rucking, footwear and equipment preparation, hydration, fueling, and recovery. It is general preparation guidance, not a substitute for the official event instructions.</p></details>
            <details><summary>What should I bring?</summary><p>Bring your own water, snacks/energy food, personal first-aid supplies, headlamp or suitable light source, and reflective belt worn around your rucksack. Event water refills and basic CLS supplies will be available at route stations, but snacks are not guaranteed.</p></details>
            <details><summary>Who can I contact with questions?</summary><p>Email the event point of contact at <a href="mailto:Matthew.r.pantel.mil@army.mil">Matthew.r.pantel.mil@army.mil</a>. No event phone numbers are published.</p></details>
          </div>
        </section>
        <section id="contact" className="content-section contact-section" aria-labelledby="contact-title">
          <div className="section-heading">
            <p className="eyebrow">Need assistance?</p>
            <h2 id="contact-title">Organizer contact</h2>
            <p className="section-intro">For participant questions and registration assistance, contact the event point of contact.</p>
          </div>
          <div className="contact-placeholder"><h3>Event point of contact</h3><p>Matthew Pantel · <a href="mailto:Matthew.r.pantel.mil@army.mil">Matthew.r.pantel.mil@army.mil</a></p></div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-main"><div className="footer-brand"><Image src="/ares%20logo.jpg" alt="Ares Company logo" width={42} height={42} className="footer-unit-logo" /><div><p className="footer-title">Norwegian Foot March</p><p className="footer-subtitle">Oceanside, California · 23 January 2027</p></div></div><div className="footer-links"><a href="#history">History</a><a href="#event-info">Event information</a><a href="#preparation">Preparation</a><a href="#updates">Updates</a><a href="#faq">FAQ</a><a href="#contact">Contact</a><a href="#main-content">Back to top ↑</a></div></div>
        <div className="footer-bottom"><span>Ares Company</span><span>Ares Company · Oceanside, California</span></div>
      </footer>
    </>
  );
}
