import { useFocus } from "./store";
import { Overlay, Toggle } from "./EnvironmentSheet";
import { cn } from "@/lib/utils";

const sounds = ["Soft chime", "Wooden bell", "Rain swell", "Silence"];

export function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings, update } = useFocus();

  return (
    <Overlay open={open} onClose={onClose} title="Timer settings">
      <div className="grid gap-4 sm:grid-cols-4">
        <Stepper label="Focus" value={settings.focus} onChange={(v) => update({ focus: v })} />
        <Stepper label="Short break" value={settings.short} onChange={(v) => update({ short: v })} />
        <Stepper label="Long break" value={settings.long} onChange={(v) => update({ long: v })} />
        <Stepper
          label="Pomodoros"
          value={settings.rounds}
          suffix=""
          onChange={(v) => update({ rounds: v })}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Toggle
          label="Auto-start breaks"
          on={settings.autoBreak}
          onClick={() => update({ autoBreak: !settings.autoBreak })}
        />
        <Toggle
          label="Auto-start focus"
          on={settings.autoFocus}
          onClick={() => update({ autoFocus: !settings.autoFocus })}
        />
        <Toggle
          label="End-of-session animation"
          on={settings.celebrate}
          onClick={() => update({ celebrate: !settings.celebrate })}
        />
        <Toggle
          label="Reduce motion"
          on={settings.reduceMotion}
          onClick={() => update({ reduceMotion: !settings.reduceMotion })}
        />
      </div>

      <div className="mt-6">
        <p className="text-[10.5px] tracking-[0.24em] text-muted-foreground uppercase">
          Timer sound
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {sounds.map((s) => (
            <button
              key={s}
              onClick={() => update({ sound: s })}
              className={cn(
                "press rounded-full px-3 py-1.5 text-[11.5px]",
                settings.sound === s ? "bg-foreground/14" : "text-muted-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </Overlay>
  );
}

function Stepper({
  label,
  value,
  onChange,
  suffix = "min",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-glass-border bg-foreground/5 p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          className="press h-7 w-7 rounded-full bg-foreground/8"
        >
          −
        </button>
        <span className="font-display text-[24px] tabular-nums">
          {value}
          <span className="ml-1 text-[11px] text-muted-foreground">{suffix}</span>
        </span>
        <button
          onClick={() => onChange(value + 1)}
          className="press h-7 w-7 rounded-full bg-foreground/8"
        >
          +
        </button>
      </div>
    </div>
  );
}
