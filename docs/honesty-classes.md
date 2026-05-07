# Honesty Classes and Epistemic Registers

The Bell-Network Geometry Lab ships numerical and structural outputs in
**four distinct registers**, each with a fixed claim envelope. Every UI
surface that displays an engine output carries a visible label naming its
register; every engine output type carries a machine-readable
`honesty: …` literal that downstream code must surface.

This document is the canonical reference for which register is allowed to
claim what.

> Companion documents:
> - [`academic-demo-flow.md`](./academic-demo-flow.md) — how the registers
>   are exhibited in a 7-minute walkthrough.
> - [`future-research-roadmap.md`](./future-research-roadmap.md) — what
>   future registers would unlock.

---

## A. Lab `<ProxyBadge>` kinds — visible per-row honesty class

The four diagnostic Geometry Lab panels (Gluing Diagnostics, Symmetry
Diagnostics, Effective Geometry, Correlation Summary) each render
`<ProxyBadge>` chips on every numbered row. The badge's `kind` prop is one
of the four enum values below. The static map `LAB_PANEL_PROXY_KIND` in
`src/types/lab.ts` ties each panel id to its declared honesty class so
new rows in existing panels inherit the correct register.

### `pedagogical-proxy`
**Meaning.** A toy formula that responds in the right qualitative
direction but does not compute a real LQG quantity. All current canvas
scores fall here — `antiParallelScore`, `gluingScore`,
`mutualInformationProxy`, the per-pair toy values
(`localStrength`, `localAlignmentScore`, `localGluingProxy`), the
`mismatchAngle` derived from the per-family mismatch coefficients.

**Where used.**
- Every numeric pill in Gluing Diagnostics' "Anti-parallel alignment" and
  "Gluing coherence" rows.
- Effective Geometry's "Vector geometry proxy" and "Effective gluing
  tendency" rows.
- Correlation Summary's "Pair-level profile" and "Global tendency"
  diagnostic rows; the four pair-profile cards and the three
  global-summary stat cards in the same panel.

**Must not claim.**
- That a value is in physical units of any LQG quantity (area in
  Planck-area units, volume in Planck-volume units, mutual information
  in bits — none of these).
- That two pedagogical-proxy values from different panels are
  numerically comparable. The proxies are unitless and only encode an
  *ordering*.

### `conceptual-diagnostic`
**Meaning.** A qualitative read on a structural property — symmetry,
homogeneity, alignment pattern. Yes / no / weak / strong, not a number to
take seriously.

**Where used.**
- Symmetry Diagnostics' "Topology symmetry", "Node equivalence", "Edge
  orbit" rows.
- Effective Geometry's "Flat tetrahedron" and "Spherical tetrahedron"
  rows (text-only; the spherical row carries a `dipole-specific` chip
  when active topology is not the dipole).
- Correlation Summary's "Symmetry vs correlation distinction" row.

**Must not claim.**
- That the qualitative read corresponds to a calculable invariant.
- That "weak" or "strong" maps to a specific numeric threshold.

### `curated-classification`
**Meaning.** A discrete tag chosen from a fixed, author-maintained set.
The classification is honest because the set is enumerable, not because
the math is exhaustive.

**Where used.**
- Symmetry Diagnostics' "Family classification" row (one of five state
  family readings: uncorrelated / weakAligned / bellSymmetric /
  frustrated / edgeBiased).
- Correlation Summary's "Family reading" row, surfaced through the
  `LabFamilyReadingList` shared component.

**Must not claim.**
- That the tags exhaust the space of possible state behaviours.
- That a state outside the tag set is "incorrectly classified" — it is
  *unclassified*, full stop.

### `future-calculable-observable`
**Meaning.** A quantity that *could* be computed honestly from a Bell-
network state but the engine does not compute it yet. Surfaced as a
"not computed" pill so the gap stays visible.

**Where used.**
- Gluing Diagnostics: "Face-area matching", "Shape matching / Regge
  condition", "Closure constraint at each node".
- Symmetry Diagnostics: "Full automorphism group computation",
  "One-node observables".
- Effective Geometry: "Twisted phase-space data", "Regge shape
  matching", "Exact LQG expectation values".
- Correlation Summary: "Exact intertwiner-space correlators", "Reduced
  density matrix / local entanglement entropy" — though note that the
  Phase 9C / 9D / 9E engines now compute several of these
  *within their respective models*; the row stays as a future-LQG
  reminder.

**Must not claim.**
- That the row's title corresponds to an output the engine produces.
- That filling the row in is a small step. Each one of these is a
  research-level extension, not a missing line of code.

---

## B. Engine honesty markers — machine-readable on every state

Every state-bearing engine output carries a string literal `honesty: …`
field. UI consumers MUST surface this literal alongside the state. The
engine ships three literals today.

### `'minimal-qubit-model'`
**Where it lives.** `MinimalQubitGraphState.honesty` from
`src/features/quantum-engine/graphState.ts` (Phase 9A engine).

**What it covers.** Every output of the minimal qubit engine: density
matrices, partial traces, von Neumann entropies, mutual information on
the curated topology+family → qubit-state mapping defined in
`src/features/lab/quantumEnginePreview.ts`.

**Allowed claims.** "Exact within the minimal qubit model — these are
finite-dimensional quantum-information observables computed in closed
form on a small Hilbert space."

**Forbidden claims.** "Exact LQG entropy", "exact intertwiner-space
mutual information", "geometric-operator expectation value". The mapping
from app config to qubit state is curated, not LQG-derived.

### `'minimal-spin-half-bell-network-prototype'`
**Where it lives.** `MinimalBellNetworkState.honesty` from
`src/features/quantum-engine/minimalBellNetworkState.ts` (Phase 9E-2
engine).

**What it covers.** The graph-level state on the two-node single-edge
spin-1/2 graph: the spin-1/2 singlet on the edge, interpreted as the
joint state on the two endpoint Hilbert factors. Both nodes have
invariantDim 0 so this state is *not* a tensor over node intertwiner
spaces.

**Allowed claims.** "The smallest possible graph-level Bell-network
prototype state on a single spin-1/2 edge."

**Forbidden claims.** "Bell-network state on the dipole / cycle-4 graph",
"projected over per-node intertwiner spaces", "geometry observable".

### `'spin-half-projected-bell-network-state'`
**Where it lives.** `SpinHalfProjectedBellNetworkState.honesty` from
`src/features/quantum-engine/spinHalfBellNetworkState.ts` (Phase 9E-4
engine).

**What it covers.** The graph-level state on the dipole or cycle-4
spin-1/2 graph, built as

> |Ψ_Γ⟩ = ( ⊗_nodes P_inv(node) ) · ( ⊗_edges |S⟩_edge ) / norm

— the link-singlet product projected by the tensor product of per-node
SU(2)-invariant subspace projectors, then L2-normalised.

**Allowed claims.** "Exact within the projected construction." "A
graph-level SU(2)-invariant Bell-network state on the {dipole, cycle-4}
spin-1/2 graph." "Constructed without arbitrary-spin Wigner-3j
contractions — spin-1/2 only."

**Forbidden claims.** "Cosmological state", "geometric-operator
eigenspace", "area / volume / dihedral expectation value", "spherical-
tetrahedron reading", "flatness / curvature score", "LQG geometry".

---

## C. UI model chips — section-level register tags

Three sections of the Correlation Summary Lab panel carry neutral header
chips (rendered via `LabSection.headerRight`, **not** `<ProxyBadge>` —
engine outputs in those sections are exact within their model rather
than proxies of an LQG observable). Each chip is the visible UI handle
for the register the section is reporting in.

| chip text | section | engine register |
| --- | --- | --- |
| `[minimal qubit model]` | Engine Preview | `'minimal-qubit-model'` |
| `[single-node SU(2) model]` | Single-node SU(2) Intertwiner Sandbox | (per-card from `invariantSubspaceProjector` — no honesty literal; the chip is the sole register tag) |
| `[graph contract · projected spin-1/2 states]` | Bell-network Graph Sandbox | `'minimal-spin-half-bell-network-prototype'` (two-node card) and `'spin-half-projected-bell-network-state'` (dipole / cycle-4 cards) |

---

## D. The boundary — what you cannot say

The four registers above stack into one cumulative boundary. Read them
as a layered claim envelope: each register is **exact within** a
specific model, and *not yet* an LQG geometric observable or a
cosmological dynamics result. The five lines below are the canonical
academic statements — each one names what the engine *can* claim and
what it *cannot*, in a form that fits an LQG / Bell-network research
discussion.

- **Exact within minimal qubit model.** The engine's density matrices,
  partial traces, von Neumann entropies, and pairwise mutual
  informations are computed in a deliberately simple finite-dimensional
  Hilbert space. They are exact in that space. The mapping from app
  config to qubit state is curated by hand
  (`src/features/lab/quantumEnginePreview.ts`); an SU(2)-aware adapter
  that derives the qubit state from a Bell-network construction is a
  future phase. **Forbidden claim:** "exact LQG entropy" or "exact
  intertwiner-space mutual information".

- **Exact within SU(2) single-node model.** `invariantSubspaceProjector(spins)`
  returns the textbook SU(2)-invariant subspace at *one* node — the
  j_total = 0 eigenspace of the total Casimir on the per-node tensor
  product. The dimensions match `mult(j_total = 0)` from the Wigner
  decomposition exactly (selftest verifies for `[½, ½]`,
  `[½, ½, ½, ½]`, `[1, 1]`, `[1, ½, ½]`). **Forbidden claim:** "Bell-
  network state" — a graph-level state needs intertwiner bases at
  *every* node plus edge-spin tensor structure between nodes plus
  edge-pairing / gluing constraints. Single-node intertwiner space
  is one of three required ingredients, not the whole construction.

- **Exact within restricted spin-1/2 projected Bell-network construction.**
  `buildSpinHalfProjectedBellNetworkState(graph)` produces, for the
  dipole and cycle-4 graphs, the link-singlet product
  `⊗_edges |S⟩_edge` projected by the tensor product of per-node
  SU(2)-invariant projectors `⊗_nodes P_inv(node)`, then L2-
  normalised. The construction is exact within this projected
  setup — and only within it. **Forbidden claim:** "general Bell-
  network state" (only spin-1/2 edges, only two graph shapes), or
  any geometric / cosmological interpretation of the projected ket.

- **Not yet an LQG geometric observable.** The projected state lives
  on a fixed combinatorial graph and is normalised, but the engine
  has no area, volume, or dihedral-angle operator to apply to it.
  The standard textbook constructions (Ashtekar-Lewandowski area
  `A_e = 8πγℓ_P² √(j_e(j_e + 1))` per edge; LQG volume operator on
  intertwiner space; dihedral-angle operator on adjacent face pairs)
  are well-defined on the spin-network Hilbert space the engine has
  built. Implementing them is the next research step.
  **Forbidden claim:** any number "in Planck-area units", "Regge
  shape-matching distance", "twisted-geometry holonomy", or
  "spherical-tetrahedron curvature signature".

- **Not yet a spin-foam or cosmological dynamics model.** The engine
  ships kinematic Bell-network states only — there is no transition
  amplitude, no spin-foam vertex amplitude, no Hamiltonian
  constraint, no cosmological reduction map. The Bridge mode's
  cosmology narrative is conceptual, not numerical, and the engine
  has not changed that. **Forbidden claim:** any cosmological
  evolution, Bianchi-sector mapping, group-field-theory condensate
  result, or refinement / continuum-limit statement.

The cumulative claim envelope is therefore: **exact in each model,
explicitly bounded, and explicitly not yet an LQG geometric observable
or a cosmological dynamics model**. Every step of the academic ladder
spelled out in [`academic-demo-flow.md`](./academic-demo-flow.md)
respects this envelope, and every roadmap item in
[`future-research-roadmap.md`](./future-research-roadmap.md) is
positioned to extend it deliberately rather than to blur it.

---

## E. How to add a new diagnostic without breaking the discipline

If a new Lab row, panel, or sandbox card lands in a future phase:

1. **Pick a register first.** Decide which of the four `ProxyKind`
   labels (or one of the three engine honesty literals) the row belongs
   in *before* writing the implementation.
2. **Surface the label visibly.** `<ProxyBadge kind="…">` on every
   diagnostic row; `LabSection.headerRight` chip on every register-shift
   section; explicit `honesty: …` literal on every state-bearing engine
   output.
3. **Document the claim envelope.** Add the row / panel to this file
   (Section A or B as appropriate) with its allowed and forbidden
   claims.
4. **If the new diagnostic is a `future-calculable-observable`,** ship
   it with a "not computed" pill and a one-sentence description of what
   computing it would require. Do not ship a placeholder number.
5. **CLAUDE.md guards.** The CLAUDE.md *Constraints that have been
   deliberately preserved* block already lists the proxy-honesty rule.
   Any new register or honesty literal must extend those constraints in
   the same commit that introduces the engine-side change.

Honesty is enforced at the discipline level, not the runtime level. The
cost of violating it is that a panel or state ships unlabelled, which is
exactly what the discipline forbids — and what every reviewer of this
project should reject in code review.
