import { createServerFn } from "@tanstack/react-start";

const SPREADSHEET_ID = "1QVqMN6PvHQKOysBNkGU8YvpQ-DYYpkZaCkbp-PD6M84";
const SHEET_NAME = "Sheet1";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";

export type TodayBooking = {
  time: string;
  name: string;
  service: string;
};

export const getTodayBookings = createServerFn({ method: "GET" }).handler(
  async (): Promise<TodayBooking[]> => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
    if (!GOOGLE_SHEETS_API_KEY)
      throw new Error("GOOGLE_SHEETS_API_KEY is not configured");

    const range = `${SHEET_NAME}!A:F`;
    const url = `${GATEWAY_URL}/spreadsheets/${SPREADSHEET_ID}/values/${range}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_SHEETS_API_KEY,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        `Sheets API failed [${res.status}]: ${JSON.stringify(data)}`,
      );
    }

    const rows: string[][] = data.values ?? [];
    if (rows.length === 0) return [];

    // Detect header row
    const first = rows[0].map((c) => (c ?? "").toString().toLowerCase());
    const hasHeader = first.includes("name") || first.includes("imie") || first.includes("date");
    const dataRows = hasHeader ? rows.slice(1) : rows;

    // Today's date in Europe/Warsaw timezone, normalized to YYYY-MM-DD
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Warsaw",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const today = fmt.format(new Date()); // e.g. 2026-05-10

    const normalizeDate = (s: string): string => {
      const t = (s ?? "").toString().trim();
      if (!t) return "";
      // YYYY-MM-DD
      const iso = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
      // DD.MM.YYYY or DD/MM/YYYY
      const dmy = t.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
      if (dmy) {
        const d = dmy[1].padStart(2, "0");
        const m = dmy[2].padStart(2, "0");
        return `${dmy[3]}-${m}-${d}`;
      }
      // Try Date parser
      const dt = new Date(t);
      if (!isNaN(dt.getTime())) {
        return fmt.format(dt);
      }
      return t;
    };

    const bookings: TodayBooking[] = dataRows
      .map((r) => ({
        name: (r[0] ?? "").toString().trim(),
        // r[1] = phone (skipped)
        service: (r[2] ?? "").toString().trim(),
        date: normalizeDate((r[3] ?? "").toString()),
        time: (r[4] ?? "").toString().trim(),
      }))
      .filter((b) => b.date === today && (b.name || b.service || b.time))
      .map(({ time, name, service }) => ({ time, name, service }))
      .sort((a, b) => a.time.localeCompare(b.time));

    return bookings;
  },
);
