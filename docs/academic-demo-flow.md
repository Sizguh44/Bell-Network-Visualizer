# Bell-Network Geometry Lab — Academic Demo Flow

A 5–7 minute walkthrough for showing the project to a research audience. The
ordering walks the visitor up the **epistemic ladder** the engine builds:
pedagogical proxies → minimal qubit model → single-node SU(2) representation
theory → spin-1/2 projected Bell-network states. Every step's UI surface is
already shipped and visible without configuration.

> Companion documents:
> - [`docs/honesty-classes.md`](./honesty-classes.md) — what each register
>   is allowed to claim.
> - [`docs/future-research-roadmap.md`](./future-research-roadmap.md) —
>   what we'd build next.

---

## Before the demo

Open the app at the GitHub Pages URL (or `npm run dev` locally) with the
default state: **Explore** mode, **Dipole** topology, **Bell-like
symmetric** state family, strength near the middle, **Alignment** lens.

Two browser tabs help: one on Explore for the canvas-driven steps, one on
**Geometry Lab** for the deep diagnostics.

---

## Step 1 — Visual graph canvas (≈ 30 s)

**Where to look:** Explore mode → main canvas + sidebar. Toggle the topology
selector between **Dipole** and **Cycle-4**, slide the strength, switch
between the five state families, switch between the five observable lenses.

**What it shows:** the *combinatorial* layer of the project — small
spin-network graphs, four face pairs each, five toy states, five reading
lenses. Numbers on screen here (anti-parallel score, gluing score, mutual-
information proxy) are pedagogical proxies driving the visuals.

**Honest claim:** "The canvas is a *toy model* responding to four
orthogonal knobs. Every number visible here is a pedagogical proxy — the
formulas are deterministic and respond in the right qualitative direction,
but they are not LQG observables."

**Honest non-claim:** "These numbers are *not* expectation values of any
real quantum-geometry operator."

---

## Step 2 — Geometry Lab → Gluing Diagnostics (≈ 45 s)

**Where to look:** switch to **Geometry Lab** mode, default tab **Gluing
Diagnostics**. Show:
- **Anti-parallel alignment** and **Gluing coherence** rows (both
  `pedagogical-proxy` badge — read directly from the canonical pipeline,
  same numbers as the canvas).
- **Face-area matching**, **Shape matching / Regge condition**, **Closure
  constraint at each node** rows (all `future-calculable-observable` badge,
  with explicit *not computed* pills).

**What it shows:** the **proxy-vs-future-observable** distinction at row
level. Three rows are explicitly *not* computed; their honesty class names
the gap.

**Honest claim:** "The pedagogical-proxy rows are the same toy formulas
the canvas uses. The future-calculable rows are quantities a real LQG
calculation would produce — face-area matching, Regge shape matching, and
closure at each node — but the engine does not compute them yet, and the UI
shows that gap."

**Honest non-claim:** "The Gluing panel does not produce a Regge geometry,
a closure constraint solution, or any geometric-operator expectation
value."

---

## Step 3 — Geometry Lab → Correlation Summary (≈ 1 min 30 s)

**Where to look:** **Correlation Summary** tab. Walk through the section
ordering:
1. **Pair-level correlation profile** — four pair cards with three
   pedagogical-proxy values each.
2. **Global proxy summary** — three stat cards including the
   `mutualInformationProxy` (a unitless toy formula
   `(strengthMean × alignMean)^1.5`).
3. **Minimal Qubit Engine Preview** with two embedded heatmaps:
   - **Node entropy heatmap** — exact von Neumann entropy per qubit, in
     bits, as fill bars.
   - **Exact pairwise qubit mutual information** — `n × n` heatmap of
     `I(Qᵢ : Qⱼ)` in bits. Click around: dipole → 2-qubit Bell pair (one
     off-diagonal cell at 2 bits), cycle-4 → 4-qubit GHZ pair (every
     off-diagonal at 1 bit).
4. **Exact-vs-proxy mutual information comparison block** — exact qubit
   `I(Q0 : Q1)` next to the existing `mutualInformationProxy` value, with
   a *qualitative comparison only* disclaimer pinning that proxy is
   unitless and exact MI is in bits/nats.

**What it shows:** the **pedagogical-proxy ↔ minimal-qubit-model**
boundary, which is the project's first real exact-vs-proxy contrast.

**Honest claim:** "The engine on the right computes *exact* finite-
dimensional quantum-information observables — density matrix, partial
trace, von Neumann entropy, mutual information. The bits values are
exactly what they say. The qualitative-comparison disclaimer pins that
the proxy on the left is unitless toy formula and the exact MI on the
right is in bits / nats — they live in different registers."

**Honest non-claim:** "These exact values are *not* exact LQG mutual
information. They are exact within a *minimal qubit model* — a finite-
dimensional toy that happens to admit clean closed-form quantum-
information calculations."

---

## Step 4 — Single-node SU(2) Intertwiner Sandbox (≈ 1 min)

**Where to look:** still in **Correlation Summary**, scroll past the
Engine Preview to the **Single-node SU(2) intertwiner sandbox** section.
Show the four cards in order:
- `[½, ½]` → singlet sector, invariant dim 1.
- `[½, ½, ½, ½]` → 4-valent spin-½ node, invariant dim 2.
- `[1, 1]` → singlet of two spin-1, invariant dim 1.
- `[1, ½, ½]` → 3-valent mixed, invariant dim 1.

Each card shows total dimension, invariant dimension, expected (textbook)
dimension, kept eigenvalue indices, a 6-eigenvalue spectrum preview, and
three projector sanity chips (`P† = P`, `P² = P`, `Tr(P) = dim`).

**What it shows:** the **single-node SU(2) representation theory**
register. The engine builds the SU(2) generators, the Casimir, the
total-J² eigenspaces and projects onto the j_total = 0 sector — the
SU(2)-invariant subspace at one node.

**Honest claim:** "These are exact SU(2) representation-theory results.
The `mult(j_total = 0)` numbers match the textbook Wigner decomposition.
The projector sanity chips verify the invariant subspace is built
correctly."

**Honest non-claim:** "A single-node intertwiner space is *not* a Bell-
network state. The full Bell-network state needs intertwiner bases at
*every* node plus edge gluing between nodes. That comes later in the
panel."

---

## Step 5 — Bell-network Graph Sandbox (≈ 1 min 30 s)

**Where to look:** the section right after the intertwiner sandbox —
**Bell-network graph sandbox**. Show all three graph cards:

1. **Two-node single-edge spin-1/2 graph** — the minimal prototype
   (status: `available`, register: `minimal two-node prototype`,
   dimension 4, normalised, honesty
   `minimal-spin-half-bell-network-prototype`).
2. **Dipole graph with four spin-1/2 edges** — the projected register
   (status: `available`, register: `spin-1/2 projected Bell-network
   state`, endpoint dim 256, graph invariant dim 4 = 2 × 2, per-node
   invariant dims `[2, 2]`, normalised, honesty
   `spin-half-projected-bell-network-state`).
3. **Cycle-4 graph with spin-1/2 edges** — same projected register
   (endpoint dim 256, graph invariant dim 1, per-node invariant dims
   `[1, 1, 1, 1]`).

**What it shows:** the engine's **graph-level Bell-network state** layer.
The construction is

> |Ψ_Γ⟩ = ( ⊗_nodes P_inv(node) ) · ( ⊗_edges |S⟩_edge ) / norm

— the link-singlet product projected by the tensor product of per-node
SU(2)-invariant subspace projectors, then L2-normalised.

**Honest claim:** "These are graph-level SU(2)-invariant Bell-network
states on the dipole and cycle-4 spin-1/2 graphs. They are *exact*
within the projected construction. The dipole projects onto a
4-dimensional graph invariant subspace; the cycle-4 onto a unique
1-dimensional invariant subspace."

**Honest non-claim:** "These states are *not* cosmological states, *not*
geometric-operator eigenspaces, *not* area / volume / dihedral
expectation values, *not* spherical-tetrahedron readings, *not*
flatness / curvature scores. The state lives on a fixed combinatorial
graph; geometry observables are a future research layer."

---

## Step 6 — Explain the honesty boundary (≈ 30 s)

After Step 5, pull the [`docs/honesty-classes.md`](./honesty-classes.md)
document into view (or just summarise from memory):

- **What is exact:** density matrices, partial traces, von Neumann
  entropy, mutual information (within the minimal qubit model);
  SU(2) generators, Casimir, total-J² eigenvalues, single-node invariant
  projectors, projected Bell-network states for dipole and cycle-4
  (within the SU(2) representation-theory layer).
- **What is proxy:** every score on the canvas, the mutual-information
  proxy in Correlation Summary's global summary, the pair-level toy
  values, the family classification reading.
- **What is future LQG:** area / volume / dihedral-angle operators,
  Regge geometry reconstruction, twisted-geometry phase space, closure
  constraints at the operator level, spin-foam dynamics, cosmological
  sector mapping.

Each row of the four diagnostic Lab panels carries a `<ProxyBadge>` that
visually anchors which register it is in.

**Honest claim:** "Every numerical output on screen is labelled with its
register. The engine never claims a result is exact LQG when it is in
fact a minimal qubit model."

---

## Step 7 — Discussion questions for the audience (≈ 1 min)

Three questions worth raising at the end of the demo:

1. **Which graph-level observables would be most meaningful to add
   next?** Area on spin labels is the cheapest classical observable
   (just `κ √(j(j+1))` per edge), but it doesn't really probe the
   projected state — it reads the edge labels directly. Volume on
   intertwiner-space is more diagnostic of the projected state but
   requires a non-trivial operator on the SU(2)-invariant subspace.
   Which one buys the most pedagogical clarity per implementation
   effort?

2. **Should the next phase prioritise area / volume operators or
   refinement toward spin-foam dynamics?** Static observables are a
   natural extension of what the engine has. Dynamics — even the
   simplest spin-foam vertex amplitude — is a much larger jump but
   gives the project a path toward cosmology.

3. **Is the dipole / cycle-4 choice pedagogically convincing for
   homogeneous cosmology?** The two graphs are the smallest
   automorphism-rich shapes in the LQG-cosmology toy literature. The
   projected states already exhibit the singlet-ground-state /
   intertwiner-overlap structure relevant to homogeneous Bianchi-style
   reductions. Is the connection close enough to motivate a Bridge
   mode lesson, or should that wait until area / volume operators
   land?

---

## Suggested framing for a research discussion

If the audience is a working LQG / Bell-network / effective-geometry
researcher (e.g. Bekir Hoca's group), the demo flow above gives an
honest tour of the four engine layers but the conversation that
follows will probably want to skip the pedagogical framing and go
straight to the **Bell-network → effective geometry** axis. Three
discussion questions sized for that audience:

1. **Should the next step prioritise area / volume operators or
   dihedral-angle / effective-geometry reconstruction?** The engine
   already ships the projected spin-1/2 Bell-network states for the
   dipole and cycle-4 graphs, so any of the four standard observables
   (area, volume, dihedral angle, twisted-vs-Regge distance) is a
   short engine extension away. Area is mechanically cheapest but
   reads only the edge labels. Volume is more diagnostic of the
   projected state but needs the LQG volume operator on the
   intertwiner subspace (a small matrix for the dipole's 2-dim
   intertwiner space, trivial for the cycle-4's 1-dim space).
   Dihedral-angle / Regge reconstruction is the most directly
   "geometry-like" but requires Wigner-3j machinery. Which sequence
   does the most for the effective-geometry interpretation the Lab
   is being shaped around?

2. **Is the dipole / cycle-4 truncation pedagogically and physically
   meaningful for the intended cosmological sector?** The dipole
   graph is the canonical homogeneous-isotropic LQG-cosmology toy
   network; the cycle-4 graph adds a minimal anisotropy. The
   projected state on the dipole already has the singlet-ground-state
   structure that homogeneous Bianchi reductions exploit. Is this
   truncation expressive enough to motivate the next research step,
   or should the engine first generalise to slightly larger
   automorphism-rich graphs (e.g. complete bipartite K_{2,3} or a
   higher-cycle) before adding observables?

3. **Which graph-level observable would best connect the projected
   spin-1/2 Bell-network state to effective geometry?** The candidate
   list is short but has different epistemic status:
   - **Per-edge area** is exact LQG kinematics but doesn't see the
     projected state — only the edge labels.
   - **Per-node volume** sees the projected state through the
     intertwiner subspace but needs a chosen volume operator
     (Ashtekar-Lewandowski vs Rovelli-Smolin disagree at 4 valence).
   - **Per-pair dihedral angle** is the most directly Regge-flavoured
     but requires committing to an interpretation of "shape" on the
     spin-network.
   - **Graph-level reduced density matrix + entanglement entropy on
     a node bipartition** is closest in form to what the engine
     already computes for the minimal qubit model — and would let
     the existing Engine Preview heatmaps lift into the projected
     register without a new physics formula.

   Question for the discussion: which of these four does most of the
   work for the *effective-geometry* narrative the project is being
   positioned around?

The honesty boundary is the same in every direction: every observable
on this list is **a future-LQG-flavoured exact observable on the
existing Bell-network state**, not a cosmological dynamics result.
The Lab can host any of them; the research-direction question is
which sequence gives the cleanest path from "graph-level state" to
"effective geometry" in the Bell-network-cosmology line specifically.

---

## Demo timing summary

| step | what | time |
| --- | --- | --- |
| 1 | Visual graph canvas | 30 s |
| 2 | Gluing Diagnostics | 45 s |
| 3 | Correlation Summary + Engine Preview | 1 m 30 s |
| 4 | Single-node SU(2) Intertwiner Sandbox | 1 m |
| 5 | Bell-network Graph Sandbox | 1 m 30 s |
| 6 | Honesty boundary | 30 s |
| 7 | Discussion questions | 1 m |
| **total** | | **6 m 45 s** |

The flow can be compressed to 5 minutes by skipping Step 6 (the honesty
classes are already visible in-page via the `<ProxyBadge>` rows and model
chips), or expanded to 8–10 minutes by spending more time on the engine
selftest results (`npm run validate:quantum-engine` shows 84/84 invariants
including textbook eigenvalues and intertwiner dimensions) and the
[`docs/future-research-roadmap.md`](./future-research-roadmap.md).

---

## What the audience walks away with

After 7 minutes the audience has seen:
- a working static toy model on a real spin network;
- exact quantum-information observables (entropy, mutual information,
  density matrices) on a deliberately small Hilbert space;
- exact SU(2) representation theory at the single-node level;
- graph-level Bell-network projected states for two canonical graphs;
- an explicit, in-page taxonomy of which register each number is in.

What they have **not** seen — and what the project openly admits it does
not yet have — is any geometric-operator expectation value, any spin-foam
dynamics, any cosmology layer, or any arbitrary-spin / arbitrary-graph
construction. That gap is documented, not hidden.
