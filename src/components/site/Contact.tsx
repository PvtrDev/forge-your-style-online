import { SectionTitle } from "./SectionTitle";
import { MapPin, Phone, Clock } from "lucide-react";
import { dayNames, openingHours } from "@/lib/services";

export function Contact() {
  const today = new Date().getDay();
  return (
    <section id="kontakt" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle eyebrow="Kontakt" title="Znajdź nas" subtitle="Wpadnij na kawę, zostań na strzyżenie." />

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-5">
            <a
              href="https://maps.google.com/?q=Kamienna+Wola+24,+26-220+Kamienna+Wola"
              target="_blank"
              rel="noreferrer"
              className="flex gap-4 bg-card border border-border rounded-lg p-5 hover:border-primary transition-colors"
            >
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Adres</p>
                <p className="font-medium">Kamienna Wola 24</p>
                <p className="text-sm text-muted-foreground">26-220 Kamienna Wola</p>
              </div>
            </a>

            <a
              href="tel:+48795586235"
              className="flex gap-4 bg-card border border-border rounded-lg p-5 hover:border-primary transition-colors"
            >
              <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Telefon</p>
                <p className="font-medium text-lg">795 586 235</p>
                <p className="text-sm text-muted-foreground">Zadzwoń lub umów online</p>
              </div>
            </a>

            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Godziny otwarcia</p>
              </div>
              <ul className="space-y-1.5 text-sm">
                {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                  const h = openingHours[d];
                  const isToday = d === today;
                  return (
                    <li
                      key={d}
                      className={`flex justify-between ${isToday ? "text-primary font-medium" : "text-foreground/80"}`}
                    >
                      <span>{dayNames[d]}</span>
                      <span>{h ? `${h.start} – ${h.end}` : "Zamknięte"}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-border min-h-[400px]">
            <iframe
              title="Mapa Barber's Forge"
              src="https://www.google.com/maps?q=Kamienna+Wola+24,+26-220+Kamienna+Wola&output=embed"
              className="w-full h-full min-h-[400px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
