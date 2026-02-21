"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, BarChart3, DollarSign, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { FormInput, FormLabel, FormSelect } from "@app-inmobiliaria/ui";

export default function RendimientoCalculatorPage() {
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("USD");
  const [monthlyRent, setMonthlyRent] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [monthlyTaxes, setMonthlyTaxes] = useState<number>(0);
  const [maintenanceCost, setMaintenanceCost] = useState<number>(0);
  const [vacancyRate, setVacancyRate] = useState<number>(5);

  const result = useMemo(() => {
    if (!purchasePrice || !monthlyRent) return null;

    const annualGrossRent = monthlyRent * 12;
    const annualExpenses = monthlyExpenses * 12;
    const annualTaxes = monthlyTaxes * 12;
    const annualMaintenance = maintenanceCost * 12;
    const vacancyLoss = annualGrossRent * (vacancyRate / 100);

    const annualNetRent = annualGrossRent - annualExpenses - annualTaxes - annualMaintenance - vacancyLoss;

    const grossYield = (annualGrossRent / purchasePrice) * 100;
    const netYield = (annualNetRent / purchasePrice) * 100;
    const capRate = (annualNetRent / purchasePrice) * 100;
    const recoveryYears = netYield > 0 ? purchasePrice / annualNetRent : Infinity;
    const monthlyNetIncome = annualNetRent / 12;

    const currSymbol = currency === "USD" ? "US$" : "$";

    return {
      grossYield: grossYield.toFixed(2),
      netYield: netYield.toFixed(2),
      capRate: capRate.toFixed(2),
      recoveryYears: recoveryYears === Infinity ? "N/A" : recoveryYears.toFixed(1),
      monthlyNetIncome: Math.round(monthlyNetIncome),
      annualGrossRent,
      annualNetRent: Math.round(annualNetRent),
      totalAnnualCosts: Math.round(annualExpenses + annualTaxes + annualMaintenance + vacancyLoss),
      currSymbol,
    };
  }, [purchasePrice, monthlyRent, monthlyExpenses, monthlyTaxes, maintenanceCost, vacancyRate, currency]);

  const formatNum = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/herramientas" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rendimiento de Inversión</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Evaluá la rentabilidad de una propiedad como inversión
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-foreground">Datos de la inversión</h2>
          <div className="space-y-4">
            <div>
              <FormLabel htmlFor="rend-price">Precio de compra</FormLabel>
              <div className="flex gap-2">
                <FormInput
                  id="rend-price"
                  type="number"
                  value={purchasePrice || ""}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  placeholder="185000"
                  inputSize="lg"
                />
                <FormSelect value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-24" aria-label="Moneda" inputSize="lg">
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                </FormSelect>
              </div>
            </div>
            <div>
              <FormLabel htmlFor="rend-rent">Alquiler mensual ({currency})</FormLabel>
              <FormInput id="rend-rent" type="number" value={monthlyRent || ""} onChange={(e) => setMonthlyRent(Number(e.target.value))} placeholder="800" inputSize="lg" />
            </div>
            <div>
              <FormLabel htmlFor="rend-exp">Expensas mensuales ({currency})</FormLabel>
              <FormInput id="rend-exp" type="number" value={monthlyExpenses || ""} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} placeholder="100" inputSize="lg" />
            </div>
            <div>
              <FormLabel htmlFor="rend-tax">Impuestos mensuales ({currency})</FormLabel>
              <FormInput id="rend-tax" type="number" value={monthlyTaxes || ""} onChange={(e) => setMonthlyTaxes(Number(e.target.value))} placeholder="50" inputSize="lg" />
            </div>
            <div>
              <FormLabel htmlFor="rend-maint">Mantenimiento mensual ({currency})</FormLabel>
              <FormInput id="rend-maint" type="number" value={maintenanceCost || ""} onChange={(e) => setMaintenanceCost(Number(e.target.value))} placeholder="30" inputSize="lg" />
            </div>
            <div>
              <FormLabel htmlFor="rend-vac">Vacancia estimada (%)</FormLabel>
              <FormInput id="rend-vac" type="number" min="0" max="100" value={vacancyRate} onChange={(e) => setVacancyRate(Number(e.target.value))} inputSize="lg" />
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          {result ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" /> Rend. bruto
                  </div>
                  <div className="mt-2 text-2xl font-bold text-foreground">{result.grossYield}%</div>
                  <div className="mt-1 text-xs text-muted-foreground">anual</div>
                </div>
                <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-5">
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-4 w-4" /> Rend. neto
                  </div>
                  <div className="mt-2 text-2xl font-bold text-emerald-800 dark:text-emerald-200">{result.netYield}%</div>
                  <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">anual</div>
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" /> Recupero
                  </div>
                  <div className="mt-2 text-2xl font-bold text-foreground">{result.recoveryYears}</div>
                  <div className="mt-1 text-xs text-muted-foreground">años</div>
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" /> Ingreso neto/mes
                  </div>
                  <div className="mt-2 text-2xl font-bold text-foreground">
                    {result.currSymbol} {formatNum(result.monthlyNetIncome)}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h3 className="mb-3 font-semibold text-foreground">Análisis detallado</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b text-sm">
                    <span className="text-muted-foreground">Ingreso bruto anual</span>
                    <span className="font-medium">{result.currSymbol} {formatNum(result.annualGrossRent)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b text-sm">
                    <span className="text-muted-foreground">Costos anuales totales</span>
                    <span className="font-medium text-red-600">- {result.currSymbol} {formatNum(result.totalAnnualCosts)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b text-sm">
                    <span className="font-semibold text-foreground">Ingreso neto anual</span>
                    <span className="font-bold text-emerald-600">{result.currSymbol} {formatNum(result.annualNetRent)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-muted-foreground">Cap Rate</span>
                    <span className="font-medium">{result.capRate}%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-primary/20 bg-blue-50 dark:bg-blue-950/30 p-4 text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">Interpretación:</p>
                <p className="mt-1">
                  {Number(result.netYield) >= 5
                    ? "Rendimiento neto superior al 5%. Es una buena inversión inmobiliaria."
                    : Number(result.netYield) >= 3
                      ? "Rendimiento neto entre 3-5%. Aceptable, considerar valorización."
                      : "Rendimiento neto bajo. Evaluar potencial de valorización del inmueble."
                  }
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-input bg-muted/50 py-20">
              <div className="text-center">
                <BarChart3 className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Ingresá los datos de la inversión para ver el análisis
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
