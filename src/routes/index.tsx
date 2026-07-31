import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Reviews } from "@/components/site/Reviews";
import { Gallery } from "@/components/site/Gallery";
import { Team } from "@/components/site/Team";
import { YouTube } from "@/components/site/YouTube";
import { WhyUs } from "@/components/site/WhyUs";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Stałe, subtelne logo w tle — widoczne podczas przewijania */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 hidden md:block"
        style={{
          backgroundImage: `url(${logoImg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "min(60vw, 700px)",
          opacity: 0.06,
        }}
      />
      <div className="relative z-10">
        <Navbar />

        <main>
          <Hero />
          <About />
          <Services />
          <WhyUs />
          <Reviews />
          <Gallery />
          <YouTube />
          <Team />
          <Contact />
        </main>
        <Footer />
      </div>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
