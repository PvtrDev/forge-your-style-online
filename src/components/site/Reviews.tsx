import { SectionTitle } from "./SectionTitle";
import { Star } from "lucide-react";

const reviews = [
  { name: "Michał Kolus", text: "Klasa, świetna atmosfera, świetny fachowiec, godny polecenia, wrócę na pewno!", rating: 5 },
  { name: "Mateusz Zbrog", text: "Polecam w 100%, zawsze wspaniała atmosfera i metamorfoza po każdej wizycie.", rating: 5 },
  { name: "Kawuś", text: "Fajna, garażowa atmosfera. Wyszliśmy z synem ze świeżą fryzurą i fajnie spędziliśmy czas. Robert to mega sympatyczny gość — czuję się jak na rozmowie ze starym kumplem.", rating: 5 },
  { name: "Tomasz W.", text: "Najlepszy barber w okolicy. Zawsze precyzyjnie, zawsze na czas, zawsze efekt WOW.", rating: 5 },
  { name: "Adrian K.", text: "Mistrzostwo w pielęgnacji brody. Polecam każdemu, kto chce wyglądać i czuć się dobrze.", rating: 5 },
];

export function Reviews() {
  return (
    <section id="opinie" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle eyebrow="Opinie" title="Co mówią klienci" />

        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-primary text-primary" />
            ))}
          </div>
          <p className="font-display text-3xl text-gold">5.0 / 5.0</p>
          <p className="text-sm text-muted-foreground">na podstawie 23 opinii w Google</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {reviews.map((r, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6 hover-lift">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-foreground/85 italic mb-4">„{r.text}"</p>
              <p className="text-sm font-medium text-primary">— {r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
