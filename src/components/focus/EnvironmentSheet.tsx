import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { environments, themeNames, type ThemeId } from "./environments";
import { useFocus } from "./store";
import { cn } from "@/lib/utils";

export function EnvironmentSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings, update, env } = useFocus();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <Overlay open={open} onClose={onClose} title="Environment">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {environments.map((e) => (
          <button
            key={e.id}
            onClick={() => update({ envId: e.id, customBg: null })}
            className={cn(
              "press group relative h-24 overflow-hidden rounded-2xl border text-left",
              env.id === e.id && !settings.customBg
                ? "border-primary/70"
                : "border-glass-border",
            )}
          >
            <span className="absolute inset-0" style={{ background: e.gradient }} />
            {e.image && (
              <img
                src={e.image}
                alt=""
                loading="lazy"
                width={1920}
                height={1080}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <span className="absolute right-2 bottom-2 left-2 block text-[11px] leading-tight text-white/90">
              {e.name}
              <span className="block text-[10px] opacity-70">{e.mood}</span>
            </span>
          </button>
        ))}
        <button
          onClick={() => fileRef.current?.click()}
          className="press flex h-24 flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-glass-border text-[11px] text-muted-foreground"
        >
          <Upload className="h-4 w-4" /> Upload your own
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) update({ customBg: URL.createObjectURL(file) });
          }}
        />
      </div>

      <div className="mt-6 space-y-4">
        <Range label="Brightness" value={settings.brightness} onChange={(v) => update({ brightness: v })} />
        <Range label="Animation intensity" value={settings.intensity} onChange={(v) => update({ intensity: v })} />
        <Range label="Panel blur" value={settings.blur} min={0} max={40} onChange={(v) => update({ blur: v })} />
        <div className="flex flex-wrap gap-2">
          <Toggle label="Rain" on={settings.rain} onClick={() => update({ rain: !settings.rain })} />
          <Toggle
            label="Ambient particles"
            on={settings.particles}
            onClick={() => update({ particles: !settings.particles })}
          />
          <Toggle
            label="Soundscape"
            on={settings.soundscape}
            onClick={() => update({ soundscape: !settings.soundscape })}
          />
          <Toggle
            label="Reduce motion"
            on={settings.reduceMotion}
            onClick={() => update({ reduceMotion: !settings.reduceMotion })}
          />
        </div>

        <div>
          <p className="text-[10.5px] tracking-[0.24em] text-muted-foreground uppercase">
            Colour mood
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(Object.keys(themeNames) as ThemeId[]).map((t) => (
              <button
                key={t}
                onClick={() => update({ theme: t })}
                className={cn(
                  "press rounded-full px-3 py-1.5 text-[11.5px]",
                  settings.theme === t ? "bg-foreground/14" : "text-muted-foreground",
                )}
              >
                {themeNames[t]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Overlay>
  );
}

export function Overlay({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
      />
      <div className="glass animate-rise no-scrollbar relative max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[26px]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="press flex h-8 w-8 items-center justify-center rounded-full bg-foreground/8"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export function Range({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="flex justify-between text-[12px] text-muted-foreground">
        {label} <span className="tabular-nums">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-[3px] w-full appearance-none rounded-full bg-foreground/15 accent-primary"
      />
    </label>
  );
}

export function Toggle({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "press flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11.5px]",
        on ? "border-primary/50 bg-primary/15" : "border-glass-border text-muted-foreground",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", on ? "bg-primary" : "bg-muted-foreground")} />
      {label}
    </button>
  );
}
