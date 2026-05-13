import { useEffect, useMemo, useState } from "react";
import { CalendarIcon, Check, Loader2, Clock, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { services, openingHours, dayNames } from "@/lib/services";
import { SectionTitle } from "./SectionTitle";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const SLOT_STEP = 15; // minutes

// Ustaw na false, aby tymczasowo wyłączyć możliwość rezerwacji online
const BOOKING_ENABLED = false;

function toMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function toTime(min: number) {
  const h = Math.floor(min / 60).toString().padStart(2, "0");
  const m = (min % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function Booking() {
  const [serviceId, setServiceId] = useState<string>(services[0].id);
  const [date, setDate] = useState<Date | undefined>();
  const [slot, setSlot] = useState<string | null>(null);
  const [taken, setTaken] = useState<{ booking_time: string; duration_min: number }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const service = useMemo(() => services.find((s) => s.id === serviceId)!, [serviceId]);

  // Fetch taken slots when date changes
  useEffect(() => {
    if (!date) return;
    setSlot(null);
    setLoadingSlots(true);
    const dateStr = format(date, "yyyy-MM-dd");
    supabase
      .rpc("get_taken_slots", { p_date: dateStr })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          setTaken([]);
        } else {
          setTaken(
            (data || []).map((d: any) => ({
              booking_time: typeof d.booking_time === "string" ? d.booking_time.slice(0, 5) : d.booking_time,
              duration_min: d.duration_min,
            })),
          );
        }
        setLoadingSlots(false);
      });
  }, [date]);

  const slots = useMemo(() => {
    if (!date) return [];
    const dow = date.getDay();
    const hours = openingHours[dow];
    if (!hours) return [];
    const startMin = toMin(hours.start);
    const endMin = toMin(hours.end);
    const dur = service.duration;

    const takenRanges = taken.map((t) => {
      const s = toMin(t.booking_time);
      return [s, s + t.duration_min] as [number, number];
    });

    const now = new Date();
    const isToday = format(date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
    const nowMin = now.getHours() * 60 + now.getMinutes();

    const list: { time: string; available: boolean }[] = [];
    for (let m = startMin; m + dur <= endMin; m += SLOT_STEP) {
      const overlaps = takenRanges.some(([s, e]) => m < e && m + dur > s);
      const inPast = isToday && m <= nowMin;
      list.push({ time: toTime(m), available: !overlaps && !inPast });
    }
    return list;
  }, [date, service, taken]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !slot) {
      toast.error("Wybierz datę i godzinę");
      return;
    }
    if (name.trim().length < 2) return toast.error("Podaj imię i nazwisko");
    if (!/^[0-9 +()-]{7,20}$/.test(phone.trim())) return toast.error("Podaj poprawny numer telefonu");

    setSubmitting(true);
    const { error } = await supabase.from("bookings").insert({
      service_id: service.id,
      service_name: service.name,
      price_pln: service.price,
      duration_min: service.duration,
      booking_date: format(date, "yyyy-MM-dd"),
      booking_time: slot,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      customer_email: email.trim() || null,
      notes: notes.trim() || null,
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message || "Nie udało się zarezerwować");
      return;
    }

    setConfirmed(true);

    // Wyślij webhook do Make.com (nie blokuje UX jeśli się nie powiedzie)
    fetch("https://hook.eu1.make.com/721j2eguv8n77i7lb1tifqscapyafsfy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        service: service.name,
        date: format(date, "yyyy-MM-dd"),
        time: slot,
        notes: notes.trim(),
      }),
    }).catch((err) => console.error("Webhook error:", err));

    toast.success("Rezerwacja przyjęta!", {
      description: `${service.name} · ${format(date, "EEEE, d MMM", { locale: pl })} o ${slot}`,
      duration: 6000,
    });

    // Refresh taken slots
    const dateStr = format(date, "yyyy-MM-dd");
    const { data } = await supabase.rpc("get_taken_slots", { p_date: dateStr });
    if (data) {
      setTaken(
        (data as any[]).map((d) => ({
          booking_time: typeof d.booking_time === "string" ? d.booking_time.slice(0, 5) : d.booking_time,
          duration_min: d.duration_min,
        })),
      );
    }

    setTimeout(() => {
      setConfirmed(false);
      setName(""); setPhone(""); setEmail(""); setNotes(""); setSlot(null);
    }, 3500);
  }

  const dayClosed = date ? !openingHours[date.getDay()] : false;

  return (
    <section id="rezerwacja" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-gold opacity-[0.04] pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <SectionTitle
          eyebrow="Rezerwacja"
          title="Zarezerwuj wizytę online"
          subtitle="Wybierz usługę, datę i wolny termin — gotowe w kilka sekund."
        />

        <div className="max-w-5xl mx-auto bg-card border border-primary/30 rounded-xl shadow-card overflow-hidden">
          <div className="grid lg:grid-cols-[1.1fr_1fr]">
            {/* LEFT: Service + date + slots */}
            <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-border">
              <div className="mb-6">
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">1. Usługa</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => { setServiceId(s.id); setSlot(null); }}
                      className={cn(
                        "text-left p-3 rounded-md border transition-all",
                        serviceId === s.id
                          ? "border-primary bg-primary/10 shadow-glow"
                          : "border-border hover:border-primary/50",
                      )}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-sm font-medium leading-tight">{s.name}</span>
                        <span className="text-sm text-gold font-display">{s.price}zł</span>
                      </div>
                      <span className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> {s.duration}min
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">2. Data</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full flex items-center gap-2 px-4 py-3 rounded-md border border-border bg-input hover:border-primary transition-colors",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {date ? format(date, "EEEE, d MMMM yyyy", { locale: pl }) : "Wybierz dzień"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      locale={pl}
                      disabled={(d) => {
                        const today = new Date(); today.setHours(0,0,0,0);
                        if (d < today) return true;
                        const max = new Date(); max.setDate(max.getDate() + 60);
                        if (d > max) return true;
                        return !openingHours[d.getDay()];
                      }}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">3. Wolne godziny</label>
                {!date ? (
                  <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-md">
                    Najpierw wybierz datę
                  </p>
                ) : dayClosed ? (
                  <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-md">
                    Zamknięte w {dayNames[date.getDay()].toLowerCase()}
                  </p>
                ) : loadingSlots ? (
                  <div className="flex items-center justify-center py-6 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Ładowanie...
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
                    {slots.map((s) => (
                      <button
                        key={s.time}
                        type="button"
                        disabled={!s.available}
                        onClick={() => setSlot(s.time)}
                        className={cn(
                          "py-2 text-sm rounded-md border transition-all",
                          !s.available && "opacity-30 line-through cursor-not-allowed",
                          s.available && slot === s.time && "border-primary bg-gradient-gold text-primary-foreground font-semibold",
                          s.available && slot !== s.time && "border-border hover:border-primary hover:text-primary",
                        )}
                      >
                        {s.time}
                      </button>
                    ))}
                    {slots.length === 0 && (
                      <p className="col-span-full text-sm text-muted-foreground text-center py-4">
                        Brak wolnych godzin tego dnia
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Customer details */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-card/50">
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-3">4. Twoje dane</label>

              <div className="space-y-3">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  placeholder="Imię i nazwisko"
                  className="w-full px-4 py-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none transition-colors"
                />
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={20}
                  placeholder="Numer telefonu"
                  className="w-full px-4 py-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  placeholder="Email (opcjonalnie)"
                  className="w-full px-4 py-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none transition-colors"
                />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={500}
                  placeholder="Dodatkowe uwagi (opcjonalnie)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="mt-5 p-4 rounded-md bg-background/50 border border-border text-sm space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Usługa</span><span className="font-medium">{service.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Termin</span><span className="font-medium">{date ? `${format(date, "d MMM", { locale: pl })}, ${slot ?? "—"}` : "—"}</span></div>
                <div className="flex justify-between text-base pt-2 border-t border-border mt-2">
                  <span>Razem</span><span className="text-gold font-display text-lg">{service.price}zł</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || confirmed || !slot}
                className={cn(
                  "mt-5 w-full py-4 rounded-md font-semibold text-primary-foreground flex items-center justify-center gap-2 transition-all relative overflow-hidden",
                  confirmed ? "bg-emerald-500" : "bg-gradient-gold hover:shadow-glow active:scale-[0.98]",
                  (submitting || !slot) && "opacity-70 cursor-not-allowed",
                )}
              >
                {submitting ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Rezerwuję...</>
                ) : confirmed ? (
                  <><Check className="h-5 w-5" /> Rezerwacja potwierdzona</>
                ) : (
                  <>Potwierdź rezerwację <ChevronRight className="h-5 w-5" /></>
                )}
              </button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Klikając potwierdzasz akceptację warunków rezerwacji.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
