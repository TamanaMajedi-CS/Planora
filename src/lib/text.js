
export function stripEnglishPrefixes(s, lang) {
  if (typeof s !== "string") return s;
  const prefixes = ["Quick wins:", "Needs:", "Find them on:"];
  if (lang !== "English") {
    for (const p of prefixes) {
      if (s.startsWith(p)) return s.slice(p.length).trim();
    }
  }
  return s;
}
