import heroImg from "@/assets/hero.jpg";
import { Star, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt="Wnętrze barbershopu Barber's Forge"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--hero-overlay)" }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-primary/40 bg-background/40 backdrop-blur-sm text-xs uppercase tracking-widest">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-foreground/90">Top Rated on Google · 5.0</span>
        </div>

        <h1 className="lucide lucide-scissors text-primary transition-transform group-hover:rotate-12 w-[30px] h-[30px]">
          Barber's <span className="text-gold">Forge</span>
        </h1>
        <p className="font-display italic text-lg md:text-2xl text-muted-foreground mb-2">
          Precyzja. Styl. Pewność siebie.
        </p>
        <p className="text-foreground/70 max-w-xl mx-auto mb-10 text-base md:text-lg">
          Barberska Kuźnia, w której każde strzyżenie to rzemiosło.
          Klasyczne techniki, nowoczesny styl, atmosfera, do której wracasz.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#rezerwacja"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-gradient-gold text-primary-foreground font-semibold shadow-glow hover:scale-[1.03] transition-transform"
          >
            Zarezerwuj wizytę
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#uslugi"
            className="px-7 py-3.5 rounded-md border border-border bg-background/30 backdrop-blur-sm text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            Zobacz usługi
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground text-xs tracking-widest uppercase animate-pulse">
        ↓ Scroll
      </div>
    </section>
  );
}
