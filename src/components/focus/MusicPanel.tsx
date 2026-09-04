import { useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { playlists } from "./environments";
import { cn } from "@/lib/utils";

export function MusicPanel({ className }: { className?: string }) {
  const [playing, setPlaying] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [volume, setVolume] = useState(60);
  const [playlist, setPlaylist] = useState(playlists[0]!.name);

  if (collapsed) {
    return (
      <section className={cn("glass flex items-center gap-3 rounded-3xl p-3", className)}>
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-lavender/70 to-dusty/70" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px]">Snowfall</p>
          <p className="truncate text-[11px] text-muted-foreground">Øneheart</p>
        </div>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="press flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={() => setCollapsed(false)}
          aria-label="Expand player"
          className="press flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground"
        >
          <ChevronDown className="h-4 w-4 rotate-180" />
        </button>
      </section>
    );
  }

  return (
    <section className={cn("glass rounded-3xl p-5", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase">Now playing</h2>
        <button
          onClick={() => setCollapsed(true)}
          aria-label="Collapse player"
          className="press flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex gap-4">
        <div
          className={cn(
            "relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-2xl shadow-[0_16px_40px_-18px_oklch(0_0_0/0.8)]",
            playing && "animate-float",
          )}
          style={{
            background:
              "radial-gradient(70% 70% at 30% 25%, oklch(0.72 0.09 300), transparent), linear-gradient(150deg, oklch(0.4 0.07 260), oklch(0.24 0.05 240))",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(1_0_0/0.12),transparent_60%)]" />
        </div>
        <div className="min-w-0 flex-1 self-center">
          <p className="truncate font-display text-[22px] leading-tight">Snowfall</p>
          <p className="truncate text-[12.5px] text-muted-foreground">Øneheart</p>
          <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-foreground/12">
            <div className="h-full w-[54%] rounded-full bg-foreground/60" />
          </div>
          <div className="mt-1.5 flex justify-between text-[10.5px] text-muted-foreground tabular-nums">
            <span>1:42</span>
            <span>3:12</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-5">
        <button aria-label="Previous" className="press text-foreground/70">
          <SkipBack className="h-4 w-4 fill-current" />
        </button>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="press flex h-11 w-11 items-center justify-center rounded-full bg-foreground/12"
        >
          {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
        </button>
        <button aria-label="Next" className="press text-foreground/70">
          <SkipForward className="h-4 w-4 fill-current" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2.5">
        <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
          className="h-[3px] w-full appearance-none rounded-full bg-foreground/15 accent-primary"
        />
      </div>

      <a
        href="https://open.spotify.com"
        target="_blank"
        rel="noreferrer"
        className="press mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-glass-border bg-foreground/6 py-2.5 text-[12px] text-foreground/85"
      >
        <SpotifyMark /> Open in Spotify <ExternalLink className="h-3 w-3 opacity-60" />
      </a>

      <div className="mt-5">
        <p className="text-[10.5px] tracking-[0.24em] text-muted-foreground uppercase">
          Focus playlists
        </p>
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          {playlists.map((p) => (
            <button
              key={p.name}
              onClick={() => setPlaylist(p.name)}
              className={cn(
                "press flex items-center gap-2 rounded-xl px-2 py-1.5 text-left text-[11.5px]",
                playlist === p.name ? "bg-foreground/12" : "hover:bg-foreground/6",
              )}
            >
              <span
                className="h-5 w-5 shrink-0 rounded-md"
                style={{ background: `oklch(0.6 0.09 ${p.hue})` }}
              />
              <span className="truncate">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpotifyMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.586 14.424a.622.622 0 0 1-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 1 1-.277-1.215c3.809-.87 7.077-.496 9.712 1.115a.623.623 0 0 1 .207.857Zm1.223-2.722a.78.78 0 0 1-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 1 1-.452-1.492c3.632-1.102 8.147-.568 11.232 1.329a.78.78 0 0 1 .257 1.072Zm.105-2.835c-3.223-1.914-8.54-2.09-11.617-1.156a.935.935 0 1 1-.542-1.79c3.532-1.072 9.404-.865 13.115 1.338a.935.935 0 1 1-.956 1.608Z" />
    </svg>
  );
}
