import * as React from "react";
import { cn } from "../utils";

interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function DataTable({ children, className, ...props }: DataTableProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card shadow-sm", className)} {...props}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">{children}</table>
      </div>
    </div>
  );
}

function DataTableHeader({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead {...props}>
      <tr className={cn("border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground", className)}>
        {children}
      </tr>
    </thead>
  );
}

function DataTableBody({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className="divide-y" {...props}>{children}</tbody>;
}

function DataTableRow({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn("transition-colors hover:bg-muted/30", className)} {...props}>
      {children}
    </tr>
  );
}

function DataTableHead({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("px-3 py-3 sm:px-5", className)} {...props}>{children}</th>;
}

function DataTableCell({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-3 py-3 sm:px-5 sm:py-4", className)} {...props}>{children}</td>;
}

export {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableHead,
  DataTableCell,
};
