"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "sonner";
import {
  LayoutGrid, List, Phone, Mail, MessageCircle,
  ChevronDown, X, Users, GripVertical, Save,
  PhoneCall, MapPin, FileText, Clock, Plus, Loader2, Send, UserCheck,
} from "lucide-react";

import { LEAD_PIPELINE_COLUMNS, LEAD_STATUS_CONFIG } from "@app-inmobiliaria/types";
import type { LeadBase } from "@app-inmobiliaria/types";

interface Activity {
  id: string;
  type: "NOTE" | "CALL" | "EMAIL" | "VISIT" | "STATUS_CHANGE" | "TASK_CREATED" | "TASK_COMPLETED";
  content: string;
  createdAt: string;
  user?: { name: string } | null;
}

const ACTIVITY_TYPES = [
  { type: "CALL", label: "Llamada", icon: PhoneCall, color: "text-blue-500" },
  { type: "EMAIL", label: "Email", icon: Mail, color: "text-violet-500" },
  { type: "VISIT", label: "Visita", icon: MapPin, color: "text-emerald-500" },
  { type: "NOTE", label: "Nota", icon: FileText, color: "text-amber-500" },
] as const;

function getActivityIcon(type: Activity["type"]) {
  switch (type) {
    case "CALL": return <PhoneCall className="h-3.5 w-3.5 text-blue-500" />;
    case "EMAIL": return <Mail className="h-3.5 w-3.5 text-violet-500" />;
    case "VISIT": return <MapPin className="h-3.5 w-3.5 text-emerald-500" />;
    case "STATUS_CHANGE": return <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />;
    default: return <FileText className="h-3.5 w-3.5 text-amber-500" />;
  }
}

function getActivityLabel(type: Activity["type"]) {
  switch (type) {
    case "CALL": return "Llamada";
    case "EMAIL": return "Email";
    case "VISIT": return "Visita";
    case "STATUS_CHANGE": return "Cambio de estado";
    default: return "Nota";
  }
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "ayer";
  return `hace ${days}d`;
}

interface LeadsPipelineProps {
  initialLeads: LeadBase[];
}

interface TeamUser {
  id: string;
  name: string | null;
  email: string;
}

export function LeadsPipeline({ initialLeads }: LeadsPipelineProps) {
  const [leads, setLeads] = useState<LeadBase[]>(initialLeads);
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [selectedLead, setSelectedLead] = useState<LeadBase | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Team / assignment state
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);
  const [assigneeId, setAssigneeId] = useState<string>("");

  // Activities state
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [newActivityType, setNewActivityType] = useState<string | null>(null);
  const [activityContent, setActivityContent] = useState("");
  const [isSavingActivity, setIsSavingActivity] = useState(false);

  // Fetch team users once on mount
  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) ? setTeamUsers(data) : [])
      .catch(() => {});
  }, []);

  // Sync assignee when lead opens or team list loads
  useEffect(() => {
    if (!selectedLead) { setAssigneeId(""); return; }
    if (!selectedLead.assignedTo) { setAssigneeId(""); return; }
    const match = teamUsers.find((u) => u.email === selectedLead.assignedTo?.email);
    setAssigneeId(match?.id ?? "");
  }, [selectedLead?.id, teamUsers]);

  // Fetch activities when a lead is opened
  useEffect(() => {
    if (!selectedLead) { setActivities([]); return; }
    setActivitiesLoading(true);
    fetch(`/api/leads/${selectedLead.id}/activities`)
      .then((r) => r.json())
      .then((data) => setActivities(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setActivitiesLoading(false));
  }, [selectedLead?.id]);

  const openLead = (lead: LeadBase) => {
    setSelectedLead(lead);
    setEditNotes(lead.notes || "");
    setNewActivityType(null);
    setActivityContent("");
  };

  const updateLeadStatus = async (id: string, status: string) => {
    const prev = leads;
    setLeads((l) => l.map((lead) => (lead.id === id ? { ...lead, status: status as LeadBase["status"] } : lead)));
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success("Estado actualizado");
    } catch {
      setLeads(prev);
      toast.error("Error al actualizar el estado");
    }
  };

  const saveNotes = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: editNotes }),
      });
      if (!res.ok) throw new Error();
      setLeads((l) => l.map((lead) => (lead.id === id ? { ...lead, notes: editNotes } : lead)));
      toast.success("Notas guardadas");
    } catch {
      toast.error("Error al guardar notas");
    }
  };

  const assignAgent = async (leadId: string, userId: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId: userId || null }),
      });
      if (!res.ok) throw new Error();
      const newUser = userId ? teamUsers.find((u) => u.id === userId) : null;
      const assignedTo = newUser ? { name: newUser.name, email: newUser.email } : null;
      setLeads((l) => l.map((lead) => lead.id === leadId ? { ...lead, assignedTo } : lead));
      setSelectedLead((prev) => prev ? { ...prev, assignedTo } : null);
      toast.success(userId ? "Lead asignado" : "Asignación eliminada");
    } catch {
      toast.error("Error al asignar el lead");
    }
  };

  const logActivity = async () => {
    if (!selectedLead || !newActivityType || !activityContent.trim()) return;
    setIsSavingActivity(true);
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: newActivityType, content: activityContent.trim() }),
      });
      if (!res.ok) throw new Error();
      const activity: Activity = await res.json();
      setActivities((prev) => [activity, ...prev]);
      setActivityContent("");
      setNewActivityType(null);
      toast.success("Actividad registrada");
    } catch {
      toast.error("Error al registrar la actividad");
    } finally {
      setIsSavingActivity(false);
    }
  };

  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (status: string) => {
    if (draggedId) {
      updateLeadStatus(draggedId, status);
      setDraggedId(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView("kanban")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            view === "kanban" ? "bg-blue-600/15 text-blue-600 dark:bg-blue-400/15 dark:text-blue-400" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <LayoutGrid className="h-4 w-4" /> Kanban
        </button>
        <button
          onClick={() => setView("table")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            view === "table" ? "bg-blue-600/15 text-blue-600 dark:bg-blue-400/15 dark:text-blue-400" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <List className="h-4 w-4" /> Tabla
        </button>
        <span className="ml-auto text-sm text-muted-foreground">{leads.length} leads</span>
      </div>

      {view === "kanban" ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {LEAD_PIPELINE_COLUMNS.map((col) => {
            const colLeads = leads.filter((l) => l.status === col.key);
            return (
              <div
                key={col.key}
                className="w-72 shrink-0 rounded-xl border bg-muted/50 p-3"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.key)}
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
                  <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                  <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {colLeads.length}
                  </span>
                </div>
                <KanbanColumn>
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      role="button"
                      tabIndex={0}
                      draggable
                      onDragStart={() => handleDragStart(lead.id)}
                      onClick={() => openLead(lead)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLead(lead); } }}
                      className={`cursor-pointer rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none ${
                        draggedId === lead.id ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-foreground truncate">{lead.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{lead.email}</div>
                        </div>
                      </div>
                      {lead.property && (
                        <div className="mt-2 truncate text-xs text-primary">{lead.property.title}</div>
                      )}
                      <div className="mt-2 flex items-center gap-1">
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Llamar">
                            <Phone className="h-3 w-3" />
                          </a>
                        )}
                        <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Email">
                          <Mail className="h-3 w-3" />
                        </a>
                        {lead.phone && (
                          <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="rounded p-1 text-muted-foreground hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-950/30 dark:hover:text-green-400" aria-label="WhatsApp">
                            <MessageCircle className="h-3 w-3" />
                          </a>
                        )}
                        <span className="ml-auto text-[10px] text-muted-foreground">
                          {new Date(String(lead.createdAt)).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {colLeads.length === 0 && (
                    <p className="py-6 text-center text-xs text-muted-foreground">Sin leads</p>
                  )}
                </KanbanColumn>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Contacto</th>
                <th className="hidden px-5 py-3 md:table-cell">Propiedad</th>
                <th className="px-5 py-3">Estado</th>
                <th className="hidden px-5 py-3 sm:table-cell">Fecha</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-muted transition-colors cursor-pointer" tabIndex={0} onClick={() => openLead(lead)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLead(lead); } }}>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-foreground">{lead.name}</div>
                    <div className="text-xs text-muted-foreground">{lead.email}</div>
                  </td>
                  <td className="hidden px-5 py-4 md:table-cell text-sm text-muted-foreground truncate max-w-[200px]">
                    {lead.property?.title || "Consulta general"}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => { e.stopPropagation(); updateLeadStatus(lead.id, e.target.value); }}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-full border-0 bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground focus:ring-2 focus:ring-primary"
                    >
                      {LEAD_PIPELINE_COLUMNS.map((s) => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="hidden px-5 py-4 sm:table-cell text-sm text-muted-foreground">
                    {new Date(String(lead.createdAt)).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Phone className="h-4 w-4" /></a>
                      )}
                      <a href={`mailto:${lead.email}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Mail className="h-4 w-4" /></a>
                      {lead.phone && (
                        <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="rounded-md p-1.5 text-muted-foreground hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-950/30 dark:hover:text-green-400"><MessageCircle className="h-4 w-4" /></a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 && (
            <div className="py-16 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">Sin consultas aún</h3>
              <p className="mt-1 text-sm text-muted-foreground">Las consultas de tu web aparecerán acá</p>
            </div>
          )}
        </div>
      )}

      {/* ── Modal de lead ───────────────────────────────────── */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedLead(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelectedLead(null)}
        >
          <div
            className="flex w-full max-w-2xl flex-col rounded-2xl bg-card shadow-2xl"
            style={{ maxHeight: "90vh" }}
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">{selectedLead.name}</h2>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-sm text-muted-foreground">{selectedLead.email}</span>
                  {selectedLead.phone && (
                    <span className="text-sm text-muted-foreground">{selectedLead.phone}</span>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="rounded-lg p-1 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-0 md:grid-cols-[1fr_1px_320px]">

                {/* Left: info + status + notes */}
                <div className="space-y-5 p-6">
                  {selectedLead.property && (
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Propiedad</p>
                      <p className="text-sm font-medium text-primary">{selectedLead.property.title}</p>
                    </div>
                  )}

                  {selectedLead.message && (
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mensaje</p>
                      <p className="text-sm text-foreground leading-relaxed">{selectedLead.message}</p>
                    </div>
                  )}

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estado</p>
                    <div className="flex flex-wrap gap-1.5">
                      {LEAD_PIPELINE_COLUMNS.map((s) => (
                        <button
                          key={s.key}
                          onClick={() => updateLeadStatus(selectedLead.id, s.key).then(() => setSelectedLead({ ...selectedLead, status: s.key }))}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                            selectedLead.status === s.key
                              ? `${s.dotColor} text-white`
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {teamUsers.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                        <UserCheck className="h-3 w-3" /> Asignado a
                      </p>
                      <select
                        value={assigneeId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAssigneeId(val);
                          assignAgent(selectedLead.id, val);
                        }}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Sin asignar</option>
                        {teamUsers.map((u) => (
                          <option key={u.id} value={u.id}>{u.name || u.email}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notas internas</p>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      rows={3}
                      placeholder="Agregar notas sobre este lead..."
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      onClick={() => saveNotes(selectedLead.id)}
                      className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90"
                    >
                      <Save className="h-3 w-3" /> Guardar notas
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden bg-border md:block" />

                {/* Right: activities */}
                <div className="flex flex-col border-t p-6 md:border-t-0">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Actividad
                  </p>

                  {/* Quick action buttons */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {ACTIVITY_TYPES.map((a) => {
                      const Icon = a.icon;
                      const isActive = newActivityType === a.type;
                      return (
                        <button
                          key={a.type}
                          type="button"
                          onClick={() => {
                            setNewActivityType(isActive ? null : a.type);
                            setActivityContent("");
                          }}
                          className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
                            isActive
                              ? "border-primary bg-primary text-white"
                              : "border-input bg-background text-foreground hover:border-primary/40 hover:bg-muted"
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                          {a.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Inline log form */}
                  {newActivityType && (
                    <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <textarea
                        value={activityContent}
                        onChange={(e) => setActivityContent(e.target.value)}
                        rows={2}
                        placeholder={`Detalle de la ${ACTIVITY_TYPES.find(a => a.type === newActivityType)?.label.toLowerCase()}...`}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) logActivity();
                        }}
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">⌘Enter para guardar</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { setNewActivityType(null); setActivityContent(""); }}
                            className="rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={logActivity}
                            disabled={!activityContent.trim() || isSavingActivity}
                            className="flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                          >
                            {isSavingActivity ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                            Guardar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  {activitiesLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : activities.length === 0 ? (
                    <div className="flex flex-col items-center py-6 text-center">
                      <Clock className="mb-2 h-8 w-8 text-muted-foreground/30" />
                      <p className="text-xs text-muted-foreground">Sin actividad registrada</p>
                      <p className="text-xs text-muted-foreground/60">Registrá llamadas, emails o visitas</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex gap-3">
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-foreground">
                                {getActivityLabel(activity.type)}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                · {timeAgo(activity.createdAt)}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                              {activity.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer: contact buttons */}
            <div className="flex gap-2 border-t px-6 py-4">
              {selectedLead.phone && (
                <a href={`tel:${selectedLead.phone}`} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                  <Phone className="h-4 w-4" /> Llamar
                </a>
              )}
              <a href={`mailto:${selectedLead.email}`} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                <Mail className="h-4 w-4" /> Email
              </a>
              {selectedLead.phone && (
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-950/50 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function KanbanColumn({ children }: { children: ReactNode }) {
  const [parent] = useAutoAnimate({ duration: 200 });
  return <div ref={parent} className="space-y-2">{children}</div>;
}
