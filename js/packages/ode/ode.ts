import { Matrix } from "./matrix.js";

export type Equation = (t: number, ...yVars: number[]) => number;
export type YVars<Eq extends Equation> = Eq extends (
  t: number,
  ...yVars: infer Vars
) => number
  ? Vars
  : never;
export type IterationState = {
  dt: number;
  eqIndex: number;
  eqs: Equation[];
  stepIndex: number;
  tData: Float64Array;
  yData: Matrix;
};
export type Solve = (state: IterationState) => number;
export function createOdeSolver(solve: Solve) {
  return function <Eq extends Equation>(
    eqs: Eq[],
    y0: YVars<Eq>,
    tEnd: number,
    steps: number
  ) {
    const dt = tEnd / steps,
      t = new Float64Array(steps + 1),
      y = new Matrix(steps + 1, eqs.length);
    y[0].set(y0);
    const state = {
      dt,
      eqIndex: 0,
      eqs,
      stepIndex: 0,
      tData: t,
      yData: y,
    };
    for (state.stepIndex; state.stepIndex < steps; state.stepIndex++) {
      t[state.stepIndex + 1] = t[state.stepIndex] + dt;
      for (state.eqIndex = 0; state.eqIndex < eqs.length; state.eqIndex++) {
        y[state.stepIndex + 1][state.eqIndex] = solve(state);
      }
    }
    return {
      t,
      y,
    };
  };
}
export const euler = createOdeSolver(
  ({ dt, eqIndex: n, eqs, stepIndex: k, tData, yData }) => {
    const eq = eqs[n],
      t = tData[k],
      y = yData[k];
    return y[n] + dt * eq(t, ...y);
  }
);
export const rungeKutta4 = createOdeSolver(
  ({ dt, eqIndex: n, eqs, stepIndex: k, tData, yData }) => {
    const dt2 = dt / 2,
      eq = eqs[n],
      t = tData[k],
      y = yData[k];
    const k1 = eq(t, ...y);
    const k2 = eq(t + dt2, ...y.map(y => y + dt2 * k1));
    const k3 = eq(t + dt2, ...y.map(y => y + dt2 * k2));
    const k4 = eq(t + dt, ...y.map(y => y + dt * k3));
    return y[n] + (1 / 6) * (k1 + 2 * k2 + 2 * k3 + k4) * dt;
  }
);
