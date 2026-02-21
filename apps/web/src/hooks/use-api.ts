"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseApiMutationOptions<T> {
  onSuccess?: (data: T) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useApiMutation<T = unknown>(options: UseApiMutationOptions<T> = {}) {
  const {
    onSuccess,
    successMessage,
    errorMessage = "Ocurrió un error",
  } = options;

  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(
    async (url: string, init?: RequestInit): Promise<T | null> => {
      setIsLoading(true);
      try {
        const res = await fetch(url, {
          headers: { "Content-Type": "application/json" },
          ...init,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: errorMessage }));
          throw new Error(err.error || errorMessage);
        }

        const data = (await res.json()) as T;
        if (successMessage) toast.success(successMessage);
        if (onSuccess) onSuccess(data);
        return data;
      } catch (error) {
        const msg = error instanceof Error ? error.message : errorMessage;
        toast.error(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, successMessage, errorMessage],
  );

  return { mutate, isLoading };
}

interface UseApiFetchOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: () => void;
}

export function useApiFetch<T = unknown>(options: UseApiFetchOptions<T> = {}) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(
    async (url: string): Promise<T | null> => {
      setIsLoading(true);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Fetch failed");
        const result = (await res.json()) as T;
        setData(result);
        if (options.onSuccess) options.onSuccess(result);
        return result;
      } catch {
        if (options.onError) options.onError();
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [options],
  );

  return { data, isLoading, fetchData, setData };
}
