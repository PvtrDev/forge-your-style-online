import { useEffect, useState } from "react";
import { Scissors, Phone, Menu, X } from "lucide-react";

const links = [
  { href: "#o-nas", label: "O nas" },
  { href: "#uslugi", label: "Usługi" },
  { href: "#opinie", label: "Opinie" },
  { href: "#galeria", label: "Galeria" },
  { href: "#zespol", label: "Zespół" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/85 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 group">
          <Scissors className="h-5 w-5 text-primary transition-transform group-hover:rotate-12" />
          <span className="font-display text-lg tracking-wide">
            Barber's <span className="text-gold">Forge</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-muted-foreground hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+48795586235" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5">
            <Phone className="h-4 w-4" /> 795 586 235
          </a>
          <a
            href="#rezerwacja"
            className="px-4 py-2 rounded-md bg-gradient-gold text-primary-foreground text-sm font-medium hover:shadow-glow transition-all"
          >
            Rezerwuj
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-foreground" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2 text-muted-foreground hover:text-primary">
                {l.label}
              </a>
            ))}
            <a
              href="#rezerwacja"
              onClick={() => setOpen(false)}
              className="mt-2 px-4 py-3 rounded-md bg-gradient-gold text-primary-foreground text-center font-medium"
            >
              Rezerwuj wizytę
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
