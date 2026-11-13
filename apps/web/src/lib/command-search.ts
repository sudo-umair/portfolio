/** Anything the command palette can list. */
export type CommandItem = {
  id: string;
  group: string;
  label: string;
  /** Secondary text shown on the right. */
  hint?: string;
  /** Extra words that should match but aren't shown (stack, tagline, synonyms). */
  keywords?: readonly string[];
};

/**
 * Filter and rank items for a query. Every whitespace-separated token must
 * appear in the label or keywords. Label matches outrank keyword matches,
 * and earlier/word-start matches outrank mid-word ones. An empty query keeps
 * the original order. Ties keep the original order too (stable sort).
 */
export function searchCommands<T extends CommandItem>(items: readonly T[], query: string): T[] {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [...items];

  const scored: { item: T; score: number; index: number }[] = [];
  items.forEach((item, index) => {
    const label = item.label.toLowerCase();
    const keywords = (item.keywords ?? []).join(" ").toLowerCase();
    let score = 0;
    for (const token of tokens) {
      const tokenScore = scoreToken(label, keywords, token);
      if (tokenScore === 0) return; // every token must match
      score += tokenScore;
    }
    scored.push({ item, score, index });
  });

  return scored.sort((a, b) => b.score - a.score || a.index - b.index).map((entry) => entry.item);
}

function scoreToken(label: string, keywords: string, token: string): number {
  if (label.startsWith(token)) return 4;
  if (startsWord(label, token)) return 3;
  if (label.includes(token)) return 2;
  if (startsWord(keywords, token)) return 1.5;
  if (keywords.includes(token)) return 1;
  return 0;
}

function startsWord(text: string, token: string): boolean {
  let from = text.indexOf(token);
  while (from !== -1) {
    if (from === 0 || /[^a-z0-9]/.test(text[from - 1]!)) return true;
    from = text.indexOf(token, from + 1);
  }
  return false;
}
