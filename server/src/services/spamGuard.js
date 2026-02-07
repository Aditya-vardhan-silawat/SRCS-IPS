import { Report } from "../models/Report.js";

const BLOCKED_PATTERNS = [
  "asdfasdf",
  "qwerty",
  "test test test",
  "lorem ipsum"
];

const MIN_UNIQUE_WORDS = 5;

export function isAbusiveOrGarbage(description) {
  const text = description.toLowerCase().trim();

  if (text.length < 10) return true;

  for (const pattern of BLOCKED_PATTERNS) {
    if (text.includes(pattern)) return true;
  }

  const words = text.split(/\s+/).filter(Boolean);
  const uniqueWords = new Set(words);
  if (uniqueWords.size < MIN_UNIQUE_WORDS) return true;

  return false;
}

function jaccardSimilarity(a, b) {
  const setA = new Set(a.split(/\s+/));
  const setB = new Set(b.split(/\s+/));
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

export async function findPossibleDuplicate(category, description) {
  const text = description.toLowerCase();

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const recentReports = await Report.find({
    category,
    createdAt: { $gte: since }
  }).select("description");

  let bestMatch = null;
  let bestScore = 0;

  for (const report of recentReports) {
    const sim = jaccardSimilarity(text, report.description.toLowerCase());
    if (sim > bestScore) {
      bestScore = sim;
      bestMatch = report;
    }
  }

  if (bestScore >= 0.8) {
    return bestMatch;
  }

  return null;
}
