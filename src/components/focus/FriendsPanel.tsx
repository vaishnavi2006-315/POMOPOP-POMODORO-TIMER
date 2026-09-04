import { useState } from "react";
import { UserPlus, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Friend = {
  name: string;
  status: "focusing" | "break" | "offline";
  detail: string;
  progress: number;
  session?: string;
};

const friends: Friend[] = [
  { name: "Maya", status: "focusing", detail: "Focusing · 18:42 remaining", progress: 0.25, session: "Pomodoro 2 of 4" },
  { name: "Alex", status: "break", detail: "Short break · 03:21", progress: 0.66, session: "Pomodoro 3 of 4" },
  { name: "Sam", status: "offline", detail: "Offline", progress: 0 },
];

const reactions = ["☕", "🌱", "🔥"];

export function FriendsPanel({ className }: { className?: string }) {
  const [sent, setSent] = useState<string | null>(null);
  const [joined, setJoined] = useState(true);

  return (
    <section className={cn("glass rounded-3xl p-5", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
          Focus Together
        </h2>
        <button
          onClick={() => setJoined((j) => !j)}
          className="press flex items-center gap-1.5 rounded-full bg-foreground/8 px-2.5 py-1 text-[10.5px] text-muted-foreground"
        >
          <Users className="h-3 w-3" />
          {joined ? "Leave room" : "Join room"}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {friends.map((f) => (
          <div key={f.name} className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-glass-border bg-gradient-to-br from-lavender/60 to-dusty/60 text-[12px] text-background">
                {f.name[0]}
              </div>
              <span
                className={cn(
                  "absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-background/60",
                  f.status === "offline" ? "bg-muted-foreground" : "bg-chart-5",
                )}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px]">{f.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{f.detail}</p>
              {f.status !== "offline" && (
                <div className="mt-1.5 h-[2px] w-full overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full rounded-full bg-primary/70 transition-all duration-700"
                    style={{ width: `${f.progress * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-foreground/6 p-3">
        <div className="flex items-center justify-between text-[10.5px] tracking-[0.18em] text-muted-foreground uppercase">
          <span>Shared session</span>
          <span>2 of 4</span>
        </div>
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-foreground/10">
          <div className="h-full w-[46%] rounded-full bg-lavender/80" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          {reactions.map((r) => (
            <button
              key={r}
              onClick={() => setSent(r)}
              className={cn(
                "press flex h-7 w-7 items-center justify-center rounded-full bg-foreground/8 text-[13px]",
                sent === r && "bg-primary/25",
              )}
            >
              {r}
            </button>
          ))}
          <span className="ml-auto text-[10.5px] text-muted-foreground">
            {sent ? "Sent quietly" : "Send a nudge"}
          </span>
        </div>
      </div>

      <button className="press mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-glass-border py-2.5 text-[12px] text-muted-foreground hover:text-foreground">
        <UserPlus className="h-3.5 w-3.5" /> Invite friend
      </button>
    </section>
  );
}
