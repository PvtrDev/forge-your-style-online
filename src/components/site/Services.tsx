import { SectionTitle } from "./SectionTitle";
import { services } from "@/lib/services";
import { Clock } from "lucide-react";

function fmtDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h}g ${m}min`;
  if (h) return `${h}g`;
  return `${m}min`;
}

export function Services() {
  return (
    <section id="uslugi" className="py-24 bg-card/30 border-y border-border">
      <div className="container mx-auto px-4">
        <SectionTitle
          eyebrow="Cennik"
          title="Nasze usługi"
          subtitle="Pełna oferta — od klasycznego strzyżenia po pakiet pełnej metamorfozy."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {services.map((s) => (
            <div
              key={s.id}
              className="group relative bg-card border border-border rounded-lg p-6 hover-lift hover:border-primary/60"
            >
              <div className="flex justify-between items-start gap-4 mb-3">
                <h3 className="font-display text-xl leading-tight">{s.name}</h3>
                <span className="font-display text-2xl text-gold whitespace-nowrap">{s.price}zł</span>
              </div>
              <p className="text-sm text-muted-foreground mb-5 min-h-[40px]">{s.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {fmtDuration(s.duration)}
                </span>
                <a href={`#rezerwacja`} className="text-xs uppercase tracking-wider text-primary hover:text-accent">
                  Rezerwuj →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
