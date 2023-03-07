import { benchIt, tabelizeBenchmarks } from "./benchmark.js";

// calculate a list of squares and compare map and for-loops
const RUNS = 200;

const data = [...Array(500_000).keys()];
const with_map = () => {
  const output = data.map(x => x ** 2);
};
const with_for_of = () => {
  const output: number[] = [];
  for (const x of data) output.push(x);
};
const with_for = () => {
  const output: number[] = new Array(data.length);
  for (let k = 0; k < data.length; k++) {
    output[k] = data[k] ** 2;
  }
};
const benchmarks = [with_map, with_for_of, with_for].map(fn =>
  benchIt(fn, RUNS)
);
console.log(`Runs = ${RUNS}`);
console.log(tabelizeBenchmarks(benchmarks));
