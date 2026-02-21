"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import {
  Upload, FileSpreadsheet, CheckCircle2, XCircle, AlertTriangle,
  Download, Loader2, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { PageHeader, ICON_COLORS } from "@app-inmobiliaria/ui";

interface ImportResult {
  row: number;
  success: boolean;
  title?: string;
  error?: string;
}

type ParsedRow = Record<string, string>;

const REQUIRED_FIELDS = ["titulo", "precio", "direccion", "ciudad", "provincia"];
const OPTIONAL_FIELDS = [
  "tipo", "operacion", "moneda", "expensas", "descripcion",
  "barrio", "superficie_total", "superficie_cubierta",
  "ambientes", "dormitorios", "banos", "cocheras", "estado",
];

const SAMPLE_CSV = `titulo,tipo,operacion,precio,moneda,direccion,ciudad,provincia,barrio,superficie_total,dormitorios,banos
"Depto 2 ambientes en Palermo",APARTMENT,SALE,120000,USD,"Av. Santa Fe 1234","Buenos Aires","Buenos Aires","Palermo",55,1,1
"Casa con jardín en Belgrano",HOUSE,SALE,250000,USD,"Cabildo 2345","Buenos Aires","Buenos Aires","Belgrano",180,3,2
"Local comercial centro",COMMERCIAL,RENT,85000,ARS,"Corrientes 567","Buenos Aires","Buenos Aires","Centro",40,,1`;

export function BulkImporter() {
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult[] | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFile = useCallback((file: File) => {
    setResults(null);
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          toast.error(`Error al parsear CSV: ${result.errors[0].message}`);
          return;
        }

        const data = result.data as ParsedRow[];
        if (data.length === 0) {
          toast.error("El archivo está vacío");
          return;
        }

        const cols = Object.keys(data[0]);
        setHeaders(cols);
        setParsedRows(data);
        toast.success(`${data.length} filas detectadas`);
      },
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith(".csv") || file.type === "text/csv")) {
        handleFile(file);
      } else {
        toast.error("Solo se aceptan archivos CSV");
      }
    },
    [handleFile]
  );

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      const res = await fetch("/api/properties/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: parsedRows }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error en la importación");
      }

      const data = await res.json();
      setResults(data.results);

      if (data.failed === 0) {
        toast.success(`${data.success} propiedades importadas exitosamente`);
      } else {
        toast.warning(`${data.success} importadas, ${data.failed} con errores`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error de importación");
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla-propiedades.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const successCount = results?.filter((r) => r.success).length ?? 0;
  const failCount = results?.filter((r) => !r.success).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/propiedades"
          className="flex h-9 w-9 items-center justify-center rounded-lg border bg-card text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <PageHeader title="Importar propiedades" description="Cargá múltiples propiedades desde un archivo CSV" />
      </div>

      {!results && (
        <>
          <div className="flex gap-3">
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Download className="h-4 w-4" />
              Descargar plantilla CSV
            </button>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-input bg-muted/30 p-8 text-center transition-colors hover:border-primary hover:bg-primary/5"
          >
            <FileSpreadsheet className="mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              {fileName ? fileName : "Arrastrá tu archivo CSV acá"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Formato CSV con encabezados. Máximo 500 propiedades.
            </p>
            <label className="mt-4 cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
              Seleccionar archivo
              <input type="file" accept=".csv" onChange={handleSelect} className="hidden" />
            </label>
          </div>

          {parsedRows.length > 0 && (
            <>
              <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b px-5 py-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Vista previa ({parsedRows.length} filas)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-[640px] w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">#</th>
                        {headers.slice(0, 8).map((h) => (
                          <th key={h} className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                            {h}
                            {REQUIRED_FIELDS.includes(h) && <span className="ml-1 text-red-500">*</span>}
                          </th>
                        ))}
                        {headers.length > 8 && (
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                            +{headers.length - 8} más
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.slice(0, 10).map((row, i) => (
                        <tr key={`row-${i}-${row[headers[0]] ?? ""}`} className="border-b last:border-0">
                          <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                          {headers.slice(0, 8).map((h) => (
                            <td key={h} className="max-w-[200px] truncate px-3 py-2 text-foreground">{row[h] || "—"}</td>
                          ))}
                          {headers.length > 8 && <td className="px-3 py-2 text-muted-foreground">...</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedRows.length > 10 && (
                  <div className="border-t px-5 py-2 text-xs text-muted-foreground">
                    Mostrando 10 de {parsedRows.length} filas
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {importing ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Importando...</>
                  ) : (
                    <><Upload className="h-4 w-4" />Importar {parsedRows.length} propiedades</>
                  )}
                </button>
              </div>
            </>
          )}

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Campos disponibles</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Requeridos</p>
                <div className="space-y-1">
                  {REQUIRED_FIELDS.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{f}</code>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Opcionales</p>
                <div className="space-y-1">
                  {OPTIONAL_FIELDS.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{f}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {results && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className={`flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm`}>
              <div className={`rounded-lg p-2 ${ICON_COLORS.emerald.bg}`}>
                <CheckCircle2 className={`h-5 w-5 ${ICON_COLORS.emerald.text}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{successCount}</div>
                <div className="text-xs text-muted-foreground">Importadas</div>
              </div>
            </div>
            <div className={`flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm`}>
              <div className={`rounded-lg p-2 ${ICON_COLORS.red.bg}`}>
                <XCircle className={`h-5 w-5 ${ICON_COLORS.red.text}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{failCount}</div>
                <div className="text-xs text-muted-foreground">Con errores</div>
              </div>
            </div>
            <div className={`flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm`}>
              <div className={`rounded-lg p-2 ${ICON_COLORS.blue.bg}`}>
                <FileSpreadsheet className={`h-5 w-5 ${ICON_COLORS.blue.text}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{results.length}</div>
                <div className="text-xs text-muted-foreground">Total procesadas</div>
              </div>
            </div>
          </div>

          {failCount > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">Filas con errores</span>
              </div>
              <div className="space-y-1">
                {results.filter((r) => !r.success).map((r) => (
                  <div key={r.row} className="flex gap-2 text-sm">
                    <span className="shrink-0 font-medium text-amber-700 dark:text-amber-400">Fila {r.row}:</span>
                    <span className="text-amber-600 dark:text-amber-300">{r.title} — {r.error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setParsedRows([]); setResults(null); setFileName(""); }}
              className="rounded-lg border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Importar otro archivo
            </button>
            <Link
              href="/dashboard/propiedades"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              Ver propiedades
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
