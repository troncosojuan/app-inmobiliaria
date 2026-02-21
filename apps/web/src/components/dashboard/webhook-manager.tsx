"use client";

import { useReducer } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, Zap, ZapOff, Send, CheckCircle2, XCircle, Globe } from "lucide-react";
import { toast } from "sonner";
import { ICON_COLORS } from "@app-inmobiliaria/ui";

interface Webhook {
  id: string;
  url: string;
  events: string;
  secret: string;
  isActive: boolean;
  lastTriggeredAt: string | null;
  lastStatusCode: number | null;
}

const EVENTS = [
  { value: "lead.created", label: "Nuevo lead" },
  { value: "property.created", label: "Propiedad creada" },
  { value: "property.published", label: "Propiedad publicada" },
  { value: "property.status_changed", label: "Estado cambiado" },
];

type FormAction =
  | { type: "TOGGLE_FORM" }
  | { type: "SET_URL"; url: string }
  | { type: "TOGGLE_EVENT"; event: string }
  | { type: "SET_SAVING"; saving: boolean }
  | { type: "SET_TESTING"; id: string | null }
  | { type: "RESET_FORM" };

interface FormState {
  showForm: boolean;
  url: string;
  selectedEvents: string[];
  saving: boolean;
  testingId: string | null;
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "TOGGLE_FORM":
      return { ...state, showForm: !state.showForm };
    case "SET_URL":
      return { ...state, url: action.url };
    case "TOGGLE_EVENT":
      return {
        ...state,
        selectedEvents: state.selectedEvents.includes(action.event)
          ? state.selectedEvents.filter((e) => e !== action.event)
          : [...state.selectedEvents, action.event],
      };
    case "SET_SAVING":
      return { ...state, saving: action.saving };
    case "SET_TESTING":
      return { ...state, testingId: action.id };
    case "RESET_FORM":
      return { ...state, url: "", selectedEvents: [], showForm: false };
    default:
      return state;
  }
}

async function fetchWebhooks(): Promise<Webhook[]> {
  const res = await fetch("/api/webhooks");
  if (!res.ok) throw new Error("Error al cargar webhooks");
  return res.json();
}

export function WebhookManager() {
  const queryClient = useQueryClient();
  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ["webhooks"],
    queryFn: fetchWebhooks,
  });

  const [form, dispatch] = useReducer(formReducer, {
    showForm: false,
    url: "",
    selectedEvents: [],
    saving: false,
    testingId: null,
  });

  async function handleCreate() {
    if (!form.url || form.selectedEvents.length === 0) {
      toast.error("Completá la URL y seleccioná al menos un evento");
      return;
    }
    dispatch({ type: "SET_SAVING", saving: true });
    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.url, events: form.selectedEvents }),
      });
      if (res.ok) {
        dispatch({ type: "RESET_FORM" });
        queryClient.invalidateQueries({ queryKey: ["webhooks"] });
        toast.success("Webhook creado");
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al crear webhook");
      }
    } catch {
      toast.error("Error de conexión");
    }
    dispatch({ type: "SET_SAVING", saving: false });
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/webhooks/${id}`, { method: "DELETE" });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["webhooks"] });
        toast.success("Webhook eliminado");
      }
    } catch {
      toast.error("Error al eliminar");
    }
  }

  async function handleToggle(id: string) {
    try {
      const res = await fetch(`/api/webhooks/${id}`, { method: "PATCH" });
      if (res.ok) queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    } catch {
      toast.error("Error al cambiar estado");
    }
  }

  async function handleTest(id: string) {
    dispatch({ type: "SET_TESTING", id });
    try {
      const res = await fetch(`/api/webhooks/${id}/test`, { method: "POST" });
      const result = await res.json();
      if (result.success) {
        toast.success(`Ping exitoso (${result.statusCode})`);
      } else {
        toast.error(`Ping falló (${result.statusCode || "sin respuesta"})`);
      }
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    } catch {
      toast.error("Error al hacer ping");
    }
    dispatch({ type: "SET_TESTING", id: null });
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => dispatch({ type: "TOGGLE_FORM" })}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo webhook
        </button>
      </div>

      {form.showForm && (
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <div>
            <label htmlFor="webhook-url" className="mb-1 block text-sm font-medium text-foreground">
              URL del endpoint
            </label>
            <input
              id="webhook-url"
              type="url"
              value={form.url}
              onChange={(e) => dispatch({ type: "SET_URL", url: e.target.value })}
              placeholder="https://tu-servidor.com/webhook"
              className="h-10 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-foreground">Eventos</span>
            <div className="flex flex-wrap gap-2">
              {EVENTS.map((event) => (
                <button
                  key={event.value}
                  type="button"
                  onClick={() => dispatch({ type: "TOGGLE_EVENT", event: event.value })}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    form.selectedEvents.includes(event.value)
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {event.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dispatch({ type: "TOGGLE_FORM" })}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={form.saving}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {form.saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Crear webhook
            </button>
          </div>
        </div>
      )}

      {webhooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center">
          <div className={`rounded-lg ${ICON_COLORS.violet.bg} p-3 mb-4`}>
            <Globe className={`h-6 w-6 ${ICON_COLORS.violet.text}`} />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Sin webhooks</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Creá tu primer webhook para recibir notificaciones automáticas.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {webhooks.map((webhook) => {
            const events: string[] = JSON.parse(webhook.events);
            return (
              <div key={webhook.id} className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {webhook.isActive ? (
                        <Zap className="h-4 w-4 shrink-0 text-emerald-500" />
                      ) : (
                        <ZapOff className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <code className="truncate text-sm font-mono text-foreground">{webhook.url}</code>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {events.map((event) => (
                        <span key={event} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {EVENTS.find((e) => e.value === event)?.label || event}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      {webhook.lastTriggeredAt && (
                        <span className="flex items-center gap-1">
                          {webhook.lastStatusCode && webhook.lastStatusCode >= 200 && webhook.lastStatusCode < 300 ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500" />
                          )}
                          Último: {new Date(webhook.lastTriggeredAt).toLocaleString("es-AR")}
                          {webhook.lastStatusCode ? ` (${webhook.lastStatusCode})` : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTest(webhook.id)}
                      disabled={form.testingId === webhook.id}
                      className="rounded-lg border p-2 text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
                      title="Test ping"
                    >
                      {form.testingId === webhook.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle(webhook.id)}
                      className="rounded-lg border p-2 text-muted-foreground hover:bg-muted transition-colors"
                      title={webhook.isActive ? "Desactivar" : "Activar"}
                    >
                      {webhook.isActive ? <Zap className="h-4 w-4 text-emerald-500" /> : <ZapOff className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(webhook.id)}
                      className="rounded-lg border p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
