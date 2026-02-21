"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UseFormSubmitOptions<T> {
  url: string;
  method?: "POST" | "PATCH" | "PUT" | "DELETE";
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: T) => void;
  redirect?: string;
  transform?: (data: unknown) => unknown;
}

export function useFormSubmit<T = unknown>(options: UseFormSubmitOptions<T>) {
  const {
    url,
    method = "POST",
    successMessage = "Guardado correctamente",
    errorMessage = "Error al guardar",
    onSuccess,
    redirect: redirectTo,
    transform,
  } = options;

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(
    async (data: unknown) => {
      setIsSubmitting(true);
      try {
        const body = transform ? transform(data) : data;

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: errorMessage }));
          throw new Error(err.error || errorMessage);
        }

        const result = await res.json() as T;
        toast.success(successMessage);

        if (onSuccess) onSuccess(result);
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.refresh();
        }

        return result;
      } catch (error) {
        const msg = error instanceof Error ? error.message : errorMessage;
        toast.error(msg);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [url, method, successMessage, errorMessage, onSuccess, redirectTo, transform, router]
  );

  return { submit, isSubmitting };
}
