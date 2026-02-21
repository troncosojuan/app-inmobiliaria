import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className = "" }: FormSectionProps) {
  return (
    <div className={`rounded-xl border bg-card p-6 shadow-sm ${className}`}>
      <h2 className="mb-1 font-semibold text-foreground">{title}</h2>
      {description && <p className="mb-4 text-sm text-muted-foreground">{description}</p>}
      {!description && <div className="mb-4" />}
      {children}
    </div>
  );
}
