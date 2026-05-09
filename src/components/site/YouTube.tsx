import { SectionTitle } from "./SectionTitle";

const videos = [
  { id: "9Vr8Wr-58d8", title: "Barber's Forge — film 1" },
  { id: "ryiuHphcbHc", title: "Barber's Forge — film 2" },
];

export function YouTube() {
  return (
    <section id="youtube" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle eyebrow="YouTube" title="Zobacz nas w akcji" />
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-2">
          {videos.map((v) => (
            <div
              key={v.id}
              className="relative w-full overflow-hidden rounded-lg border border-border shadow-lg"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${v.id}`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
