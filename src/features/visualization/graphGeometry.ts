export type Point = { x: number; y: number };

/**
 * Math-convention unit vector for the given angle in degrees. SVG y-axis
 * points down, so we flip the sine so a positive angle reads as "up" on the
 * canvas (consistent with how the dipole fan and the cycle layout are
 * designed).
 */
export function angleToUnit(degrees: number): Point {
  const rad = (degrees * Math.PI) / 180;
  return { x: Math.cos(rad), y: -Math.sin(rad) };
}

export interface ArrowGeometry {
  /** Line segment from the anchor to the head base. */
  line: { x1: number; y1: number; x2: number; y2: number };
  /** SVG path for the arrow head triangle. */
  head: string;
  /** Exact tip point — useful for labels positioned between arrow tips. */
  tip: Point;
}

/**
 * Build the line+head primitives for a single arrow starting at `from`,
 * pointing in the given unit direction, over `length` pixels total.
 * Head length and width are fixed so the visual weight stays comparable
 * across topologies.
 */
export function arrowGeometry(
  from: Point,
  direction: Point,
  length: number,
): ArrowGeometry {
  const tip = {
    x: from.x + direction.x * length,
    y: from.y + direction.y * length,
  };
  const px = -direction.y;
  const py = direction.x;
  const headLen = 9;
  const headHalfWidth = 4.5;
  const baseX = tip.x - direction.x * headLen;
  const baseY = tip.y - direction.y * headLen;
  const leftX = baseX + px * headHalfWidth;
  const leftY = baseY + py * headHalfWidth;
  const rightX = baseX - px * headHalfWidth;
  const rightY = baseY - py * headHalfWidth;
  return {
    line: { x1: from.x, y1: from.y, x2: baseX, y2: baseY },
    head: `M ${tip.x},${tip.y} L ${leftX},${leftY} L ${rightX},${rightY} Z`,
    tip,
  };
}
