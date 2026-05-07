/**
 * Geometry Lab type surface — Faz 2 skeleton.
 *
 * The Geometry Lab is being introduced as a peer mode (`AppMode === 'lab'`)
 * alongside Explore / Learn / Challenge / Bridge. This file declares the
 * shape of the future Lab without yet shipping any real diagnostic logic:
 *
 *   • `LabPanelId` — the closed set of Lab panels the UI knows how to
 *     render. Adding a panel here means adding a corresponding placeholder
 *     under `src/features/lab/panels/` and a matching i18n entry under
 *     `lab.panels.<id>` in both locales.
 *
 *   • `ProxyKind` — the four-class honesty taxonomy formalised in the Faz 1
 *     documentation pass and in the *Constraints — Proxy honesty* rule of
 *     `CLAUDE.md`. Every diagnostic that ever ships in a Lab panel must be
 *     visibly tagged with one of these kinds via the `<ProxyBadge />`
 *     primitive in `src/features/lab/shared/ProxyBadge.tsx`.
 *
 * No runtime logic computes anything yet. Faz 3+ adds real diagnostics on
 * top of this scaffolding.
 */

/** The closed set of Geometry Lab panels. */
export type LabPanelId =
  | 'gluing'
  | 'symmetry'
  | 'effectiveGeometry'
  | 'correlations'
  | 'researchNotes'
  | 'openProblems';

/**
 * Honesty class for any Lab diagnostic. Per the Faz 1 documentation rule
 * (*Honesty / Scope* in README + *Proxy honesty* constraint in CLAUDE.md),
 * **every** Lab diagnostic must declare which of these four kinds it is.
 *
 *   • `pedagogical-proxy` — toy formula, qualitatively faithful but not a
 *     real LQG quantity. (All current legacy scores fall here.)
 *   • `conceptual-diagnostic` — qualitative read on a structural property
 *     (symmetry, homogeneity, alignment pattern). Yes / no / weak / strong,
 *     not a number to take seriously.
 *   • `curated-classification` — discrete tag chosen from a fixed,
 *     author-maintained set. Honest because the set is enumerable.
 *   • `future-calculable-observable` — a quantity that *could* be computed
 *     honestly but is currently sketched only. Flagged so the gap is
 *     visible rather than hidden.
 */
export type ProxyKind =
  | 'pedagogical-proxy'
  | 'conceptual-diagnostic'
  | 'curated-classification'
  | 'future-calculable-observable';

/**
 * Canonical ordering of Lab panels in the panel switcher. Mirrors the
 * order each panel should appear in Lab i18n + UI surfaces. Exporting it
 * as a `readonly` array so callers (UI + URL parser) share the same source
 * of truth.
 */
export const LAB_PANEL_IDS: readonly LabPanelId[] = [
  'gluing',
  'symmetry',
  'effectiveGeometry',
  'correlations',
  'researchNotes',
  'openProblems',
];

/** Default panel surfaced when the Lab opens with no `labPanel` cue. */
export const FIRST_LAB_PANEL_ID: LabPanelId = 'gluing';

/** Canonical ordering of proxy kinds for any UI listing. */
export const PROXY_KINDS: readonly ProxyKind[] = [
  'pedagogical-proxy',
  'conceptual-diagnostic',
  'curated-classification',
  'future-calculable-observable',
];

/**
 * Static metadata shared by every Lab panel — the author-declared honesty
 * class for the diagnostics that panel will eventually carry. Faz 2 only
 * surfaces these as sample badges next to each placeholder; Faz 3+ will
 * use them to tag real outputs.
 */
export const LAB_PANEL_PROXY_KIND: Readonly<Record<LabPanelId, ProxyKind>> = {
  gluing: 'pedagogical-proxy',
  symmetry: 'conceptual-diagnostic',
  effectiveGeometry: 'pedagogical-proxy',
  correlations: 'pedagogical-proxy',
  researchNotes: 'curated-classification',
  openProblems: 'future-calculable-observable',
};
