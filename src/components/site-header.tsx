const LINKS = [
  { href: "#transmision", label: "Transmisión" },
  { href: "#peluche", label: "Peluche" },
  { href: "#historia", label: "Historia" },
  { href: "#moneda", label: "Moneda" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-signal/30 bg-void/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <a href="#transmision" className="font-display text-2xl tracking-widest text-frost">
          ASTEROID
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-sm tracking-widest text-steel uppercase"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#moneda"
          className="buy-glow inline-flex h-11 items-center border border-signal bg-signal px-4 font-display text-sm tracking-widest text-void uppercase transition-transform duration-150 ease-out active:scale-[0.96]"
        >
          Comprar
        </a>
      </div>
      <nav className="flex gap-5 overflow-x-auto px-4 pb-3 md:hidden">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="shrink-0 font-display text-sm tracking-widest text-steel uppercase"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
