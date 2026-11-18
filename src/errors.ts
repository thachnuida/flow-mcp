export type Code = "policy" | "rate_limited" | "busy" | "timeout" | "download" | "quote_exceeded" | "not_signed_in" | "failed";

/** Map an error message to a stable machine-readable code (substring based). */
export function classify(text: string): Code {
  const t = String(text ?? "");
  if (/policy grounds/i.test(t)) return "policy";
  if (/unusual activity/i.test(t)) return "rate_limited";
  if (/A generation is running in the Flow tab|browser has been closed/i.test(t)) return "busy";
  if (/Timed out/i.test(t)) return "timeout";
  if (/EXDEV|download|tile menu/i.test(t)) return "download";
  if (/above max_credits/i.test(t)) return "quote_exceeded";
  if (/Not signed in/i.test(t)) return "not_signed_in";
  return "failed";
}
