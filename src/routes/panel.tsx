import { createFileRoute, useServerFn } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { getTodayBookings } from "@/lib/bookings.functions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, User, Scissors, Lock, RefreshCw } from "lucide-react";

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

function Dashboard() {
  const fetchBookings = useServerFn(getTodayBookings);
  const { data, isLoading, isError, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["today-bookings"],
    queryFn: () => fetchBookings(),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });

  const today = new Date().toLocaleDateString("pl-PL", {
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
        <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-muted-foreground text-lg capitalize">{today}</p>
            <h1 className="text-3xl md:text-4xl font-bold mt-1">Dzisiejsze rezerwacje</h1>
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
            <p className="text-2xl font-medium">Brak rezerwacji na dziś</p>
            <p className="text-muted-foreground mt-2">Ciesz się wolnym dniem ✂️</p>
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
          Auto-odświeżanie co 30 s · Ostatnia aktualizacja: {updated}
        </p>
      </div>
    </main>
  );
}
