const navItems = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload & Announce" },
  { href: "/reunions", label: "Reunions" },
  { href: "/family-history", label: "Family History" },
  { href: "/connections", label: "Family Connections" },
  { href: "/admin", label: "Admin" }
];

export function Header() {
  return (
    <header className="site-header">
      <div className="nav-shell">
        <a className="brand" href="/">
          901 Johnsons
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
