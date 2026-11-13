import { describe, expect, it } from "vitest";
import { formatRange, formatYearMonth } from "./dates";

describe("formatYearMonth", () => {
  it("formats YYYY-MM without touching time zones", () => {
    expect(formatYearMonth("2024-03")).toBe("Mar 2024");
    expect(formatYearMonth("2019-12")).toBe("Dec 2019");
  });

  it("rejects malformed input", () => {
    expect(() => formatYearMonth("2024-13")).toThrow();
    expect(() => formatYearMonth("March 2024")).toThrow();
  });
});

describe("formatRange", () => {
  it("uses Present for open ranges", () => {
    expect(formatRange("2024-03")).toBe("Mar 2024 – Present");
    expect(formatRange("2023-02", "2024-03")).toBe("Feb 2023 – Mar 2024");
  });
});
