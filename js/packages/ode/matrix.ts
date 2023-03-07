export type Shape2d = {
  columns: number;
  rows: number;
};
export class Matrix {
  shape: Shape2d;
  vector: Float64Array;
  [rowIndex: number]: Float64Array;
  constructor(rows: number, columns: number) {
    this.shape = { rows, columns };
    this.vector = new Float64Array(rows * columns);
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      this[rowIndex] = this.vector.subarray(
        rowIndex * columns,
        (rowIndex + 1) * columns
      );
    }
  }
  [Symbol.iterator](): Iterator<Float64Array, undefined> {
    let rowIndex = 0;
    const next = () => {
      if (rowIndex === this.shape.rows) {
        return { done: true } as { done: true; value?: undefined };
      }
      return { done: false as const, value: this[rowIndex++] };
    };
    return {
      next,
    };
  }
  add(matrix: Matrix): this {
    if (
      this.shape.columns !== matrix.shape.columns ||
      this.shape.rows !== matrix.shape.rows
    ) {
      throw new Error(
        `Dimensions of matrices do not match, got (${this.shape.rows}, ${this.shape.columns}) and (${matrix.shape.rows}, ${matrix.shape.columns})`
      );
    }
    for (let k = 0; k < this.vector.length; k++) {
      this.vector[k] += matrix.vector[k];
    }
    return this;
  }
  *entries(): Generator<[number, Float64Array]> {
    for (let rowIndex = 0; rowIndex < this.shape.rows; rowIndex++) {
      yield [rowIndex, this[rowIndex]];
    }
  }
}
