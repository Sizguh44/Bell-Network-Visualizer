/**
 * Palette shared by the graph visualizations, the Face Pair Detail card and
 * the visualization legend. Length matches `PAIR_COUNT = 4`; wraps with `%`
 * for any hypothetical future topology with more edges.
 *
 * The actual graph nodes + edges have moved to `src/data/topologies.ts`.
 */
export const PAIR_COLORS = ['#6aa7ff', '#4fb8a6', '#c596ff', '#e8a572'] as const;
