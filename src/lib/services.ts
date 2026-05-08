export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
};

export const services: Service[] = [
  { id: "strzyzenie", name: "Strzyżenie", description: "Klasyczne lub nowoczesne męskie strzyżenie dopasowane do Twojego stylu.", price: 75, duration: 50 },
  { id: "combo", name: "Combo (strzyżenie + broda)", description: "Pełna metamorfoza — strzyżenie i pielęgnacja brody w jednej wizycie.", price: 120, duration: 90 },
  { id: "broda", name: "Trymowanie i pielęgnacja brody", description: "Trymowanie, konturowanie i odżywianie brody dla idealnej linii.", price: 70, duration: 30 },
  { id: "combo-koloryzacja", name: "Combo z koloryzacją brody", description: "Strzyżenie, modelowanie brody i profesjonalna koloryzacja.", price: 140, duration: 105 },
  { id: "koloryzacja", name: "Koloryzacja brody", description: "Wyrównanie tonu i pogłębienie koloru zarostu.", price: 60, duration: 25 },
  { id: "koncha", name: "Koncha — świecowanie uszu", description: "Tradycyjny rytuał oczyszczania i relaksu.", price: 60, duration: 30 },
  { id: "nos", name: "Usuwanie włosów z nosa", description: "Szybki i bezbolesny zabieg dla pełnego komfortu.", price: 50, duration: 30 },
  { id: "uszy", name: "Usuwanie włosów z uszu", description: "Precyzyjna pielęgnacja każdego detalu.", price: 50, duration: 30 },
  { id: "pakiet", name: "Pakiet wszystkich usług", description: "Pełna pielęgnacja: strzyżenie, broda, koloryzacja, koncha i więcej.", price: 250, duration: 120 },
];

// Opening hours per day-of-week (0=Sun ... 6=Sat). null = closed.
export const openingHours: Record<number, { start: string; end: string } | null> = {
  0: null,                              // Niedziela — zamknięte
  1: null,                              // Poniedziałek — zamknięte
  2: { start: "10:00", end: "21:00" },  // Wtorek
  3: { start: "14:00", end: "21:00" },  // Środa
  4: { start: "10:00", end: "21:00" },  // Czwartek
  5: { start: "10:00", end: "20:00" },  // Piątek
  6: { start: "10:00", end: "14:00" },  // Sobota
};

export const dayNames = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
