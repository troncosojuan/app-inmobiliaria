"use client";

import { useState, useRef, useCallback } from "react";
import {
  ArrowLeft, Save, Eye, Bold, Italic, Heading1, Heading2,
  List, ListOrdered, Link2, Image, AlignLeft, AlignCenter,
  Quote, Minus, Undo, Redo, Code,
} from "lucide-react";
import { Button } from "@app-inmobiliaria/ui";
import { toast } from "sonner";

interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PageEditorProps {
  page: CustomPage | null;
  onSave: (page: CustomPage) => void;
  onCancel: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const TOOLBAR_GROUPS = [
  [
    { cmd: "undo", icon: Undo, label: "Deshacer" },
    { cmd: "redo", icon: Redo, label: "Rehacer" },
  ],
  [
    { cmd: "bold", icon: Bold, label: "Negrita" },
    { cmd: "italic", icon: Italic, label: "Cursiva" },
    { cmd: "code", icon: Code, label: "Código" },
  ],
  [
    { cmd: "h1", icon: Heading1, label: "Título" },
    { cmd: "h2", icon: Heading2, label: "Subtítulo" },
  ],
  [
    { cmd: "ul", icon: List, label: "Lista" },
    { cmd: "ol", icon: ListOrdered, label: "Lista numerada" },
    { cmd: "blockquote", icon: Quote, label: "Cita" },
  ],
  [
    { cmd: "left", icon: AlignLeft, label: "Izquierda" },
    { cmd: "center", icon: AlignCenter, label: "Centro" },
  ],
  [
    { cmd: "link", icon: Link2, label: "Enlace" },
    { cmd: "image", icon: Image, label: "Imagen" },
    { cmd: "hr", icon: Minus, label: "Separador" },
  ],
];

export function PageEditor({ page, onSave, onCancel }: PageEditorProps) {
  const [title, setTitle] = useState(page?.title || "");
  const [slug, setSlug] = useState(page?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!page);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value);
      if (autoSlug) setSlug(slugify(value));
    },
    [autoSlug]
  );

  function execCommand(cmd: string) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    switch (cmd) {
      case "bold":
        document.execCommand("bold");
        break;
      case "italic":
        document.execCommand("italic");
        break;
      case "code":
        document.execCommand("formatBlock", false, "pre");
        break;
      case "h1":
        document.execCommand("formatBlock", false, "h2");
        break;
      case "h2":
        document.execCommand("formatBlock", false, "h3");
        break;
      case "ul":
        document.execCommand("insertUnorderedList");
        break;
      case "ol":
        document.execCommand("insertOrderedList");
        break;
      case "blockquote":
        document.execCommand("formatBlock", false, "blockquote");
        break;
      case "left":
        document.execCommand("justifyLeft");
        break;
      case "center":
        document.execCommand("justifyCenter");
        break;
      case "link": {
        const url = prompt("URL del enlace:");
        if (url) document.execCommand("createLink", false, url);
        break;
      }
      case "image": {
        const src = prompt("URL de la imagen:");
        if (src) document.execCommand("insertImage", false, src);
        break;
      }
      case "hr":
        document.execCommand("insertHorizontalRule");
        break;
      case "undo":
        document.execCommand("undo");
        break;
      case "redo":
        document.execCommand("redo");
        break;
    }
  }

  async function handleSave() {
    if (!title.trim() || !slug.trim()) {
      toast.error("Título y slug son obligatorios");
      return;
    }

    const content = editorRef.current?.innerHTML || "";
    if (!content.trim() || content === "<br>") {
      toast.error("El contenido no puede estar vacío");
      return;
    }

    setSaving(true);
    try {
      const url = page ? `/api/pages/${page.id}` : "/api/pages";
      const method = page ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          content,
          isPublished: page?.isPublished ?? false,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al guardar");
      }

      const saved = await res.json();
      toast.success(page ? "Página actualizada" : "Página creada");
      onSave(saved);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a páginas
        </button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewing(!previewing)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            {previewing ? "Editar" : "Vista previa"}
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ej: Sobre Nosotros"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Slug (URL)
            {autoSlug && <span className="ml-2 text-xs text-muted-foreground">(automático)</span>}
          </label>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setAutoSlug(false);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
              }}
              placeholder="sobre-nosotros"
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {previewing ? (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h1 className="mb-4 text-2xl font-bold text-foreground">{title || "Sin título"}</h1>
          <div
            className="prose prose-slate max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: editorRef.current?.innerHTML || "" }}
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-2 py-1.5">
            {TOOLBAR_GROUPS.map((group, gi) => (
              <div key={gi} className="flex items-center">
                {gi > 0 && <div className="mx-1 h-5 w-px bg-border" />}
                {group.map(({ cmd, icon: Icon, label }) => (
                  <button
                    key={cmd}
                    onClick={() => execCommand(cmd)}
                    title={label}
                    className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="min-h-[400px] px-6 py-4 text-sm text-foreground focus:outline-none [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_blockquote]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_a]:text-blue-600 [&_a]:underline [&_hr]:my-6 [&_hr]:border-border [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-lg [&_pre]:mb-3 [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:text-xs"
            dangerouslySetInnerHTML={{ __html: page?.content || "" }}
          />
        </div>
      )}
    </div>
  );
}
