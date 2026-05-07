# Future Research Roadmap

The engine has reached a coherent stopping point at Mega Phase 9E-4: the
SU(2) representation theory is in, single-node intertwiner projectors
work for arbitrary spin tuples, the Bell-network graph contract is fixed,
and projected spin-1/2 graph-level states ship for the dipole and cycle-4
graphs. Engine selftests are 84/84 clean. This document lays out the
**three-horizon research plan** for what comes next, with concrete
prerequisites for each item.

> Companion documents:
> - [`academic-demo-flow.md`](./academic-demo-flow.md) — current
>   demonstrable surface.
> - [`honesty-classes.md`](./honesty-classes.md) — what the engine is
>   allowed to claim today.

---

## Near-term — geometry observables and reduced states (≈ 1 phase each)

These extensions sit directly on top of the existing engine. They add
real LQG-flavoured numbers without changing the underlying Hilbert space
or graph contract.

### Area operator on edge spins
**What it adds.** A per-edge area expectation value
`A_e = κ √(j_e (j_e + 1))` (in units of `8πγℓ_P²` taken as 1 here),
plus a graph-level total area `Σ_e A_e`.

**Why it matters.** This is the cheapest classical geometry observable
the engine can produce. It surfaces the spin-network area spectrum and
gives the visitor a number that anyone *would* honestly call an "LQG
area". Per-edge values for spin-1/2 are
`κ √(½ · 3/2) = κ · √(¾) ≈ 0.866 κ`.

**Prerequisite.** None — every input the operator needs (the per-edge
spin label) is already in the `BellNetworkGraph` contract. Implementation
is essentially `graph.edges.map(e => kappa * Math.sqrt(e.spin * (e.spin + 1)))`.

**New honesty class.** This is the engine's first **`exact-lqg-classical-
observable`** entry — exact within the kinematic LQG Hilbert space the
engine has built (no dynamics, no quantum corrections to the area
spectrum, no semiclassical regime claim). Update
[`honesty-classes.md`](./honesty-classes.md) when this lands.

### Volume operator on the projected Bell-network state
**What it adds.** A per-node volume expectation value `⟨V_node⟩` for
3-valent and 4-valent nodes, computed as the matrix element of the LQG
volume operator on the per-node SU(2)-invariant subspace. For the
dipole's two 4-valent nodes: a 2×2 matrix on the 2-dim intertwiner
space, with concrete eigenvalues. For cycle-4's four 2-valent nodes:
trivially zero (volume vanishes on bivalent nodes).

**Why it matters.** Volume is more diagnostic of the *projected state*
(not just the graph labels) than area is. It surfaces the
intertwiner-space structure the engine spent Phase 9D-2-b building, in
a way the user can see numerically.

**Prerequisite.** A symbolic / numerical implementation of the LQG
volume operator on a small SU(2)-invariant subspace. Standard textbook
formulas exist (Ashtekar-Lewandowski volume, Rovelli-Smolin volume —
they differ for 4-valent nodes). Pick one explicitly and document the
choice in the engine module header.

**Open question for the volume implementation.** The 4-valent volume
operator's matrix elements depend on the 6j-symbols of the recoupling
basis. Implementing 6j requires either (a) a Wigner-3j table for
spin-1/2 only (small enough to hardcode), or (b) the full Wigner-3j /
6j machinery (Phase 9F-mid territory).

### Graph-level reduced density matrices
**What it adds.** For a graph subset `A ⊆ nodes`, compute
`ρ_A = Tr_{A^c}(|Ψ_Γ⟩⟨Ψ_Γ|)` and its von Neumann entropy `S(A)`. Plus
the corresponding mutual information `I(A : B) = S(A) + S(B) − S(A∪B)`
for disjoint subsets. The engine's existing
`mutualInformationQubitSubsystems` already does this for the minimal
qubit model; the extension lifts it to the projected Bell-network state.

**Why it matters.** This is the **graph-level analogue** of the
existing exact qubit MI heatmap. For dipole, partition `{n0} | {n1}`
(half-and-half) and report `S({n0})`; for cycle-4, several non-trivial
partitions are available.

**Prerequisite.** The projected state (already built). The engine's
existing `partialTraceQubits` works on bit-decomposed indices; for the
projected state we'd add a `partialTraceNodeSubset(state, keepNodes)`
that respects the node-major slot layout. Straightforward extension of
existing partial-trace machinery.

### Exact-vs-proxy comparison refinement
**What it adds.** Once area / volume / reduced-MI numbers land, extend
the existing Engine Preview's exact-vs-proxy comparison block to include
graph-level pairs:

| existing proxy | new exact |
| --- | --- |
| `mutualInformationProxy` (unitless) | `S(A)` for projected Bell-network reduced ρ (in bits) |
| `gluingScore` (toy proxy) | per-edge area × normalisation factor |
| `antiParallelScore` (toy proxy) | dihedral-angle expectation (mid-term) |

Each comparison still stays *qualitative only* — proxy and exact live
in different registers and units — but the reader can see how the
ordering of states under each proxy lines up with the ordering under
the exact observable. That is the first numerical bridge between the
pedagogical layer and the LQG-flavoured layer.

**Prerequisite.** Area and reduced-MI implementations above.

---

## Mid-term — arbitrary spin and shape geometry (≈ 3-5 phases)

These steps generalise beyond spin-1/2 and beyond the two canonical
graphs. They are bigger jumps but each has well-defined textbook
content.

### Arbitrary-spin edge gluing via Wigner-3j
**What it adds.** A general singlet-on-edge primitive for any half-
integer spin. For spin-`j` edge between nodes carrying spin-`j` factors
on each side, the SU(2)-invariant edge state is the standard
`(2j + 1)`-coefficient Wigner-3j contraction
`Σ_m (−1)^{j − m} |j, m⟩_{source} |j, −m⟩_{target} / √(2j + 1)`.

**Why it matters.** Removes the engine's spin-1/2 restriction. Once this
lands, dipole and cycle-4 can carry any homogeneous spin labelling —
useful for studying how observable values scale with spin. The
textbook *natural* spin labels for cosmology toy models are spin-1/2
through spin-3/2; this opens that range.

**Prerequisite.** A pure-TS Wigner-3j calculator. The closed-form Racah
formula is straightforward; the symbolic-rational arithmetic could be
floating-point for now (precision tested against textbook values for
`{j₁, j₂, j₃} ∈ {0, ½, 1, 3/2, 2}`).

### Wigner-6j / Clebsch-Gordan for intertwiner recoupling
**What it adds.** Recoupling matrices between different choices of
intertwiner basis (e.g. for a 4-valent node, the recoupling between the
"`(j₁, j₂)` first" basis and the "`(j₁, j₃)` first" basis is a 6j-symbol
matrix element). Necessary for the volume operator on 4-valent and
higher-valence nodes.

**Why it matters.** Once you have 6j you have the volume operator's
matrix elements as derived quantities, plus the building blocks for the
spin-foam vertex amplitude.

**Prerequisite.** Wigner-3j (above). 6j is built from sums of 3j
products; the algebra is straightforward but the index bookkeeping is
fiddly.

### Dihedral-angle operator
**What it adds.** A per-pair dihedral-angle expectation
`⟨θ_{e_i, e_j}⟩` for any two incident edges of a node, computed as a
matrix element of the dihedral angle operator on the per-node
intertwiner space.

**Why it matters.** Dihedral angles are the *geometric* counterpart of
the canvas's `mismatchAngle` proxy. For the first time the user gets a
real number, in radians, that the canvas's anti-parallel score was
trying to approximate.

**Prerequisite.** The volume operator (above), since dihedral angle
shares the 6j-symbol machinery. Also a clear convention for which
basis on the node intertwiner space the matrix element is computed in.

### Twisted-geometry vs Regge-geometry comparison
**What it adds.** A panel-level comparison surface (probably a new
section in the existing Effective Geometry Lab panel) showing the same
projected state read through two semiclassical limits:
- **Vector geometry** — closure constraint at the operator level (the
  graph invariant projector P_inv already encodes this).
- **Twisted geometry** — phase-space data with relaxed shape matching
  (this is a new computation; needs flux variables on edges).
- **Regge geometry** — full shape matching across faces (also new;
  needs the per-pair dihedral angles plus area + closure).

**Why it matters.** This is the *Effective Geometry Lab panel's named
research target*. The panel currently shows only conceptual diagnostics
and curated readings here; mid-term phases would actually compute the
twisted vs Regge distance.

**Prerequisite.** Area, volume, dihedral-angle operators (above).

---

## Long-term — dynamics and cosmology (≈ many phases)

These are research-level extensions that change the project's category
from "kinematic LQG playground" to something closer to a research tool.
Each one is a multi-phase undertaking on its own.

### Spin-foam vertex amplitude
**What it adds.** The transition amplitude for a single spin-foam
vertex — the EPRL or Ooguri vertex amplitude, depending on the chosen
quantisation. For the dipole graph this is well-studied analytically;
for cycle-4 it is computable but not as well-known.

**Why it matters.** Dynamics. Without a vertex amplitude the engine is
purely kinematic — it ships states and observables on a fixed graph
but has no way to evolve the graph or the state. Adding the vertex
amplitude is what unlocks the project's path toward cosmology.

**Prerequisite.** Wigner-3j, 6j (mid-term). Also: a clear honest
labelling of the chosen amplitude (EPRL has a continuous parameter γ;
the engine should pick a specific value, document it, and surface it
in the UI).

**Note.** Vertex amplitudes are typically defined for fixed boundary
data (incoming and outgoing spin networks). The engine's existing
projected Bell-network states are valid boundary data. So the vertex
amplitude lands as a new builder
`buildSpinFoamVertexAmplitude(boundaryStates)` that takes the
projected states and returns a complex amplitude.

### Cosmological sector mapping
**What it adds.** An explicit map from Bell-network states on the
dipole graph to homogeneous-isotropic Bianchi I cosmological states.
The dipole graph is the standard simplest spin-network for *isotropic*
LQG-cosmology toy models; cycle-4 corresponds to *anisotropic* Bianchi
sectors.

**Why it matters.** Closes the loop with the Bridge module's narrative
about "graph homogeneity ↔ cosmological homogeneity". Today that
narrative is purely conceptual; this phase would make it numerical.

**Prerequisite.** Spin-foam vertex amplitude (above) plus volume
operator. The mapping is a textbook reduction in the LQG-cosmology
literature; implementation is non-trivial because the reduction is
defined at the symplectic-structure level, not directly on Hilbert
space.

### Refinement / graph limit
**What it adds.** A way to refine the dipole or cycle-4 graph by
inserting nodes / edges along the existing edges, plus a comparison of
observables before and after refinement. The continuum limit of LQG
states under graph refinement is an open research question; the engine
would surface the refined-vs-unrefined numerical comparison rather
than claiming a continuum result.

**Why it matters.** The engine's current graphs are tiny. Refinement
gives a path toward larger graphs without inventing new graph
constructors — and lets the user see how observable values change
under refinement.

**Prerequisite.** At minimum the area / volume / dihedral operators,
plus a graph-refinement constructor on `BellNetworkGraph`. The
constructor is straightforward; the observable comparison is the
research-level part.

### Semiclassical coherent spin-network states
**What it adds.** Replace the link-singlet primitive with a more
physical *coherent intertwiner state* per node — the LQG-coherent
state peaked on a classical face geometry. The current projected state
is the SU(2)-invariant projection of the bare singlet product, which
is equally peaked on every classical configuration that respects
closure; coherent intertwiners are peaked on a specific shape.

**Why it matters.** Coherent states are the bridge from quantum-
geometry observables to classical Regge geometry. Without them the
engine cannot honestly produce a Regge-geometry expectation value
because the state has no preferred shape.

**Prerequisite.** Area, volume, dihedral angle operators (mid-term)
plus a Bloch-sphere / Heisenberg coherent-state construction at each
node. Standard LQG literature has explicit formulas; implementation is
linear-algebra-heavy but contained.

### Group field theory cosmology connection
**What it adds.** A documentation-level (or deep-research-level)
mapping between the engine's Bell-network states and group field
theory condensate states for cosmology. This is the **deepest**
honest path to cosmological dynamics.

**Why it matters.** The engine reaches the literature frontier. Group
field theory cosmology is an active research line and the dipole
graph plays a specific role in it.

**Prerequisite.** Vertex amplitude (above) plus a literature review of
group-field-theory cosmology condensates. This is most likely a
multi-author research project rather than a single phase.

---

## Cross-cutting requirements

These apply to every entry above and should be enforced as new phases
land:

- **Honesty-class first.** Before writing any new engine code,
  designate the new register in
  [`honesty-classes.md`](./honesty-classes.md) and decide what claims
  the new output is allowed to make.
- **Selftest before UI.** Every new engine output ships with at least
  one selftest in `quantumEngine.selftest.ts` (textbook expected
  values, sanity checks, edge cases). The UI surface comes only after
  the selftest is green.
- **No new npm dependency.** The engine has been pure-TS dependency-
  free since Phase 9A. Maintain that.
- **Bilingual UI parity.** Every new user-visible string lands in both
  EN and TR in the same commit, validated by `validate-ui-i18n.mjs`.
- **No ad-hoc graph / state family / observable lens additions.** The
  four-knob structure is load-bearing for the existing UI; new graphs
  go through the topology registry, new states through the state-
  family registry, new lenses through the observable-mode registry.

---

## Picking the next phase

The natural near-term order is: **area** → **graph-level reduced ρ /
MI** → **volume** → **dihedral angle**. Each step builds on the
previous and each is roughly one phase of effort. After dihedral
angle the engine has real numerical content for the
**twisted-vs-Regge** comparison surface — at which point the
existing Effective Geometry Lab panel can graduate from
`conceptual-diagnostic` rows to `exact-lqg-classical-observable`
rows for the first time.

Beyond that, the choice between **spin-foam dynamics** and **arbitrary-
spin gluing** is a strategic decision: dynamics gives the project a
path toward cosmology but is much harder; arbitrary-spin gluing is
incremental and strengthens the static layer. Both are documented
above; both have explicit prerequisites; either is honest.

---

## Bekir Hoca discussion candidates

A short shortlist sized for a research conversation about which
extension lands best on the Bell-network → effective-geometry axis the
project is being shaped around. Each candidate is already documented
in detail above; this is the discussion-ready summary.

- **Area operator as first exact LQG-flavoured observable.** Per-edge
  `A_e = κ √(j_e (j_e + 1))` from the Ashtekar-Lewandowski area
  spectrum. Cheapest extension; produces the engine's first
  `exact-lqg-classical-observable` honesty literal. Doesn't probe the
  projected state — only reads the edge spin labels — but anchors the
  honesty boundary at "exact LQG kinematic observable on a fixed
  graph" for the first time.

- **Volume operator on intertwiner space.** Per-node
  `⟨V_node⟩` matrix elements on the SU(2)-invariant subspace. For the
  dipole's two 4-valent nodes this is a 2×2 matrix on the 2-dim
  intertwiner space (genuine numerical content); for the cycle-4's
  bivalent nodes the volume is trivially zero. Discussion point: do
  we use the Ashtekar-Lewandowski or the Rovelli-Smolin volume?
  They differ at 4 valence and the choice should be documented in
  the engine module header before implementation.

- **Dihedral-angle operator and twisted-vs-Regge geometry.**
  Per-incident-pair `⟨θ_{e_i, e_j}⟩` matrix elements. The geometric
  counterpart of the canvas's `mismatchAngle` proxy — for the first
  time the user gets a real number, in radians, that the
  anti-parallel score was approximating. The Effective Geometry
  Lab panel was specifically built around this comparison surface;
  it currently shows only `conceptual-diagnostic` rows for vector /
  twisted / Regge geometries and would graduate to exact rows once
  the dihedral-angle operator lands.

- **Semiclassical coherent spin-network extension.** Replace the
  link-singlet primitive with LQG-coherent intertwiner states peaked
  on a classical face geometry. The current projected state is the
  SU(2)-invariant projection of the bare singlet product — equally
  peaked on every closure-respecting classical configuration; coherent
  intertwiners pick a specific shape. Required *before* any honest
  Regge-geometry expectation value, since the bare projected state
  has no preferred shape to read.

- **Relation to homogeneous graph truncations / cosmology.** The
  dipole graph is the canonical isotropic LQG-cosmology toy network;
  the cycle-4 graph adds the minimal anisotropy. The projected
  states on these graphs already have the structural features
  (singlet ground state, intertwiner-overlap / face-pair
  correlations) that homogeneous Bianchi-style cosmological
  reductions rely on. Discussion point: at what stage of the
  observable ladder does the engine become useful for *reading off*
  cosmological-sector data rather than just *demonstrating* it?
  Probably after volume + dihedral angle land; possibly earlier with
  the entanglement-entropy bipartition observable from the
  near-term roadmap.

The five candidates are not mutually exclusive — the natural
near-term sequence (area → reduced ρ → volume → dihedral angle)
covers the first three in order, with coherent intertwiners and
cosmology-relation as longer-horizon extensions on top.
