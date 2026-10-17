const PREPOSITIONS = new Set([
  "in", "on", "at", "with", "from", "to", "for", "by", "after", "before",
  "under", "over", "through", "during", "behind", "beside", "into", "onto",
]);

function cleanWord(word = "") {
  return word
    .toLowerCase()
    .replace(/[’‘`]/g, "'")                           // normalise curly apostrophes
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "") // strip edge punctuation, *, quotes
    .replace(/'(s|d|ll|re|ve|m)$/, "");               // bob's, he'd, she'll, I'm, they're, we've
}

function isExpletive(start, second) {
  return (start === "it" || start === "there") &&
    (second === "was" || second === "were" || second === "would" || second === "wouldn't");
}

function isPronoun(start) {
  return ["i", "he", "she", "they", "it", "we", "you"].includes(start);
}

// "Three Seagrass, Seagrass, Mrs. Day" -> [["three","seagrass"], ["seagrass"], ["mrs","day"]]
function parseNames(str) {
  return str
    .split(/[,\n]+/)
    .map((raw) => raw.trim().split(/\s+/).map(cleanWord).filter(Boolean))
    .filter((words) => words.length > 0);
}

// Pulls abbreviations like "Mrs", "Dr" out of names the user typed ("Mrs. Day")
function findAbbreviations(...nameStrings) {
  const found = new Set();
  for (const str of nameStrings) {
    for (const m of str.matchAll(/\p{L}+(?=\.)/gu)) found.add(m[0]);
  }
  return [...found];
}

// Does the sentence's opening words match any name as a prefix?
function matchesName(leadWords, names) {
  return names.some((name) => name.every((w, i) => leadWords[i] === w));
}

function splitSentences(text, abbreviations = []) {
  // Don't split right after "Mrs." / "Dr." etc., if the user's names contained them
  const noSplitAfter = abbreviations.length
    ? `(?<!\\b(?:${abbreviations.join("|")})\\.)`
    : "";

  const splitter = new RegExp(
    `(?<=[.!?]["'”’»›>)\\]]*)${noSplitAfter}\\s+(?=[—–\\-"'“‘«‹<(\\[]*\\s*\\p{Lu})|\\n+\\s*(?=[—–])`,
    "u"
  );

  return text
    .split(splitter)
    .map((s) => s.trim())
    .filter((s) => /[\p{L}\p{N}]/u.test(s)); // must contain at least one letter/digit
}

function countSentenceStarts(sentences, povNames, charNames) {
  const counts = { POV: 0, chars: 0, pronoun: 0, expletive: 0, preposition: 0, other: 0 };

  for (const s of sentences) {
    const lead = s
      .replace(/^[^\p{L}\p{N}]+/u, "") // drop leading symbols
      .split(/\s+/)
      .slice(0, 3)                     // raise if your names are longer than 3 words
      .map(cleanWord);
    const start = lead[0];
    const second = lead[1];
    if (!start) continue;

    if (matchesName(lead, povNames)) {
      counts.POV++;
    } else if (matchesName(lead, charNames)) {
      counts.chars++;
    } else if (isExpletive(start, second)) {
      counts.expletive++;
    } else if (isPronoun(start)) {
      counts.pronoun++;
    } else if (PREPOSITIONS.has(start)) {
      counts.preposition++;
    } else {
      counts.other++;
    }
  }
  return counts;
}

export function processTextCount({ text, POV, chars }) {
  const sentences = splitSentences(text, findAbbreviations(POV, chars));
  const povNames = parseNames(POV);
  const charNames = parseNames(chars);

  return {
    wordCount: (text.match(/\S+/g) ?? []).length,
    sentenceCount: sentences.length,
    sentenceStarts: countSentenceStarts(sentences, povNames, charNames),
  };
}
