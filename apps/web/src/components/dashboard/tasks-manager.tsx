"use client";

import { useState } from "react";
import {
  Plus, CheckCircle2, Clock, AlertTriangle, Circle,
  ChevronDown, Trash2, User, Calendar, Flag,
} from "lucide-react";
import { Button, EmptyState } from "@app-inmobiliaria/ui";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  lead: { id: string; name: string } | null;
  assignedTo: { id: string; name: string; avatar: string | null } | null;
  createdBy: { id: string; name: string } | null;
  createdAt: string;
}

interface TaskStats { pending: number; inProgress: number; completed: number; overdue: number; total: number }
interface TeamUser { id: string; name: string | null; email: string }

const PRIORITY_CONFIG = {
  URGENT: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950", label: "Urgente" },
  HIGH: { icon: Flag, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950", label: "Alta" },
  MEDIUM: { icon: Flag, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950", label: "Media" },
  LOW: { icon: Flag, color: "text-slate-400", bg: "bg-slate-50 dark:bg-slate-800", label: "Baja" },
};

const STATUS_CONFIG = {
  PENDING: { icon: Circle, color: "text-slate-400", label: "Pendiente" },
  IN_PROGRESS: { icon: Clock, color: "text-blue-500", label: "En progreso" },
  COMPLETED: { icon: CheckCircle2, color: "text-emerald-500", label: "Completada" },
  CANCELLED: { icon: Circle, color: "text-red-400", label: "Cancelada" },
};

function isOverdue(task: Task) {
  return task.dueDate && task.status !== "COMPLETED" && task.status !== "CANCELLED" && new Date(task.dueDate) < new Date();
}

export function TasksManager({ tasks: initialTasks, stats, users, currentUserId }: {
  tasks: Task[];
  stats: TaskStats;
  users: TeamUser[];
  currentUserId: string;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<string>("MEDIUM");
  const [assignedToId, setAssignedToId] = useState(currentUserId);

  const filtered = filter === "all" ? tasks.filter((t) => t.status !== "CANCELLED")
    : filter === "overdue" ? tasks.filter(isOverdue)
    : tasks.filter((t) => t.status === filter);

  async function handleCreate() {
    if (!title.trim()) { toast.error("El título es obligatorio"); return; }
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, dueDate: dueDate || undefined, priority, assignedToId }),
      });
      if (!res.ok) throw new Error();
      const task = await res.json();
      setTasks((prev) => [task, ...prev]);
      setShowForm(false);
      setTitle(""); setDescription(""); setDueDate(""); setPriority("MEDIUM");
      toast.success("Tarea creada");
    } catch { toast.error("Error al crear la tarea"); }
  }

  async function handleStatusChange(taskId: string, status: string) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      toast.success("Tarea actualizada");
    } catch { toast.error("Error al actualizar"); }
  }

  async function handleDelete(taskId: string) {
    if (!confirm("¿Eliminar esta tarea?")) return;
    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success("Tarea eliminada");
    } catch { toast.error("Error al eliminar"); }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Pendientes", value: stats.pending, color: "text-slate-600 dark:text-slate-400" },
          { label: "En progreso", value: stats.inProgress, color: "text-blue-600 dark:text-blue-400" },
          { label: "Completadas", value: stats.completed, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Vencidas", value: stats.overdue, color: "text-red-600 dark:text-red-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border bg-card p-0.5">
          {[
            { value: "all", label: "Todas" },
            { value: "PENDING", label: "Pendientes" },
            { value: "IN_PROGRESS", label: "En progreso" },
            { value: "overdue", label: "Vencidas" },
            { value: "COMPLETED", label: "Completadas" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva tarea
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título de la tarea"
            className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción (opcional)" rows={2}
            className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="task-due" className="mb-1 block text-xs text-muted-foreground">Fecha límite</label>
              <input id="task-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="task-priority" className="mb-1 block text-xs text-muted-foreground">Prioridad</label>
              <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>
            <div>
              <label htmlFor="task-assign" className="mb-1 block text-xs text-muted-foreground">Asignar a</label>
              <select id="task-assign" value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
                {users.map((u) => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Crear tarea</Button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState icon={<CheckCircle2 className="h-10 w-10" />} title="Sin tareas" description="No hay tareas para este filtro." />
      ) : (
        <div className="space-y-2">
          {filtered.map((task) => {
            const pri = PRIORITY_CONFIG[task.priority];
            const st = STATUS_CONFIG[task.status];
            const overdue = isOverdue(task);
            return (
              <div key={task.id} className={`group flex items-start gap-3 rounded-xl border bg-card p-4 transition-all hover:shadow-sm ${overdue ? "border-red-200 dark:border-red-900" : ""}`}>
                <button
                  onClick={() => handleStatusChange(task.id, task.status === "COMPLETED" ? "PENDING" : "COMPLETED")}
                  className={`mt-0.5 shrink-0 ${st.color} transition-colors hover:text-emerald-500`}
                >
                  <st.icon className="h-5 w-5" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${task.status === "COMPLETED" ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${pri.bg} ${pri.color}`}>
                        <pri.icon className="h-2.5 w-2.5" />
                        {pri.label}
                      </span>
                      <div className="relative group/menu">
                        <button className="rounded p-1 text-muted-foreground hover:bg-muted"><ChevronDown className="h-3.5 w-3.5" /></button>
                        <div className="absolute right-0 top-full z-10 hidden w-36 rounded-lg border bg-card py-1 shadow-lg group-hover/menu:block">
                          {(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const).map((s) => (
                            <button key={s} onClick={() => handleStatusChange(task.id, s)}
                              className="block w-full px-3 py-1.5 text-left text-xs hover:bg-muted">{STATUS_CONFIG[s].label}</button>
                          ))}
                          <hr className="my-1 border-border" />
                          <button onClick={() => handleDelete(task.id)}
                            className="block w-full px-3 py-1.5 text-left text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950">Eliminar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {task.description && <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{task.description}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    {task.dueDate && (
                      <span className={`flex items-center gap-1 ${overdue ? "font-semibold text-red-500" : ""}`}>
                        <Calendar className="h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
                        {overdue && " (vencida)"}
                      </span>
                    )}
                    {task.assignedTo && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {task.assignedTo.name}
                      </span>
                    )}
                    {task.lead && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                        Lead: {task.lead.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
