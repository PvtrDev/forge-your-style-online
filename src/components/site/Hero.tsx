import logoAsset from "@/assets/logo-forge.png.asset.json";
import { Star, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-primary/40 bg-background/40 backdrop-blur-sm text-xs uppercase tracking-widest">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-foreground/90">Top Rated on Google · 5.0</span>
        </div>

        <h1 className="mb-4">
          <img
            src={logoAsset.url}
            alt="Barber's Forge — Barberska Kuźnia"
            width={1024}
            height={1024}
            className="mx-auto w-full max-w-md md:max-w-xl h-auto"
          />
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
            href="#kontakt"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-gradient-gold text-primary-foreground font-semibold shadow-glow hover:scale-[1.03] transition-transform"
          >
            Skontaktuj się
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
