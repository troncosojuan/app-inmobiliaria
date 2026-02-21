import * as React from "react";
import { cn } from "../utils";

const inputBase =
  "w-full rounded-lg border border-input px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50";

const inputVariants = {
  default: "bg-background",
  card: "bg-card",
  muted: "bg-muted/50",
};

const inputSizes = {
  sm: "h-9",
  md: "h-10",
  lg: "h-11",
};

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: keyof typeof inputVariants;
  inputSize?: keyof typeof inputSizes;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, variant = "card", inputSize = "md", ...props }, ref) => (
    <input
      ref={ref}
      className={cn(inputBase, inputVariants[variant], inputSizes[inputSize], className)}
      {...props}
    />
  )
);
FormInput.displayName = "FormInput";

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: keyof typeof inputVariants;
  inputSize?: keyof typeof inputSizes;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, variant = "card", inputSize = "md", children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(inputBase, inputVariants[variant], inputSizes[inputSize], "appearance-none", className)}
      {...props}
    >
      {children}
    </select>
  )
);
FormSelect.displayName = "FormSelect";

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: keyof typeof inputVariants;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, variant = "card", ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(inputBase, inputVariants[variant], "py-2 resize-none", className)}
      {...props}
    />
  )
);
FormTextarea.displayName = "FormTextarea";

function FormLabel({ htmlFor, className, children }: { htmlFor?: string; className?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={cn("mb-1.5 block text-sm font-medium text-foreground", className)}>
      {children}
    </label>
  );
}

function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

export { FormInput, FormSelect, FormTextarea, FormLabel, FormError, inputBase, inputVariants, inputSizes };
