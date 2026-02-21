"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { Button } from "@app-inmobiliaria/ui";
import { toast } from "sonner";

interface ReportExporterProps {
  days: number;
}

const PROPERTY_LABELS: Record<string, string> = {
  title: "Título", type: "Tipo", operation: "Operación", status: "Estado",
  price: "Precio", currency: "Moneda", city: "Ciudad", state: "Provincia",
  address: "Dirección", bedrooms: "Dormitorios", bathrooms: "Baños",
  totalArea: "Superficie (m²)", isFeatured: "Destacada", createdAt: "Fecha creación",
};

const LEAD_LABELS: Record<string, string> = {
  name: "Nombre", email: "Email", phone: "Teléfono", status: "Estado",
  source: "Fuente", createdAt: "Fecha", propertyTitle: "Propiedad",
};

export function ReportExporter({ days }: ReportExporterProps) {
  const [exporting, setExporting] = useState<"excel" | "csv" | null>(null);

  async function fetchData() {
    const res = await fetch(`/api/analytics/export?days=${days}`);
    if (!res.ok) throw new Error("Error al obtener datos");
    return res.json();
  }

  async function exportExcel() {
    setExporting("excel");
    try {
      const data = await fetchData();
      const XLSX = await import("xlsx");

      const propertiesRows = data.properties.map((p: Record<string, unknown>) => ({
        [PROPERTY_LABELS.title]: p.title,
        [PROPERTY_LABELS.type]: p.type,
        [PROPERTY_LABELS.operation]: p.operation,
        [PROPERTY_LABELS.status]: p.status,
        [PROPERTY_LABELS.price]: p.price,
        [PROPERTY_LABELS.currency]: p.currency,
        [PROPERTY_LABELS.city]: p.city,
        [PROPERTY_LABELS.state]: p.state,
        [PROPERTY_LABELS.address]: p.address,
        [PROPERTY_LABELS.bedrooms]: p.bedrooms,
        [PROPERTY_LABELS.bathrooms]: p.bathrooms,
        [PROPERTY_LABELS.totalArea]: p.totalArea,
        [PROPERTY_LABELS.isFeatured]: p.isFeatured ? "Sí" : "No",
        [PROPERTY_LABELS.createdAt]: new Date(p.createdAt as string).toLocaleDateString("es-AR"),
        Leads: (p._count as { leads: number })?.leads ?? 0,
        Vistas: (p._count as { views: number })?.views ?? 0,
      }));

      const leadsRows = data.leads.map((l: Record<string, unknown>) => ({
        [LEAD_LABELS.name]: l.name,
        [LEAD_LABELS.email]: l.email,
        [LEAD_LABELS.phone]: l.phone || "-",
        [LEAD_LABELS.status]: l.status,
        [LEAD_LABELS.source]: l.source || "-",
        [LEAD_LABELS.createdAt]: new Date(l.createdAt as string).toLocaleDateString("es-AR"),
        [LEAD_LABELS.propertyTitle]: (l.property as { title: string } | null)?.title || "-",
      }));

      const wb = XLSX.utils.book_new();
      const wsProperties = XLSX.utils.json_to_sheet(propertiesRows);
      const wsLeads = XLSX.utils.json_to_sheet(leadsRows);

      XLSX.utils.book_append_sheet(wb, wsProperties, "Propiedades");
      XLSX.utils.book_append_sheet(wb, wsLeads, `Leads (${days}d)`);

      XLSX.writeFile(wb, `reporte-inmobiliaria-${days}d.xlsx`);
      toast.success("Reporte Excel descargado");
    } catch {
      toast.error("Error al generar el reporte");
    } finally {
      setExporting(null);
    }
  }

  async function exportCSV() {
    setExporting("csv");
    try {
      const data = await fetchData();

      const propHeaders = Object.values(PROPERTY_LABELS).concat(["Leads", "Vistas"]);
      const propRows = data.properties.map((p: Record<string, unknown>) => [
        p.title, p.type, p.operation, p.status, p.price, p.currency,
        p.city, p.state, p.address, p.bedrooms, p.bathrooms, p.totalArea,
        p.isFeatured ? "Sí" : "No",
        new Date(p.createdAt as string).toLocaleDateString("es-AR"),
        (p._count as { leads: number })?.leads ?? 0,
        (p._count as { views: number })?.views ?? 0,
      ]);

      const csvContent = [propHeaders.join(","), ...propRows.map((r: unknown[]) =>
        r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
      )].join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `propiedades-${days}d.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV descargado");
    } catch {
      toast.error("Error al generar el CSV");
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={exportExcel} disabled={!!exporting} className="gap-2">
        {exporting === "excel" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="h-4 w-4" />
        )}
        Excel
      </Button>
      <Button variant="outline" onClick={exportCSV} disabled={!!exporting} className="gap-2">
        {exporting === "csv" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        CSV
      </Button>
    </div>
  );
}
