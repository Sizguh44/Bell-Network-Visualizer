/**
 * Phase 9A — minimal complex-number primitives.
 *
 * Pure TypeScript, no dependencies. Used by the rest of the
 * quantum-engine for state vectors, density matrices, partial traces
 * and entropy. Deliberately small: the engine never needs a full
 * complex-number library, and a focused surface keeps the engine
 * easy to reason about and verify.
 *
 * NOTE: Phase 9A is a **minimal qubit model**. It is not an SU(2)
 * intertwiner-space engine, not an LQG Bell-network calculation.
 * Future phases (Phase 9C+) replace qubit Hilbert factors with SU(2)
 * representation spaces; the complex layer stays unchanged.
 */

/**
 * A complex number stored as a struct of two real components. Plain
 * objects are deliberate: they're easy to log, easy to compare in
 * tests, and stay JSON-serialisable. The runtime cost over typed
 * arrays is negligible for the small Hilbert spaces this engine
 * exercises (typical dim ≤ 8 for Phase 9A).
 */
export interface Complex {
  re: number;
  im: number;
}

/** The complex zero, 0 + 0i. */
export const ZERO: Complex = { re: 0, im: 0 };

/** The complex one, 1 + 0i. */
export const ONE: Complex = { re: 1, im: 0 };

/** Construct a complex number. `im` defaults to 0 for convenience. */
export function complex(re: number, im = 0): Complex {
  return { re, im };
}

/** a + b. */
export function add(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

/** a − b. */
export function sub(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im };
}

/** a · b. */
export function mul(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

/** Complex conjugate ā = re − im·i. */
export function conj(a: Complex): Complex {
  return { re: a.re, im: -a.im };
}

/** |a|² = re² + im². */
export function abs2(a: Complex): number {
  return a.re * a.re + a.im * a.im;
}

/** Multiply a complex number by a real scalar. */
export function scale(a: Complex, s: number): Complex {
  return { re: a.re * s, im: a.im * s };
}

/**
 * Approximate equality with a tolerance. Used everywhere assertions
 * compare floating-point complex numbers (state amplitudes, partial-
 * trace outputs, ρ vs ρ†). Default `eps = 1e-10` matches the precision
 * we expect from the small-Hilbert-space arithmetic the engine does.
 */
export function approxEqualComplex(a: Complex, b: Complex, eps = 1e-10): boolean {
  return Math.abs(a.re - b.re) < eps && Math.abs(a.im - b.im) < eps;
}
