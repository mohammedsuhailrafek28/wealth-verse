export type SynonymRule = {
  canonical: string;
  variants: string[];
};

export const SYNONYM_DICTIONARY: SynonymRule[] = [
  { canonical: "reduce spending", variants: ["save money", "spend less", "cut costs", "lower expenses"] },
  { canonical: "emergency fund", variants: ["rainy day fund", "rainy-day fund", "emerjency fund", "emergency savings"] },
  { canonical: "investment", variants: ["invest", "investing", "investng", "sip", "mutual fund"] },
  { canonical: "income", variants: ["salary", "paycheck", "earnings"] },
  { canonical: "spending", variants: ["expense", "expenses", "spend", "costs"] },
  { canonical: "financial health score", variants: ["health score", "score", "wealth score"] },
  { canonical: "goal", variants: ["target", "milestone", "objective"] },
  { canonical: "risk", variants: ["unsafe", "danger", "safe", "conservative"] },
  { canonical: "notification", variants: ["notifications", "alerts inbox", "unread"] },
  { canonical: "event history", variants: ["activity", "timeline", "history", "what happened"] },
  { canonical: "forecast", variants: ["prediction", "project", "projection", "what will happen"] },
];

export function applySynonyms(
  question: string,
  options: { phrasesOnly?: boolean } = {}
) {
  let normalized = question;
  const matched: string[] = [];

  for (const rule of SYNONYM_DICTIONARY) {
    for (const variant of rule.variants) {
      if (options.phrasesOnly && !/[\s-]/.test(variant)) {
        continue;
      }
      const pattern = new RegExp(`\\b${variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      if (pattern.test(normalized)) {
        normalized = normalized.replace(pattern, rule.canonical);
        matched.push(`${variant}->${rule.canonical}`);
      }
    }
  }

  return {
    question: normalized,
    synonymsMatched: Array.from(new Set(matched)),
  };
}
