import { SectionTitle } from "./SectionTitle";
import barber from "@/assets/barber-robert.jpg";
import sebastian from "@/assets/barber-sebastian.jpg.asset.json";
import { Instagram } from "lucide-react";

const team = [
  {
    name: "Robert",
    role: "Założyciel · Master Barber",
    img: barber,
    bio: "Pasjonat klasycznego barberingu i nowoczesnych stylizacji. Za swoim fotelem ugościł setki klientów, każdego traktując jak starego znajomego.",
  },
  {
    name: "Sebastian",
    role: "Barber",
    img: sebastian.url,
    bio: "Precyzja, dobre oko i wyczucie stylu. Sebastian łączy klasyczne fade'y z nowoczesnymi trendami — u niego każde strzyżenie to pełen luz i solidne rzemiosło.",
  },
];

export function Team() {
  return (
    <section id="zespol" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle eyebrow="Zespół" title="Mistrzowie kuźni" />

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {team.map((m) => (
            <div key={m.name} className="bg-card border border-border rounded-lg overflow-hidden hover-lift">
              <div className="relative aspect-square overflow-hidden">
                <img src={m.img} alt={`${m.name} — barber`} loading="lazy" width={800} height={800} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-display text-2xl">{m.name}</h3>
                <p className="text-sm text-primary mb-3">{m.role}</p>
                <p className="text-sm text-muted-foreground mb-4">{m.bio}</p>
                <a href="#kontakt" className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent">
                  <Instagram className="h-4 w-4" /> Umów się do {m.name}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
