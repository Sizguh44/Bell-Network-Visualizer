# Release Notes

## Academic discussion readiness — Bell-network effective geometry framing (2026-04-25)

A short polish pass over the documentation set, sharpening how the
project presents itself to a working LQG / Bell-network /
effective-geometry researcher (the immediate audience is Bekir Hoca's
research line). **No engine, UI, or numerical-output changes** —
engine selftests stay at 84/84, all UI bytes byte-identical to the
preceding milestone.

What changed:

- **README.md** and **README.tr.md** — the *Academic framing*
  callout is rewritten to state explicitly that the project is *a
  layered research sandbox*, not a complete LQG calculation, with
  the four epistemic registers (pedagogical proxy → minimal qubit
  quantum-information → single-node SU(2) intertwiner → restricted
  spin-1/2 projected Bell-network state) named on the surface.
  Bell-network states, effective geometry, dipole graph, cycle-4
  graph, SU(2) invariant subspace / intertwiner projector, projected
  spin-1/2 Bell-network state, the proxy-vs-exact-observable
  distinction, and the roadmap-only status of area / volume /
  dihedral-angle operators all surface in the opening callout.
- **`docs/academic-demo-flow.md`** — new *Suggested framing for a
  research discussion* section sized for a research audience, with
  three discussion questions on the **Bell-network → effective
  geometry** axis: (a) area / volume vs dihedral / Regge sequencing;
  (b) dipole / cycle-4 truncation suitability for the cosmological
  sector; (c) which graph-level observable best connects the
  projected state to effective geometry.
- **`docs/future-research-roadmap.md`** — new *Bekir Hoca discussion
  candidates* section with five discussion-ready bullets: area
  operator, volume operator on intertwiner space, dihedral-angle /
  twisted-vs-Regge, semiclassical coherent spin-network extension,
  and the relation to homogeneous graph truncations / cosmology.
- **`docs/honesty-classes.md`** — Section D ("the boundary") rewritten
  as five academic claim-envelope statements: *exact within minimal
  qubit model* / *exact within SU(2) single-node model* / *exact
  within restricted spin-1/2 projected Bell-network construction* /
  *not yet an LQG geometric observable* / *not yet a spin-foam or
  cosmological dynamics model*. Each line names what the engine
  *can* claim and what it *cannot*.
- **CLAUDE.md** — changelog entry recording the documentation-only
  polish.

The release is purely an academic packaging refinement — the engine
state is the same, the UI is the same, the numerical outputs are the
same. What changed is *how* the project narrates its own claim
envelope to a research audience.

## Academic Demo Milestone — Mega Phase 9F (2026-04-25)

The engine has reached a coherent stopping point and is now packaged for
academic presentation. **No engine, UI, or numerical-output changes** —
this milestone is documentation-only. What the project now ships:

**Four exact engine layers** (84/84 selftests clean):

- **Tier 1** — pedagogical proxy diagnostics on the canvas + Geometry
  Lab.
- **Tier 2** — minimal qubit quantum-information layer (density
  matrices, partial traces, von Neumann entropy via Jacobi
  eigendecomposition, exact pairwise mutual information; per-qubit
  entropy heatmap and exact MI heatmap visible in Correlation Summary).
- **Tier 3** — single-node SU(2) representation theory: spin-`j`
  matrices and Casimir, tensor-product spin spaces, total-`J²`
  eigendecomposition, SU(2)-invariant subspace projector for any
  spin tuple at one node. Surfaced as the **Single-node SU(2)
  Intertwiner Sandbox** with four textbook examples.
- **Tier 4** — spin-1/2 projected Bell-network states for the
  two-node single-edge graph (minimal prototype), dipole, and
  cycle-4 graphs. Construction:
  `|Ψ_Γ⟩ = (⊗_node P_inv) · (⊗_edge |S⟩) / norm`. Surfaced as the
  **Bell-network Graph Sandbox** with all three canonical graphs
  marked `available`.

**Documentation layer added** in `docs/`:

- [`docs/academic-demo-flow.md`](./docs/academic-demo-flow.md) — 5–7
  minute Geometry Lab walkthrough mapped to the four tiers, with
  discussion questions for the audience.
- [`docs/honesty-classes.md`](./docs/honesty-classes.md) — canonical
  reference for which register is allowed to claim what (four
  ProxyBadge kinds, three engine honesty literals, three UI model
  chips, and an explicit "what you cannot say" boundary).
- [`docs/future-research-roadmap.md`](./docs/future-research-roadmap.md)
  — three-horizon plan: near-term (area / volume / dihedral on the
  projected state), mid-term (arbitrary-spin Wigner-3j /
  twisted-vs-Regge), long-term (spin-foam vertex amplitude /
  cosmology / refinement / coherent intertwiners).

**README.md** and **README.tr.md** gained a parallel
*Academic Scope: Bell-Network Geometry Lab* section listing the four
tiers, an exact / proxy / future-LQG comparison table, and links to
the three companion docs.

**No engine code, UI logic, or i18n key changes.** Engine selftest
remains 84/84. UI numeric outputs are byte-identical to Mega Phase
9E-4. The release is purely an academic packaging step — making the
existing engine state demonstrable to a research audience without
inflating any claim envelope.

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
