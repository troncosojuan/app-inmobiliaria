"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, TrendingUp, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { FormInput, FormLabel, FormSelect } from "@app-inmobiliaria/ui";

const IPC_DATA: Record<string, number> = {
  "2024-01": 254.2, "2024-02": 276.2, "2024-03": 287.9, "2024-04": 303.2,
  "2024-05": 315.5, "2024-06": 323.2, "2024-07": 330.5, "2024-08": 340.7,
  "2024-09": 349.8, "2024-10": 358.3, "2024-11": 365.2, "2024-12": 372.7,
  "2025-01": 382.5, "2025-02": 391.0, "2025-03": 398.8, "2025-04": 407.2,
  "2025-05": 414.5, "2025-06": 421.3, "2025-07": 428.8, "2025-08": 435.1,
  "2025-09": 441.9, "2025-10": 448.2, "2025-11": 455.0, "2025-12": 461.8,
  "2026-01": 468.5, "2026-02": 475.3,
};

const ADJUSTMENT_PERIODS = [
  { value: 3, label: "Trimestral (3 meses)" },
  { value: 6, label: "Semestral (6 meses)" },
  { value: 12, label: "Anual (12 meses)" },
];

export default function IPCCalculatorPage() {
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>("");
  const [period, setPeriod] = useState<number>(3);

  const result = useMemo(() => {
    if (!baseAmount || !startDate) return null;

    const startKey = startDate.substring(0, 7);
    const startIPC = IPC_DATA[startKey];
    if (!startIPC) return null;

    const dates = Object.keys(IPC_DATA).sort();
    const latestKey = dates[dates.length - 1];
    const latestIPC = IPC_DATA[latestKey];

    const adjustmentFactor = latestIPC / startIPC;
    const adjustedAmount = Math.round(baseAmount * adjustmentFactor);
    const variation = ((adjustmentFactor - 1) * 100).toFixed(1);

    const adjustments: { date: string; ipc: number; amount: number; variation: string }[] = [];
    const start = new Date(startDate + "-01");
    let currentDate = new Date(start);
    let prevIPC = startIPC;
    let currentAmount = baseAmount;

    while (true) {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + period, 1);
      const key = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;

      if (!IPC_DATA[key]) break;

      const factor = IPC_DATA[key] / prevIPC;
      currentAmount = Math.round(currentAmount * factor);
      adjustments.push({
        date: currentDate.toLocaleDateString("es-AR", { month: "long", year: "numeric" }),
        ipc: IPC_DATA[key],
        amount: currentAmount,
        variation: ((factor - 1) * 100).toFixed(1),
      });
      prevIPC = IPC_DATA[key];
    }

    const nextAdjustment = new Date(currentDate);
    const nextKey = `${nextAdjustment.getFullYear()}-${String(nextAdjustment.getMonth() + 1).padStart(2, "0")}`;

    return {
      adjustedAmount,
      variation,
      startIPC,
      latestIPC,
      latestDate: latestKey,
      adjustments,
      nextAdjustmentDate: nextAdjustment.toLocaleDateString("es-AR", { month: "long", year: "numeric" }),
    };
  }, [baseAmount, startDate, period]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/herramientas" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calculadora IPC</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Calculá el ajuste de alquiler según el índice IPC del BCRA
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-1">
          <h2 className="mb-4 font-semibold text-foreground">Datos del contrato</h2>
          <div className="space-y-4">
            <div>
              <FormLabel htmlFor="ipc-amount">Monto base del alquiler (ARS)</FormLabel>
              <FormInput
                id="ipc-amount"
                type="number"
                value={baseAmount || ""}
                onChange={(e) => setBaseAmount(Number(e.target.value))}
                placeholder="150000"
                inputSize="lg"
              />
            </div>
            <div>
              <FormLabel htmlFor="ipc-start">Fecha de inicio del contrato</FormLabel>
              <FormInput
                id="ipc-start"
                type="month"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min="2024-01"
                max="2026-02"
                inputSize="lg"
              />
            </div>
            <div>
              <FormLabel htmlFor="ipc-period">Periodicidad de ajuste</FormLabel>
              <FormSelect
                id="ipc-period"
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                inputSize="lg"
              >
                {ADJUSTMENT_PERIODS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </FormSelect>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          {result ? (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Monto ajustado
                  </div>
                  <div className="mt-2 text-2xl font-bold text-foreground">
                    $ {result.adjustedAmount.toLocaleString("es-AR")}
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    Variación total
                  </div>
                  <div className="mt-2 text-2xl font-bold text-emerald-600">
                    +{result.variation}%
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Próximo ajuste
                  </div>
                  <div className="mt-2 text-lg font-bold text-foreground">
                    {result.nextAdjustmentDate}
                  </div>
                </div>
              </div>

              {result.adjustments.length > 0 && (
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                  <h3 className="mb-3 font-semibold text-foreground">Historial de ajustes</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 text-xs font-medium uppercase text-muted-foreground pb-2 border-b">
                      <span>Fecha</span>
                      <span className="text-right">IPC</span>
                      <span className="text-right">Monto</span>
                      <span className="text-right">Variación</span>
                    </div>
                    <div className="grid grid-cols-4 text-sm py-1.5 border-b border-border">
                      <span className="text-muted-foreground capitalize">Inicio</span>
                      <span className="text-right text-muted-foreground">{result.startIPC.toFixed(1)}</span>
                      <span className="text-right font-medium text-foreground">$ {baseAmount.toLocaleString("es-AR")}</span>
                      <span className="text-right text-muted-foreground">—</span>
                    </div>
                    {result.adjustments.map((adj) => (
                      <div key={adj.date} className="grid grid-cols-4 text-sm py-1.5 border-b border-border last:border-0">
                        <span className="text-muted-foreground capitalize">{adj.date}</span>
                        <span className="text-right text-muted-foreground">{adj.ipc.toFixed(1)}</span>
                        <span className="text-right font-medium text-foreground">$ {adj.amount.toLocaleString("es-AR")}</span>
                        <span className="text-right text-emerald-600">+{adj.variation}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-input bg-muted/50 py-20">
              <div className="text-center">
                <TrendingUp className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Ingresá los datos del contrato para ver el cálculo
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
