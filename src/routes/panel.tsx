import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Clock,
  User,
  Scissors,
  Lock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TodayBooking = { time: string; name: string; service: string };

const PANEL_PASSWORD = "barber123";
const STORAGE_KEY = "panel_auth";

export const Route = createFileRoute("/panel")({
  head: () => ({
    meta: [
      { title: "Panel właściciela — Barber's Forge" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PanelPage,
});

function PanelPage() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  if (!authed) return <PasswordGate onSuccess={() => setAuthed(true)} />;
  return <Dashboard />;
}

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value === PANEL_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold">Panel właściciela</h1>
          <p className="text-muted-foreground">Wpisz hasło, aby kontynuować</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Input
            type="password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            placeholder="Hasło"
            className="h-12 text-lg"
            autoFocus
          />
          {error && (
            <p className="text-destructive text-center font-medium">Brak dostępu</p>
          )}
          <Button type="submit" className="w-full h-12 text-lg">
            Zaloguj
          </Button>
        </form>
      </Card>
    </main>
  );
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function shiftDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

function isSameDay(a: Date, b: Date): boolean {
  return toIsoDate(a) === toIsoDate(b);
}

function Dashboard() {
  const [selected, setSelected] = useState<Date>(() => new Date());
  const isoDate = toIsoDate(selected);
  const today = new Date();
  const isToday = isSameDay(selected, today);

  const { data, isLoading, isError, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["bookings", isoDate],
    queryFn: async (): Promise<TodayBooking[]> => {
      const { data, error } = await supabase.functions.invoke("today-bookings", {
        body: { date: isoDate },
        method: "GET",
      } as never);
      // Edge function reads ?date= from URL; fall back via direct fetch if invoke shape differs
      if (error) throw error;
      return (data?.bookings ?? []) as TodayBooking[];
    },
    refetchInterval: isToday ? 30_000 : false,
    refetchOnWindowFocus: true,
  });

  const dateLabel = selected.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const updated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <header className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-muted-foreground text-lg capitalize">{dateLabel}</p>
            <h1 className="text-3xl md:text-4xl font-bold mt-1">
              {isToday ? "Dzisiejsze rezerwacje" : "Rezerwacje"}
            </h1>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw className={`h-5 w-5 ${isFetching ? "animate-spin" : ""}`} />
            Odśwież
          </Button>
        </header>

        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setSelected((d) => shiftDays(d, -1))}
            className="h-12 w-12 p-0"
            aria-label="Poprzedni dzień"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className={cn("h-12 gap-2 flex-1 min-w-[200px] justify-center text-base font-medium")}
              >
                <CalendarIcon className="h-5 w-5" />
                <span className="capitalize">{dateLabel}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={selected}
                onSelect={(d) => d && setSelected(d)}
                weekStartsOn={1}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setSelected((d) => shiftDays(d, 1))}
            className="h-12 w-12 p-0"
            aria-label="Następny dzień"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {!isToday && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setSelected(new Date())}
              className="h-12"
            >
              Dziś
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-28 animate-pulse bg-muted/40" />
            ))}
          </div>
        )}

        {isError && (
          <Card className="p-6 border-destructive/40">
            <p className="text-destructive font-medium">
              Nie udało się pobrać rezerwacji. Spróbuj ponownie.
            </p>
          </Card>
        )}

        {!isLoading && !isError && data && data.length === 0 && (
          <Card className="p-10 text-center">
            <p className="text-2xl font-medium">Brak rezerwacji</p>
            <p className="text-muted-foreground mt-2">
              {isToday ? "Ciesz się wolnym dniem ✂️" : "W tym dniu nie ma wizyt."}
            </p>
          </Card>
        )}

        {!isLoading && !isError && data && data.length > 0 && (
          <ul className="space-y-3">
            {data.map((b, idx) => (
              <li key={idx}>
                <Card className="p-5 md:p-6 flex items-center gap-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center justify-center min-w-[90px] md:min-w-[110px] py-3 px-4 rounded-xl bg-primary text-primary-foreground">
                    <Clock className="h-5 w-5 mb-1 opacity-80" />
                    <span className="text-2xl md:text-3xl font-bold tabular-nums">
                      {b.time || "—"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 text-xl md:text-2xl font-semibold truncate">
                      <User className="h-5 w-5 text-muted-foreground shrink-0" />
                      <span className="truncate">{b.name || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-base md:text-lg text-muted-foreground truncate">
                      <Scissors className="h-4 w-4 shrink-0" />
                      <span className="truncate">{b.service || "—"}</span>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}

        <p className="text-center text-sm text-muted-foreground mt-8">
          {isToday ? "Auto-odświeżanie co 30 s · " : ""}Ostatnia aktualizacja: {updated}
        </p>
      </div>
    </main>
  );
}
