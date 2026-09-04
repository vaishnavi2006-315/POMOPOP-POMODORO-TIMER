import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListTodo, Users } from "lucide-react";
import { AmbientBackground } from "@/components/focus/AmbientBackground";
import { TopBar, type View } from "@/components/focus/TopBar";
import { TaskPanel } from "@/components/focus/TaskPanel";
import { TimerPanel } from "@/components/focus/TimerPanel";
import { FriendsPanel } from "@/components/focus/FriendsPanel";
import { MusicPanel } from "@/components/focus/MusicPanel";
import { StatsPanel } from "@/components/focus/StatsPanel";
import { EnvironmentSheet, Overlay } from "@/components/focus/EnvironmentSheet";
import { SettingsSheet } from "@/components/focus/SettingsSheet";
import { FocusProvider, useFocus } from "@/components/focus/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FocusSpace — A cozy lofi room for deep focus" },
      {
        name: "description",
        content:
          "A calm lofi focus space with a customizable Pomodoro timer, gentle task list, ambient environments and quiet study rooms with friends.",
      },
      { property: "og:title", content: "FocusSpace — A cozy lofi room for deep focus" },
      {
        property: "og:description",
        content:
          "Pomodoro timer, tasks, ambient lofi environments and quiet focus rooms — a calm place to get things done.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <FocusProvider>
      <FocusSpace />
    </FocusProvider>
  ),
});

function FocusSpace() {
  const { settings, running, mode } = useFocus();
  const [view, setView] = useState<View>("focus");
  const [envOpen, setEnvOpen] = useState(false);
  const [setOpen, setSetOpen] = useState(false);
  const [sheet, setSheet] = useState<"tasks" | "friends" | null>(null);

  const focusing = running && mode === "focus";
  const themeClass = `theme-${settings.theme}`;

  return (
    <div
      className={cn(
        themeClass,
        settings.reduceMotion && "reduce-motion",
        "relative flex min-h-screen flex-col overflow-x-hidden",
      )}
      style={{ ["--panel-blur" as string]: `${settings.blur}px` }}
    >
      <AmbientBackground />

      <TopBar
        view={view}
        setView={setView}
        onEnvironment={() => setEnvOpen(true)}
        onSettings={() => setSetOpen(true)}
      />

      <main className="flex-1 px-4 pb-24 md:px-8 md:pb-10">
        {view === "stats" ? (
          <div className="mx-auto max-w-4xl pt-6">
            <StatsPanel />
          </div>
        ) : (
          <div className="mx-auto grid w-full max-w-[1500px] items-start gap-6 pt-2 lg:grid-cols-[300px_minmax(0,1fr)_320px]">
            <TaskPanel
              className={cn(
                "hidden max-h-[70vh] transition-all duration-500 lg:flex",
                focusing && "opacity-25 hover:opacity-100",
              )}
            />

            <div className="flex justify-center py-6 lg:py-10">
              <TimerPanel />
            </div>

            <div
              className={cn(
                "hidden space-y-5 transition-all duration-500 lg:block",
                focusing && "opacity-25 hover:opacity-100",
              )}
            >
              <MusicPanel />
              <FriendsPanel />
            </div>
          </div>
        )}
      </main>

      {/* Mobile / tablet quick access */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-center gap-2 p-4 lg:hidden">
        <button
          onClick={() => setSheet("tasks")}
          className="glass press flex items-center gap-2 rounded-full px-4 py-2.5 text-[12.5px]"
        >
          <ListTodo className="h-4 w-4" /> Tasks
        </button>
        <button
          onClick={() => setSheet("friends")}
          className="glass press flex items-center gap-2 rounded-full px-4 py-2.5 text-[12.5px]"
        >
          <Users className="h-4 w-4" /> Friends
        </button>
      </div>

      <div className="fixed right-4 bottom-20 left-4 z-20 lg:hidden">
        <MusicPanel />
      </div>

      <Overlay open={sheet === "tasks"} onClose={() => setSheet(null)} title="Today">
        <TaskPanel className="border-0 bg-transparent p-0 shadow-none backdrop-blur-none" />
      </Overlay>
      <Overlay open={sheet === "friends"} onClose={() => setSheet(null)} title="Focus together">
        <FriendsPanel className="border-0 bg-transparent p-0 shadow-none backdrop-blur-none" />
      </Overlay>
      <Overlay open={view === "tasks"} onClose={() => setView("focus")} title="Today">
        <TaskPanel className="border-0 bg-transparent p-0 shadow-none backdrop-blur-none" />
      </Overlay>
      <Overlay open={view === "friends"} onClose={() => setView("focus")} title="Focus together">
        <FriendsPanel className="border-0 bg-transparent p-0 shadow-none backdrop-blur-none" />
      </Overlay>

      <EnvironmentSheet open={envOpen} onClose={() => setEnvOpen(false)} />
      <SettingsSheet open={setOpen} onClose={() => setSetOpen(false)} />
    </div>
  );
}
