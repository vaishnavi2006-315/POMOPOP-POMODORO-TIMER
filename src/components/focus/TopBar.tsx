import { Moon, Settings as SettingsIcon, Volume2, VolumeX, Image as ImageIcon } from "lucide-react";
import { useFocus } from "./store";
import { cn } from "@/lib/utils";

export type View = "focus" | "tasks" | "friends" | "stats";

export function TopBar({
  view,
  setView,
  onEnvironment,
  onSettings,
}: {
  view: View;
  setView: (v: View) => void;
  onEnvironment: () => void;
  onSettings: () => void;
}) {
  const { settings, update, running, mode } = useFocus();
  const hidden = running && mode === "focus";

  return (
    <header
      className={cn(
        "flex items-center justify-between gap-4 px-5 py-4 transition-opacity duration-500 md:px-8",
        hidden ? "opacity-40 hover:opacity-100" : "opacity-100",
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-glass-border bg-glass">
          <Moon className="h-4 w-4 text-primary" />
          <span className="absolute inset-0 animate-halo rounded-full bg-primary/25 blur-md" />
        </span>
        <span className="text-[15px] tracking-[0.22em] uppercase text-foreground/85">
          FocusSpace
        </span>
      </div>

      <nav className="glass-soft hidden items-center gap-1 rounded-full p-1 md:flex">
        {(["focus", "tasks", "friends", "stats"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "press rounded-full px-4 py-1.5 text-[13px] capitalize",
              view === v
                ? "bg-foreground/12 text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {v}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-1.5">
        <IconBtn label="Environment" onClick={onEnvironment}>
          <ImageIcon className="h-[17px] w-[17px]" />
        </IconBtn>
        <IconBtn
          label="Soundscape"
          onClick={() => update({ soundscape: !settings.soundscape })}
        >
          {settings.soundscape ? (
            <Volume2 className="h-[17px] w-[17px]" />
          ) : (
            <VolumeX className="h-[17px] w-[17px] opacity-60" />
          )}
        </IconBtn>
        <IconBtn label="Settings" onClick={onSettings}>
          <SettingsIcon className="h-[17px] w-[17px]" />
        </IconBtn>
        <button className="press ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-glass-border bg-gradient-to-br from-peach/70 to-lavender/70 text-[13px] font-medium text-background">
          K
        </button>
      </div>
    </header>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className="press flex h-9 w-9 items-center justify-center rounded-full border border-glass-border bg-glass text-foreground/80 hover:text-foreground"
    >
      {children}
    </button>
  );
}
