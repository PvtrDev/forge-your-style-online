import { SectionTitle } from "./SectionTitle";
import { ShieldCheck, Flame, Coffee, MapPin } from "lucide-react";

const items = [
  { icon: Flame, title: "Garażowy klimat", text: "Industrialne wnętrze, vintage fotele, atmosfera, której nie znajdziesz w sieciówce." },
  { icon: Coffee, title: "Wizyta = doświadczenie", text: "Kawa, rozmowa, zero pośpiechu. Wychodzisz nie tylko z fryzurą — z dobrym dniem." },
  { icon: ShieldCheck, title: "Gwarancja jakości", text: "Nie jesteś zadowolony? Poprawimy. Twój wygląd to nasza wizytówka." },
  { icon: MapPin, title: "Łatwy dojazd", text: "Kamienna Wola — wygodny dojazd, miejsce parkingowe, bez kolejek." },
];

export function WhyUs() {
  return (
    <section className="py-24 bg-card/30 border-y border-border">
      <div className="container mx-auto px-4">
        <SectionTitle eyebrow="Why us" title="Dlaczego Barber's Forge" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {items.map((it) => (
            <div key={it.title} className="bg-card border border-border rounded-lg p-6 hover-lift">
              <div className="inline-flex items-center justify-center h-11 w-11 rounded-md bg-gradient-gold text-primary-foreground mb-4">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg mb-2">{it.title}</h3>
              <p className="text-sm text-muted-foreground">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
