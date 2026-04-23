# Release Notes

## v0.5 — First public-ready cut

The first version packaged for public sharing. Everything runs in the browser — no
backend, no accounts, no tracking.

### What this release contains

**Visualisation and interaction**

- Two shippable spin-network topologies selectable from the sidebar: **Dipole** (2 nodes,
  4 parallel edges; automorphism group S₂ × S₄) and **Cycle-4** (4 nodes on a ring, 4
  edges; automorphism group D₄). Both carry exactly four face pairs so every state family
  runs unchanged on either.
- Five deterministic state families (*Uncorrelated*, *Weakly aligned*, *Bell-like
  symmetric*, *Frustrated*, *Edge-biased*), each defined by per-pair strength offsets and
  mismatch coefficients.
- Five observable lenses (*Alignment*, *Mismatch*, *Gluing*, *Correlation*, *Uniformity*)
  that re-read the same underlying state without moving the canvas.
- Per-pair inspection card (hover or click a pair) with local strength, mismatch angle,
  alignment score and gluing proxy; the active lens highlights the relevant row and the
  canvas emphasis redistributes live.

**Guided layer**

- **8 lessons** (Learn mode) with narrative, applied setup, checkpoint and per-option
  feedback; inline concept links jump straight into the Atlas.
- **10 challenges** (Challenge mode) spanning prediction, comparison, diagnosis and
  conceptual tasks across intro / core / advanced levels.
- **7 bridge lessons** (Bridge mode) connecting local gluing to graph symmetry and,
  honestly, to the cosmological questions this demo does *not* answer.
- **17 Concept Atlas entries**, each split into *Why it matters*, *In this app* and *In
  full theory* sections with explicit *Common confusion* callouts where appropriate.
- A **Content Library** drawer listing every piece of authored content with tabs and
  search.

**Usability**

- Session persistence via `localStorage` (key `bell-network-visualizer:v1`): mode, active
  lesson / challenge / bridge, checkpoint progress, the four knob values, selected pair,
  and onboarding status.
- URL-hash configuration sharing — any specific setup can be sent as a plain link.
- Dismissible *Start here* card on first run, with a "How to use" button in the header
  that reopens it.
- Cross-mode "Next step" hint after a Learn checkpoint is revealed, pointing at a
  concept-matched challenge and / or bridge lesson.
- Atlas detail view shows both author-suggested content **and** a *Where else this
  appears* section built from the inverse mention index.

### Who this is for

- Physics and mathematical-physics students with a first exposure to loop quantum gravity
  who want tactile intuition for how entanglement and shared-face geometry relate.
- Lecturers and seminar leaders who want a shareable, link-addressable toy for
  demonstrations.
- Content authors who want to extend the lesson / challenge / bridge sets without leaving
  TypeScript strict — the single `contentIndex` API and the id-union cross-link types make
  new content a data change.

### What this is **not**

- Not a real LQG calculation. No intertwiner-space correlators, Hilbert-space projections
  or Regge matching conditions are computed.
- Not a graph editor. The two shippable topologies are hard-coded; new topologies are a
  registry addition, not a UI feature.
- Not a cosmological model. The *Bridge* module exists to frame — not cross — the gap to
  full-theory claims.

### Known limitations

- Layout is tuned for desktop viewports; mobile is responsive but not optimised.
- Snapshot / export is not wired up; the `data-export-ref="visualization-panel"` hook is
  inert.
- Automorphism action is discussed but not interactive — a node swap or rotation cannot
  yet be applied as a canvas gesture.

### Tech snapshot

- React 18 + Vite 5 + TypeScript 5 (strict · `noUnusedLocals` · `noUnusedParameters`).
- Runtime dependencies: React and ReactDOM only. No UI kit, no styling library, no
  analytics.
- Deploys to GitHub Pages via `.github/workflows/deploy.yml`; `vite.config.ts` rewrites
  `base` to `/Bell-Network-Visualizer/` in production — rename the `REPO_NAME` constant if
  you fork under a different slug.
