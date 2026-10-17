import { useState } from "react";
import { BarChart } from "@mui/x-charts";
import { Chip, Stack } from "@mui/material";
import { books, categories, average } from "./stats/BooksStats";

const AVERAGE = "Average";

function Stats({ wordCount, sentenceCount, sentenceStarts }) {
  const [selected, setSelected] = useState([AVERAGE]);

  const percentage = (number) =>
    sentenceCount ? Number(((100 * number) / sentenceCount).toFixed(2)) : 0;

  const yours = categories.reduce((acc, { key }) => {
    acc[key] = percentage(sentenceStarts[key]);
    return acc;
  }, {});

  // Everything that can be toggled, in display order
  const options = [AVERAGE, ...books.map((b) => b.title)];

  const toggle = (name) =>
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );

  // One row per category, one column per series
  const dataset = categories.map(({ key, label }) => {
    const row = { category: label, "Your text": yours[key], [AVERAGE]: average[key] };
    books.forEach((b) => (row[b.title] = b[key]));
    return row;
  });

  // Your text is always first; then only the selected options
  const series = ["Your text", ...options.filter((o) => selected.includes(o))].map(
    (name) => ({
      dataKey: name,
      label: name,
      valueFormatter: (v) => `${v}%`,
    })
  );

  return (
    <div>
      <h3>Stats</h3>
      <p>Words: {wordCount}</p>
      <p>Sentences: {sentenceCount}</p>

      <h4>Sentence starts</h4>
      <ul>
        {categories.map(({ key, label }) => (
          <li key={key}>{label}: {yours[key]}%</li>
        ))}
      </ul>

      <h4>Compare with</h4>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mb: 2 }}>
        {options.map((name) => (
          <Chip
            key={name}
            label={name}
            clickable
            color={selected.includes(name) ? "primary" : "default"}
            variant={selected.includes(name) ? "filled" : "outlined"}
            onClick={() => toggle(name)}
          />
        ))}
      </Stack>

      <BarChart
        dataset={dataset}
        xAxis={[{ scaleType: "band", dataKey: "category" }]}
        yAxis={[{ label: "% of sentences" }]}
        series={series}
        height={400}
      />
    </div>
  );
}

export default Stats;
