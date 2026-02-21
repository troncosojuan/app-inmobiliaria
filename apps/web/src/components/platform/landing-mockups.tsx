"use client";

export function MockupWebsite() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="h-2 w-2 rounded-full bg-red-400" />
        <div className="h-2 w-2 rounded-full bg-amber-400" />
        <div className="h-2 w-2 rounded-full bg-emerald-400" />
      </div>
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-5 w-20 rounded bg-slate-200 dark:bg-slate-600" />
          <div className="flex gap-1">
            <div className="h-2 w-8 rounded bg-slate-200 dark:bg-slate-600" />
            <div className="h-2 w-8 rounded bg-slate-200 dark:bg-slate-600" />
            <div className="h-2 w-8 rounded bg-slate-200 dark:bg-slate-600" />
          </div>
        </div>
        <div className="mb-4 h-16 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40" />
        <div className="mb-3 flex gap-2">
          <div className="h-8 flex-1 rounded-md border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-800" />
          <div className="h-8 w-16 rounded-md bg-blue-500" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-800">
              <div className="aspect-[4/3] rounded-t-lg bg-slate-200 dark:bg-slate-600" />
              <div className="p-2">
                <div className="mb-1 h-2 w-3/4 rounded bg-slate-300 dark:bg-slate-500" />
                <div className="h-2 w-1/2 rounded bg-slate-200 dark:bg-slate-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MockupDashboard() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="h-2 w-2 rounded-full bg-red-400" />
        <div className="h-2 w-2 rounded-full bg-amber-400" />
        <div className="h-2 w-2 rounded-full bg-emerald-400" />
      </div>
      <div className="p-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-600" />
          <div className="h-6 w-20 rounded bg-blue-500" />
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                <th className="px-2 py-1.5 font-medium">Propiedad</th>
                <th className="px-2 py-1.5 font-medium">Estado</th>
                <th className="px-2 py-1.5 font-medium">Precio</th>
              </tr>
            </thead>
            <tbody>
              {["Casa Palermo", "Depto Microcentro", "Local Belgrano"].map((name, i) => (
                <tr key={name} className="border-b border-slate-100 dark:border-slate-700/50">
                  <td className="px-2 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-8 shrink-0 rounded bg-slate-200 dark:bg-slate-600" />
                      <span className="truncate">{name}</span>
                    </div>
                  </td>
                  <td className="px-2 py-1.5">
                    <span className="inline-flex rounded-full bg-emerald-100 px-1.5 py-0.5 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                      Publicado
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-slate-600 dark:text-slate-400">USD {[120000, 85000, 95000][i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function MockupPublications() {
  const portals = [
    { name: "ZonaProp", color: "bg-blue-100 dark:bg-blue-900/40", w: "w-16" },
    { name: "MercadoLibre", color: "bg-amber-100 dark:bg-amber-900/40", w: "w-20" },
    { name: "ArgenProp", color: "bg-emerald-100 dark:bg-emerald-900/40", w: "w-14" },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="h-2 w-2 rounded-full bg-red-400" />
        <div className="h-2 w-2 rounded-full bg-amber-400" />
        <div className="h-2 w-2 rounded-full bg-emerald-400" />
      </div>
      <div className="p-4">
        <div className="mb-3 h-4 w-28 rounded bg-slate-200 dark:bg-slate-600" />
        <div className="space-y-2">
          {portals.map((p) => (
            <div
              key={p.name}
              className={`flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 ${p.color}`}
            >
              <div className="flex items-center gap-2">
                <div className={`h-8 ${p.w} rounded bg-white/80 dark:bg-slate-800/80`} />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{p.name}</span>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                Conectado
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <div className="h-6 flex-1 rounded border border-dashed border-slate-300 dark:border-slate-600" />
          <div className="h-6 w-14 rounded bg-blue-500 text-center text-xs leading-6 text-white">Publicar</div>
        </div>
      </div>
    </div>
  );
}

export function MockupChat() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="h-2 w-2 rounded-full bg-red-400" />
        <div className="h-2 w-2 rounded-full bg-amber-400" />
        <div className="h-2 w-2 rounded-full bg-emerald-400" />
      </div>
      <div className="p-3">
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-blue-50 px-2 py-1.5 dark:bg-blue-900/30">
          <div className="h-6 w-6 rounded-full bg-blue-500" />
          <div>
            <div className="h-2 w-20 rounded bg-blue-200 dark:bg-blue-800" />
            <div className="mt-0.5 h-1.5 w-14 rounded bg-blue-100 dark:bg-blue-800/50" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="ml-4 max-w-[85%] rounded-lg rounded-tl-none bg-slate-100 py-1.5 px-2 text-xs dark:bg-slate-700">
            Busco depto 2 ambientes en Palermo
          </div>
          <div className="mr-4 ml-auto max-w-[85%] rounded-lg rounded-tr-none bg-blue-500 py-1.5 px-2 text-xs text-white">
            Encontré 3 opciones. ¿Hasta cuánto querés pagar?
          </div>
          <div className="ml-4 max-w-[85%] rounded-lg rounded-tl-none bg-slate-100 py-1.5 px-2 text-xs dark:bg-slate-700">
            Hasta USD 120.000
          </div>
        </div>
        <div className="mt-3 flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-600 dark:bg-slate-800">
          <div className="h-6 flex-1 rounded bg-white dark:bg-slate-700" />
          <div className="h-6 w-6 rounded bg-blue-500" />
        </div>
      </div>
    </div>
  );
}

export function MockupAnalytics() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="h-2 w-2 rounded-full bg-red-400" />
        <div className="h-2 w-2 rounded-full bg-amber-400" />
        <div className="h-2 w-2 rounded-full bg-emerald-400" />
      </div>
      <div className="p-3">
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="h-2 w-12 rounded bg-slate-300 dark:bg-slate-600" />
            <div className="mt-1 text-lg font-bold text-slate-800 dark:text-white">1.2k</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="h-2 w-14 rounded bg-slate-300 dark:bg-slate-600" />
            <div className="mt-1 text-lg font-bold text-slate-800 dark:text-white">48</div>
          </div>
        </div>
        <div className="mb-2 h-3 w-24 rounded bg-slate-200 dark:bg-slate-600" />
        <div className="flex h-20 items-end justify-between gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 dark:border-slate-700 dark:bg-slate-800/50">
          {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-blue-500 dark:bg-blue-600"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-slate-500">
          <span>Lun</span>
          <span>Dom</span>
        </div>
      </div>
    </div>
  );
}
