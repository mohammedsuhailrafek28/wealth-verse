import { applySynonyms } from "./synonymDictionary";

const SPELLING_FIXES: Record<string, string> = {
  investng: "investing",
  investmnt: "investment",
  emerjency: "emergency",
  finacial: "financial",
  helth: "health",
  scor: "score",
  recomendation: "recommendation",
  recomendations: "recommendations",
  expence: "expense",
  expences: "expenses",
};

export function normalizeQuestion(question: string) {
  const compact = question
    .toLowerCase()
    .replace(/[“”]/g, "\"")
    .replace(/[’]/g, "'")
    .replace(/[^\w\s₹.,?%-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const phraseSynonymFixed = applySynonyms(compact, { phrasesOnly: true });

  const spellingFixed = phraseSynonymFixed.question
    .split(" ")
    .map((word) => SPELLING_FIXES[word] ?? word)
    .join(" ");

  const finalNormalized = applySynonyms(spellingFixed);

  return {
    question: finalNormalized.question,
    synonymsMatched: Array.from(
      new Set([
        ...phraseSynonymFixed.synonymsMatched,
        ...finalNormalized.synonymsMatched,
      ])
    ),
  };
}
