/** Today as yyyy-MM-dd, the format the API and date inputs use. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
