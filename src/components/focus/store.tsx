import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { environments, type Environment, type ThemeId } from "./environments";

export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  done: boolean;
  pomodoros: number;
  priority: Priority;
  due?: string;
};

export type Mode = "focus" | "short" | "long";

export type Settings = {
  focus: number;
  short: number;
  long: number;
  rounds: number;
  autoBreak: boolean;
  autoFocus: boolean;
  sound: string;
  celebrate: boolean;
  reduceMotion: boolean;
  envId: string;
  theme: ThemeId;
  brightness: number;
  intensity: number;
  rain: boolean;
  particles: boolean;
  blur: number;
  soundscape: boolean;
  customBg: string | null;
};

const defaultSettings: Settings = {
  focus: 25,
  short: 5,
  long: 15,
  rounds: 4,
  autoBreak: true,
  autoFocus: false,
  sound: "Soft chime",
  celebrate: true,
  reduceMotion: false,
  envId: "tokyo",
  theme: "dark",
  brightness: 62,
  intensity: 65,
  rain: true,
  particles: true,
  blur: 22,
  soundscape: true,
  customBg: null,
};

const defaultTasks: Task[] = [
  { id: "t1", title: "Finish project proposal", done: false, pomodoros: 2, priority: "high" },
  { id: "t2", title: "Read Chapter 4", done: false, pomodoros: 1, priority: "medium" },
  { id: "t3", title: "Reply to emails", done: false, pomodoros: 1, priority: "low" },
  { id: "t4", title: "Review notes", done: true, pomodoros: 2, priority: "low" },
];

type Ctx = {
  tasks: Task[];
  addTask: (t: Omit<Task, "id" | "done">) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  reorder: (from: number, to: number) => void;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  activeTask: Task | undefined;

  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  env: Environment;

  mode: Mode;
  setMode: (m: Mode) => void;
  secondsLeft: number;
  running: boolean;
  round: number;
  totalSeconds: number;
  toggleRun: () => void;
  reset: () => void;
  skip: () => void;

  completedPomodoros: number;
  focusSeconds: number;
  justCompleted: boolean;
};

const FocusCtx = createContext<Ctx | null>(null);

const STORAGE = "focusspace:v1";

export function FocusProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [activeTaskId, setActiveTaskId] = useState<string | null>("t1");
  const [mode, setModeState] = useState<Mode>("focus");
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(defaultSettings.focus * 60);
  const [completedPomodoros, setCompletedPomodoros] = useState(5);
  const [focusSeconds, setFocusSeconds] = useState(3 * 3600 + 25 * 60);
  const [justCompleted, setJustCompleted] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw) as { tasks?: Task[]; settings?: Partial<Settings> };
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.settings) {
          const merged = { ...defaultSettings, ...parsed.settings };
          setSettings(merged);
          setSecondsLeft(merged.focus * 60);
        }
      }
    } catch {
      /* ignore */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify({ tasks, settings }));
    } catch {
      /* ignore */
    }
  }, [tasks, settings]);

  const durationFor = useCallback(
    (m: Mode) => (m === "focus" ? settings.focus : m === "short" ? settings.short : settings.long) * 60,
    [settings.focus, settings.short, settings.long],
  );

  const totalSeconds = durationFor(mode);

  const advance = useCallback(() => {
    setJustCompleted(true);
    window.setTimeout(() => setJustCompleted(false), 2600);
    if (mode === "focus") {
      setCompletedPomodoros((c) => c + 1);
      setFocusSeconds((s) => s + settings.focus * 60);
      const isLong = round % settings.rounds === 0;
      const next: Mode = isLong ? "long" : "short";
      setModeState(next);
      setSecondsLeft(durationFor(next));
      setRunning(settings.autoBreak);
    } else {
      setRound((r) => (mode === "long" ? 1 : r + 1));
      setModeState("focus");
      setSecondsLeft(durationFor("focus"));
      setRunning(settings.autoFocus);
    }
  }, [mode, round, settings.rounds, settings.autoBreak, settings.autoFocus, settings.focus, durationFor]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.setTimeout(advance, 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, advance]);

  const setMode = (m: Mode) => {
    setModeState(m);
    setRunning(false);
    setSecondsLeft(durationFor(m));
  };

  const update = (patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      if (patch.envId && patch.envId !== prev.envId) {
        const e = environments.find((x) => x.id === patch.envId);
        if (e) {
          next.theme = e.theme;
          next.rain = e.rain;
        }
      }
      return next;
    });
    if (!running) {
      if (patch.focus && mode === "focus") setSecondsLeft(patch.focus * 60);
      if (patch.short && mode === "short") setSecondsLeft(patch.short * 60);
      if (patch.long && mode === "long") setSecondsLeft(patch.long * 60);
    }
  };

  const value: Ctx = {
    tasks,
    addTask: (t) =>
      setTasks((prev) => [...prev, { ...t, id: Math.random().toString(36).slice(2), done: false }]),
    toggleTask: (id) =>
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
    removeTask: (id) => setTasks((prev) => prev.filter((t) => t.id !== id)),
    reorder: (from, to) =>
      setTasks((prev) => {
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        if (moved) next.splice(to, 0, moved);
        return next;
      }),
    activeTaskId,
    setActiveTaskId,
    activeTask: tasks.find((t) => t.id === activeTaskId),
    settings,
    update,
    env: environments.find((e) => e.id === settings.envId) ?? environments[0]!,
    mode,
    setMode,
    secondsLeft,
    running,
    round,
    totalSeconds,
    toggleRun: () => setRunning((r) => !r),
    reset: () => {
      setRunning(false);
      setSecondsLeft(durationFor(mode));
    },
    skip: advance,
    completedPomodoros,
    focusSeconds,
    justCompleted,
  };

  return <FocusCtx.Provider value={value}>{children}</FocusCtx.Provider>;
}

export function useFocus() {
  const ctx = useContext(FocusCtx);
  if (!ctx) throw new Error("useFocus must be used inside FocusProvider");
  return ctx;
}

export function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export function useNow(active: boolean) {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => tick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [active]);
}

export const modeLabel: Record<Mode, string> = {
  focus: "Focus",
  short: "Short Break",
  long: "Long Break",
};

export function useMemoizedGreeting() {
  return useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return "Late night";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);
}
