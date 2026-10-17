export const books = [
  { title: "Beloved",
    POV: 1.54, chars: 1.10, pronoun: 21.93, expletive: 1.10, preposition: 2.41, other: 71.93 },
  { title: "The Secret History",
    POV: 17.00, chars: 3.52, pronoun: 13.32, expletive: 2.14, preposition: 3.83, other: 60.18 },
  { title: "A Memory Called Empire",
    POV: 9.30, chars: 3.38, pronoun: 26.20, expletive: 3.94, preposition: 3.94, other: 53.24 },
  { title: "To Kill a Mockingbird",
    POV: 7.45, chars: 16.86, pronoun: 14.90, expletive: 1.57, preposition: 3.14, other: 56.08 },
];

export const categories = [
  { key: "POV", label: "POV Character" },
  { key: "chars", label: "Other Characters" },
  { key: "pronoun", label: "Pronouns" },
  { key: "expletive", label: 'Expletives ("It was/There was")' },
  { key: "preposition", label: "Prepositions" },
  { key: "other", label: "Other" },
];

export const average = categories.reduce((avg, { key }) => {
  avg[key] = Number(
    (books.reduce((sum, b) => sum + b[key], 0) / books.length).toFixed(2)
  );
  return avg;
}, {});
