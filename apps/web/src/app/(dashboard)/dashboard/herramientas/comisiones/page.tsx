"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, Percent, DollarSign, Building2 } from "lucide-react";
import Link from "next/link";
import { FormInput, FormLabel, FormSelect } from "@app-inmobiliaria/ui";

const TEMPLATES = [
  { name: "Venta CUCICBA (CABA)", operationType: "sale", percentage: 3, iva: 21, label: "3% + IVA" },
  { name: "Venta Pcia. Buenos Aires", operationType: "sale", percentage: 4, iva: 21, label: "4% + IVA" },
  { name: "Alquiler (1 mes)", operationType: "rent", percentage: 100, iva: 21, label: "1 mes + IVA", isFixedMonth: true },
  { name: "Alquiler (medio mes)", operationType: "rent", percentage: 50, iva: 21, label: "½ mes + IVA", isFixedMonth: true },
  { name: "Personalizado", operationType: "custom", percentage: 0, iva: 21, label: "Custom" },
];

export default function ComisionesCalculatorPage() {
  const [operationAmount, setOperationAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("USD");
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [customPercentage, setCustomPercentage] = useState<number>(3);
  const [customIva, setCustomIva] = useState<number>(21);

  const result = useMemo(() => {
    if (!operationAmount) return null;

    const template = TEMPLATES[selectedTemplate];
    const isCustom = template.operationType === "custom";
    const pct = isCustom ? customPercentage : template.percentage;
    const iva = isCustom ? customIva : template.iva;

    let comisionNeta: number;
    if (template.isFixedMonth) {
      comisionNeta = operationAmount * (pct / 100);
    } else {
      comisionNeta = operationAmount * (pct / 100);
    }

    const ivaAmount = comisionNeta * (iva / 100);
    const total = comisionNeta + ivaAmount;

    const currSymbol = currency === "USD" ? "US$" : "$";

    return {
      comisionNeta,
      ivaAmount,
      total,
      percentage: pct,
      ivaPercentage: iva,
      currSymbol,
    };
  }, [operationAmount, selectedTemplate, customPercentage, customIva, currency]);

  const formatNum = (n: number) => n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/herramientas" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calculadora de Comisiones</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Calculá honorarios según normativa CUCICBA y colegios provinciales
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-foreground">Datos de la operación</h2>
          <div className="space-y-4">
            <div>
              <FormLabel htmlFor="com-amount">
                Monto de la operación
              </FormLabel>
              <div className="flex gap-2">
                <FormInput
                  id="com-amount"
                  type="number"
                  value={operationAmount || ""}
                  onChange={(e) => setOperationAmount(Number(e.target.value))}
                  placeholder="185000"
                  inputSize="lg"
                />
                <FormSelect
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-24"
                  aria-label="Moneda"
                  inputSize="lg"
                >
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                </FormSelect>
              </div>
            </div>

            <div>
              <FormLabel>Tipo de comisión</FormLabel>
              <div className="mt-1.5 space-y-2">
                {TEMPLATES.map((t, i) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => setSelectedTemplate(i)}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                      selectedTemplate === i
                        ? "border-primary bg-blue-50 dark:bg-blue-950/30 text-primary"
                        : "border-input hover:bg-muted"
                    }`}
                  >
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {TEMPLATES[selectedTemplate].operationType === "custom" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FormLabel htmlFor="custom-pct">Porcentaje (%)</FormLabel>
                  <FormInput
                    id="custom-pct"
                    type="number"
                    step="0.5"
                    value={customPercentage}
                    onChange={(e) => setCustomPercentage(Number(e.target.value))}
                    inputSize="lg"
                  />
                </div>
                <div>
                  <FormLabel htmlFor="custom-iva">IVA (%)</FormLabel>
                  <FormInput
                    id="custom-iva"
                    type="number"
                    value={customIva}
                    onChange={(e) => setCustomIva(Number(e.target.value))}
                    inputSize="lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          {result ? (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Percent className="h-4 w-4" /> Comisión neta
                  </div>
                  <div className="mt-2 text-2xl font-bold text-foreground">
                    {result.currSymbol} {formatNum(result.comisionNeta)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{result.percentage}% del monto</div>
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" /> IVA ({result.ivaPercentage}%)
                  </div>
                  <div className="mt-2 text-2xl font-bold text-amber-600">
                    {result.currSymbol} {formatNum(result.ivaAmount)}
                  </div>
                </div>
                <div className="rounded-xl border-2 border-primary/20 bg-blue-50 dark:bg-blue-950/30 p-5">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <DollarSign className="h-4 w-4" /> Total a cobrar
                  </div>
                  <div className="mt-2 text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {result.currSymbol} {formatNum(result.total)}
                  </div>
                  <div className="mt-1 text-xs text-primary">Comisión + IVA</div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h3 className="mb-3 font-semibold text-foreground">Desglose</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border text-sm">
                    <span className="text-muted-foreground">Monto de operación</span>
                    <span className="font-medium text-foreground">{result.currSymbol} {formatNum(operationAmount)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border text-sm">
                    <span className="text-muted-foreground">Comisión ({result.percentage}%)</span>
                    <span className="font-medium text-foreground">{result.currSymbol} {formatNum(result.comisionNeta)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border text-sm">
                    <span className="text-muted-foreground">IVA ({result.ivaPercentage}%)</span>
                    <span className="font-medium text-foreground">{result.currSymbol} {formatNum(result.ivaAmount)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm">
                    <span className="font-semibold text-foreground">Honorarios finales</span>
                    <span className="font-bold text-primary">{result.currSymbol} {formatNum(result.total)}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-input bg-muted/50 py-20">
              <div className="text-center">
                <Percent className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Ingresá el monto de la operación para calcular
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
