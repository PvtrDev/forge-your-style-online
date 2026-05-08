import { SectionTitle } from "./SectionTitle";
import { Award, Users, Clock4, Sparkles } from "lucide-react";

const features = [
  { icon: Award, title: "Mistrzowskie rzemiosło", text: "Lata doświadczenia w klasycznym i nowoczesnym barberingu." },
  { icon: Users, title: "Indywidualne podejście", text: "Każda wizyta to konsultacja, a nie tylko strzyżenie." },
  { icon: Clock4, title: "Punktualność", text: "Szanujemy Twój czas — wizyty zawsze zgodnie z terminem." },
  { icon: Sparkles, title: "Premium produkty", text: "Pracujemy tylko na sprawdzonych kosmetykach najwyższej jakości." },
];

export function About() {
  return (
    <section id="o-nas" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle
          eyebrow="O nas"
          title="Kuźnia stylu od pierwszego cięcia"
          subtitle="Barber's Forge to miejsce stworzone dla mężczyzn, którzy cenią detal, atmosferę i jakość. Garażowy klimat, profesjonalne podejście i fryzura, z którą wyjdziesz pewny siebie."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="hover-lift bg-card border border-border rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
