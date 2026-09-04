import { useState } from "react";
import { Check, ChevronDown, GripVertical, Play, Plus, X } from "lucide-react";
import { useFocus, type Priority, type Task } from "./store";
import { cn } from "@/lib/utils";

const priorityColor: Record<Priority, string> = {
  high: "bg-peach",
  medium: "bg-amber",
  low: "bg-dusty",
};

export function TaskPanel({ className }: { className?: string }) {
  const { tasks, addTask, toggleTask, removeTask, reorder, activeTaskId, setActiveTaskId } =
    useFocus();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [pomos, setPomos] = useState(1);
  const [priority, setPriority] = useState<Priority>("medium");
  const [due, setDue] = useState("");
  const [showDone, setShowDone] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  const submit = () => {
    if (!title.trim()) return;
    addTask({ title: title.trim(), pomodoros: pomos, priority, due: due || undefined });
    setTitle("");
    setPomos(1);
    setDue("");
    setAdding(false);
  };

  return (
    <section className={cn("glass flex flex-col rounded-3xl p-5", className)}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase">Today</h2>
        <span className="text-[11px] text-muted-foreground">
          {done.length} / {tasks.length} done
        </span>
      </div>

      <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-foreground/10">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${tasks.length ? (done.length / tasks.length) * 100 : 0}%` }}
        />
      </div>

      <div className="no-scrollbar mt-4 flex-1 space-y-1 overflow-y-auto">
        {open.map((task, i) => (
          <TaskRow
            key={task.id}
            task={task}
            active={task.id === activeTaskId}
            onToggle={() => toggleTask(task.id)}
            onRemove={() => removeTask(task.id)}
            onFocus={() => setActiveTaskId(task.id)}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null && dragIndex !== i) reorder(dragIndex, i);
              setDragIndex(null);
            }}
          />
        ))}

        {adding ? (
          <div className="animate-rise mt-2 rounded-2xl border border-glass-border bg-foreground/5 p-3">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="What are you working on?"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-foreground/8 px-2 py-1 text-[11px]">
                🍅
                <button
                  onClick={() => setPomos((p) => Math.max(1, p - 1))}
                  className="px-1 text-muted-foreground"
                >
                  −
                </button>
                <span className="w-3 text-center">{pomos}</span>
                <button onClick={() => setPomos((p) => p + 1)} className="px-1 text-muted-foreground">
                  +
                </button>
              </div>
              {(["low", "medium", "high"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "press flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] capitalize",
                    priority === p ? "bg-foreground/14 text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", priorityColor[p])} />
                  {p}
                </button>
              ))}
              <input
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="rounded-full bg-foreground/8 px-2.5 py-1 text-[11px] text-muted-foreground outline-none"
              />
              <button
                onClick={submit}
                className="press ml-auto rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground"
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="press mt-2 flex w-full items-center gap-2 rounded-2xl border border-dashed border-glass-border px-3 py-2.5 text-[13px] text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4" /> Add task
          </button>
        )}

        {done.length > 0 && (
          <div className="pt-3">
            <button
              onClick={() => setShowDone((s) => !s)}
              className="flex w-full items-center gap-1.5 px-1 text-[11px] tracking-[0.2em] text-muted-foreground uppercase"
            >
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform", showDone && "rotate-180")}
              />
              Completed · {done.length}
            </button>
            {showDone && (
              <div className="animate-rise mt-1 space-y-1">
                {done.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    active={false}
                    onToggle={() => toggleTask(task.id)}
                    onRemove={() => removeTask(task.id)}
                    onFocus={() => setActiveTaskId(task.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function TaskRow({
  task,
  active,
  onToggle,
  onRemove,
  onFocus,
  ...drag
}: {
  task: Task;
  active: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onFocus: () => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...drag}
      className={cn(
        "group flex items-center gap-2 rounded-2xl px-2 py-2 transition-colors duration-200",
        active ? "bg-foreground/10" : "hover:bg-foreground/6",
        task.done && "opacity-45",
      )}
    >
      <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-60" />
      <button
        onClick={onToggle}
        aria-label="Toggle task"
        className={cn(
          "press flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border",
          task.done ? "border-primary bg-primary" : "border-foreground/30",
        )}
      >
        {task.done && <Check className="h-3 w-3 text-primary-foreground" />}
      </button>
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", priorityColor[task.priority])} />
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-[13.5px]", task.done && "line-through")}>{task.title}</p>
        {task.due && <p className="text-[10.5px] text-muted-foreground">Due {task.due}</p>}
      </div>
      <span className="shrink-0 text-[11px] text-muted-foreground">🍅 {task.pomodoros}</span>
      {!task.done && (
        <button
          onClick={onFocus}
          aria-label="Focus on this task"
          className="press flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-primary"
        >
          <Play className="h-3 w-3 fill-current" />
        </button>
      )}
      <button
        onClick={onRemove}
        aria-label="Remove task"
        className="press flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
