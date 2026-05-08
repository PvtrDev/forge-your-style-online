import { Scissors } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-10 bg-card/40 border-t border-border">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Scissors className="h-4 w-4 text-primary" />
          <span className="font-display">Barber's Forge — Barberska Kuźnia</span>
        </div>
        <p>© {new Date().getFullYear()} Wszelkie prawa zastrzeżone.</p>
      </div>
    </footer>
  );
}
