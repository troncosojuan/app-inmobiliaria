/**
 * Recursively converts Prisma Decimal objects to plain numbers
 * so they can be safely passed from Server Components to Client Components.
 */
export function serialize<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (obj instanceof Date) return obj as T;

  if (typeof obj === "object" && "toNumber" in obj && typeof (obj as { toNumber: unknown }).toNumber === "function") {
    return (obj as { toNumber: () => number }).toNumber() as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(serialize) as T;
  }

  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = serialize(value);
    }
    return result as T;
  }

  return obj;
}
