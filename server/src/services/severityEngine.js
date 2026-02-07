const BASE_SCORES = {
  Academic: 5,
  "Staff Behavior": 10,
  Facilities: 3,
  "Mental Pressure": 20,
  Harassment: 30,
  Other: 5
};

const KEYWORD_RULES = [
  {
    words: ["harass", "bully", "abuse", "threaten", "blackmail"],
    score: 40,
    reason: "Harassment or abuse related terms"
  },
  {
    words: ["hit", "violence", "physical", "attack"],
    score: 40,
    reason: "Physical violence related terms"
  },
  {
    words: ["suicide", "kill myself", "self harm", "self-harm", "end my life"],
    score: 60,
    reason: "Self-harm or suicide indicators"
  },
  {
    words: ["crying", "panic", "depressed", "anxious", "stress", "pressure"],
    score: 20,
    reason: "Strong emotional or mental pressure indicators"
  },
  {
    words: ["unfair", "bias", "discrimination", "partiality"],
    score: 15,
    reason: "Unfair treatment or discrimination"
  },
  {
    words: ["dirty", "unclean", "smell", "stink", "toilet", "washroom"],
    score: 5,
    reason: "Unhygienic facilities"
  },
  {
    words: ["water", "electricity", "fan", "ac", "air conditioner", "light"],
    score: 5,
    reason: "Basic facility issues"
  },
  {
    words: ["shout", "insult", "humiliate", "rude"],
    score: 15,
    reason: "Rude or humiliating behavior"
  }
];

function mapScoreToSeverity(score) {
  if (score >= 80) return "CRITICAL";
  if (score >= 50) return "HIGH";
  if (score >= 25) return "MEDIUM";
  return "LOW";
}

export function evaluateSeverity(category, description) {
  const text = description.toLowerCase();
  let score = BASE_SCORES[category] || 5;
  const reasons = [`Base score for category: ${category} = ${score}`];

  for (const rule of KEYWORD_RULES) {
    const matchedWords = rule.words.filter((w) => text.includes(w));
    if (matchedWords.length > 0) {
      score += rule.score;
      reasons.push(`${rule.reason} (+${rule.score}) via: ${matchedWords.join(", ")}`);
    }
  }

  const lengthBonus = Math.min(description.length / 200, 3);
  if (lengthBonus > 0) {
    score += lengthBonus;
    reasons.push(`Description length bonus (+${lengthBonus.toFixed(1)})`);
  }

  const severity = mapScoreToSeverity(score);

  return {
    severity,
    score: Math.round(score),
    reasons
  };
}
