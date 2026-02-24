import { DollarSign } from "lucide-react";

interface DolarRate {
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
}

async function getDolarRates(): Promise<DolarRate[]> {
  try {
    const res = await fetch("https://dolarapi.com/v1/dolares", {
      next: { revalidate: 300 }, // cache 5 minutes
    });
    if (!res.ok) return [];
    const data: DolarRate[] = await res.json();
    return data.filter((d) => ["oficial", "blue", "mep"].includes(d.casa));
  } catch {
    return [];
  }
}

const LABEL: Record<string, string> = { oficial: "Oficial", blue: "Blue", mep: "MEP" };

export async function DolarWidget() {
  const rates = await getDolarRates();
  if (rates.length === 0) return null;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
          <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Cotización del dólar</h3>
        <span className="ml-auto text-[10px] text-muted-foreground">Actualiza cada 5 min</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {rates.map((rate) => (
          <div key={rate.casa} className="rounded-lg bg-muted/50 px-2.5 py-2 text-center">
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {LABEL[rate.casa] || rate.nombre}
            </div>
            <div className="mt-1 text-sm font-bold text-foreground">
              ${rate.venta.toLocaleString("es-AR")}
            </div>
            <div className="text-[10px] text-muted-foreground">
              Cpo: ${rate.compra.toLocaleString("es-AR")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
