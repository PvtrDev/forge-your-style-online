import { SectionTitle } from "./SectionTitle";
import barber from "@/assets/barber-robert.jpg";
import { Instagram } from "lucide-react";

export function Team() {
  return (
    <section id="zespol" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle eyebrow="Zespół" title="Mistrz kuźni" />

        <div className="max-w-md mx-auto bg-card border border-border rounded-lg overflow-hidden hover-lift">
          <div className="relative aspect-square overflow-hidden">
            <img src={barber} alt="Robert — barber" loading="lazy" width={800} height={800} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 text-center">
            <h3 className="font-display text-2xl">Robert</h3>
            <p className="text-sm text-primary mb-3">Założyciel · Master Barber</p>
            <p className="text-sm text-muted-foreground mb-4">
              Pasjonat klasycznego barberingu i nowoczesnych stylizacji. Za swoim fotelem ugościł setki klientów,
              każdego traktując jak starego znajomego.
            </p>
            <a href="#rezerwacja" className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent">
              <Instagram className="h-4 w-4" /> Umów się do Roberta
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
