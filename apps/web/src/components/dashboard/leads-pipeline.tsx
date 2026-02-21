"use client";

import { useState, type ReactNode } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "sonner";
import {
  LayoutGrid, List, Phone, Mail, MessageCircle,
  ChevronDown, X, Users, GripVertical, Save,
} from "lucide-react";

import { LEAD_PIPELINE_COLUMNS, LEAD_STATUS_CONFIG } from "@app-inmobiliaria/types";
import type { LeadBase } from "@app-inmobiliaria/types";

interface LeadsPipelineProps {
  initialLeads: LeadBase[];
}

export function LeadsPipeline({ initialLeads }: LeadsPipelineProps) {
  const [leads, setLeads] = useState<LeadBase[]>(initialLeads);
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [selectedLead, setSelectedLead] = useState<LeadBase | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

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
                      onClick={() => { setSelectedLead(lead); setEditNotes(lead.notes || ""); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedLead(lead); setEditNotes(lead.notes || ""); } }}
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
              {leads.map((lead) => {
                return (
                  <tr key={lead.id} className="hover:bg-muted transition-colors cursor-pointer focus-visible:bg-muted" tabIndex={0} onClick={() => { setSelectedLead(lead); setEditNotes(lead.notes || ""); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedLead(lead); setEditNotes(lead.notes || ""); } }}>
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
                        aria-label="Cambiar estado"
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
                          <a href={`tel:${lead.phone}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Llamar"><Phone className="h-4 w-4" /></a>
                        )}
                        <a href={`mailto:${lead.email}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Email"><Mail className="h-4 w-4" /></a>
                        {lead.phone && (
                          <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="rounded-md p-1.5 text-muted-foreground hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-950/30 dark:hover:text-green-400" aria-label="WhatsApp"><MessageCircle className="h-4 w-4" /></a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" role="dialog" aria-modal="true" onClick={() => setSelectedLead(null)} onKeyDown={(e) => e.key === "Escape" && setSelectedLead(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl" role="document" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">{selectedLead.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedLead.email}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="rounded-lg p-1 text-muted-foreground hover:text-foreground" aria-label="Cerrar">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {selectedLead.property && (
                <div>
                  <span className="text-xs font-medium uppercase text-muted-foreground">Propiedad</span>
                  <p className="text-sm text-primary">{selectedLead.property.title}</p>
                </div>
              )}

              {selectedLead.message && (
                <div>
                  <span className="text-xs font-medium uppercase text-muted-foreground">Mensaje</span>
                  <p className="text-sm text-foreground">{selectedLead.message}</p>
                </div>
              )}

              <div>
                <span className="text-xs font-medium uppercase text-muted-foreground">Estado</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
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

              <div>
                <span className="text-xs font-medium uppercase text-muted-foreground">Notas internas</span>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  placeholder="Agregar notas sobre este lead..."
                  className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={() => saveNotes(selectedLead.id)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90"
                >
                  <Save className="h-3 w-3" /> Guardar notas
                </button>
              </div>

              <div className="flex gap-2 border-t pt-4">
                {selectedLead.phone && (
                  <a href={`tel:${selectedLead.phone}`} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
                    <Phone className="h-4 w-4" /> Llamar
                  </a>
                )}
                <a href={`mailto:${selectedLead.email}`} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
                  <Mail className="h-4 w-4" /> Email
                </a>
                {selectedLead.phone && (
                  <a href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-950/50">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                )}
              </div>
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
