"use client";

import { Minus, Plus } from "lucide-react";

interface NumberStepperProps {
  id?: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export function NumberStepper({
  id,
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
}: NumberStepperProps) {
  const current = value ?? 0;

  const decrement = () => {
    const next = current - step;
    if (next < min) return;
    onChange(next === 0 && min === 0 ? undefined : next);
  };

  const increment = () => {
    const next = current + step;
    if (next > max) return;
    onChange(next);
  };

  return (
    <div className="flex items-center gap-0 rounded-lg border border-input bg-background overflow-hidden h-10">
      <button
        type="button"
        onClick={decrement}
        disabled={current <= min}
        className="flex h-full w-10 shrink-0 items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
        aria-label="Reducir"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <div
        id={id}
        className="flex h-full flex-1 items-center justify-center text-sm font-medium text-foreground select-none min-w-[2rem]"
      >
        {current === 0 ? <span className="text-muted-foreground text-xs">—</span> : current}
      </div>
      <button
        type="button"
        onClick={increment}
        disabled={current >= max}
        className="flex h-full w-10 shrink-0 items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
        aria-label="Aumentar"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
