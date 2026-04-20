// ── Helpers ──────────────────────────────────────────────

function normalize(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // strip accents
}

/** Strip titles, suffixes, and quoted nicknames from a name */
function cleanLinkedInName(name: string): string {
  return (
    name
      // Remove quoted nicknames: Robert "Rosho" Hopp → Robert Hopp
      .replace(/[""][^""]*[""]|"[^"]*"/g, "")
      // Remove titles at start
      .replace(
        /^(dr\.?|mr\.?|mrs\.?|ms\.?|prof\.?|rev\.?|sir|dame)\s+/i,
        ""
      )
      // Remove suffixes at end
      .replace(
        /,?\s*(ph\.?d\.?|md|mba|msc|bsc|jr\.?|sr\.?|ii|iii|iv|cpa|ca|cfa|pmp|esq\.?)\.?\s*$/gi,
        ""
      )
      // Remove trailing commas and extra spaces
      .replace(/,\s*$/, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/** Check if a LinkedIn abbreviated name matches a full name.
 *  e.g., "AJ S." matches "AJ Silvers", "Sergio B." matches "Sergio Bazelli"
 */
function abbreviatedMatch(
  cleanedA: string,
  cleanedB: string
): boolean {
  const partsA = cleanedA.split(" ");
  const partsB = cleanedB.split(" ");

  // One side must have an abbreviated part (single char or char + ".")
  const isAbbrev = (p: string) => /^[a-z]\.?$/.test(p);

  // Try A abbreviated, B full
  if (
    partsA.length >= 2 &&
    partsB.length >= 2 &&
    isAbbrev(partsA[partsA.length - 1].replace(".", ""))
  ) {
    const firstA = partsA.slice(0, -1).join(" ");
    const firstB = partsB.slice(0, -1).join(" ");
    const lastInitA = partsA[partsA.length - 1].replace(".", "")[0];
    const lastInitB = partsB[partsB.length - 1][0];
    if (firstA === firstB && lastInitA === lastInitB) return true;
  }

  // Try B abbreviated, A full
  if (
    partsB.length >= 2 &&
    partsA.length >= 2 &&
    isAbbrev(partsB[partsB.length - 1].replace(".", ""))
  ) {
    const firstA = partsA.slice(0, -1).join(" ");
    const firstB = partsB.slice(0, -1).join(" ");
    const lastInitA = partsA[partsA.length - 1][0];
    const lastInitB = partsB[partsB.length - 1].replace(".", "")[0];
    if (firstA === firstB && lastInitA === lastInitB) return true;
  }

  return false;
}

/** Check if all parts of the shorter name appear in the longer name.
 *  e.g., "Luke Fernandez" matches "Luke Jason Fernandez" (subset match)
 */
function subsetPartsMatch(
  partsA: string[],
  partsB: string[]
): boolean {
  const shorter = partsA.length <= partsB.length ? partsA : partsB;
  const longer = partsA.length > partsB.length ? partsA : partsB;

  if (shorter.length < 2) return false;
  if (shorter.length === longer.length) return false; // handled by exact parts match

  const remaining = [...longer];
  for (const part of shorter) {
    const idx = remaining.indexOf(part);
    if (idx === -1) return false;
    remaining.splice(idx, 1);
  }
  return true;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ── Main matcher ─────────────────────────────────────────

export function fuzzyMatchName(
  submittedName: string,
  commenterNames: string[]
): string | null {
  const cleaned = normalize(cleanLinkedInName(submittedName));
  const cleanedParts = cleaned.split(" ").sort();

  for (const name of commenterNames) {
    const commCleaned = normalize(cleanLinkedInName(name));
    const commParts = commCleaned.split(" ").sort();

    // 1. Exact match after cleaning
    if (cleaned === commCleaned) return name;

    // 2. Parts match in any order ("John Smith" = "Smith John")
    if (
      cleanedParts.length === commParts.length &&
      cleanedParts.every((p, i) => p === commParts[i])
    ) {
      return name;
    }

    // 3. Abbreviated last name ("AJ S." = "AJ Silvers")
    if (abbreviatedMatch(cleaned, commCleaned)) return name;

    // 4. Subset parts match ("Luke Fernandez" = "Luke Jason Fernandez")
    if (subsetPartsMatch(cleanedParts, commParts)) return name;
  }

  // 5. Levenshtein distance ≤ 2 on cleaned names
  for (const name of commenterNames) {
    const commCleaned = normalize(cleanLinkedInName(name));
    if (levenshtein(cleaned, commCleaned) <= 2) return name;
  }

  return null;
}

// ── Keyword check ────────────────────────────────────────

/**
 * Check if a comment text contains the required keyword.
 * Case-insensitive, handles partial matches.
 */
export function keywordInComment(
  commentText: string,
  keyword: string
): boolean {
  if (!commentText || !keyword) return false;
  return commentText.toLowerCase().includes(keyword.toLowerCase().trim());
}
