const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * "2024-03" -> "Mar 2024". Parsed by hand rather than with Date or Intl, so
 * the output never depends on the server's time zone or locale.
 */
export function formatYearMonth(value: string): string {
  const [year, month] = value.split("-");
  const name = MONTHS[Number(month) - 1];
  if (!year || !name) throw new Error(`Expected YYYY-MM, got "${value}"`);
  return `${name} ${year}`;
}

/** "Mar 2024 – Present", or "Feb 2023 – Mar 2024". */
export function formatRange(start: string, end?: string): string {
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : "Present"}`;
}
