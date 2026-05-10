// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SPREADSHEET_ID = "1QVqMN6PvHQKOysBNkGU8YvpQ-DYYpkZaCkbp-PD6M84";
const SHEET_NAME = "Sheet1";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function todayWarsaw(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function normalizeDate(s: string): string {
  const t = (s ?? "").toString().trim();
  if (!t) return "";
  const iso = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const dmy = t.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
  if (dmy) {
    const d = dmy[1].padStart(2, "0");
    const m = dmy[2].padStart(2, "0");
    return `${dmy[3]}-${m}-${d}`;
  }
  const dt = new Date(t);
  if (!isNaN(dt.getTime())) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Warsaw",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(dt);
  }
  return t;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GOOGLE_SHEETS_API_KEY = Deno.env.get("GOOGLE_SHEETS_API_KEY");
    if (!LOVABLE_API_KEY || !GOOGLE_SHEETS_API_KEY) {
      throw new Error("Missing connector credentials");
    }

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
      throw new Error(`Sheets API failed [${res.status}]: ${JSON.stringify(data)}`);
    }

    const rows: string[][] = data.values ?? [];
    const first = (rows[0] ?? []).map((c: string) => (c ?? "").toString().toLowerCase());
    const hasHeader = first.includes("name") || first.includes("imie") || first.includes("date");
    const dataRows = hasHeader ? rows.slice(1) : rows;

    const urlObj = new URL(req.url);
    const requested = urlObj.searchParams.get("date");
    const target = requested && /^\d{4}-\d{2}-\d{2}$/.test(requested)
      ? requested
      : todayWarsaw();

    const bookings = dataRows
      .map((r) => ({
        name: (r[0] ?? "").toString().trim(),
        service: (r[2] ?? "").toString().trim(),
        date: normalizeDate((r[3] ?? "").toString()),
        time: (r[4] ?? "").toString().trim(),
      }))
      .filter((b) => b.date === target && (b.name || b.service || b.time))
      .map(({ time, name, service }) => ({ time, name, service }))
      .sort((a, b) => a.time.localeCompare(b.time));

    return new Response(JSON.stringify({ bookings }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
