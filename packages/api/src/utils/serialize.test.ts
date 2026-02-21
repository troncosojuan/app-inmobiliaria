import { describe, it, expect } from "vitest";
import { serialize } from "./serialize";

describe("serialize", () => {
  it("preserves Dates as Date objects", () => {
    const date = new Date("2025-01-15T12:00:00Z");
    const result = serialize({ id: "1", createdAt: date });
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.createdAt).toEqual(date);
  });

  it("converts Decimal-like objects to numbers", () => {
    const decimal = { toNumber: () => 99.99 };
    const result = serialize({ id: "1", price: decimal });
    expect(result.price).toBe(99.99);
  });

  it("handles nested objects with Decimals", () => {
    const result = serialize({
      id: "1",
      plan: { name: "Pro", price: { toNumber: () => 5000 } },
    });
    expect(result.plan.price).toBe(5000);
    expect(result.plan.name).toBe("Pro");
  });

  it("handles arrays", () => {
    const result = serialize({
      id: "1",
      items: [
        { id: "a", price: { toNumber: () => 100 } },
        { id: "b", price: { toNumber: () => 200 } },
      ],
    });
    expect(result.items[0].price).toBe(100);
    expect(result.items[1].price).toBe(200);
  });

  it("preserves primitives", () => {
    const result = serialize({
      str: "hello",
      num: 42,
      bool: true,
      nil: null,
    });
    expect(result.str).toBe("hello");
    expect(result.num).toBe(42);
    expect(result.bool).toBe(true);
    expect(result.nil).toBe(null);
  });

  it("handles null and undefined", () => {
    expect(serialize(null)).toBe(null);
    expect(serialize(undefined)).toBe(undefined);
  });
});
