export function mean(data: number[]): number {
  let sum = 0;
  for (const x of data) sum += x;
  return data.length > 0 ? sum / data.length : NaN;
}
export function std(data: number[], meanOfData?: number): number {
  if (meanOfData === undefined) meanOfData = mean(data);
  let sigma = 0;
  for (const x of data) sigma += (x - meanOfData) ** 2;
  return data.length > 1 ? Math.sqrt((1 / (data.length - 1)) * sigma) : NaN;
}
export function median(data: number[]): number {
  let center: number;
  if (data.length % 2 === 1) {
    center = Math.floor(data.length / 2);
    return data[center];
  }
  center = data.length / 2 - 1;
  return (data[center] + data[center + 1]) / 2;
}
