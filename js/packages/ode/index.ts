import { writeFile } from "fs/promises";
import { join } from "path";

import { euler, rungeKutta4 as rk4, YVars } from "./ode.js";

const OUTPUT_PATH = "./.data";
// Solve exponential decay with euler method
(async () => {
  const eqs = [(_t: number, y: number) => -y],
    y0: YVars<(typeof eqs)[0]> = [1],
    tEnd = 4,
    steps = 200;
  const { t, y } = euler(eqs, y0, tEnd, steps);

  // transform to csv string
  let csvString = `
# Exponential decay 
# 
# Method: Forward euler
#   start: t = 0
#   end: t = ${tEnd}
#   steps: ${steps}
# Equation: y' = -y
# Initial condition: y(t = 0) = ${y0[0]}`;
  for (const [rowIndex, row] of y.entries()) {
    csvString += `${t[rowIndex]}, ${row.join(", ")}\n`;
  }
  await writeFile(
    join(OUTPUT_PATH, "./exponential_decay_euler.csv"),
    csvString,
    "utf8"
  );
})();

// Solve harmonic oscillator using fourth order runge-kutta
(async () => {
  /**
   * Equation
   * x'' = -x
   *
   * Is transformed to a system od ODEs of first order:
   * y1 = x
   * y2 = x'
   *
   * y1' = y2
   * y2' = -y1
   */
  const eqs = [
      (_t: number, _y1: number, y2: number) => y2,
      (_t: number, y1: number, _y2: number) => -y1,
    ],
    y0: YVars<(typeof eqs)[0]> = [0, 1],
    tEnd = 4,
    steps = 1_000;
  const { t, y } = rk4(eqs, y0, tEnd, steps);

  // transform to csv string
  let csvString = `
# Harmonic oscillator 
# 
# Method: Runge-Kutta (4th Order)
#   start: t = 0
#   end: t = ${tEnd}
#   steps: ${steps}
# Equation: x'' = x
# Initial conditions:
#   x(t = 0) = ${y0[0]}
#   x'(t = 0) = ${y0[1]}`;
  for (const [rowIndex, row] of y.entries()) {
    csvString += `${t[rowIndex]}, ${row.join(", ")}\n`;
  }
  await writeFile(
    join(OUTPUT_PATH, "./harmonic_oscillator_rk4.csv"),
    csvString,
    "utf8"
  );
})();

// Simulate E x B-Drift of a positively charged particle
(async () => {
  /**
   * External fields are homogenous:
   * Ex || x-axis
   * Bz || z-axis
   *
   * Equations:
   * m x'' = q Ex + q y' Bz
   * m y'' = - q x' Bx
   *
   * Scale to be dimensionless:
   * omega_c = |q| Bz / m, lambda = Ex / (Bz omega_c)
   *
   * Transform to system of first order ODEs
   * z1 = x
   * z2 = x'
   * z3 = y
   * z4 = y'
   *
   * Result:
   * z1' = z2
   * z2' = 1 + z4
   * z3' = z4
   * z4' = -z2
   */
  type Eq4 = (
    t: number,
    z1: number,
    z2: number,
    z3: number,
    z4: number
  ) => number;
  const eqs: Eq4[] = [
      (_t, _z1, z2, _z3, _z4) => z2,
      (_t, _z1, _z2, _z3, z4) => 1 + z4,
      (_t, _z1, _z2, _z3, z4) => z4,
      (_t, _z1, z2, _z3, _z4) => z2,
    ],
    y0: YVars<(typeof eqs)[0]> = [0, 1, 0, 1],
    tEnd = 4,
    steps = 40_000;
  const { t, y } = rk4(eqs, y0, tEnd, steps);

  // transform to csv string
  let csvString = `
# ExB-Drift of a particle
# 
# Method: Runge-Kutta (4th Order)
#   start: t = 0
#   end: t = ${tEnd}
#   steps: ${steps}
# Equations:
#   z1' = z2
#   z2' = 1 + z4
#   z3' = z4
#   z4' = -z2
# Initial conditions:
#   z1(t = 0) = ${y0[0]}
#   z2(t = 0) = ${y0[1]}
#   z3(t = 0) = ${y0[2]}
#   z4(t = 0) = ${y0[3]}`;
  for (const [rowIndex, row] of y.entries()) {
    csvString += `${t[rowIndex]}, ${row.join(", ")}\n`;
  }
  await writeFile(join(OUTPUT_PATH, "./E-B-drift_rk4.csv"), csvString, "utf8");
})();
