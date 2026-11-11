const navigationItems = [
  { label: "History", href: "#history" },
  { label: "Event info", href: "#event-info" },
  { label: "Preparation", href: "#preparation" },
  { label: "Resources", href: "/resources" },\n  { label: "FAQ", href: "/#faq" },
  { label: "Updates", href: "#updates" },
];

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <a className="brand-lockup" href="#main-content" aria-label="Norwegian Foot March home">
          <span className="brand-mark" aria-hidden="true">416</span>
          <span className="brand-copy"><span className="brand-name">Norwegian Foot March</span><span className="brand-location">Oceanside · California</span></span>
        </a>
        <div className="nav-links">
          {navigationItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          <a className="nav-cta" href="/register">Register now</a>
        </div>
      </nav>
    </header>
  );
}
