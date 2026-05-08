import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Reviews } from "@/components/site/Reviews";
import { Gallery } from "@/components/site/Gallery";
import { Team } from "@/components/site/Team";
import { WhyUs } from "@/components/site/WhyUs";
import { Booking } from "@/components/site/Booking";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Barber's Forge — Barberska Kuźnia | Kamienna Wola" },
      { name: "description", content: "Premium barbershop Barber's Forge w Kamiennej Woli. Strzyżenie, broda, koloryzacja. Rezerwuj wizytę online — Top Rated 5.0 w Google." },
      { property: "og:title", content: "Barber's Forge — Barberska Kuźnia" },
      { property: "og:description", content: "Precyzja. Styl. Pewność siebie. Rezerwuj wizytę online." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <WhyUs />
        <Reviews />
        <Gallery />
        <Team />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
