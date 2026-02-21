"use client";

import { useState } from "react";
import { Plus, FileText, Eye, EyeOff, Pencil, Trash2, ExternalLink, Globe } from "lucide-react";
import { Button, EmptyState } from "@app-inmobiliaria/ui";
import { toast } from "sonner";
import { PageEditor } from "./page-editor";

interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PagesManagerProps {
  pages: CustomPage[];
}

export function PagesManager({ pages: initialPages }: PagesManagerProps) {
  const [pages, setPages] = useState<CustomPage[]>(initialPages);
  const [editing, setEditing] = useState<CustomPage | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleTogglePublish(id: string) {
    try {
      const res = await fetch(`/api/pages/${id}/toggle`, { method: "PATCH" });
      if (!res.ok) throw new Error("Error al cambiar estado");
      const updated = await res.json();
      setPages((prev) => prev.map((p) => (p.id === id ? updated : p)));
      toast.success(updated.isPublished ? "Página publicada" : "Página despublicada");
    } catch {
      toast.error("Error al cambiar estado de publicación");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de eliminar esta página?")) return;
    try {
      const res = await fetch(`/api/pages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      setPages((prev) => prev.filter((p) => p.id !== id));
      toast.success("Página eliminada");
    } catch {
      toast.error("Error al eliminar la página");
    }
  }

  function handleSaved(page: CustomPage) {
    setPages((prev) => {
      const exists = prev.find((p) => p.id === page.id);
      if (exists) return prev.map((p) => (p.id === page.id ? page : p));
      return [page, ...prev];
    });
    setEditing(null);
    setCreating(false);
  }

  if (editing || creating) {
    return (
      <PageEditor
        page={editing}
        onSave={handleSaved}
        onCancel={() => {
          setEditing(null);
          setCreating(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva página
        </Button>
      </div>

      {pages.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-10 w-10" />}
          title="Sin páginas"
          description="Creá tu primera página para complementar tu sitio web."
          action={
            <Button onClick={() => setCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Crear página
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <div
              key={page.id}
              className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
            >
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
                      <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{page.title}</h3>
                      <p className="text-xs text-muted-foreground">/{page.slug}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      page.isPublished
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {page.isPublished ? "Publicada" : "Borrador"}
                  </span>
                </div>

                <p className="mb-4 text-xs text-muted-foreground line-clamp-2">
                  {page.content.replace(/<[^>]*>/g, "").slice(0, 120)}...
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditing(page)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Pencil className="h-3 w-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleTogglePublish(page.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {page.isPublished ? (
                      <>
                        <EyeOff className="h-3 w-3" />
                        Despublicar
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3" />
                        Publicar
                      </>
                    )}
                  </button>
                  {page.isPublished && (
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ver
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
