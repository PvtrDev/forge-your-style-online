import { SectionTitle } from "./SectionTitle";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import g7 from "@/assets/gallery-7.jpg";

const images = [
  { src: g4, alt: "Wnętrze barbershopu" },
  { src: g7, alt: "Barber przy pracy nad brodą klienta" },
  { src: g2, alt: "Stylizacja włosów" },
  { src: g5, alt: "Strzyżenie brody maszynką" },
  { src: g6, alt: "Konturowanie brody trymerem" },
  { src: g1, alt: "Pielęgnacja brody" },
  { src: g3, alt: "Narzędzia barberskie" },
];

export function Gallery() {
  return (
    <section id="galeria" className="py-24 bg-card/30 border-y border-border">
      <div className="container mx-auto px-4">
        <SectionTitle eyebrow="Galeria" title="Zajrzyj do kuźni" subtitle="Wnętrze, atmosfera i nasze realizacje." />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
          {images.map((img, i) => (
            <div key={i} className="group relative overflow-hidden rounded-lg aspect-[4/5] bg-card">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                width={1024}
                height={1024}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/0 to-background/0 opacity-60 group-hover:opacity-30 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
