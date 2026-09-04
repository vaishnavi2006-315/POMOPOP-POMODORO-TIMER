import { useFocus } from "./store";
import { cn } from "@/lib/utils";

const week = [
  { day: "Mon", h: 1.6 },
  { day: "Tue", h: 2.9 },
  { day: "Wed", h: 1.1 },
  { day: "Thu", h: 3.4 },
  { day: "Fri", h: 2.3 },
  { day: "Sat", h: 0.8 },
  { day: "Sun", h: 1.9 },
];

export function StatsPanel({ className }: { className?: string }) {
  const { focusSeconds, completedPomodoros, tasks } = useFocus();
  const hours = Math.floor(focusSeconds / 3600);
  const mins = Math.floor((focusSeconds % 3600) / 60);
  const max = Math.max(...week.map((w) => w.h));

  return (
    <section className={cn("glass rounded-3xl p-6", className)}>
      <h2 className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase">Your focus</h2>

      <div className="mt-4 flex flex-wrap items-end gap-8">
        <div>
          <p className="text-[11px] text-muted-foreground">Today</p>
          <p className="font-display text-[52px] leading-none">
            {hours}h {mins}m
          </p>
        </div>
        <Stat label="Pomodoros" value={`🍅 ${completedPomodoros}`} />
        <Stat label="Tasks done" value={`${tasks.filter((t) => t.done).length}`} />
        <Stat label="Streak" value="6 days" />
        <Stat label="Most productive" value="21:00 – 23:00" />
      </div>

      <div className="mt-8 flex h-40 items-end gap-3">
        {week.map((w, i) => (
          <div key={w.day} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-primary/25 to-primary/85 transition-all duration-700"
                style={{ height: `${(w.h / max) * 100}%`, transitionDelay: `${i * 60}ms` }}
              />
            </div>
            <span className="text-[10.5px] text-muted-foreground">{w.day}</span>
          </div>
        ))}
      </div>

      <div className="mt-7">
        <p className="text-[10.5px] tracking-[0.24em] text-muted-foreground uppercase">
          Focus history
        </p>
        <div className="mt-3 space-y-2 text-[12.5px]">
          {[
            ["Today · 21:10", "Finish project proposal", "50m"],
            ["Today · 19:35", "Read Chapter 4", "25m"],
            ["Yesterday · 22:02", "Late night coding", "1h 15m"],
          ].map(([when, what, dur]) => (
            <div key={when} className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-muted-foreground">{when}</span>
              <span className="mx-3 flex-1 truncate">{what}</span>
              <span className="tabular-nums">{dur}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-[19px]">{value}</p>
    </div>
  );
}
