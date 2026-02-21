"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  UserPlus, Shield, User, Mail, Building2,
  MoreHorizontal, ToggleLeft, ToggleRight, Trash2, Key,
} from "lucide-react";
import {
  BADGE_COLORS, ICON_COLORS,
  DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableHead, DataTableCell,
  FormInput, FormSelect, FormLabel,
} from "@app-inmobiliaria/ui";

interface TeamUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count: { properties: number; assignedLeads: number };
}

interface TeamManagerProps {
  users: TeamUser[];
  currentUserId: string;
  isAdmin: boolean;
  userLimit: { allowed: boolean; current: number; max: number };
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  TENANT_ADMIN: { label: "Admin", color: BADGE_COLORS.violet },
  AGENT: { label: "Agente", color: BADGE_COLORS.blue },
  PLATFORM_ADMIN: { label: "Plataforma", color: BADGE_COLORS.amber },
};

export function TeamManager({ users, currentUserId, isAdmin, userLimit }: TeamManagerProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("AGENT");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("AGENT");
    setShowForm(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear usuario");
      toast.success(`${name} fue agregado al equipo`);
      resetForm();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/users/${userId}/toggle`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al cambiar estado");
      }
      toast.success(currentActive ? "Usuario desactivado" : "Usuario activado");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al cambiar estado del usuario");
    } finally {
      setActionUserId(null);
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`¿Eliminar a ${userName}? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al eliminar");
      }
      toast.success(`${userName} fue eliminado del equipo`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar usuario");
    } finally {
      setActionUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="flex items-center justify-end">
          {!showForm && (
            <button
              onClick={() => userLimit.allowed ? setShowForm(true) : toast.error(`Límite de ${userLimit.max} usuarios alcanzado. Actualizá tu plan.`)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Agregar usuario
            </button>
          )}
        </div>
      )}

      {showForm && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className={`rounded-lg p-2.5 ${ICON_COLORS.emerald.bg}`}>
              <UserPlus className={`h-5 w-5 ${ICON_COLORS.emerald.text}`} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Nuevo miembro del equipo</h3>
          </div>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <div>
              <FormLabel htmlFor="new-name">Nombre</FormLabel>
              <FormInput id="new-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan Pérez" required />
            </div>
            <div>
              <FormLabel htmlFor="new-email">Email</FormLabel>
              <FormInput id="new-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="juan@inmobiliaria.com" required />
            </div>
            <div>
              <FormLabel htmlFor="new-password">Contraseña</FormLabel>
              <FormInput id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} />
            </div>
            <div>
              <FormLabel htmlFor="new-role">Rol</FormLabel>
              <FormSelect id="new-role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="AGENT">Agente</option>
                <option value="TENANT_ADMIN">Administrador</option>
              </FormSelect>
            </div>
            <div className="sm:col-span-2 flex items-center justify-end gap-3">
              <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50">
                {isSubmitting ? "Creando..." : "Crear usuario"}
              </button>
            </div>
          </form>
        </div>
      )}

      <DataTable>
        <DataTableHeader>
          <DataTableHead>Usuario</DataTableHead>
          <DataTableHead>Rol</DataTableHead>
          <DataTableHead>Propiedades</DataTableHead>
          <DataTableHead>Leads</DataTableHead>
          <DataTableHead>Estado</DataTableHead>
          <DataTableHead>Desde</DataTableHead>
          {isAdmin && <DataTableHead />}
        </DataTableHeader>
        <DataTableBody>
          {users.map((user) => {
            const roleInfo = ROLE_LABELS[user.role] || ROLE_LABELS.AGENT;
            const isSelf = user.id === currentUserId;

            return (
              <DataTableRow key={user.id}>
                <DataTableCell>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${ICON_COLORS.blue.bg}`}>
                      {user.role === "TENANT_ADMIN" || user.role === "PLATFORM_ADMIN"
                        ? <Shield className={`h-4 w-4 ${ICON_COLORS.blue.text}`} />
                        : <User className={`h-4 w-4 ${ICON_COLORS.blue.text}`} />
                      }
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {user.name || "Sin nombre"}
                        {isSelf && <span className="ml-1.5 text-xs text-muted-foreground">(vos)</span>}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </DataTableCell>
                <DataTableCell>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleInfo.color}`}>
                    {roleInfo.label}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    {user._count.properties}
                  </div>
                </DataTableCell>
                <DataTableCell>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {user._count.assignedLeads}
                  </div>
                </DataTableCell>
                <DataTableCell>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    user.isActive ? BADGE_COLORS.emerald : BADGE_COLORS.red
                  }`}>
                    {user.isActive ? "Activo" : "Inactivo"}
                  </span>
                </DataTableCell>
                <DataTableCell className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("es-AR", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </DataTableCell>
                {isAdmin && (
                  <DataTableCell>
                    {!isSelf && (
                      <div className="relative">
                        <button
                          onClick={() => setActionUserId(actionUserId === user.id ? null : user.id)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          aria-label="Acciones"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {actionUserId === user.id && (
                          <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border bg-popover py-1 shadow-lg">
                            <button
                              onClick={() => handleToggleActive(user.id, user.isActive)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              {user.isActive
                                ? <><ToggleRight className="h-4 w-4 text-red-500" /> Desactivar</>
                                : <><ToggleLeft className="h-4 w-4 text-emerald-500" /> Activar</>
                              }
                            </button>
                            <button
                              onClick={() => handleDelete(user.id, user.name || user.email)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </DataTableCell>
                )}
              </DataTableRow>
            );
          })}
        </DataTableBody>
      </DataTable>

      {users.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No hay usuarios en el equipo. Agregá el primer agente.
        </div>
      )}
    </div>
  );
}
