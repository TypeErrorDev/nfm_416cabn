import Navbar from "./components/Navbar";

const eventFacts = [
  { label: "Date", value: "23 January 2027" },
  { label: "Location", value: "Oceanside, California" },
  { label: "Host unit", value: "416th Civil Affairs Battalion" },
  { label: "Registration", value: "Details forthcoming" },
];

const eventDetails = [
  {
    number: "01",
    title: "The course",
    description:
      "The official route, distance, terrain, and course guidance will be published here once confirmed by the event organizers.",
  },
  {
    number: "02",
    title: "Participation standards",
    description:
      "Eligibility, required standards, completion requirements, and event procedures will be provided in the official participant information.",
  },
  {
    number: "03",
    title: "Preparation",
    description:
      "A confirmed packing list and preparation guidance will be shared with participants ahead of the march.",
  },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />

      <main id="main-content">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">416th Civil Affairs Battalion · Oceanside, California</p>
              <p className="hero-kicker">Norsk Fotmarsj</p>
              <h1 id="hero-title" className="hero-title">
                Norwegian
                <br />
                Foot March
              </h1>
              <p className="hero-description">
                An endurance march rooted in Norwegian military tradition.
                Prepare with purpose, take on the distance, and earn the
                accomplishment one step at a time.
              </p>

              <dl className="hero-facts">
                {eventFacts.map((fact) => (
                  <div className="hero-fact" key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="hero-actions">
                <a className="btn btn-primary" href="#event-info">
                  Event information
                  <span aria-hidden="true">↗</span>
                </a>
                <a className="btn btn-ghost" href="#history">
                  Learn the history
                </a>
              </div>
              <p className="hero-note">
                Official event details will be posted as they are confirmed.
              </p>
            </div>

            <div className="hero-art" aria-hidden="true">
              <div className="hero-sun" />
              <div className="hero-contour contour-one" />
              <div className="hero-contour contour-two" />
              <div className="hero-contour contour-three" />
              <svg
                className="runner-art"
                viewBox="0 0 560 210"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
          <div className="fact-tile">
            <span className="fact-index">04</span>
            <span className="fact-value">Coming soon</span>
            <span className="fact-label">Registration information</span>
          </div>
        </section>

        <section id="history" className="content-section history-section" aria-labelledby="history-title">
          <div className="section-heading">
            <p className="eyebrow">The tradition</p>
            <h2 id="history-title">A march built on endurance</h2>
          </div>
          <div className="history-grid">
            <div className="history-lead">
              <p className="lead-copy">
                The Norwegian Foot March is a military endurance event with
                roots in Norway. It challenges participants to cover a
                demanding distance on foot while meeting the standards
                established for the march.
              </p>
              <p>
                More than a test of physical ability, the march calls for
                preparation, resilience, and steady determination. Every
                participant brings their own reason for taking on the
                challenge; the shared experience is the commitment to finish.
              </p>
            </div>
            <div className="tradition-list">
              <article className="tradition-item">
                <span className="tradition-mark" aria-hidden="true">01</span>
                <div>
                  <h3>Tradition</h3>
                  <p>A longstanding Norwegian military tradition carried forward by participants around the world.</p>
                </div>
              </article>
              <article className="tradition-item">
                <span className="tradition-mark" aria-hidden="true">02</span>
                <div>
                  <h3>Endurance</h3>
                  <p>A challenge that rewards preparation, pacing, and perseverance from start to finish.</p>
                </div>
              </article>
              <article className="tradition-item">
                <span className="tradition-mark" aria-hidden="true">03</span>
                <div>
                  <h3>Accomplishment</h3>
                  <p>An opportunity to test yourself alongside fellow service members and members of the community.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="event-info" className="content-section event-section" aria-labelledby="event-title">
          <div className="section-heading">
            <p className="eyebrow">Know before you go</p>
            <h2 id="event-title">Event information</h2>
            <p className="section-intro">
              Planning information is being coordinated by the event organizers.
              Confirmed requirements and instructions will be added here before
              the event.
            </p>
          </div>
          <div className="detail-grid">
            {eventDetails.map((detail) => (
              <article className="detail-card" key={detail.number}>
                <span className="detail-number">{detail.number}</span>
                <h3>{detail.title}</h3>
                <p>{detail.description}</p>
                <span className="detail-status">Information forthcoming</span>
              </article>
            ))}
          </div>
          <div className="notice-band">
            <span className="notice-symbol" aria-hidden="true">i</span>
            <p>
              Use this website as the central source for event updates. Do not
              rely on unofficial route details or requirements.
            </p>
          </div>
        </section>

        <section id="updates" className="content-section updates-section" aria-labelledby="updates-title">
          <div className="updates-heading">
            <div>
              <p className="eyebrow">From the organizers</p>
              <h2 id="updates-title">Event updates</h2>
            </div>
            <p>
              Announcements, participant guidance, and registration information
              will be published here as they become available.
            </p>
          </div>
          <article className="update-card">
            <div className="update-meta">
              <span>416th Civil Affairs Battalion</span>
              <span>Event notice</span>
            </div>
            <h3>Norwegian Foot March · Oceanside</h3>
            <p>
              The event website is being prepared. Check back for confirmed
              details and the official participant information packet.
            </p>
          </article>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <span className="footer-unit">416th</span>
            <div>
              <p className="footer-title">Norwegian Foot March</p>
              <p className="footer-subtitle">Oceanside, California · 23 January 2027</p>
            </div>
          </div>
          <div className="footer-links">
            <a href="#history">History</a>
            <a href="#event-info">Event information</a>
            <a href="#updates">Updates</a>
            <a href="#main-content">Back to top ↑</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>416th Civil Affairs Battalion</span>
          <span>Official event information · Details subject to confirmation</span>
        </div>
      </footer>
    </>
  );
}
