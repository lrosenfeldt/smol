import { mean, median, std } from "./statistics.js";

export type Benchmark = {
  duration: number;
  endTime: number;
  mean: number;
  median: number;
  results: number[];
  runs: number;
  startTime: number;
  std: number;
  meta: {
    fn: () => void;
    name: string;
  };
};
export function benchIt(fn: () => void, runs = 100): Benchmark {
  const results: number[] = [];
  let t0 = 0,
    t1 = 0,
    startTime = 0,
    endTime = 0;
  startTime = performance.now();
  for (let k = 0; k < runs; k++) {
    t0 = performance.now();
    fn();
    t1 = performance.now();
    results.push(t1 - t0);
  }
  endTime = performance.now();
  const meanTime = mean(results),
    stdTime = std(results, meanTime),
    medianTime = median(results);
  return {
    duration: endTime - startTime,
    endTime: endTime + performance.timeOrigin,
    mean: meanTime,
    median: medianTime,
    results,
    runs,
    startTime: startTime + performance.timeOrigin,
    std: stdTime,
    meta: {
      fn,
      name: fn.name,
    },
  };
}
export function tabelizeBenchmarks(benchmarks: Benchmark[]): string {
  const rows: Array<[string, string, string]> = [
    ["Name", "Result (ms)", "Duration (ms)"],
  ];
  for (const {
    meta: { name },
    duration,
    mean,
    std,
  } of benchmarks) {
    // insert columns
    rows.push([
      name,
      `${mean.toFixed(4)} +- ${std.toFixed(4)}`,
      duration.toFixed(4),
    ]);
  }
  // find widest column
  const contentWidth: [number, number, number] = [0, 0, 0];
  for (const row of rows) {
    for (const [index, currentWidth] of contentWidth.entries()) {
      contentWidth[index] = Math.max(currentWidth, row[index].length);
    }
  }
  const formattedRows = rows.map(row =>
    row
      .map((columnContent, index) => {
        const whitespace = contentWidth[index] - columnContent.length;
        const suffix = index === row.length - 1 ? " |" : " ";
        return "| " + columnContent + " ".repeat(whitespace) + suffix;
      })
      .join(" ")
  );
  // insert table separator
  const table = [
    formattedRows[0],
    formattedRows[0].replaceAll(/[^|]/g, "-"),
    ...formattedRows.splice(1),
  ].join("\n");
  return table;
}
