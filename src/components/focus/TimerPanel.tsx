import { Pause, Play, RotateCcw, SkipForward, Sparkles } from "lucide-react";
import { fmt, modeLabel, useFocus, type Mode } from "./store";
import { cn } from "@/lib/utils";

export function TimerPanel() {
  const {
    mode,
    setMode,
    secondsLeft,
    totalSeconds,
    running,
    toggleRun,
    reset,
    skip,
    round,
    settings,
    activeTask,
    justCompleted,
  } = useFocus();

  const progress = totalSeconds ? 1 - secondsLeft / totalSeconds : 0;
  const r = 156;
  const c = 2 * Math.PI * r;
  const focusing = running && mode === "focus";

  return (
    <section className="relative flex flex-col items-center justify-center">
      <div
        className={cn(
          "glass-soft flex items-center gap-1 rounded-full p-1 transition-all duration-500",
          focusing && "pointer-events-none opacity-0",
        )}
      >
        {(["focus", "short", "long"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "press rounded-full px-4 py-1.5 text-[12px]",
              mode === m ? "bg-foreground/14 text-foreground" : "text-muted-foreground",
            )}
          >
            {modeLabel[m]}
          </button>
        ))}
      </div>

      <div className="relative mt-8 flex h-[360px] w-[360px] items-center justify-center">
        <div
          className={cn(
            "absolute inset-6 rounded-full blur-3xl transition-opacity duration-1000",
            running ? "animate-breathe opacity-80" : "opacity-40",
          )}
          style={{ background: "var(--primary)", opacity: 0.18 }}
        />
        <svg viewBox="0 0 360 360" className="absolute inset-0 h-full w-full -rotate-90">
          <circle
            cx="180"
            cy="180"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-foreground/12"
          />
          <circle
            cx="180"
            cy="180"
            r={r}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - progress)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        <div className="flex flex-col items-center">
          <span className="text-[11px] tracking-[0.34em] text-muted-foreground uppercase">
            {modeLabel[mode]}
          </span>
          <span className="text-glow mt-1 font-display text-[86px] leading-[1] tabular-nums">
            {fmt(secondsLeft)}
          </span>
          <span className="mt-2 max-w-[220px] truncate text-center text-[13px] text-foreground/70">
            {activeTask ? activeTask.title : "No task selected"}
          </span>
          <span className="mt-5 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Pomodoro {round} of {settings.rounds}
          </span>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={reset}
          aria-label="Reset"
          className="press flex h-11 w-11 items-center justify-center rounded-full border border-glass-border bg-glass text-foreground/70"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={toggleRun}
          className="press flex h-16 items-center gap-2.5 rounded-full bg-primary px-9 text-[15px] font-medium tracking-wide text-primary-foreground shadow-[0_18px_50px_-18px_var(--primary)]"
        >
          {running ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={skip}
          aria-label="Skip"
          className="press flex h-11 w-11 items-center justify-center rounded-full border border-glass-border bg-glass text-foreground/70"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>

      <div
        className={cn(
          "mt-6 flex items-center gap-2 text-[11px] tracking-[0.22em] text-muted-foreground uppercase transition-opacity duration-700",
          focusing ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-primary" />
        Focus mode
      </div>

      {justCompleted && settings.celebrate && (
        <div className="animate-rise pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px]">
            <Sparkles className="h-4 w-4 text-primary" />
            Session complete — take a breath
          </div>
        </div>
      )}
    </section>
  );
}
