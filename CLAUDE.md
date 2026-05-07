# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

> ## ⚠ Maintenance directive — read this on every session
>
> The user has asked that **this file be kept in sync by Claude, not by the user.**
>
> After every meaningful change to the repository (new feature, refactor, content addition,
> bug fix, CSS system shift, dependency change, build / deploy config change, content
> architecture change), **append a dated one-line entry to the Changelog section at the
> bottom of this file in the same turn as the code change.** Update the Commands,
> Product shape, High-level architecture, and Constraints sections above whenever any of
> those facts change.
>
> Never ask the user to update CLAUDE.md — that is Claude's responsibility. If you only
> touched documentation or made a trivial fix, still record it in the Changelog so the
> log is a faithful record of activity across sessions.

---

> ## 🌐 Bilingual maintenance rule — read this before adding user-facing text
>
> This repo ships in **two locales (EN + TR)**. Every user-visible string —
> button labels, badges, helper text, empty states, tooltips, drawer titles,
> section headings, lesson / challenge / bridge / glossary entries, card copy,
> confirm-dialog messages, error messages — must land in **both** locales in
> the same commit. There is no "EN-only temporary" path; an EN-only surface
> is an incomplete change.
>
> Files that must be kept in lockstep:
>
> - `src/i18n/ui/en.ts`  ↔  `src/i18n/ui/tr.ts` (chrome strings)
> - `src/data/en/*.ts`   ↔  `src/data/tr/*.ts` (lessons · challenges ·
>   bridgeLessons · glossary)
>
> Technical LQG terms — spin network, Bell-network, face pair, gluing,
> anti-parallel alignment, state family, observable lens, dipole graph,
> cycle graph, vector geometry, Regge geometry, intertwiner, automorphism,
> homogeneity, cosmology — stay English by policy (see Faz-3 report). Every
> sentence around them must be translated.
>
> Before considering any copy or content change "done", run:
>
>     npm run validate:i18n
>
> It now runs two sub-checks back-to-back: `validate-i18n.mjs` (content
> structural parity — same ids, orders, prev/next chains, config objects,
> option ids, related-id arrays, glossary `tags` presence) followed by
> `validate-ui-i18n.mjs` (UI string-tree parity — same keys at every depth,
> same leaf type per key, same array lengths). Both fail the CI workflow on
> any drift, so a broken bilingual surface can never reach GitHub Pages.

---

## Commands

```bash
npm install                       # first time only
npm run dev                       # Vite dev server (http://localhost:5173)
npm run build                     # tsc (strict) + vite build → dist/
npm run preview                   # serve the production bundle locally
npm run typecheck                 # tsc --noEmit
npm run validate:i18n             # structural EN ↔ TR parity check (no new deps)
npm run validate:quantum-engine   # Phase 9A → 9E-4 engine self-test (no new deps)
```

No test framework is wired up; `tsc --noEmit` is the de-facto correctness check. There is no
linter configuration — TypeScript `strict` + `noUnusedLocals` + `noUnusedParameters` (see
`tsconfig.json`) do the gatekeeping. `scripts/validate-i18n.mjs` parses the four paired
data files via the TypeScript compiler API (already a devDep) and fails fast on any id /
order / prev-next / config / option-id / related-array drift between locales — it does
not check translation text.

Deploys via GitHub Actions on push to `main`. Vite `base` is rewritten to
`/Bell-Network-Visualizer/` in production; update `REPO_NAME` in `vite.config.ts` if the repo
is renamed (or set the base to `'/'` for a user/organization page).

## Product shape

Static, browser-only pedagogical tool for small spin networks in loop quantum gravity. Two
topologies ship — **Dipole** and **Cycle-4** — both exposing exactly four face pairs so every
state family runs unchanged on either. The UI has **five peer modes** and two overlay drawers,
all layered on a shared explorer:

- **Explore** — free-form demo (footer = 4 theory cards).
- **Learn** — 8 guided lessons with multiple-choice checkpoints.
- **Challenge** — 10 Socratic tasks (prediction · comparison · diagnosis · conceptual).
- **Bridge** — 7 cosmology-bridge lessons (pair → graph → cosmology).
- **Geometry Lab** — research-oriented surface (Faz 2 skeleton). Six placeholder panels
  (Gluing Diagnostics · Symmetry / Automorphism · Effective Geometry · Correlation Summary
  · Research Notes · Open Problems) plus a visible scope note. **No real diagnostic ships
  yet** — every panel only renders its label, short goal, a sample `ProxyBadge` for its
  intended honesty class, and a "later phase" tag. Real outputs land in Faz 3+.
- **Concept Atlas** — 17-entry glossary drawer, concept-centric.
- **Content Library** — tabbed drawer over every authored content kind, content-centric.

The project is being repositioned as the **Bell-Network Geometry Lab** — see *Academic
Direction* and *Honesty / Scope* in `README.md`. The Faz 1 commit (2026-04-25) introduced
this framing in documentation only. The Faz 2 commit (2026-04-25) added the `'lab'` mode
itself: `AppMode` widened, `src/features/lab/` created (LabPanel + 6 placeholder panels +
shared `PlaceholderPanel` and `ProxyBadge`), `src/types/lab.ts` with `LabPanelId` /
`ProxyKind` / `LAB_PANEL_PROXY_KIND`, URL state extended with optional `labPanel`,
`PersistedState.activeLabPanelId` added (storage key unchanged — addition is strictly
backward-compatible), and bilingual `lab` i18n block. Real diagnostics are still deferred.

Phase 9A (2026-04-25) added the **first real computational layer**: a pure TypeScript
minimal quantum-information engine at `src/features/quantum-engine/`. The engine computes
*exact* finite-dimensional quantum-information observables — pure-state density matrices
ρ = |ψ⟩⟨ψ|, partial traces over chosen qubits, von Neumann entropy via analytic 2×2
Hermitian eigenvalues — for a minimal qubit model (≤ 8-dim Hilbert spaces). The engine
is React-, DOM-, and i18n-agnostic. The engine is **not** an SU(2) intertwiner-space
calculation, **not** an LQG Bell-network state, **not** a geometric-operator expectation
value. Any UI surface that displays Phase 9A outputs must label them as *minimal qubit
model* outputs and must not present them as exact LQG results. The SU(2) / intertwiner /
one-node observable upgrade is part of a future Phase 9C+. A self-test at
`src/features/quantum-engine/quantumEngine.selftest.ts` verifies thirteen invariants
(Bell single-qubit ρ = I/2, S = ln 2 nats / 1 bit; product |00⟩ S = 0; GHZ(3) per-qubit
S = ln 2; partial-trace trace preservation; Hermitian reduced ρ; pure-state purity 1;
analytic 2×2 eigenvalues; minimal-qubit graph-state builders normalised) and runs via
`npm run validate:quantum-engine`, which compiles the engine + selftest with the
already-installed `typescript` compiler API to a temp dir
(`.tmp-quantum-engine/`, gitignored) and executes the compiled output via Node's
`require()`. **No new npm dependency.**

Phase 9B (2026-04-25) added the engine's first UI surface — the **Minimal Qubit Engine
Preview** sub-section inside the existing Correlation Summary Lab panel. A new pure-TS
adapter `src/features/lab/quantumEnginePreview.ts` deterministically maps the active
config (graph topology + state family) to a minimal qubit state (`product`, `bell-pair`
or `ghz`) and the panel renders the engine's exact density-matrix / partial-trace /
von Neumann entropy outputs for that state. The section header carries a neutral
`[minimal qubit model]` chip (no `<ProxyBadge>` — engine outputs are exact within their
model rather than proxies, so the four ProxyKinds don't fit), the intro paragraph and
the closing exact-vs-proxy callout pin the "exact within minimal model · pedagogical
proxy of LQG register" distinction. **The mapping from app config to qubit state is
curated, not LQG-derived**, and the rendered section makes that boundary visible.

Phase 9B.5 (2026-04-25) extended the engine with **exact qubit mutual information** —
the textbook quantum-information identity I(A:B) = S(A) + S(B) − S(AB) implemented in
a new `src/features/quantum-engine/mutualInformation.ts` module. For a *pure* two-qubit
state, S(AB) = S(|ψ⟩⟨ψ|) = 0 by construction, which lets Phase 9B.5 compute exact MI
without a general n×n Hermitian eigensolver. The dispatcher
`maybeComputePreviewMutualInformation` returns `'computed'` for `numQubits === 2`
states (dipole preview) and `'unsupported'` (with reason
`'requires-general-subsystem-entropy'`) for `numQubits ≥ 3` states (cycle-4 preview),
deferring 4×4 reduced-ρ entropy to a future phase along with SU(2) work. The
Correlation Summary Engine Preview section gained a new exact-vs-proxy comparison
sub-block between the reduced density matrix grid and the closing exact-vs-proxy
callout: when computed, two cards show exact I(Q0:Q1) in bits + nats (with S(AB)
breakdown) alongside the existing `mutualInformationProxy` value; when unsupported, a
dashed notice explains the deferral while still surfacing the proxy. A
qualitative-comparison disclaimer pins that the proxy is unitless and the exact MI is
in bits/nats — they are *not* a numeric error bar against each other. **No new physics
formula is introduced** (I(A:B) = S(A)+S(B)−S(AB) is the textbook definition);
**`derived.mutualInformationProxy`'s formula `(strengthMean × alignMean)^1.5` is
unchanged**.

Phase 9C-1 (2026-04-25) **lifted the 4-qubit MI restriction** by adding a general
real-symmetric Hermitian eigensolver and generalising both `vonNeumannEntropy` and the
mutual-information helpers. `entropy.ts` gained `eigenvaluesHermitian(matrix, eps)` — a
size-dispatched eigensolver: the existing analytic 2×2 path is kept verbatim; for n ≥ 3
the matrix is checked via `isEffectivelyRealHermitian`, projected to a real symmetric
matrix via `hermitianToRealSymmetric`, and diagonalised by a pure-TS Jacobi rotation
solver `eigenvaluesRealSymmetricJacobi(matrix, options)` (default `tolerance = 1e-12`,
`maxIterations = 100·n²`). `vonNeumannEntropy(rho, base, eps)` now accepts any size
through the new dispatcher. `mutualInformation.ts` gained
`mutualInformationQubitSubsystems(ket, numQubits, A, B)` which builds ρ_A, ρ_B, ρ_AB
via `partialTraceQubits` (sorted keep-lists for deterministic bases) and computes
`I(A:B) = S(A) + S(B) − S(AB)`. The Phase 9B.5 helper
`mutualInformationForTwoQubitPureState` and the dispatcher
`maybeComputePreviewMutualInformation` are refactored to delegate to the general helper
— the hardcoded `S(AB) = 0` shortcut is retired (the general eigensolver naturally
produces eigenvalues `{1, 0, 0, 0}` for a pure 2-qubit ρ, so `S(AB) = 0` is now a
*result* rather than a hardcode). The dispatcher now returns `'computed'` for every
state the engine produces today (Bell pair, Cycle-4/GHZ pair, GHZ(3), GHZ(4),
product(4)); the `'unsupported'` branch is reserved for the future-only case of a
reduced ρ with significant complex Hermitian off-diagonals (an SU(2) scenario, not
reachable from current Phase 9A/9B engine states). The Engine Preview UI's unsupported
notice was generalised in both locales to reflect that — its "deferred to a future
phase" wording is replaced by an honest "real-symmetric only; complex Hermitian
deferred" caveat. **No new npm dependency** (Jacobi is dependency-free pure TS), **no
new physics formula** (textbook Jacobi + textbook I(A:B) identity), **no proxy formula
change**, and the engine's React-/DOM-/i18n-agnostic discipline is preserved. The
selftest now runs **24 invariants** (was 17 in Phase 9B.5): one Phase 9B.5 GHZ-as-
unsupported assertion was *replaced* by its 9C-1 inversion (now `'computed'`) and
seven new assertions cover `eigenvaluesHermitian` (2×2 + 4×4),
`eigenvaluesRealSymmetricJacobi` (4×4 Bell-shaped), `vonNeumannEntropy` (4×4
diag(0.5, 0, 0, 0.5) = ln 2), `isEffectivelyRealHermitian` (GHZ(4) and Bell ρ-AB), and
`mutualInformationQubitSubsystems` (GHZ(4) → 1 bit, product(4) → 0 bits).

Phase 9C-2 (2026-04-25) **made the engine's exact correlation outputs visible** by
adding two heatmap surfaces inside the existing Engine Preview section of the
Correlation Summary Lab panel. New engine helper
`src/features/quantum-engine/pairwiseMutualInformation.ts` exports
`computePairwiseMutualInformationMatrix(ket, numQubits)` plus the supporting
`PairwiseMutualInformationCell` (`'diagonal' | 'computed' | 'unsupported'`) and
`PairwiseMutualInformationMatrix` types. The helper builds a symmetric `n × n`
matrix of `I(Qᵢ : Qⱼ)` values by delegating each strict-upper-triangle off-diagonal
to the Phase 9C-1 `mutualInformationQubitSubsystems` and mirroring into the lower
triangle, so each pair is computed exactly once. `maxComputedBits` is recorded as
the max bits across computed cells (or `0`), used by the UI to scale heatmap
intensity into `[0, 1]` — a **visual normalisation, not a new physics score**. Two
new visualisations land in `CorrelationSummaryPanel`:
the existing per-qubit entropy cards gain a horizontal fill bar (width =
`entropyBits / 1`, since one bit is the maximum single-qubit entropy), and a new
exact pairwise MI heatmap renders the matrix as a grid with axis labels Q0..Q(n-1),
em-dash diagonals, accent-tinted off-diagonals (background blended via
`color-mix(in srgb, var(--accent-soft), var(--surface-1))` driven by an
`--intensity` CSS custom property), and dashed `n/a` cells for unsupported pairs.
The new heatmaps preserve every prior surface byte-for-byte: existing entropy card
labels/values/secondary lines, the reduced density matrix grid for qubit 0, the
Phase 9B.5 exact-vs-proxy MI comparison block, the qualitative-comparison
disclaimer, and the closing exact-vs-proxy callout are all unchanged. **No new
proxy formula, no new top-level `AppMode`, no URL state / persistence change, no
new graph topology / state family / observable lens, no other Lab panel touched,
no new npm dependency.** The engine self-test now runs **27 invariants** (was 24
in Phase 9C-1): three new assertions cover `computePairwiseMutualInformationMatrix`
on Bell pair (2×2, off-diag = 2 bits, maxComputedBits = 2), product(4) (every
off-diagonal = 0 bits, maxComputedBits = 0) and GHZ(4) (every off-diagonal = 1 bit,
maxComputedBits = 1). The closed `'unsupported'` cell branch is preserved as a
defence against future complex-Hermitian states (Phase 9C-3 SU(2) territory) and
is unreachable through normal app flows today.

Phase 9C-3 (2026-04-25) **introduced the engine's first SU(2) representation-theory
building blocks** at `src/features/quantum-engine/spinRepresentation.ts`. New
exports: `validateSpinJ(j)` (rejects negative, non-half-integer, non-finite spins),
`spinDimension(j) = 2j + 1`, `magneticNumbers(j)` returning the canonical
**descending-m** ordering `[j, j−1, …, −j]`, raising / lowering operators
`spinJPlus(j)` / `spinJMinus(j)` in that basis, Cartesian generators `spinJX(j) =
(J+ + J−)/2`, `spinJY(j) = (J+ − J−)/(2i)` (= scaleMatrix · `−i/2`), the diagonal
`spinJZ(j) [i][i] = m_i`, the Casimir `spinCasimir(j) = JxJx + JyJy + JzJz`, and
the bundle helper `buildSpinJRepresentation(j)` which returns all of the above
in one struct. Three small **generic** linear-algebra helpers landed alongside in
`linearAlgebra.ts`: `addMatrices(A, B)` (element-wise, shape-checked),
`scaleMatrix(A, s)` (complex scalar), and `commutator(A, B) = AB − BA`. They
live in the linear-algebra layer because they are not SU(2)-specific — any
future representation-theory work, Lie-algebra sanity check, or intertwiner
closure verification can reuse them. **No qubit Hilbert factor was replaced**:
this phase is engine-only, no UI surface imports the new module yet, and no
existing engine code calls into it. The minimal-qubit-model preview, the
Phase 9C-1 general subsystem entropy + MI, and the Phase 9C-2 heatmaps are all
byte-identical to before. The selftest grew from 27 → **39 invariants** with
12 new SU(2) checks: `validateSpinJ` accepts `{0, ½, 1, 3⁄2}` and rejects
`{−½, 0.3, NaN, ∞}`; `spinDimension(0) = 1`, `spinDimension(½) = 2`,
`spinDimension(1) = 3`; `magneticNumbers(½) = [½, −½]`,
`magneticNumbers(1) = [1, 0, −1]`; `j = ½` matches the closed forms
`Jz = diag(½, −½)`, `Jx = ½σx`, `Jy = ½σy`; `j = 1` raising-operator
super-diagonals equal `√2`; Casimir `J²(½) = ¾ I` and `J²(1) = 2 I`;
canonical commutators `[Jx,Jy] = iJz` cyclic for both `j = ½` and `j = 1`;
Hermiticity `Jx† = Jx`, `Jy† = Jy`, `Jz† = Jz`, `(J+)† = J−` at both spins;
and `buildSpinJRepresentation(1)` returns the right `dimension` /
`magneticNumbers` / Casimir bundle. **No intertwiner basis is yet
implemented, no closure constraint, no Bell-network state, no area / volume /
dihedral expectation, no spherical-tetrahedron / flatness / curvature
score, no LQG geometry claim** — those are Phase 9D and onward. This phase
gives the engine the matrix toolkit needed to build those layers later
without rewriting the linear-algebra core.

Phase 9D-1 (2026-04-25) **introduced tensor-product spin spaces and total
angular-momentum operators** at `src/features/quantum-engine/spinTensorProduct.ts`.
New exports: the `SpinAxis` (`'x' | 'y' | 'z'`) and `SpinTensorProductSpace`
types; `tensorProductMatrices(matrices)` (variadic Kronecker product, left-fold
of the existing binary `tensorProductMatrix` from `quantumState.ts` —
**no duplicate implementation**); `buildSpinTensorProductSpace(spins)` which
validates each spin label, computes `dimensions = [2j_k + 1]` and
`totalDimension = Π dimensions`; `embeddedSpinOperator(spins, targetIndex, axis)`
which builds `I_{D_0} ⊗ … ⊗ J_axis(spins[targetIndex]) ⊗ … ⊗ I_{D_{k−1}}`;
`totalSpinOperator(spins, axis) = Σ_k embeddedSpinOperator(_, k, axis)`; and
`totalSpinSquared(spins) = Jx_total² + Jy_total² + Jz_total²`. Two canonical
2-spin-1/2 building-block helpers — `singletStateTwoSpinHalf()` returning
`(|↑↓⟩ − |↓↑⟩)/√2 = [0, 1/√2, −1/√2, 0]` and `tripletStatesTwoSpinHalf()`
returning `{plus = |↑↑⟩, zero = (|↑↓⟩+|↓↑⟩)/√2, minus = |↓↓⟩}` — round out
the surface; **they are NOT LQG intertwiners and NOT Bell-network states**,
they are the standard textbook two-spin-1/2 constructions and the per-file
header pins this verbatim. One small generic helper landed in
`linearAlgebra.ts` to support the new module: `expectationValue(ket, operator)`
returns `⟨ψ|O|ψ⟩` as a `Complex`. The selftest grew from 39 → **48
invariants** with 9 new SU(2) tensor-product checks: dim/totalDim of
`buildSpinTensorProductSpace([½, ½])` and `[1, ½]`; `embeddedSpinOperator`
on first and second factors equals `Jz ⊗ I_2` / `I_2 ⊗ Jz` respectively;
`totalSpinOperator(_, z) = Jz⊗I + I⊗Jz` (verified two ways: explicit
diag(1, 0, 0, −1) and bottom-up `addMatrices` of two embeddings);
`totalSpinSquared([½, ½])` eigenvalues `{2, 2, 2, 0}` via the Phase 9C-1
real-symmetric Jacobi solver (so the existing `eigenvaluesHermitian`
dispatcher also gets exercised on this 4×4); singlet normalised with
`⟨S|J²|S⟩ = 0` and `⟨S|J_axis|S⟩ = 0` for every axis; each triplet
normalised with `⟨T|J²|T⟩ = 2` and `⟨T_±|Jz|T_±⟩ = ±1`,
`⟨T_0|Jz|T_0⟩ = 0`; total commutators `[Jx_total, Jy_total] = i Jz_total`
cyclic on `[½, ½]`. **Composite basis convention (fixed for the engine):**
the composite basis is the Kronecker product of each factor's
descending-m basis, so `idx = Σ_k idx_k · D_{k+1}·…·D_{n−1}` with
`idx_k = j_k − m_k`; factor 0 is the outermost (most-significant). For
two spin-1/2 the composite basis is `[|↑↑⟩, |↑↓⟩, |↓↑⟩, |↓↓⟩]`. **No
intertwiner projector, no closure-constraint solver, no Bell-network
SU(2) state, no area / volume / dihedral expectation, no LQG geometry
claim** — those are Phase 9D-2 and onward. The `J_total = 0` eigenspace
of `totalSpinSquared` IS the SU(2)-invariant subspace at a node and
will become the natural intertwiner-space construction in 9D-2; this
phase only builds the operator whose spectrum encodes that
decomposition.

Phase 9D-2-a (2026-04-25) **extended the Phase 9C-1 Jacobi eigensolver to also
return eigenvectors**, in preparation for Phase 9D-2-b's invariant-subspace
projector. New exports from `entropy.ts`:
`eigendecompositionRealSymmetricJacobi(matrix, options)` returning
`{eigenvalues, eigenvectors}` per the canonical column convention
(eigenvectors = columns of the returned matrix, sorted alongside eigenvalues
in descending order); `eigendecompositionHermitian(matrix, eps)` dispatcher
that handles `n = 0`, `n = 1` (real-diagonal guard + trivial `[[1]]`), and
`n ≥ 2` via the real-symmetric path through `hermitianToRealSymmetric` +
the Jacobi eigendecomposition (so 2×2 routes through Jacobi, **not** the
analytic 2×2 path); and the matching return-type interfaces
`RealSymmetricEigendecomposition` and `HermitianEigendecomposition`.
**Behaviour preservation.** The existing `eigenvaluesRealSymmetricJacobi`
is refactored to delegate to `eigendecompositionRealSymmetricJacobi(_).eigenvalues`,
so all Phase 9C-1 / 9C-2 / 9D-1 callers (`eigenvaluesHermitian` for n ≥ 3,
`vonNeumannEntropy`, `mutualInformationQubitSubsystems`,
`computePairwiseMutualInformationMatrix`, the Jacobi-on-Bell-shaped-4×4
selftest, the `totalSpinSquared([½, ½])` spectrum selftest) get the
**byte-identical** eigenvalue lists they got before. The Phase 9C-1
algorithm (largest-pivot search, textbook Jacobi formula
`τ = (a_qq − a_pp) / (2 a_pq)`, smaller-root choice for stability,
default `tolerance = 1e-12`, `maxIterations = 100·n²`) is preserved
verbatim; only the additional `V` accumulation and the eigenvector
return are new. **Eigenvector convention (fixed for the engine):**
`V[row][col] = ⟨e_row | v_col⟩`, columns sorted by descending
eigenvalue. `V` is initialised to the identity and updated by
right-multiplication `V ← V · G` on each Givens rotation, so at
convergence `A = V · diag(λ) · Vᵀ` (real-symmetric ⇒ real-orthogonal V).
**Narrower than `eigenvaluesHermitian`.** The eigenvalue dispatcher has
an analytic 2×2 path that handles complex Hermitian off-diagonals
(Phase 9A's `eigenvaluesHermitian2x2`); the eigendecomposition
dispatcher does not — there is no analytic 2×2 eigenvector formula
implemented and it would not extend to n ≥ 3 anyway. Complex Hermitian
eigendecomposition (Householder + complex QR, or complex Jacobi) stays
deferred. The selftest grew from 48 → **54 invariants** with 6 new
9D-2-a checks: `diag(3, 2, 1)` returns identity eigenvectors and
reconstructs to itself; `[[2, 1], [1, 2]]` returns eigenvalues `{3, 1}`
with eigenvectors `(1, 1)/√2` (for 3) and `(1, −1)/√2` (for 1) up to
sign, plus reconstruction; tri-diagonal `[[2, 1, 0], [1, 2, 1], [0, 1, 2]]`
returns spectrum `{2 + √2, 2, 2 − √2}` with `Vᵀ V = I_3` orthonormality
and reconstruction; `eigenvaluesRealSymmetricJacobi` matches
`eigendecompositionRealSymmetricJacobi(_).eigenvalues` exactly on a 4×4
test matrix (the delegation contract); `totalSpinSquared([½, ½])`
returns spectrum `{2, 2, 2, 0}` and the eigenvector at column 3 is
`±singletStateTwoSpinHalf()` within `1e-9`, plus `J² ≈ V · diag(λ) · Vᵀ`
reconstruction; `eigendecompositionHermitian` throws on `[[1, i], [-i, 1]]`
with a "complex" message while `eigenvaluesHermitian` still computes
its `{0, 2}` spectrum analytically. **No invariant-subspace projector,
no intertwiner basis, no closure-constraint solver, no Bell-network
state, no area / volume / dihedral expectation, no LQG geometry
claim** — those are Phase 9D-2-b and onward.

Phase 9D-2-b (2026-04-25) **landed the first SU(2)-invariant subspace
projector** — the engine's first piece of code that anyone could honestly call
an "intertwiner basis", at one node only. New file
`src/features/quantum-engine/invariantSubspace.ts` exports
`invariantSubspaceProjector(spins, tolerance = 1e-8)` returning an
`InvariantSubspaceProjector` struct with `{spins, tolerance,
totalDimension, invariantDimension, eigenvalues, keptEigenvalueIndices,
basis, projector}`. The algorithm is a five-step composition of the
already-tested 9D-1 / 9D-2-a layers: (1) `buildSpinTensorProductSpace`
validates spins and computes the total Hilbert dimension; (2)
`totalSpinSquared(spins)` builds the total Casimir on the tensor
product (Phase 9D-1); (3) `eigendecompositionHermitian(j2)` returns
eigenvalues + eigenvectors in descending eigenvalue order
(Phase 9D-2-a); (4) the kept eigenvalue indices are those with
`|λ_k| < tolerance` (the j_total = 0 sector — by definition the
SU(2)-invariant subspace at a node); (5) the basis matrix `V` is the
columns of the eigenvector matrix at those indices, and the projector
is `P = V · V†`. The empty-subspace case is special-cased: when
`invariantDimension === 0`, `basis` is the canonical "totalDimension
rows of empty columns" shape and
`projector = zeroMatrix(totalDimension, totalDimension)`. **Basis
convention** matches Phase 9D-2-a: `basis[row][col] = ⟨composite_row | v_col⟩`
with column index running over the invariant subspace. **Honesty
boundary**: this is a **single-node** SU(2)-invariant subspace; the
basis vectors are NOT Bell-network states, NOT graph-level LQG
states, and NOT geometric-operator eigenspaces — those layers
(Phase 9E and onward) need edge-spin tensor structure between nodes
plus edge-pairing / gluing constraints, neither of which exists yet.
The selftest grew from 54 → **60 invariants** with 6 new 9D-2-b
checks: `[½, ½]` returns `dim = 1` with `P = |singlet⟩⟨singlet|`
element-wise, basis column ±|S⟩ within `1e-9`, plus full sanity
(`P† = P`, `P² = P`, `Tr(P) = 1`); `[½, ½, ½, ½]` returns `dim = 2`
(textbook 4-valent spin-½ intertwiner space) with sanity and
`⟨v|J²|v⟩ ≈ 0` for each basis column; `[1, 1]` returns `dim = 1`;
`[1, ½, ½]` returns `dim = 1` with `totalDim = 12`; the empty case
`[½]` returns `dim = 0` with the right shapes and zero projector;
the tolerance-variation case `[½, ½]` with `tolerance = 1e-10` still
returns `dim = 1`. All textbook intertwiner-space dimensions
(`mult(j_total = 0)` in the SU(2) Wigner decomposition) match
analytically derived values. **No Bell-network state, no edge
gluing, no multi-node graph state, no area / volume / dihedral
expectation, no spherical-tetrahedron / flatness / curvature
score, no LQG geometry claim** — those are Phase 9E.

Phase 9E-1 (2026-04-25) **surfaced the Phase 9D-2-b invariant-subspace
projector in the UI** as a new "Single-node SU(2) intertwiner sandbox"
section inside the existing Correlation Summary panel — the engine's
first SU(2) representation-theory output to appear on screen. New
adapter `src/features/lab/intertwinerSandboxPreview.ts` exports
`IntertwinerSandboxExampleId` (closed enum), `IntertwinerSandboxExample`
(static metadata), `IntertwinerSandboxResult`,
`getIntertwinerSandboxExamples()` (static four-element list),
`computeIntertwinerSandboxResult(example)` (engine call + projector
sanity checks: P† = P, P² = P, Tr(P) = dim within `1e-9`), plus the
formatting helpers `formatSpinLabel` / `formatSpinTuple` that render
spins as `[1/2, 1/2]` rather than `[0.5, 0.5]`. The four shipped
examples are the textbook SU(2) cases already covered by Phase 9D-2-b
selftests: `[½, ½]` (singlet sector, expected dim = 1), `[½, ½, ½, ½]`
(minimal 4-valent spin-½ node, expected dim = 2), `[1, 1]` (singlet
sector of two spin-1, expected dim = 1), `[1, ½, ½]` (3-valent mixed,
expected dim = 1). Each card surfaces the spin tuple, total tensor-
product dimension, computed invariant dimension, expected (textbook)
dimension, kept-eigenvalue indices, a 6-eigenvalue spectrum preview
(with ellipsis when truncated), three projector sanity chips
(pass/fail), and an interpretation paragraph from i18n. **No matrix
display:** the projector and basis matrices are deliberately not
rendered — too large for first-pass UX, and the dimensions plus
sanity chips already convey the structural content. UI placement is
between the existing Engine Preview section (4) and the State-family
curated correlation reading (5) inside Correlation Summary, so the
two epistemic registers (minimal qubit model · single-node SU(2)
model) sit in adjacent sections without bleeding into each other.
The header carries a neutral `[single-node SU(2) model]` chip in
`LabSection.headerRight` (no `<ProxyBadge>` — engine outputs are exact
within the model rather than proxies). New i18n block
`lab.correlations.intertwinerSandbox.*` shipped EN ↔ TR in lockstep
(intro / chip / 11 leaf labels / 4 example title+interpretation
pairs); technical SU(2) terms (`SU(2)`, `intertwiner`, `invariant
subspace`, `projector`, `spectrum`, `spin tuple`) stay English in TR.
New CSS classes (`intertwinerSandbox`, `su2ModelChip`,
`intertwinerIntro`, `intertwinerGrid`, `intertwinerCard`,
`intertwinerCardHeader`, `intertwinerCardTitle`, `spinTuple`,
`invariantStats`, `invariantStatLabel`, `invariantStatValue`,
`spectrumPreviewBlock`, `spectrumPreviewLabel`, `spectrumPreviewValue`,
`keptIndicesValue`, `sanityBlock`, `sanityLabel`, `sanityChips`,
`sanityChip`, `sanityChipPass`, `sanityChipFail`, `sanityChipState`,
`intertwinerInterpretation`) — every colour pulled from existing
design tokens (`--ok`, `--ok-soft`, `--warn`, `--warn-soft`,
`--surface-1`, `--surface-2`, `--border-subtle`, `--border-medium`,
`--text-*`). **Engine code unchanged**: no new function,
no new type, no selftest modification (the 60/60 selftest at
Phase 9D-2-b already protects the four sandbox examples). **No
Bell-network state, no edge gluing, no multi-node graph state, no
area / volume / dihedral expectation, no LQG geometry claim**, and
the existing minimal-qubit Engine Preview / heatmaps / exact-vs-proxy
MI comparison / closing exact-vs-proxy callout are all unchanged.

Mega Phase 9E-2 (2026-04-25) **introduced the engine's first
graph-level layer** — three new modules that move the engine from
single-node SU(2) representation theory to a Bell-network graph
contract plus a minimal two-node prototype state:
`src/features/quantum-engine/bellNetworkGraph.ts`,
`src/features/quantum-engine/spinHalfGluing.ts`, and
`src/features/quantum-engine/minimalBellNetworkState.ts`.
**`bellNetworkGraph.ts`** defines the core types
`BellNetworkNodeId`, `BellNetworkEdgeId`, `BellNetworkNode`,
`BellNetworkEdge` (carrying `id`, `source`, `target`, `spin`),
`BellNetworkGraph`, plus the per-node summary types
`BellNetworkNodeIntertwinerSummary` and `BellNetworkGraphSummary`.
`validateBellNetworkGraph(graph)` enforces nine rules: non-empty
nodes, non-empty unique node ids, non-empty unique edge ids, valid
endpoints, no self-loops (deferred), valid spins via `validateSpinJ`,
every node has at least one incident edge. **Parallel edges are
explicitly allowed** (the dipole graph requires them — multiple
distinct edge ids with identical `{source, target}`). Edge
`source` / `target` are **bookkeeping only**; there is no physical
orientation. Helpers `incidentEdgesForNode` / `incidentEdgeIdsForNode`
/ `spinsForNode` derive per-node spin tuples from the edge list (the
node never declares its spin tuple directly — that's the gluing
constraint). `summarizeBellNetworkGraph(graph)` validates the graph
and runs `invariantSubspaceProjector(spins)` (Phase 9D-2-b) once per
node, returning `{nodeId, incidentEdgeIds, spins, totalDimension,
invariantDimension, keptEigenvalueIndices}` for each node — **the
projector and basis matrices are deliberately NOT surfaced** in the
summary, those layers belong on a per-node deep-dive UI rather than a
graph-level summary. Three canonical constructors ship the graphs
Phase 9E-2 / 9E-3 / 9E-4 will exercise:
`createTwoNodeSingleEdgeSpinHalfGraph()` (2 nodes, 1 spin-½ edge —
each node spins `[½]`, totalDim 2, invariantDim 0),
`createDipoleSpinHalfGraph()` (2 nodes, 4 parallel spin-½ edges —
each node spins `[½, ½, ½, ½]`, totalDim 16, invariantDim 2),
`createCycle4SpinHalfGraph()` (4 nodes, 4 spin-½ edges in a ring —
each node spins `[½, ½]`, totalDim 4, invariantDim 1).
**`spinHalfGluing.ts`** provides `spinHalfSingletState()` (the
SU(2)-invariant singlet `(|↑↓⟩ − |↓↑⟩) / √2 = [0, 1/√2, −1/√2, 0]`
in the composite basis pinned by Phase 9D-1, byte-equal to
`singletStateTwoSpinHalf` from `spinTensorProduct.ts` — selftest
verifies — but architecturally distinct: it is the **edge gluing
primitive**, while `singletStateTwoSpinHalf` is a textbook two-spin-½
state used for `⟨J²⟩ = 0` checks). Plus the guards
`validateSpinHalfEdge(edge)` (strict equality `edge.spin === 0.5`)
and `assertAllEdgesSpinHalf(graph)` (every edge of a graph is
spin-½ — a precondition for graph-level Bell-network state builders
that gate on the singlet primitive). Higher-spin edge gluing
(arbitrary Wigner-3j) is NOT implemented; this module's strict guards
prevent multi-node builders from accidentally pretending to glue
arbitrary spins. **`minimalBellNetworkState.ts`** ships the closed
`MinimalBellNetworkStateKind` enum (`'two-node-single-edge-spin-half'`
only), the `MinimalBellNetworkState` interface (carrying graph, ket,
dimension, normalised flag, and the mandatory
`honesty: 'minimal-spin-half-bell-network-prototype'` literal), and
`buildMinimalSpinHalfBellNetworkState(graph)` which validates the
graph contract, asserts every edge is spin-½, then runs a strict
scope check: graph must have exactly 2 nodes and 1 edge. Other
shapes (dipole, cycle-4, …) throw with an explicit "Phase 9E-2
supports only the two-node single spin-1/2 edge prototype" message.
For the supported shape, `ket = spinHalfSingletState()` and
`dimension = 4`, with `normalised` checked against
`vectorNormSquared ≈ 1` within the existing `1e-10` tolerance. The
state IS the singlet on the single edge, interpreted as the joint
state on the two endpoint Hilbert factors; for this graph both
endpoint nodes have `invariantDimension = 0`, so the state is NOT a
tensor over per-node intertwiner spaces — it is the simplest possible
graph-level state and the starting point for Phase 9E-4's
intertwiner-aware multi-node gluing. **No arbitrary spin gluing, no
Wigner-3j, no dipole/cycle-4 state, no area / volume / dihedral
expectation, no spherical-tetrahedron / flatness / curvature score,
no graph dynamics, no cosmology layer, no LQG geometry claim** — all
deferred to Phase 9E-4 and onward. The selftest grew from 60 → **76
invariants** with 16 new 9E-2 checks: 6 graph-validation rejection
tests (duplicate node ids, duplicate edge ids, missing endpoint,
self-loop, invalid spin 0.3, negative spin), 1 parallel-edges-allowed
test (dipole validates), 3 graph-summary tests (two-node single-edge
→ each node spins `[½]` / dim 2 / inv 0; dipole → each node
incidentEdgeIds `[e0,e1,e2,e3]` / spins `[½,½,½,½]` / dim 16 /
inv 2; cycle-4 → each node spins `[½,½]` / dim 4 / inv 1), 3
spin-half singlet primitive tests (`‖ket‖² = 1`,
`spinHalfSingletState ≡ singletStateTwoSpinHalf` byte-equal,
`⟨J²⟩ = 0` on `[½, ½]`), and 3 minimal-state-builder tests
(two-node-single-edge succeeds with all fields correct, dipole
rejects with "Phase 9E-2" in the error message, cycle-4 rejects
with the same scope error). Every existing 60 self-check from
Phase 9D-2-b still passes byte-for-byte.

Mega Phase 9E-3 (2026-04-25) **surfaced the Phase 9E-2 graph contract
in the UI** as a new "Bell-network graph sandbox" section inside the
existing Correlation Summary panel — the engine's first graph-level
output to appear on screen. New adapter
`src/features/lab/bellNetworkSandboxPreview.ts` (pure TS, no React,
no i18n) exports the closed `BellNetworkSandboxExampleId`
(`twoNodeSingleEdge | dipoleSpinHalf | cycle4SpinHalf`), the closed
`BellNetworkSandboxGraphKind` and `BellNetworkSandboxDeferredReason`
unions, the `BellNetworkSandboxExample` / `BellNetworkSandboxResult`
/ `BellNetworkSandboxNodeSummary` interfaces and the
`BellNetworkSandboxPrototypeState` discriminated union
(`'available'` carries `kind`/`dimension`/`normalised`/`honesty`;
`'deferred'` carries a typed `reason`),
`getBellNetworkSandboxExamples()` (static three-element list — no
dropdown / no user input), and `computeBellNetworkSandboxResult`
which (a) calls the canonical 9E-2 graph constructor for each id,
(b) calls `summarizeBellNetworkGraph` to derive per-node spin tuples
+ intertwiner dimensions, (c) for the two-node single-edge id only
calls `buildMinimalSpinHalfBellNetworkState` to populate the
prototype-state details, and (d) for dipole / cycle-4 returns
`{status: 'deferred', reason: 'requires-edge-slot-bookkeeping'}`
**without calling the engine state builder** (calling it would throw
the engine's "Phase 9E-2 supports only…" error — which is the
correct engine-level response, but we don't want exceptions on the
UI render path). The adapter also computes `hasParallelEdges` for
each graph by hashing edge endpoint pairs as **unordered** keys
(`a < b ? '${a}::${b}' : '${b}::${a}'`), reflecting the Phase 9E-2
honesty rule that edge `source` / `target` are bookkeeping only.
`CorrelationSummaryPanel.tsx` gains a new `LabSection` between the
Phase 9E-1 single-node intertwiner sandbox (4.6) and the State-family
curated reading (5); computes the three results inline and renders
one card per graph with: title + interpretation paragraph from i18n;
graph facts dl (nodes / edges / edge spins / parallel edges yes-no);
prototype-state box (header label + status pill — `--ok-soft` for
"available", `--warn-soft` for "deferred"; available branch shows
kind / dimension / normalised / honesty in a dl, deferred branch
shows the localised reason text); and a per-node summary list with
node id + incident edges + spin tuple + total dimension + invariant
dimension per node. **No matrix display:** the projector / basis /
ket vectors are deliberately not rendered — same restraint as the
Phase 9E-1 sandbox; for the two-node prototype the dimension (4)
plus the `normalised: yes` and `honesty:
'minimal-spin-half-bell-network-prototype'` fields convey the
structural content. **No `<ProxyBadge>`** — engine outputs are exact
within the model rather than proxies; the four ProxyKinds don't
fit. A new `deferredReasonText` helper sits at the bottom of the
panel file alongside the existing `SanityChip` / `formatComplex` /
`clamp01` helpers; the helper is exhaustively typed over the closed
`BellNetworkSandboxDeferredReason` union so a missing case is a
TypeScript error. New i18n block
`lab.correlations.bellNetworkSandbox.*` shipped EN ↔ TR in lockstep
— `validate-ui-i18n.mjs` enforces the same key tree, leaf types, and
the three-example sub-tree on both sides. Technical SU(2) /
graph-theory terms (`Bell-network`, `graph contract`, `edge-slot
bookkeeping`, `intertwiner`, `invariant subspace`, `prototype state`)
stay English in TR; the surrounding prose is Turkish. New panel CSS
classes (32 total) pulled from existing design tokens — `--ok` /
`--ok-soft` for the available pill, `--warn` / `--warn-soft` for
the deferred pill, `--surface-1` / `--surface-2` /
`--border-subtle` / `--border-medium` for cards / labels / nested
node summary cards — no hardcoded colours. **Engine code
unchanged**: no new function, no new type, no selftest modification
(the 76/76 selftest at Mega Phase 9E-2 already protects the three
canonical graphs and the two-node prototype). **No Bell-network
state for dipole / cycle-4, no edge gluing, no edge-slot
bookkeeping, no Wigner-3j, no area / volume / dihedral expectation,
no LQG geometry claim** — those are Phase 9E-4 and onward.

Mega Phase 9E-4 (2026-04-25) **lifted the dipole and cycle-4 graphs
from "deferred" to projected graph-level Bell-network states**, the
engine's first multi-node graph state. Two new engine modules:
`src/features/quantum-engine/edgeSlotBookkeeping.ts` and
`src/features/quantum-engine/spinHalfBellNetworkState.ts`, plus a
new generic `matrixVectorMultiply(matrix, vector)` helper in
`linearAlgebra.ts`. **`edgeSlotBookkeeping.ts`** provides the types
`NodeSlotAssignment` / `EdgeEndpointSlot` / `EdgeSlotAssignment` /
`BellNetworkSlotBookkeeping` and the function
`canonicaliseEdgeSlots(graph)` which resolves each edge endpoint to
a `(nodeId, slotIndex)` pair where `slotIndex` is the edge's
position in `incidentEdgeIds(graph, nodeId)` — the same per-node
slot ordering Phase 9E-2 / 9E-3 already used for the per-node
intertwiner spaces, so slot indices in the new bookkeeping match
slot indices in the existing UI surfaces. **Parallel edges are
resolved by edge id**: the dipole's four parallel edges get distinct
slot pairs `(0,0), (1,1), (2,2), (3,3)` — selftest #60 verifies this
explicitly. Edge `source` / `target` remain bookkeeping only; they
fix a sign convention for the singlet primitive but the projected
state's overall sign drops out of every observable.
**`spinHalfBellNetworkState.ts`** is the heart of the phase. It
exports the closed `SpinHalfProjectedBellNetworkStateKind` enum
(`'dipole-spin-half-projected' | 'cycle4-spin-half-projected'`),
the `SpinHalfProjectedBellNetworkState` interface (carrying both
the `endpointKet` in the full endpoint Hilbert space and the
`invariantCoefficients` in the graph invariant subspace, plus
`endpointDimension` / `invariantDimension` /
`perNodeInvariantDimensions` / `normBeforeProjectionNormalisation`
/ `normalised` / `honesty: 'spin-half-projected-bell-network-state'`),
the layout types `EndpointSlotRef` / `EndpointLayout`, the
`GlobalNodeProjector` interface, and four functions: the helper
`buildEndpointLayout(graph, bookkeeping)` flattens per-node slots
into a global slot list (node-major / incident-edge-minor) and
reports `endpointDimension = 2^(Σ_node valence)`;
`buildSpinHalfLinkSingletProductKet(graph, bookkeeping, layout)`
builds `⊗_edges (|↑⟩|↓⟩ − |↓⟩|↑⟩)/√2` in the global endpoint
basis by enumerating `2^|edges|` term-choice combinations, with
norm 1 by construction (selftest #62 / #63 verify);
`buildGlobalNodeProjector(graph)` runs
`invariantSubspaceProjector(spinsForNode)` once per node and
tensor-products the per-node projectors AND per-node basis matrices
into global versions (the existing `tensorProductMatrices`
left-fold handles rectangular matrices correctly); and finally
`buildSpinHalfProjectedBellNetworkState(graph)` composes the
pipeline with: shape recognition (only dipole / cycle-4 supported —
otherwise throw "Phase 9E-4 supports only…"), bookkeeping + layout
+ link ket + global projector, then `projected = P_global ·
linkKet`, normalisation guard (`normBefore > 1e-12`), final
normalisation, `invariantCoefficients = B† · endpointKet`, and a
final norm check. **Composite endpoint basis convention pinned in
module header:** Kronecker product of per-slot spin-1/2 factors
with slot 0 most significant, matching the Phase 9D-1 tensor-product
convention exactly so `⊗_node P_inv(node)` acts on the same global
basis as the link product without an index permutation. **Two-node
single-edge graph not handled here** — it has invariantDim 0 per
node, the projected builder rejects it by shape, and the Phase 9E-2
minimal prototype path remains its canonical builder. **UI:** the
`bellNetworkSandboxPreview.ts` adapter is widened — its
`BellNetworkSandboxPrototypeState.available` branch now carries an
optional `stateRegister` discriminant
(`'minimal-two-node-prototype' | 'spin-half-projected-bell-network-state'`)
plus optional `endpointDimension`, `invariantDimension`,
`perNodeInvariantDimensions`, and
`normBeforeProjectionNormalisation` fields populated only for the
projected register. The `computeBellNetworkSandboxResult` function
now calls `buildSpinHalfProjectedBellNetworkState` for dipole /
cycle-4 and `buildMinimalSpinHalfBellNetworkState` for the
two-node graph; the deferred branch is unreachable from the
canonical examples but stays in the type for future shapes. **The
Bell-network sandbox section in Correlation Summary now shows
all three canonical graphs as "available"** with state-register /
kind / dimension / endpoint-dim / graph-invariant-dim /
per-node-invariant-dims / normalised / norm-before / honesty rows
on the projected cards. **No matrix display** — neither the
endpointKet (`Complex[256]` for both dipole and cycle-4) nor the
invariantCoefficients (`Complex[4]` for dipole, `Complex[1]` for
cycle-4) are surfaced through the UI, in line with the
Phase 9E-1 / 9E-3 matrix-display restraint. New i18n leaves
under `lab.correlations.bellNetworkSandbox.*`:
`stateRegisterLabel`, `endpointDimensionLabel`,
`graphInvariantDimensionLabel`, `perNodeInvariantDimensionsLabel`,
`normBeforeProjectionLabel`, plus `stateRegisters.{minimalTwoNodePrototype,
spinHalfProjectedBellNetworkState}` and updated example
interpretations and intro / chip / `deferredReasons` strings.
EN ↔ TR shipped in lockstep. The selftest grew from 76 → **84
invariants** with 8 new 9E-4 checks: `canonicaliseEdgeSlots` on
dipole (parallel-edge slot pairs) and cycle-4 (mixed
source/target ordering); link-singlet product norm = 1 for both
graphs; full projected-state assertions for dipole (kind / dims /
normalisation / `P · ket ≈ ket`) and cycle-4 (same plus invariant
dim 1); rejection tests for two-node single-edge (invariantDim 0
at every node) and arbitrary 3-node line (shape not in canonical
set), both throwing with "Phase 9E-4" in the error message. Every
existing 76 self-check from Mega Phase 9E-3 still passes
byte-for-byte. **No arbitrary spin Wigner-3j, no arbitrary-graph
Bell-network state, no area / volume / dihedral expectation, no
geometry reconstruction, no cosmology dynamics, no LQG geometry
claim** — those are Phase 9F territory.

Mega Phase 9F (2026-04-25) **packaged the engine for academic
presentation** without touching engine, UI, or numerical outputs. The
project now has an explicit four-tier epistemic ladder, an
audience-ready 5–7 minute demo flow, a canonical reference for which
register can claim what, and a three-horizon research roadmap. New
documentation directory `docs/`:
[`docs/academic-demo-flow.md`](./docs/academic-demo-flow.md),
[`docs/honesty-classes.md`](./docs/honesty-classes.md), and
[`docs/future-research-roadmap.md`](./docs/future-research-roadmap.md).
**README.md** and **README.tr.md** gain a parallel
*Academic Scope: Bell-Network Geometry Lab* section that names the
four tiers (pedagogical proxy → minimal qubit quantum-information →
single-node SU(2) representation theory → spin-1/2 projected
Bell-network state), spells out an exact / proxy / future-LQG
comparison table, and links the three companion docs. **RELEASE_NOTES.md**
gains an "Academic Demo Milestone" entry on top describing what the
release contains. **No engine code, no UI logic, no i18n keys
modified.** Engine selftest stays at 84/84. UI numeric outputs are
byte-identical to Mega Phase 9E-4. The release is purely an academic
packaging step — making the existing engine state demonstrable to a
research audience without inflating any claim envelope. The Phase
9F constraint codifies the honesty discipline as a documentation
rule: future research targets must extend the four-tier ladder
deliberately, never blur the boundary between exact and future-LQG.

## High-level architecture

### Four knobs, one state

`DemoConfig` (`src/types/graph.ts`) has **exactly four user-facing knobs**, orthogonal to
mode:

- `graphTopology` — which spin network (`'dipole'` or `'cycle4'`). Both ship with 4 face
  pairs so the same state-family arrays apply to either.
- `stateFamily` — which correlation pattern (5 deterministic presets).
- `entanglementStrength` — slider 0..1.
- `observableMode` — which of 5 lenses the UI reports (alignment, mismatch, gluing,
  correlation, uniformity). The lens **never moves the canvas geometry**; it only re-weights
  per-pair emphasis and re-reads the headline Summary card.

Topology is the only knob that invalidates selection — `App.tsx` clears `selectedEdgeId` via
`useEffect` when `config.graphTopology` changes, because edge ids are topology-specific.

### Toy physics pipeline (keep coherent)

Everything displayed comes from deterministic formulas in `src/features/graph/`:

```
stateFamilies.ts (family = strengthOffsets[4] + mismatchCoeff[4] + edgeNarratives[4])
      │
      ▼
computePairSnapshot(family, i, strength)     ← in deriveCorrelationState.ts
      │     returns { localStrength, localMismatchAngle,
      │                localAlignmentScore, localGluingProxy }
      │
      ├── deriveCorrelationState(strength, family)   → CorrelationState (global 4 metrics)
      ├── deriveEdgeDetails(edges, strength, family, observableMode)
      │                                               → EdgeDetail[] (per-pair, includes emphasis)
      └── deriveObservableSummary(family, strength, observableMode)
                                                      → ObservableSummary (hero card)
```

The **same `mismatchCoeff` and `82°` constant** drive both the canvas arrow angles in
`DipoleGraphView.tsx` / `CycleGraphView.tsx` and the numeric `localMismatchAngle` in the
detail card — they cannot drift. If you change one formula, update the others and the
README formula table.

`MAX_MISMATCH_DEG = 82` is the canonical constant, exported from `deriveCorrelationState.ts`.

### Topology registry + shared visual primitive

`src/data/topologies.ts` is the single source of truth for the shippable graphs. Each
`GraphTopology` declares `id`, `label`, `shortDescription`, `symmetryNote`, `nodes`, `edges`
and `pairCount`. Adding a new topology means:

1. Extend `GraphTopologyId` in `src/types/graph.ts`.
2. Append a `GraphTopology` object to `TOPOLOGIES` in `src/data/topologies.ts` with exactly
   4 edges (the current state-family arrays assume `PAIR_COUNT = 4`).
3. Build a matching `*GraphView.tsx` that composes the shared
   `features/visualization/FacePairGraphic.tsx` primitive — the graphic handles all the
   per-pair visuals (edge, arrows, hit regions, halo, pair label, keyboard / selection /
   hover) so a topology view only contains layout logic (node positions, edge path
   construction, per-endpoint base angle).
4. Register the new view in `VisualizationPanel.tsx`'s topology switch.

Shared layout helpers live in `features/visualization/graphGeometry.ts`
(`angleToUnit`, `arrowGeometry`). `PAIR_COLORS` lives in `src/data/dipoleGraph.ts` and is
topology-agnostic.

### Content architecture

Authoring is data-driven. There are four content kinds (`ContentKind` in
`src/types/content.ts`): `lesson`, `challenge`, `bridge-lesson`, `glossary`. Each has:

- its own type file (`src/types/{learning,challenge,bridge,glossary}.ts`) that `extends
  ContentMeta` (optional `status`, `hidden`, `authorNote`, `lastUpdatedLabel`);
- its own data file (`src/data/{lessons,challenges,bridgeLessons,glossary}.ts`) with the
  canonical array + `getX(id)` lookup + `FIRST_*_ID` initial constant;
- a slot in `src/data/contentIndex.ts` — **this is the single authoring API** re-exporting
  every collection plus `getContentRef`, `getRelationsForContent` (outgoing),
  `getContentMentioningConcept` (incoming / inverse index), and `getContentStats`.

Cross-links flow through the id unions:

```
Glossary.suggestedLessonIds       → LessonId[]
Glossary.suggestedChallengeIds    → ChallengeId[]      (optional)
Glossary.suggestedBridgeLessonIds → BridgeLessonId[]   (optional)
Lesson.conceptTags                → GlossaryEntryId[]
Challenge.relatedConceptIds       → GlossaryEntryId[]
Challenge.relatedLessonIds        → LessonId[]
BridgeLesson.relatedConceptIds    → GlossaryEntryId[]
BridgeLesson.relatedLessonIds     → LessonId[]
BridgeLesson.suggestedChallengeIds→ ChallengeId[]      (optional)
```

`ConceptTag` in `types/learning.ts` is an alias for `GlossaryEntryId` — every lesson tag must
be a real glossary entry.

To add a new lesson / challenge / bridge / entry: extend the id union in the types file and
append an object to the data array. **No component code changes are required.** TypeScript
strict will surface any id collision or missing required field. README has step-by-step
per-kind instructions.

### Navigation context

`src/features/learning/GlossaryContext.tsx` is misleadingly named — it is actually the
**app-level navigation overlay context**. It owns every handler that can change mode or open
a drawer: `openEntry`, `openAtlas`, `closeAtlas`, `openLibrary`, `closeLibrary`,
`openLesson`, `openChallenge`, `openBridgeLesson`. The `App.tsx` component composes these so
any `open*` call closes the other overlays. Use `useGlossary()` anywhere you need to
navigate between modes or open a drawer — never thread these callbacks as props.

### Inline glossary tokens

Lesson and bridge lesson narratives are stored as plain strings but may include
`[[concept-id|display text]]` tokens. `renderGlossaryInline` in
`src/features/learning/renderGlossaryInline.tsx` parses these into clickable
`<GlossaryLink>` buttons that open the atlas. Theory cards use `<GlossaryLink id>` directly
in JSX since they are not data-driven.

### App layout + footer-swap pattern

`AppLayout` has four slots: header / sidebar / main / footer. The **footer slot is the mode
switch**:

- Explore: 4 theory cards in a responsive grid.
- Learn: `LessonPanel`.
- Challenge: `ChallengePanel`.
- Bridge: `BridgePanel`.
- Lab: `LabPanel` (Faz 2 skeleton — see *Geometry Lab skeleton* below).

Sidebar (`ControlPanel`) and main (`VisualizationPanel`) are constant across modes. The two
drawers (`ConceptAtlasPanel`, `ContentLibraryPanel`) are rendered at the App level outside
the layout and overlay everything.

Selection state (`selectedEdgeId`) lives in `App.tsx`, not in `VisualizationPanel`, so
lesson / challenge / bridge "Apply setup" actions can set it.

### Geometry Lab skeleton (Faz 2)

The Geometry Lab is a fifth peer mode (`AppMode === 'lab'`) that ships as a skeleton in
this build. Files:

- `src/types/lab.ts` — `LabPanelId` (closed set: `'gluing' | 'symmetry' | 'effectiveGeometry'
  | 'correlations' | 'researchNotes' | 'openProblems'`), `ProxyKind` (closed set:
  `'pedagogical-proxy' | 'conceptual-diagnostic' | 'curated-classification' |
  'future-calculable-observable'`), `LAB_PANEL_IDS`, `FIRST_LAB_PANEL_ID`, `PROXY_KINDS`,
  and the static `LAB_PANEL_PROXY_KIND` registry.
- `src/features/lab/LabPanel.tsx` — root container: header / scope-note card / panel
  switcher (segmented tab strip over `LAB_PANEL_IDS`) / active panel body. Active panel
  selection is owned by `App.tsx` so it round-trips through `localStorage` and the URL
  hash.
- `src/features/lab/shared/ProxyBadge.tsx` — visible honesty-class tag. Rendered on the
  panel surface (not in a tooltip, per the *Proxy honesty* constraint). Each `ProxyKind`
  has its own colour (accent / ok / warn / muted) so the four classes are recognisable at
  a glance.
- `src/features/lab/shared/PlaceholderPanel.tsx` — generic skeleton panel. Reads label /
  short goal / placeholder body from `lab.panels[panelId]` i18n and pulls the panel's
  intended honesty class from `LAB_PANEL_PROXY_KIND[panelId]`. Faz 3+ panels can keep
  using it (passing children) or replace it once they have non-placeholder UI.
- **Faz 5.5 shared Lab UI primitives** under `src/features/lab/shared/`:
  - `LabShared.module.css` — root surface, header (`.title` / `.intro`), section pattern
    (`.section` / `.sectionCard` / `.sectionLabel` / `.sectionHeader` / `.cardBody`),
    diagnostic row chrome (`.diagnosticList` / `.diagnosticRow` / `.diagnosticRowHeader` /
    `.diagnosticRowTitleGroup` / `.diagnosticRowTitle` / `.diagnosticRowScopeChip` /
    `.diagnosticRowBody` / `.diagnosticRowDescription` / `.diagnosticRowValue` /
    `.diagnosticRowNotComputed` / `.diagnosticRowProxyNote`), limitations bullet list
    (`.limitations` / `.limitationsList` / `.limitationsItem` with the warn-coloured
    `::before` marker), accent-tinted callout (`.callout` / `.calloutBody`), and the
    active reading card pattern shared by Symmetry + Effective Geometry (`.readingCard`
    / `.readingHeadline` / `.readingBody`).
  - `LabSection.tsx` — generic section wrapper (`label` + `children` + optional
    `className` for `sectionCard` chrome + optional `headerRight` for an inline
    right-aligned ProxyBadge + optional `ariaLabel`).
  - `LabDiagnosticRow.tsx` — single-component union of every diagnostic-row variant
    used in the three real Lab panels: required `title` / `body` / `proxyNote` / `kind`
    plus optional `value` (numeric pedagogical-proxy pill), `notComputedLabel`
    (future-calculable-observable pill) and `scopeChip` (topology-restricted
    applicability tag near the title).
  - `LabLimitationsList.tsx` — `label` + `ariaLabel` + `items: readonly string[]`.
  - `LabCallout.tsx` — `label` + `body`, accent-tinted "how to read" callout
    rendered as `<aside>`.
  - `LabFamilyReadingList.tsx` (Faz 6.5) — presentation-only list of curated
    state-family readings, consumed by Symmetry + Correlation panels. Props:
    `families: readonly StateFamilyPreset[]`, `activeFamilyId: StateFamily`,
    `readings: Record<StateFamily, { headline: string; body: string }>`,
    `activeChipLabel: string`, optional `ariaLabel`. Active family is
    highlighted with the accent-soft pattern; the active chip flows inline
    next to the family label (Correlation's pattern, hoisted as canonical).
  Real Lab panels consume these primitives; panel-specific layouts (Gluing's
  pair table, Effective Geometry's vector/twisted/Regge comparison grid,
  Correlation's pair-profile + global-summary grids) stay in each panel's own
  CSS module.

In addition, `LabPanel.tsx` renders a Faz 6.5 **demo-off context banner** —
a warn-tinted `<aside>` shown only when `config.demoMode === false`,
explaining that every pedagogical-proxy value across the four real Lab
panels reads zero because the canonical pipeline is fed `strength = 0`
(mirroring `VisualizationPanel`'s pre-existing behaviour). The banner is
informational only — no `ProxyBadge`, no diagnostic claim.
- `src/features/lab/panels/{Gluing,Symmetry,EffectiveGeometry,CorrelationSummary,ResearchNotes,OpenProblems}Panel.tsx`
  — one component per `LabPanelId`. **Gluing Diagnostics is real (Faz 3)** and
  reads the canonical `deriveCorrelationState` / `deriveEdgeDetails` pipeline
  via the `config` prop forwarded by `LabPanel`; it carries six structural
  sections (header / hierarchy / diagnostic rows / pair table / limitations /
  how-to-read) and renders five labelled rows, two `pedagogical-proxy` and
  three `future-calculable-observable`. **Symmetry / Automorphism Diagnostics
  is real (Faz 4)** and reads structural metadata only — `getTopology` for
  the active topology (incl. its existing `symmetryNote`), `getStateFamilies`
  for the five curated state-family readings — and surfaces the same
  `config` prop pattern. It carries seven structural sections (header /
  context / active topology card / five-card family classification list with
  active highlight / six diagnostic rows / limitations / how-to-read) and
  renders three `conceptual-diagnostic` rows, one `curated-classification`
  row, and two `future-calculable-observable` rows. **No automorphism
  algorithm runs anywhere in the panel** — the readings are author-curated
  text keyed by topology id and state-family id under the `lab.symmetry.*`
  i18n tree. **Effective Geometry Summary is real (Faz 5)** and reads the
  same canonical `deriveCorrelationState` pipeline as the canvas + Gluing
  Diagnostics so numeric values cannot drift. It carries seven structural
  sections (header / hierarchy framing / vector-twisted-Regge comparison
  cards / topology-specific note / seven diagnostic rows / limitations /
  how-to-read) and renders two `pedagogical-proxy` rows (reading
  `antiParallelScore` and `gluingScore`), two `conceptual-diagnostic` rows
  (flat-vs-spherical tetrahedron framing — the spherical row carries a
  `dipole-specific` chip when active topology is not the dipole), and three
  `future-calculable-observable` rows (twisted phase-space data, Regge
  shape-matching, exact LQG expectation values). **No new toy formula** —
  no "effective geometry score", no "flatness score", no "sphericity score"
  is invented; the panel only reads existing pipeline outputs and labels
  them through the vector-geometry lens. **Correlation Summary is real
  (Faz 6)** and reads the same canonical `deriveCorrelationState` /
  `deriveEdgeDetails` pipeline as the canvas + the three other real
  panels. It carries eight structural sections (header / hierarchy
  framing / 4-card per-pair profile / 3-card global proxy summary /
  5-item curated state-family readings / 6 diagnostic rows / limitations
  / how-to-read) and renders two `pedagogical-proxy` rows (pair-level
  profile + global tendency), one `curated-classification` row (family
  reading), one `conceptual-diagnostic` row (symmetry-vs-correlation
  distinction), and two `future-calculable-observable` rows (exact
  intertwiner-space correlators, reduced density matrix / local
  entanglement entropy). The `mutualInformationProxy` value is
  surfaced honestly with an explicit proxy-note declaring that it is a
  toy formula `(strengthMean × alignMean)^1.5` and not the quantum
  mutual information of any density matrix. **No new pair-pair
  correlation formula, no exact two-point function calculation, and no
  reduced density matrix or entanglement entropy is computed.**
  **Research Notes is real (Faz 7)** and is **explanatory, not
  computational** — it does not read the canonical pipeline, runs no
  algorithm against the active state, and renders no `<ProxyBadge>`
  per note. The panel carries three structural sections (header /
  panel-scope card / six note cards) plus an explicit panel-scope
  honesty disclaimer; the six notes (`bellNetworkGluing`,
  `geometryHierarchy`, `homogeneousGraphs`,
  `dipoleEffectiveGeometry`, `correlations`, `proxiesToObservables`)
  each carry a thesis + `whyItMatters` + `inThisApp` + `futureWork`
  field, with the `inThisApp` field repeating the relevant honesty
  disclaimer in context. **Faz 7 keeps Research Notes in the UI
  i18n tree (`lab.researchNotes.*`) instead of creating new data
  files; this avoids expanding `validate-i18n.mjs` paths until the
  note system becomes larger.** **Open Problems is real (Faz 8)** —
  the sixth and final Lab panel, replacing the Faz 2 placeholder. It
  is a **research-program panel**: explanatory like Research Notes,
  but structured as eight research-paper-abstract-style cards, each
  tied to the diagnostic Lab panels where its corresponding
  `future-calculable-observable` row already surfaces. Per-problem
  content lives in `src/data/openProblems.ts` (a locale-keyed record
  pattern mirroring `topologies.ts` / `stateFamilies.ts`); panel
  shell strings live in `lab.openProblems.*` i18n. Each card carries
  a title, a source-panel chip row (`Appears in: <Panel>`), and five
  labelled sub-fields (Real observable / Proxy used in app / Missing
  physics / Why it matters / Research direction); the
  Research-direction body is the only forward-looking field and gets
  a slight italic + text-primary emphasis. **No
  `<ProxyBadge>` per card, no panel-level scope card, no
  how-to-read callout** — the per-card structure carries the honesty
  register without duplicating disclaimers from other panels. **All
  six Lab panels are now real**; no `PlaceholderPanel` consumer
  remains, though `PlaceholderPanel` itself stays in the codebase as
  a tool for future Lab-panel additions.

URL state and persistence are extended additively. `UrlState.labPanel` is optional and
encoded only when `mode === 'lab'`; old hashes round-trip unchanged. `PersistedState`
gains an optional `activeLabPanelId` that defaults to `FIRST_LAB_PANEL_ID` when absent —
**no `STORAGE_KEY` bump** is needed (v1 stays good).

i18n: a new top-level `lab` key in `UI_STRINGS` carries every visible string the Lab
needs (heading, scope note, panel labels, placeholder body per panel, proxy-kind labels +
titles). `modes.lab.{label,hint}` provides the ModeToggle copy. Both EN and TR ship in
lockstep; `validate-ui-i18n.mjs` enforces structural parity.

The Lab does **not** introduce a new `DemoConfig` knob, a new state family, a new
observable lens, or a new graph topology. **No Lab panel introduces a new toy formula.**
Real diagnostic panels (currently: Gluing Diagnostics in Faz 3) read existing pipeline
outputs verbatim — `derived.antiParallelScore`, `derived.gluingScore`, the per-pair
`localStrength` / `localMismatchAngle` / `localAlignmentScore` / `localGluingProxy` from
`deriveEdgeDetails` — and label them with their honesty class via `ProxyBadge`. Numbers
that the app does *not* compute are rendered as a visible "not computed" pill rather
than hidden, so the gap between Lab proxies and a real LQG calculation stays legible on
the panel surface.

### Session persistence + URL sharing

`App.tsx` resolves its initial state by folding three sources with precedence
**URL hash > `localStorage` > hard-coded defaults**, then runs a single effect that
(a) serialises every persisted field into `localStorage` under the versioned key
`bell-network-visualizer:v1` and (b) writes the URL hash via `history.replaceState`.

- `src/utils/persistence.ts` — `loadPersistedState()` / `savePersistedState()`; both
  silent-fallback on SSR, missing, malformed, private-mode or quota-exceeded cases. Bump
  the version suffix in `STORAGE_KEY` whenever the persisted shape changes incompatibly.
- `src/utils/urlState.ts` — `parseUrlHash()` / `encodeUrlHash()` / `writeUrlHash()`. The
  hash schema is deliberately short: only the four knobs + active mode's own content id +
  selected edge. Content ids are passed through without runtime union-check here; `App.tsx`
  validates them against the real lookup tables (`getLesson` / `getChallenge` /
  `getBridgeLesson` / `getGlossaryEntry`) and falls back to the `FIRST_*_ID` constants if
  the id no longer exists.

### First-run onboarding

`src/features/learning/StartHereCard.tsx` renders as the lead tile of the Explore-mode
footer grid when `onboardingSeen === false`. Three primary actions: *Start with Learn*,
*Explore freely*, *Open Atlas*. The card writes `onboardingSeen = true` through every
action and via an explicit × dismiss button. The header's **How to use** button
(`Header.tsx`) flips the flag back to re-show it (also switches to Explore mode first).

### Cross-mode recommendations

`src/features/learning/recommendations.ts` contains `getLessonRecommendations(lesson)`:
picks one challenge + one bridge lesson based on shared `conceptTags` ∩
`relatedConceptIds`, ties broken by `order`. `LessonPanel` renders the result as a
**Next step** block only after `state.revealed === true` so it appears at a natural pause
after the checkpoint is answered. Challenge and Bridge panels already surface their own
related-item links, so no analogous block is needed there.

### Design tokens

All CSS variables live in `src/styles/global.css`: `--surface-0..3` layered backgrounds,
`--border-subtle/medium/strong`, `--text-primary..quaternary`, `--accent` + `--ok` +
`--warn` (with `*-soft` alpha variants), `--sp-0..9`, `--radius-xs..pill`, `--shadow-*`,
`--ring-focus`, `--t-fast/med/slow`. Every component CSS module references these — do not
hard-code colours or spacing. A `@media (prefers-reduced-motion: reduce)` rule globally
zeroes animation durations.

### Constraints that have been deliberately preserved

- **No backend, no API keys, no tracking.** Deploy target is GitHub Pages.
- **No runtime dependencies beyond React/ReactDOM.** Styling is CSS modules + plain CSS.
- **Fixed set of topologies** — Dipole and Cycle-4 are hard-coded in
  `src/data/topologies.ts`. Arbitrary graph editing is out of scope; adding a topology is a
  registry change, not a UI change.
- **`PAIR_COUNT = 4` is load-bearing.** State-family arrays (`strengthOffsets`,
  `mismatchCoeff`, `edgeNarratives`) all assume exactly four pairs. Any new topology must
  match this to keep the family arrays topology-agnostic.
- **Toy-model honesty.** All metrics are illustrative proxies. The Bridge module
  specifically frames what the demo does *not* cover; preserve that register in any new
  narrative.
- **Proxy honesty (Geometry Lab discipline).** Any future Geometry Lab diagnostic must be
  explicitly labelled as one of: **pedagogical-proxy**, **conceptual-diagnostic**,
  **curated-classification**, or **future-calculable-observable**. The label is part of the
  public surface (visible in the panel, not buried in a tooltip); no Lab diagnostic ships
  unlabelled. This is the academic-honesty rule introduced in the Faz 1 documentation pass —
  see *Academic Direction* and *Honesty / Scope* in `README.md` / `README.tr.md`. The Faz 2
  build enforces it at the **component level** via
  `src/features/lab/shared/ProxyBadge.tsx`: every `ProxyBadge` requires a `kind` prop
  (no unlabelled state), the badge is always rendered on the panel surface (the longer
  description is exposed via `title`/`aria-label` only as a secondary affordance), and
  the static `LAB_PANEL_PROXY_KIND` registry in `src/types/lab.ts` ties each `LabPanelId`
  to its declared honesty class so future panels cannot quietly become unlabelled.
- **`prefers-reduced-motion`** gated for every animation.
- **`data-export-ref="visualization-panel"`** on the main visualization container is an
  inert hook for a future snapshot/export helper — it is not connected to anything yet.
- **Phase 9A engine honesty (minimal qubit model).** The pure-TS engine at
  `src/features/quantum-engine/` computes *exact* finite-dimensional quantum-information
  observables (density matrices, partial traces, von Neumann entropy) for a **minimal
  qubit model** of small Hilbert spaces. Any UI surface that displays Phase 9A outputs
  MUST label them as `minimal qubit model` results — the `MinimalQubitGraphState.honesty`
  field and the per-file header comments on every engine module are the machine-readable
  + author-readable enforcement. **Phase 9A is not an SU(2) intertwiner calculation,
  not an LQG Bell-network state, not a geometric-operator expectation value, and not a
  spherical / flat-tetrahedron curvature signature.** The SU(2) / intertwiner basis /
  one-node-observable upgrade is part of Phase 9C+ and replaces the qubit Hilbert
  factors in `quantumState.ts` and `graphState.ts` while leaving the linear-algebra,
  density-matrix, partial-trace and entropy layers unchanged.
- **Phase 9B engine preview honesty.** The Minimal Qubit Engine Preview sub-section in
  Correlation Summary is the engine's *only* UI surface today. Engine outputs there are
  *exact within the minimal qubit model* — but "exact" never means "exact LQG result".
  The `[minimal qubit model]` chip in the section header, the intro paragraph and the
  closing exact-vs-proxy callout collectively keep the distinction visible. Engine
  entropies must NOT be compared to LQG entanglement entropy without the explicit
  model caveat. The adapter at `src/features/lab/quantumEnginePreview.ts` is a curated
  topology+family → qubit-state mapping, NOT an LQG reduction; an SU(2)-aware adapter
  is part of Phase 9C+.
- **Phase 9B.5 mutual-information honesty.** Exact qubit mutual information in the
  Engine Preview is *exact only within the minimal qubit model*. It must NOT be
  compared numerically with the project's existing `mutualInformationProxy` — the
  proxy is a unitless toy formula, the exact MI is in bits/nats, and they live in
  different registers. The Engine Preview's qualitative-comparison disclaimer at the
  bottom of the comparison block is the visible enforcement; any future UI display of
  the engine MI must keep that disclaimer (or an equivalent unit-mismatch caveat).
  Phase 9C-1 generalised the engine to compute pair MI for 4-qubit states (cycle-4
  preview, GHZ(4), product(4)) via a real-symmetric Jacobi eigensolver — the
  Phase 9B.5 deferral is retired. The unsupported branch in the UI is *kept* as a
  defence against future complex-Hermitian states; do not delete it.
- **Phase 9C-1 eigensolver scope (real-symmetric only).** The general Hermitian
  eigensolver `eigenvaluesHermitian(matrix, eps)` in `src/features/quantum-engine/`
  handles only the **real-symmetric** branch: closed-form 2×2 plus pure-TS Jacobi
  rotations for n ≥ 3 via the real-symmetric path. A complex Hermitian matrix
  (significant imaginary off-diagonals beyond `eps`) makes it throw; the throw is
  caught by `mutualInformationQubitSubsystems` and surfaced as `'unsupported'` with
  reason `'requires-complex-hermitian-eigensolver'`. Extending the solver to true
  complex Hermitian (Householder + QR, or complex Jacobi) belongs to Phase 9C-3 and
  must stay dependency-free pure TS to preserve the engine's no-new-deps rule. The
  selftest's `eigenvaluesRealSymmetricJacobi` / `eigenvaluesHermitian` / `vonNeumannEntropy`
  assertions are the contract — any change to the eigensolver must keep them passing.
- **Phase 9C-2 heatmap honesty (visual normalisation, not a new score).** The
  Engine Preview's node-entropy fill bars and exact pairwise MI heatmap surface
  values produced by the existing Phase 9C-1 engine — they introduce **no new
  physics formula and no new diagnostic score**. The entropy bar's width is
  `entropyBits / 1` (one bit is the textbook maximum single-qubit entropy), and
  the MI heatmap's cell intensity is `cellBits / maxComputedBits`. Both are
  *visual* normalisations only; the displayed numeric values in the cards and
  cells remain the engine's exact bits/nats outputs. The bits values are exact
  *only within the minimal qubit model* (same register as Phase 9C-1) — they
  must NOT be labelled or compared as "LQG mutual information" or "intertwiner-
  space mutual information". The body strings under
  `lab.correlations.enginePreview.heatmaps` repeat the model boundary in both
  locales; do not remove that caveat when iterating on the heatmap UX. The
  `'unsupported'` cell branch (rendering as `n/a`) is unreachable today and is
  kept for the future complex-Hermitian path.
- **Phase 9C-3 SU(2) representation honesty (building blocks, not LQG geometry).**
  The new `spinRepresentation.ts` module is a **representation-theory toolkit**
  for one SU(2) irrep at a time — not yet an LQG spin-network node, not yet
  an intertwiner basis, not yet a Bell-network state. The matrices it produces
  (J+, J−, Jx, Jy, Jz, Casimir) are exact within the descending-m basis pinned
  in the module header; do **not** describe them as "LQG geometry", "area /
  volume / dihedral-angle operator", "spherical-tetrahedron reading",
  "flatness score", or "curvature signature" anywhere in code, comments, UI
  copy, or documentation. The descending-m convention `[j, j−1, …, −j]` is
  fixed for the engine — every future module that consumes spin matrices must
  use the same basis order so reduced-density-matrix / partial-trace /
  intertwiner code can keep its index arithmetic deterministic. Intertwiner
  groundwork, closure constraints, area / volume / dihedral expectation values,
  and Bell-network state construction belong to Phase 9D and onward; those
  layers will sit *on top of* this matrix toolkit and the Phase 9C-1 entropy
  / Phase 9C-2 heatmap layers without modifying them.
- **Phase 9D-1 SU(2) tensor-product honesty (infrastructure, not intertwiners).**
  The new `spinTensorProduct.ts` module is **representation-theory infrastructure**
  built on top of Phase 9C-3 — tensor-product Hilbert spaces, embedded
  single-factor operators, total angular-momentum operators, and the total
  Casimir `J_total² = Jx_total² + Jy_total² + Jz_total²`. The eigenspectrum
  of `J_total²` IS the SU(2) decomposition into total-spin sectors and the
  `J_total = 0` eigenspace IS the SU(2)-invariant subspace at a node, but
  Phase 9D-1 does **not** yet extract a basis for it; the projector lives
  in Phase 9D-2. The two canonical 2-spin-1/2 helpers
  (`singletStateTwoSpinHalf`, `tripletStatesTwoSpinHalf`) are the textbook
  `(|↑↓⟩ ∓ |↓↑⟩)/√2` / `|↑↑⟩` / `|↓↓⟩` constructions in elementary quantum
  mechanics — do **not** call them "LQG intertwiners" or "Bell-network
  states" anywhere in code, comments, UI copy, or documentation. The
  composite basis convention is fixed: composite index
  `idx = Σ_k idx_k · D_{k+1}·…·D_{n−1}` with `idx_k = j_k − m_k`, factor 0
  outermost. Every future tensor-product module must use the same
  convention so partial-trace / intertwiner-projector code can rely on
  the same mixed-radix index arithmetic. Closure constraints, intertwiner
  basis extraction, area / volume / dihedral expectation values, and
  Bell-network state construction stay deferred to Phase 9D-2 and onward.
- **Phase 9D-2-a eigendecomposition honesty (linear algebra, not intertwiners).**
  The new `eigendecompositionRealSymmetricJacobi` and
  `eigendecompositionHermitian` are pure linear-algebra plumbing —
  Jacobi eigenvectors of an effectively-real-Hermitian matrix. The
  output `{eigenvalues, eigenvectors}` is **not** an intertwiner basis,
  **not** an SU(2)-invariant subspace projector, and **not** a node
  closure solution; it is a generic eigendecomposition that happens to
  be the foundation Phase 9D-2-b will use to build those layers. Do
  not describe an eigenvector of `totalSpinSquared` at eigenvalue 0
  as an "LQG intertwiner" anywhere in code or documentation — the
  invariant-subspace selection step (collecting *all* zero-eigenvalue
  eigenvectors, building `V V†`, returning the projector + basis) is
  Phase 9D-2-b. The eigenvector convention is fixed for the engine:
  `eigenvectors[row][col] = ⟨e_row | v_col⟩`, columns sorted by
  descending eigenvalue. Future eigendecomposition code (complex
  Hermitian via Householder + complex QR, or complex Jacobi) must
  preserve this convention so 9D-2-b's projector arithmetic stays
  basis-consistent. The 2×2 path in `eigendecompositionHermitian`
  routes through Jacobi (rather than the analytic 2×2 formula); a
  complex Hermitian 2×2 with significant imaginary off-diagonals
  throws — the eigenvalue dispatcher `eigenvaluesHermitian` still
  has the analytic 2×2 path for that case (eigenvalues only, no
  eigenvectors).
- **Phase 9D-2-b intertwiner-space honesty (one node only, not Bell-network).**
  `invariantSubspaceProjector` returns an SU(2)-invariant subspace
  projector and basis for the tensor product of spins at **one node
  only**. The result MAY be described as a "minimal intertwiner-space
  basis at one node" or an "SU(2)-invariant subspace projector" — that
  is exactly what `mult(j_total = 0)` in the Wigner decomposition
  measures. The result MUST NOT be described as a "Bell-network state",
  "graph-level LQG state", "geometric-operator eigenspace",
  "area / volume / dihedral expectation value", "spherical-tetrahedron
  reading", or "cosmological state" anywhere in code, comments, UI
  copy, or documentation — none of those layers exist yet. A
  Bell-network state needs (a) intertwiner basis at *every* node
  (this module — at one node), (b) edge-spin tensor structure between
  nodes, and (c) edge-pairing / gluing constraints. Steps (b) and (c)
  belong to Phase 9E and onward. The basis convention matches Phase
  9D-2-a: `basis[row][col] = ⟨composite_row | v_col⟩`, columns are
  the kept eigenvectors. The projector `P = V · V†` is
  sign-invariant by construction — do not rely on basis-vector signs
  for any downstream computation; rely on the projector. The default
  tolerance `1e-8` is generous against Jacobi drift on small matrices
  while staying tight against any non-zero textbook eigenvalue
  (smallest is `2` for j_total = 1); future callers running on
  larger tensor-product spaces (n ≥ 6 spin-½ factors) should
  consider widening it (1e-7 or so) if a kept-rank regression
  appears, **without** loosening the engine's eigenvalue test
  tolerances downstream.
- **Phase 9E-1 intertwiner sandbox honesty (single-node UI surface).** The
  new "Single-node SU(2) intertwiner sandbox" section inside the
  Correlation Summary panel is the engine's first SU(2)-aware UI
  output. It MUST be labelled as a single-node SU(2) model — the
  `[single-node SU(2) model]` header chip and the i18n intro paragraph
  pin this. Any text or chip in the section MUST NOT call an example
  a "Bell-network state", a "graph-level LQG state", or a
  "geometric-operator eigenspace"; MUST NOT describe the invariant
  dimension as "geometry", "volume", or "curvature"; and MUST NOT
  imply edge gluing or multi-node state construction. The section
  surfaces only the four textbook examples already covered by the
  Phase 9D-2-b selftest (`[½, ½]`, `[½, ½, ½, ½]`, `[1, 1]`,
  `[1, ½, ½]`); deliberately no dropdown, no user input, no
  arbitrary-spin-tuple sandbox — that lets the kept tolerance default
  (`1e-8`) stay safe against Jacobi drift. The projector and basis
  matrices are intentionally NOT rendered (too large for a first
  UI surface, and the dimensions + sanity chips already convey the
  structural content). UI placement is fixed: between the Engine
  Preview (minimal qubit model) and the State-family curated reading
  inside Correlation Summary, so the two epistemic registers
  (minimal qubit model · single-node SU(2) model) sit adjacent
  without bleeding into each other.
- **Phase 9F academic packaging discipline (documentation, not
  engine).** The four-tier epistemic ladder published in
  `README.md` (pedagogical proxy → minimal qubit quantum-information
  → single-node SU(2) representation theory → spin-1/2 projected
  Bell-network state) is the **canonical academic framing** of the
  project. Future phases that extend the engine MUST surface their
  output through one of the four existing tiers OR add a new tier
  *deliberately* (with the corresponding new honesty literal,
  documented in [`docs/honesty-classes.md`](./docs/honesty-classes.md)).
  No tier may quietly absorb a new output without an explicit
  documentation update in the same commit. The three documentation
  files in `docs/` are the canonical references:
  - [`docs/academic-demo-flow.md`](./docs/academic-demo-flow.md) is
    the audience walkthrough; updating a Lab surface that the demo
    flow references requires updating the corresponding step.
  - [`docs/honesty-classes.md`](./docs/honesty-classes.md) is the
    canonical claim-envelope reference; new honesty literals,
    ProxyKinds, or model chips MUST be registered there.
  - [`docs/future-research-roadmap.md`](./docs/future-research-roadmap.md)
    is the forward plan; a phase that lands a roadmap item should
    move that item to "completed" with a phase-number reference.
  **Documentation must NOT claim** geometry observables, area /
  volume / dihedral expectation values, spin-foam dynamics,
  cosmological sector mapping, or LQG geometry until the
  corresponding engine layer ships and registers its honesty class.
- **Phase 9E-4 spin-1/2 projected Bell-network state honesty
  (graph-level state, not geometry).** The new
  `buildSpinHalfProjectedBellNetworkState` is the engine's first
  multi-node graph state. The construction is mathematically clean:
  link-singlet product `⊗_edges |S⟩` projected by the tensor product
  of per-node SU(2)-invariant subspace projectors `⊗_node P_inv`, then
  L2-normalised. The result MAY be described as a "spin-1/2 projected
  Bell-network state on the {dipole, cycle-4} graph" or a
  "graph-level SU(2)-invariant state". The result MUST NOT be
  described as a "cosmological state", "geometric-operator
  eigenspace", "area / volume / dihedral expectation value",
  "spherical-tetrahedron reading", "flatness / curvature score", or
  "LQG geometry" anywhere in code, comments, UI copy, or
  documentation — none of those layers exist yet, and the projected
  state by itself does not produce them. The construction is **spin
  1/2 only** (`assertAllEdgesSpinHalf` is a precondition); arbitrary
  spin would need Wigner-3j contractions which Phase 9E-4 does not
  implement. Only the **dipole** and **cycle-4** canonical graph
  shapes are supported by `buildSpinHalfProjectedBellNetworkState`;
  arbitrary spin-1/2 graphs throw a "Phase 9E-4 supports only…"
  scope error. The two-node single-edge graph stays on the Phase 9E-2
  minimal-prototype path because both endpoint nodes have
  `invariantDimension = 0` (a single spin-1/2 has no SU(2)-invariant
  sub-state). Edge `source` / `target` remain bookkeeping only — the
  link-singlet primitive uses them to fix a sign convention but the
  projected state's overall sign is irrelevant for every observable.
  The `'spin-half-projected-bell-network-state'` honesty literal MUST
  be surfaced by any downstream UI consumer alongside the state. The
  full `endpointKet` (256-dim for both dipole and cycle-4) and
  `invariantCoefficients` (4-dim / 1-dim) are deliberately NOT
  rendered in the UI today — same matrix-display restraint as
  Phase 9E-1 / 9E-3. The composite endpoint basis convention is
  fixed: node-major / incident-edge-minor, slot 0 most significant
  in the Kronecker product, `[|↑⟩, |↓⟩] = [+½, −½]` per slot,
  matching the Phase 9D-1 tensor-product convention exactly.
- **Phase 9E-3 Bell-network graph sandbox honesty (UI surface for
  the graph contract).** The new "Bell-network graph sandbox" section
  inside the Correlation Summary panel surfaces the Phase 9E-2 graph
  contract + per-node intertwiner summaries for three canonical
  spin-1/2 graphs. It MUST be labelled as "graph contract · not full
  state" — the header chip and the i18n intro paragraph pin this.
  The dipole and cycle-4 cards MUST NOT be described as "completed
  Bell-network states", "graph-level LQG states", or
  "geometric-operator eigenspaces"; they carry a typed
  `'deferred'` prototype-state pill with a localised
  `requires-edge-slot-bookkeeping` reason. The two-node single-edge
  card IS a graph-level state, but only at the smallest possible
  scale (one spin-½ edge between two nodes); UI copy must NOT
  describe it as a dipole, a cycle-4, or a multi-node state — it is
  the prototype that verifies the gluing primitive and the graph
  contract. The adapter `bellNetworkSandboxPreview.ts` deliberately
  does NOT call `buildMinimalSpinHalfBellNetworkState` for dipole /
  cycle-4 (which would throw Phase 9E-2's scope error). The full ket
  / projector / basis matrices are intentionally NOT rendered (same
  matrix-display restraint as Phase 9E-1's single-node intertwiner
  sandbox above). Edge `source` / `target` are bookkeeping only —
  the UI surfaces this through the "parallel edges yes/no" graph
  fact, computed on **unordered** endpoint pairs (sorted hash) so
  `{n0 → n1}` and `{n1 → n0}` count as parallel.
- **Phase 9E-2 Bell-network graph contract honesty (graph contract,
  not graph state).** A `BellNetworkGraph` is a typed combinatorial
  contract (nodes + spin-labelled edges) with explicit validation
  rules. It is **not itself a state**. The summary returned by
  `summarizeBellNetworkGraph` is per-node intertwiner-space metadata
  only — `{totalDimension, invariantDimension, keptEigenvalueIndices}`
  per node — and MUST NOT be described as a graph-level Bell-network
  state, a tensor over node intertwiner spaces, or an edge-glued
  state. Edge `source` / `target` are **bookkeeping only**; do not
  describe them as physical orientation. **Parallel edges are
  allowed** because the dipole graph requires them; **self-loops are
  rejected** in this phase (the gluing primitive on a self-edge is
  not specified). The two-node single-edge spin-½ graph is the only
  graph for which Phase 9E-2 builds an explicit graph-level state
  ket; dipole and cycle-4 graphs deliberately throw on
  `buildMinimalSpinHalfBellNetworkState` with a "Phase 9E-2 supports
  only…" message because their gluing requires edge-slot bookkeeping
  (Phase 9E-4). The minimal prototype state's `honesty:
  'minimal-spin-half-bell-network-prototype'` literal MUST be
  surfaced by any future UI consumer alongside the state. Higher-spin
  edge gluing (arbitrary Wigner-3j) is not implemented; the strict
  `validateSpinHalfEdge` / `assertAllEdgesSpinHalf` guards prevent
  multi-node builders from accidentally pretending to glue arbitrary
  spins. **No area / volume / dihedral expectation, no
  spherical-tetrahedron / flatness / curvature score, no graph
  dynamics, no cosmology layer, no LQG geometry claim** anywhere on
  this layer — those are Phase 9F territory and beyond.

## Changelog

Maintained by Claude per the directive at the top of this file. Newest entries on top.
Format: `YYYY-MM-DD — short imperative description.`

- 2026-04-25 — **Academic framing refined toward Bell-network effective
  geometry discussion; no engine/UI logic changes.** A short polish pass
  over the existing documentation set, sharpening how the project
  presents itself to a working LQG / Bell-network / effective-geometry
  researcher. **No file under `src/` changed**, no engine selftest
  modified (still 84/84), no i18n key added, no UI logic touched, no
  package.json edit, no new dependency. Five docs updated:
  - **README.md** — the *Academic framing — Bell-Network Geometry Lab*
    callout block at the top is rewritten to surface the research-axis
    vocabulary explicitly: Bell-network states, effective geometry,
    dipole graph, cycle-4 graph, SU(2) invariant subspace, intertwiner
    projector, projected spin-1/2 Bell-network state, the
    proxy-vs-exact-observable distinction, and the roadmap-only status
    of area / volume / dihedral-angle operators. The verbatim
    positioning sentence
    *"The project is not presented as a complete LQG calculation; it is
    a layered research sandbox that separates pedagogical diagnostics,
    exact finite-dimensional quantum-information computations, single-
    node SU(2) intertwiner structures, and restricted spin-1/2
    projected Bell-network states."* now appears in the callout.
  - **README.tr.md** — parallel rewrite in Turkish; technical terms
    (Bell-network, effective geometry, intertwiner, projected state,
    SU(2), spin-1/2, dipole graph, cycle-4 graph) stay English per the
    existing project policy, surrounding prose is Turkish.
  - **`docs/academic-demo-flow.md`** — new *Suggested framing for a
    research discussion* section between Step 7 and the timing summary,
    with three Bekir-Hoca-sized discussion questions on the
    Bell-network → effective geometry axis: (a) area/volume vs
    dihedral / Regge sequencing; (b) dipole/cycle-4 truncation
    suitability for the cosmological sector; (c) which graph-level
    observable best connects the projected state to effective geometry
    (with a four-candidate shortlist: per-edge area, per-node volume,
    per-pair dihedral angle, graph-level reduced ρ + bipartition
    entropy).
  - **`docs/future-research-roadmap.md`** — new *Bekir Hoca discussion
    candidates* section appended after *Picking the next phase*, with
    five discussion-ready bullets: area operator, volume operator on
    intertwiner space, dihedral-angle / twisted-vs-Regge geometry,
    semiclassical coherent spin-network extension, relation to
    homogeneous graph truncations / cosmology. Each bullet names the
    standard textbook constructions (Ashtekar-Lewandowski vs Rovelli-
    Smolin volume, etc.) and the discussion point that comes with
    implementing it.
  - **`docs/honesty-classes.md`** — Section D ("the boundary") rewritten
    from a four-paragraph prose form into five named academic
    claim-envelope statements: *exact within minimal qubit model* /
    *exact within SU(2) single-node model* / *exact within restricted
    spin-1/2 projected Bell-network construction* / *not yet an LQG
    geometric observable* / *not yet a spin-foam or cosmological
    dynamics model*. Each line carries the allowed claim and the
    forbidden claim, in a form that fits an academic discussion.
  - **RELEASE_NOTES.md** — new *Academic discussion readiness — Bell-
    network effective geometry framing* entry on top above the existing
    Mega Phase 9F milestone.
  All four standard validators still pass: `npm run validate:quantum-engine`
  84/84 clean, `npm run validate:i18n` clean, `npm run typecheck` clean,
  `npm run build` clean (output bundle byte-identical to Mega Phase 9F
  / 9E-4 since no source under `src/` changed). The polish is purely
  a documentation refinement — the project's claim envelope is the
  same, but its narration of that envelope is now sized for a working
  LQG / Bell-network research conversation.
- 2026-04-25 — **Mega Faz 9F: Academic demo packaging added with README
  scope, demo flow, honesty classes, and future research roadmap; no
  engine or UI logic changes.** Documentation-only milestone — engine
  selftest stays at 84/84, all UI numeric outputs byte-identical to
  Mega Phase 9E-4, no i18n key changes. Three new docs under `docs/`:
  `academic-demo-flow.md` (5–7 minute Geometry Lab walkthrough mapped
  to the four epistemic tiers, with seven steps from canvas to
  Bell-network sandbox plus three discussion questions for the
  audience), `honesty-classes.md` (canonical reference for claim
  envelopes — Section A: four `<ProxyBadge>` kinds with allowed /
  forbidden claims; Section B: three engine `honesty: …` literals
  (`'minimal-qubit-model'`, `'minimal-spin-half-bell-network-prototype'`,
  `'spin-half-projected-bell-network-state'`); Section C: three UI
  model chips; Section D: explicit "what you cannot say" boundary;
  Section E: how to add a new diagnostic without breaking the
  discipline), `future-research-roadmap.md` (three-horizon plan —
  near-term: area / volume / dihedral / graph-level reduced ρ on the
  projected state; mid-term: arbitrary-spin Wigner-3j /
  Wigner-6j / dihedral-angle operator / twisted-vs-Regge comparison;
  long-term: spin-foam vertex amplitude / cosmological sector mapping
  / refinement / coherent intertwiners / group field theory cosmology;
  with cross-cutting requirements section pinning the existing engine
  disciplines for any future phase). README.md gains a new
  *Academic Scope: Bell-Network Geometry Lab* section between the
  *Honesty / Scope* section and *Quick Start* — names the four tiers
  with descriptions / status / "where to find it" per tier, an
  exact-vs-proxy-vs-future-LQG comparison table, and links to the
  three companion docs. README.tr.md gains the parallel
  *Akademik Kapsam: Bell-Network Geometry Lab* section in the
  identical position; technical SU(2) / LQG terms (Bell-network,
  intertwiner, projected state, mutual information, density matrix,
  SU(2), spin-1/2, ProxyBadge, honesty literal) stay English in TR
  per the existing project policy. RELEASE_NOTES.md gains an
  "Academic Demo Milestone — Mega Phase 9F" entry on top above the
  existing v0.5 entry, summarising the four engine tiers and the
  three new docs. CLAUDE.md gains a new Mega Phase 9F architecture
  paragraph (in the Product shape section), a new constraint
  **Phase 9F academic packaging discipline (documentation, not
  engine)** that codifies the four-tier ladder + three-doc set as
  the canonical academic framing and fixes the rule that future
  phases must update the corresponding doc in the same commit, and
  this changelog entry. **Engine code unchanged** (no new function,
  no new type, no selftest modification — the 84/84 selftest at
  Mega Phase 9E-4 already covers every output the academic packaging
  describes), **UI logic unchanged** (no TSX touched, no React
  component modified, no panel restructure), **i18n unchanged** (no
  EN or TR key added or modified — the academic narrative lives in
  the docs / README, not in user-facing UI strings). **No new
  npm dependency.** All four standard validators still pass:
  `npm run validate:quantum-engine` 84/84 clean,
  `npm run validate:i18n` clean,
  `npm run typecheck` clean, `npm run build` clean (output bundle
  byte-identical to Mega Phase 9E-4 since no source under
  `src/` changed). The release is purely an academic packaging
  step — making the existing engine state demonstrable to a research
  audience without inflating any claim envelope.
- 2026-04-25 — **Mega Faz 9E-4: Edge-slot bookkeeping and spin-half
  projected Bell-network states added for dipole and cycle4; UI now
  marks them available without geometry claims.** Engine + UI change.
  Two new engine modules:
  `src/features/quantum-engine/edgeSlotBookkeeping.ts` (types
  `NodeSlotAssignment` / `EdgeEndpointSlot` / `EdgeSlotAssignment` /
  `BellNetworkSlotBookkeeping`, function `canonicaliseEdgeSlots`
  resolving each edge endpoint to a `(nodeId, slotIndex)` pair where
  `slotIndex` is the edge's position in
  `incidentEdgesForNode(graph, nodeId)`; parallel edges resolved by
  edge id so the dipole's four parallel edges get distinct
  `(0,0), (1,1), (2,2), (3,3)` pairs);
  `src/features/quantum-engine/spinHalfBellNetworkState.ts` (closed
  enum `SpinHalfProjectedBellNetworkStateKind` with two variants
  `'dipole-spin-half-projected'` / `'cycle4-spin-half-projected'`,
  the result interface `SpinHalfProjectedBellNetworkState` carrying
  both `endpointKet` and `invariantCoefficients` plus all relevant
  dimensions and the mandatory
  `honesty: 'spin-half-projected-bell-network-state'` literal, helper
  types `EndpointSlotRef` / `EndpointLayout` / `GlobalNodeProjector`,
  helpers `buildEndpointLayout` and
  `buildSpinHalfLinkSingletProductKet` and
  `buildGlobalNodeProjector`, and the end-to-end
  `buildSpinHalfProjectedBellNetworkState(graph)` which composes
  shape recognition + bookkeeping + layout + link ket + global
  projector + matrix-vector multiply + L2-normalisation +
  invariant-coefficient projection). One new generic helper
  `matrixVectorMultiply(matrix, vector)` in `linearAlgebra.ts` —
  rectangular shape-checked multiplication, broadly useful.
  **Composite endpoint basis convention** pinned in the module
  header: node-major / incident-edge-minor, slot 0 most significant,
  `[|↑⟩, |↓⟩] = [+½, −½]` per slot, matching Phase 9D-1's
  tensor-product convention exactly so `⊗_node P_inv(node)` acts on
  the same global basis as the link product without an index
  permutation. **Two-node single-edge graph** is intentionally NOT
  handled by the projected builder (each node has invariantDim 0;
  the projected construction would zero out); the existing
  Phase 9E-2 `buildMinimalSpinHalfBellNetworkState` continues to
  handle it. **Arbitrary graph shapes** are rejected with an
  explicit "Phase 9E-4 supports only dipole and cycle-4 spin-1/2
  projected states" error. **Arbitrary spin** is rejected via the
  existing `assertAllEdgesSpinHalf` precondition; Wigner-3j
  contractions for higher spins are NOT in this layer. **UI:** the
  `bellNetworkSandboxPreview.ts` adapter is widened — its
  `BellNetworkSandboxPrototypeState.available` branch now carries
  an optional `stateRegister` discriminant
  (`'minimal-two-node-prototype'` for two-node,
  `'spin-half-projected-bell-network-state'` for dipole/cycle-4)
  plus optional `endpointDimension` /
  `invariantDimension` / `perNodeInvariantDimensions` /
  `normBeforeProjectionNormalisation` fields. The
  `computeBellNetworkSandboxResult` function calls
  `buildSpinHalfProjectedBellNetworkState` for dipole / cycle-4 and
  `buildMinimalSpinHalfBellNetworkState` for two-node; the deferred
  branch is now unreachable from canonical examples but stays in
  the type union for future shapes. The Bell-network sandbox
  section in Correlation Summary now shows **all three canonical
  graphs as "available"** with seven new dl rows on the projected
  cards (state register / kind / dimension / endpoint dim / graph
  invariant dim / per-node invariant dims / normalised /
  pre-normalisation `‖P · ⊗|S⟩‖` / honesty). **No matrix display**
  — neither the 256-component endpointKet nor the 4-/1-component
  invariantCoefficients are rendered in the UI today, in line with
  the Phase 9E-1 / 9E-3 matrix-display restraint. New i18n leaves
  under `lab.correlations.bellNetworkSandbox.*`:
  `stateRegisterLabel`, `endpointDimensionLabel`,
  `graphInvariantDimensionLabel`,
  `perNodeInvariantDimensionsLabel`, `normBeforeProjectionLabel`,
  plus `stateRegisters.{minimalTwoNodePrototype,
  spinHalfProjectedBellNetworkState}` and updated `intro` /
  `modelChip` / `deferredReasons` / per-example `interpretation`
  strings. EN ↔ TR shipped in lockstep —
  `validate-ui-i18n.mjs` enforces the same key tree, leaf types,
  and the closed `stateRegisters.*` sub-tree on both sides.
  Technical SU(2) / graph-theory terms (`Bell-network`,
  `graph contract`, `edge-slot bookkeeping`, `intertwiner`,
  `invariant subspace`, `prototype state`, `projected state`,
  `endpoint`, `singlet`) stay English in TR; the surrounding prose
  is Turkish. Two new helper functions in the panel
  (`stateRegisterText` total over the closed
  `BellNetworkSandboxStateRegister` union; reused
  `deferredReasonText` from 9E-3). The selftest grew from 76 →
  **84 invariants** with 8 new 9E-4 checks:
  `canonicaliseEdgeSlots` on dipole (parallel-edge slot pairs) and
  cycle-4 (n0 incident `[e0, e3]` from constructor edge order, e3
  resolved as source `n3:slot1` / target `n0:slot1`);
  link-singlet product norm = 1 for dipole and cycle-4 (slot
  disjointness ⇒ product is a clean tensor of normalised
  singlets); full projected-state assertions for dipole
  (`kind === 'dipole-spin-half-projected'`, `endpointDim 256`,
  `perNodeInvariantDims [2, 2]`, `invariantDim 4`, `‖endpointKet‖² =
  1`, `‖invariantCoefficients‖² = 1`, `P · endpointKet ≈
  endpointKet` element-wise within `1e-9`,
  `normBefore > 1e-12`); same for cycle-4 (`kind ===
  'cycle4-spin-half-projected'`, `endpointDim 256`,
  `perNodeInvariantDims [1, 1, 1, 1]`, `invariantDim 1`,
  `invariantCoefficients` length 1 with `|c|² = 1`); rejection
  tests for two-node single-edge and arbitrary 3-node line, both
  throwing with "Phase 9E-4" in the error message. Every existing
  76 self-check from Mega Phase 9E-2 still passes byte-for-byte.
  **Honesty boundary pinned** in two new module headers, in the
  new constraint **Phase 9E-4 spin-1/2 projected Bell-network
  state honesty (graph-level state, not geometry)**, and in this
  changelog: the projected state IS a graph-level SU(2)-invariant
  state on the dipole or cycle-4 graph; it is NOT a cosmological
  state, NOT a geometric-operator eigenspace, NOT an
  area / volume / dihedral expectation value, NOT a
  spherical-tetrahedron reading, NOT a flatness / curvature score,
  and NOT an LQG geometry claim. Higher-spin Wigner-3j gluing,
  arbitrary-graph state construction, and geometric operators are
  Phase 9F+ territory. **No top-level `AppMode` change, no URL
  state / persistence change, no new graph topology / state family
  / observable lens, no SU(2)-aware engine preview adapter (still
  curated qubit mapping for the Engine Preview section), no
  arbitrary spin gluing, no Wigner-3j / Clebsch-Gordan helpers, no
  area / volume / dihedral expectation, no spherical-tetrahedron /
  flatness / curvature score, no LQG geometry claim, no existing
  proxy formula change, no external citation system, no new npm
  dependency.** The Gluing / Symmetry / Effective Geometry /
  Research Notes / Open Problems panels are byte-identical to Mega
  Faz 9E-3; the Correlation Summary panel's Engine Preview
  (mapping card / heatmaps / reduced ρ / exact-vs-proxy MI
  comparison / closing exact-vs-proxy callout) and the Phase 9E-1
  single-node intertwiner sandbox are unchanged. CLAUDE.md gains a
  new Mega Phase 9E-4 architecture paragraph (engine section), a
  new constraint, and this changelog entry.
  `npm run validate:quantum-engine` 84/84 clean,
  `npm run validate:i18n` clean, `npm run typecheck` clean,
  `npm run build` clean.
- 2026-04-25 — **Mega Faz 9E-3: Bell-network graph sandbox UI added with
  canonical graph summaries and two-node prototype state visibility;
  dipole/cycle4 remain deferred graph-level states.** First UI surface
  for the Mega Phase 9E-2 engine. New adapter
  `src/features/lab/bellNetworkSandboxPreview.ts` (pure TS, no React,
  no i18n) exports the closed `BellNetworkSandboxExampleId`
  (`twoNodeSingleEdge | dipoleSpinHalf | cycle4SpinHalf`), the closed
  `BellNetworkSandboxGraphKind` and `BellNetworkSandboxDeferredReason`
  unions, the `BellNetworkSandboxExample` /
  `BellNetworkSandboxNodeSummary` / `BellNetworkSandboxResult`
  interfaces, the `BellNetworkSandboxPrototypeState` discriminated
  union (`'available'` carries `kind` / `dimension` / `normalised` /
  `honesty`; `'deferred'` carries a typed `reason`), the static
  `getBellNetworkSandboxExamples()` (no dropdown / no user input),
  `computeBellNetworkSandboxResult` which calls `summarizeBellNetworkGraph`
  for every example and `buildMinimalSpinHalfBellNetworkState` for the
  two-node id only, and a small `detectParallelEdges` helper that
  hashes edges on **unordered** endpoint pairs. The adapter
  deliberately does NOT call the engine state builder on dipole /
  cycle-4 — calling it would throw the Phase 9E-2 scope error;
  instead `'deferred'` is returned directly from the example metadata
  so the render path stays exception-free. `CorrelationSummaryPanel.tsx`
  gains a new `LabSection` between the Phase 9E-1 single-node
  intertwiner sandbox (4.6) and the State-family curated reading (5);
  computes the three results inline (no `useMemo` — sub-millisecond on
  matrices ≤ 16 dim), renders one card per graph with title +
  interpretation paragraph from i18n, a 4-row graph-facts dl
  (nodes / edges / edge spins / parallel edges yes-no), a
  prototype-state box (status pill — `--ok-soft` / `--warn-soft` —
  + available-branch dl with kind/dimension/normalised/honesty OR
  deferred-branch reason text), and a per-node summary list with one
  card per node showing node id + incident edges + spin tuple +
  total dimension + invariant dimension. **No matrix display** for
  the projector / basis / ket vectors: too large for a first-pass UI
  surface; for the prototype state the dimension + normalised + honesty
  fields already carry the structural content (same convention as the
  Phase 9E-1 sandbox). **No `<ProxyBadge>`** — engine outputs in this
  section are exact within their model rather than proxies; the four
  ProxyKinds don't fit. A new `deferredReasonText` helper sits at the
  bottom of the panel file alongside the existing `SanityChip` /
  `formatComplex` / `clamp01` helpers, exhaustively typed over the
  closed `BellNetworkSandboxDeferredReason` union (missing case = TS
  error). New i18n block `lab.correlations.bellNetworkSandbox.*`
  shipped EN ↔ TR in lockstep — `validate-ui-i18n.mjs` enforces the
  same key tree (intro / chip / 16 leaf labels / closed
  `deferredReasons.*` sub-tree / 3 example title+interpretation
  pairs) on both sides. Technical SU(2) / graph-theory terms
  (`Bell-network`, `graph contract`, `edge-slot bookkeeping`,
  `intertwiner`, `invariant subspace`, `prototype state`) stay
  English in TR; the surrounding prose is Turkish. New panel CSS
  classes (32 total — `bellNetworkSandbox`, `bellGraphChip`,
  `bellNetworkIntro`, `bellGraphGrid`, `bellGraphCard`,
  `bellGraphHeader`, `bellGraphTitle`, `bellGraphInterpretation`,
  `graphFactsBlock`, `graphFactsLabel`, `graphFacts`,
  `graphFactLabel`, `graphFactValue`, `prototypeBox`,
  `prototypeBoxHead`, `prototypeLabel`, `prototypePill`,
  `prototypePillAvailable`, `prototypePillDeferred`,
  `prototypeDetails`, `prototypeDetailLabel`, `prototypeDetailValue`,
  `prototypeDeferredReason`, `nodeSummaryBlock`, `nodeSummaryLabel`,
  `nodeSummaryList`, `nodeSummaryCard`, `nodeSummaryHeader`,
  `nodeSummaryNodeId`, `nodeSummaryIncidentEdges`,
  `nodeSummaryStats`, `nodeSummaryStatLabel`,
  `nodeSummaryStatValue`) — every colour pulled from existing design
  tokens (`--ok` / `--ok-soft`, `--warn` / `--warn-soft`,
  `--surface-1` / `--surface-2`, `--border-subtle` /
  `--border-medium`, `--text-*`); no hardcoded colours.
  **Engine code unchanged**: no new function, no new type, no
  selftest modification (the 76/76 selftest at Mega Phase 9E-2
  already protects the three canonical graphs and the two-node
  prototype). `npm run validate:quantum-engine` 76/76 clean
  (engine itself is unchanged), `npm run validate:i18n` clean (new
  key tree present in both locales with matching leaf types),
  `npm run typecheck` clean, `npm run build` clean. **No top-level
  `AppMode` change, no URL state / persistence change, no new graph
  topology / state family / observable lens, no SU(2)-aware engine
  preview adapter (still curated qubit mapping for the Engine
  Preview section), no edge gluing tensor structure for dipole /
  cycle-4, no multi-node graph state, no Wigner-3j / Clebsch-Gordan
  helpers, no area / volume / dihedral expectation, no
  spherical-tetrahedron / flatness / curvature score, no LQG
  geometry claim, no existing proxy formula change, no external
  citation system, no new npm dependency.** The Gluing / Symmetry /
  Effective Geometry / Research Notes / Open Problems panels are
  byte-identical to Mega Faz 9E-2; the Correlation Summary panel's
  Engine Preview section (mapping card / entropy heatmap / pairwise
  MI heatmap / reduced density matrix / exact-vs-proxy comparison /
  closing exact-vs-proxy callout) and its single-node SU(2)
  intertwiner sandbox (Phase 9E-1) are unchanged. CLAUDE.md gains
  a new Mega Phase 9E-3 architecture paragraph (engine section), a
  new constraint **Phase 9E-3 Bell-network graph sandbox honesty
  (UI surface for the graph contract)**, and this changelog entry.
- 2026-04-25 — **Mega Faz 9E-2: Bell-network graph contract, spin-half edge
  gluing primitive, and minimal two-node spin-half state prototype added;
  dipole/cycle4 remain summary-only.** Engine-only change. Three new files:
  `src/features/quantum-engine/bellNetworkGraph.ts` (types
  `BellNetworkNodeId` / `BellNetworkEdgeId` / `BellNetworkNode` /
  `BellNetworkEdge` / `BellNetworkGraph` + per-node summary types
  `BellNetworkNodeIntertwinerSummary` / `BellNetworkGraphSummary`,
  the validator `validateBellNetworkGraph` enforcing 9 rules
  (non-empty nodes, non-empty unique node ids, non-empty unique edge
  ids, valid endpoints, no self-loops, valid spins via
  `validateSpinJ`, every node has at least one incident edge —
  parallel edges deliberately allowed because the dipole requires
  them), helpers `incidentEdgesForNode` / `incidentEdgeIdsForNode` /
  `spinsForNode`, the per-node summary helper
  `summarizeBellNetworkGraph` which runs `invariantSubspaceProjector`
  once per node and returns dimensions + kept eigenvalue indices
  WITHOUT the projector and basis matrices, and three canonical
  constructors: `createTwoNodeSingleEdgeSpinHalfGraph` /
  `createDipoleSpinHalfGraph` / `createCycle4SpinHalfGraph`);
  `src/features/quantum-engine/spinHalfGluing.ts`
  (`spinHalfSingletState()` returning the SU(2)-invariant singlet
  `(|↑↓⟩ − |↓↑⟩) / √2 = [0, 1/√2, −1/√2, 0]` byte-equal to
  `singletStateTwoSpinHalf` from Phase 9D-1 but architecturally
  distinct: this is the **edge gluing primitive** for graph-level
  builders, while the 9D-1 helper is a textbook two-spin-½ state
  used in `⟨J²⟩ = 0` checks; plus the strict guards
  `validateSpinHalfEdge` (`edge.spin === 0.5` exact equality) and
  `assertAllEdgesSpinHalf(graph)`); and
  `src/features/quantum-engine/minimalBellNetworkState.ts` (closed
  enum `MinimalBellNetworkStateKind = 'two-node-single-edge-spin-half'`,
  interface `MinimalBellNetworkState` carrying graph / ket / dimension
  / `normalised` flag / mandatory
  `honesty: 'minimal-spin-half-bell-network-prototype'` literal, and
  `buildMinimalSpinHalfBellNetworkState(graph)` which validates the
  graph contract, asserts every edge is spin-½, scope-checks
  `nodeCount === 2 && edgeCount === 1`, and returns
  `{ket: spinHalfSingletState(), dimension: 4, normalised: true,
  …}` — throwing a "Phase 9E-2 supports only the two-node single
  spin-1/2 edge prototype" error for dipole / cycle-4 / arbitrary
  graphs). All new symbols exported via `index.ts` (sixteen
  total: 7 graph types + 8 graph functions + 3 spin-half helpers +
  2 minimal-state types + 1 minimal-state builder). The selftest
  grew from 60 → **76 invariants** with 16 new 9E-2 checks: 6
  graph-validation rejection tests (duplicate node ids, duplicate
  edge ids, missing endpoint, self-loop, invalid spin 0.3, negative
  spin); 1 parallel-edges-allowed test (dipole validates without
  throw); 3 graph-summary tests with explicit per-node totals
  (`createTwoNodeSingleEdgeSpinHalfGraph` → each node spins `[½]` /
  totalDim 2 / invariantDim 0; `createDipoleSpinHalfGraph` → each
  node spins `[½, ½, ½, ½]` / totalDim 16 / invariantDim 2 / four
  incident edges in `[e0, e1, e2, e3]` order;
  `createCycle4SpinHalfGraph` → each node spins `[½, ½]` /
  totalDim 4 / invariantDim 1); 3 spin-½ singlet primitive tests
  (`‖spinHalfSingletState‖² = 1`, byte-equal to
  `singletStateTwoSpinHalf`, `⟨J²⟩ = 0` on `[½, ½]`); and 3
  minimal-state-builder tests (two-node-single-edge succeeds with
  kind / dimension / normalised / honesty / ket all correct, dipole
  rejects with "Phase 9E-2" in the error message, cycle-4 rejects
  with the same scope error). Every existing 60 self-check from
  Phase 9D-2-b still passes byte-for-byte. **Honesty boundary
  pinned** in three module headers, in the new constraint
  **Phase 9E-2 Bell-network graph contract honesty (graph contract,
  not graph state)**, and in this changelog: a `BellNetworkGraph`
  is a typed contract, not a state; per-node summaries are not
  graph-level Bell-network states; the two-node single-edge state
  is a deliberate prototype (the simplest possible graph-level
  state on which Phase 9E-4 will add intertwiner-aware multi-node
  gluing); edge `source` / `target` are bookkeeping only, not
  physical orientation; parallel edges allowed; self-loops
  rejected. **No UI was touched, no i18n key added, no React
  component changed, no top-level `AppMode` change, no URL state /
  persistence change, no new graph topology / state family /
  observable lens, no SU(2)-aware engine preview adapter
  (still curated qubit mapping for the Engine Preview section), no
  arbitrary spin gluing, no Wigner-3j, no dipole/cycle4 state, no
  area / volume / dihedral expectation, no spherical-tetrahedron /
  flatness / curvature score, no LQG geometry claim, no existing
  proxy formula change, no external citation system, no new npm
  dependency.** The Gluing / Symmetry / Effective Geometry /
  Correlation Summary (incl. its Engine Preview heatmaps,
  exact-vs-proxy MI comparison, and Phase 9E-1 intertwiner
  sandbox) / Research Notes / Open Problems panels are
  byte-identical to Faz 9E-1. CLAUDE.md gains a new Mega Phase 9E-2
  architecture paragraph (engine section), a new constraint, and
  this changelog entry. `npm run validate:quantum-engine` 76/76
  clean, `npm run validate:i18n` clean, `npm run typecheck` clean,
  `npm run build` clean.
- 2026-04-25 — **Faz 9E-1: Single-node SU(2) Intertwiner Sandbox added to
  Correlation Summary using the invariant-subspace projector; no
  Bell-network or geometry claims.** First UI surface for the
  Phase 9D-2-b engine. New adapter
  `src/features/lab/intertwinerSandboxPreview.ts` (pure TS, no React,
  no i18n) exports the closed `IntertwinerSandboxExampleId`
  (`twoSpinHalf | fourSpinHalf | twoSpinOne | spinOneTwoSpinHalf`),
  the `IntertwinerSandboxExample` / `IntertwinerSandboxResult`
  interfaces, `getIntertwinerSandboxExamples()` (static four-element
  list — no dropdown / no user input), `computeIntertwinerSandboxResult`
  (engine call + three projector sanity checks at `1e-9`), and the
  spin-formatting helpers `formatSpinLabel` / `formatSpinTuple`.
  `CorrelationSummaryPanel.tsx` gains a new `LabSection` between the
  Engine Preview (4) and the State-family curated reading (5);
  computes the four results inline (no `useMemo` — sub-millisecond on
  matrices ≤ 16 dim), renders one card per example with title, spin
  tuple as `[1/2, 1/2]`, total / invariant / expected dimensions, kept
  eigenvalue indices, 6-eigenvalue spectrum preview (with ellipsis when
  truncated), three projector sanity chips (P† = P, P² = P, Tr(P) = dim
  — pass/fail tinted by `--ok-soft` / `--warn-soft`), and an
  interpretation paragraph from i18n. **No matrix display** for the
  projector or basis: too large for a first-pass UI surface; dimensions
  + sanity chips already carry the structural content. **No
  `<ProxyBadge>`** — engine outputs in this section are exact within
  their model rather than proxies; the four ProxyKinds don't fit. A
  small `SanityChip` helper component sits at the bottom of the panel
  file alongside the existing `formatComplex` / `clamp01` helpers.
  New i18n block `lab.correlations.intertwinerSandbox.*` shipped EN ↔
  TR in lockstep — `validate-ui-i18n.mjs` enforces the same key tree,
  leaf types, and the four-example sub-tree on both sides. Technical
  SU(2) terms (`SU(2)`, `intertwiner`, `invariant subspace`,
  `projector`, `spectrum`, `spin tuple`) stay English in TR; the
  surrounding prose is Turkish. New panel CSS classes (22 total)
  pulled from existing design tokens — `--ok` / `--ok-soft` for the
  pass chip, `--warn` / `--warn-soft` for the fail chip,
  `--surface-1` / `--surface-2` / `--border-subtle` /
  `--border-medium` for cards/labels — no hardcoded colours. **Engine
  code unchanged**: no new function, no new type, no selftest
  modification (the 60/60 selftest at Phase 9D-2-b already protects
  the four sandbox examples). `npm run validate:quantum-engine`
  60/60 clean (engine itself is unchanged), `npm run validate:i18n`
  clean (new key tree present in both locales with matching leaf
  types), `npm run typecheck` clean, `npm run build` clean. **No top-
  level `AppMode` change, no URL state / persistence change, no new
  graph topology / state family / observable lens, no SU(2)-aware
  engine preview adapter (still curated qubit mapping for the
  Engine Preview section), no edge gluing, no multi-node graph
  state, no area / volume / dihedral expectation, no spherical-
  tetrahedron / flatness / curvature score, no LQG geometry claim,
  no existing proxy formula change, no external citation system, no
  new npm dependency.** The Gluing / Symmetry / Effective Geometry
  / Research Notes / Open Problems panels are byte-identical to Faz
  9D-2-b; the Correlation Summary panel's Engine Preview section
  (mapping card / entropy heatmap / pairwise MI heatmap / reduced
  density matrix / exact-vs-proxy comparison / closing exact-vs-proxy
  callout) is unchanged. CLAUDE.md gains a new Phase 9E-1
  architecture paragraph (engine section), a new constraint
  **Phase 9E-1 intertwiner sandbox honesty (single-node UI
  surface)**, and this changelog entry.
- 2026-04-25 — **Faz 9D-2-b: SU(2)-invariant subspace projector added for
  single-node spin tensor products; projector sanity and textbook
  intertwiner dimensions verified.** Engine-only change. New file
  `src/features/quantum-engine/invariantSubspace.ts` exports the
  `InvariantSubspaceProjector` interface and the
  `invariantSubspaceProjector(spins, tolerance = 1e-8)` builder. The
  builder composes already-tested layers: `buildSpinTensorProductSpace`
  validates spins and yields `totalDimension`; `totalSpinSquared(spins)`
  builds the total Casimir (Phase 9D-1); `eigendecompositionHermitian`
  diagonalises it (Phase 9D-2-a) returning eigenvalues + eigenvectors
  in descending order; the kept indices are those with
  `|λ_k| < tolerance` (the j_total = 0 sector); the basis matrix `V`
  is the corresponding columns; and `P = matMul(V, dagger(V))`. The
  empty-subspace case (`invariantDimension === 0`) is special-cased so
  `basis` is `totalDimension` rows of empty columns and `projector` is
  `zeroMatrix(totalDimension, totalDimension)`. The result struct
  carries provenance metadata (`spins`, `tolerance`, `totalDimension`,
  `invariantDimension`, full descending `eigenvalues`,
  `keptEigenvalueIndices`, `basis`, `projector`) so callers can trace
  why dimension came out to what it is. `index.ts` exports the new
  symbols. The selftest grew from 54 → **60 invariants** with 6 new
  9D-2-b checks: `[½, ½]` returns `dim = 1` with `P = |singlet⟩⟨singlet|`
  element-wise (verified entry-by-entry against
  `singletStateTwoSpinHalf()`), basis column ±|S⟩ within `1e-9`, plus
  full sanity (`P† = P`, `P² = P`, `Tr(P) = 1`); `[½, ½, ½, ½]`
  returns `dim = 2` (textbook 4-valent spin-½ intertwiner space) with
  the same sanity battery and `⟨v|J²|v⟩ ≈ 0` for each kept basis
  column; `[1, 1]` returns `dim = 1` with sanity; `[1, ½, ½]` returns
  `dim = 1` with `totalDim = 12` and sanity; the empty case `[½]`
  returns `dim = 0`, basis as 2 rows of empty columns, projector as
  the 2×2 zero matrix, `Tr(P) = 0`; the tolerance-variation case
  `[½, ½]` with `tolerance = 1e-10` still returns `dim = 1` and
  records that tolerance in the result struct. **Honesty boundary
  pinned** in module header, in the new `Phase 9D-2-b
  intertwiner-space honesty (one node only, not Bell-network)`
  constraint, and in this changelog: the result is a single-node
  SU(2)-invariant subspace; basis vectors are NOT Bell-network
  states / graph-level LQG states / geometric-operator eigenspaces;
  multi-node gluing belongs to Phase 9E. **No UI was touched, no
  i18n key added, no React component changed, no top-level
  `AppMode` change, no URL state / persistence change, no new graph
  topology / state family / observable lens, no SU(2)-aware engine
  preview adapter (still curated qubit mapping), no edge gluing
  tensor structure, no multi-node graph state, no area / volume /
  dihedral expectation, no spherical-tetrahedron / flatness /
  curvature score, no LQG geometry claim, no existing proxy formula
  change, no external citation system, no new npm dependency.** The
  Gluing / Symmetry / Effective Geometry / Correlation Summary /
  Research Notes / Open Problems panels are byte-identical to Faz
  9D-2-a; the Engine Preview's heatmaps and exact-vs-proxy
  comparison are unchanged. CLAUDE.md gains a new Phase 9D-2-b
  architecture paragraph (engine section), a new constraint, and
  this changelog entry. `npm run validate:quantum-engine` 60/60
  clean, `npm run validate:i18n` clean, `npm run typecheck` clean,
  `npm run build` clean.
- 2026-04-25 — **Faz 9D-2-a: Real-symmetric Jacobi eigendecomposition with
  eigenvectors added; total-spin singlet eigenvector verified; no
  invariant-subspace projector yet.** Engine-only change. The Phase 9C-1
  Jacobi eigensolver `eigenvaluesRealSymmetricJacobi(matrix, options)`
  is refactored to delegate to the new
  `eigendecompositionRealSymmetricJacobi(matrix, options)` returning
  `{eigenvalues, eigenvectors}`; the public eigenvalue API is
  byte-identical (the rotation formula, pivot search and iteration cap
  are unchanged from 9C-1). New types
  `RealSymmetricEigendecomposition` and `HermitianEigendecomposition`,
  plus the new dispatcher `eigendecompositionHermitian(matrix, eps)`
  which handles `n = 0` / `n = 1` / `n ≥ 2` (real-symmetric only —
  throws on significant complex Hermitian off-diagonals; the analytic
  2×2 eigenvector formula is **not** implemented and would not extend
  to n ≥ 3, so the Jacobi path is the single source of truth for
  eigenvectors). All five new symbols exported from `index.ts`. The
  Jacobi rotation accumulates `V` by right-multiplication
  `V ← V · G` on each Givens rotation, so at convergence
  `A = V · diag(λ) · Vᵀ` (real-symmetric ⇒ real-orthogonal V). The
  eigenvector convention is **column-major, descending eigenvalue
  order** (`eigenvectors[row][col] = ⟨e_row | v_col⟩`). The selftest
  grew from 48 → **54 invariants** with 6 new 9D-2-a checks:
  `diag(3, 2, 1)` returns identity eigenvectors and reconstructs
  exactly; `[[2, 1], [1, 2]]` returns `{3, 1}` with eigenvectors
  `(1, 1)/√2` / `(1, −1)/√2` up to sign and reconstruction;
  tri-diagonal `[[2, 1, 0], [1, 2, 1], [0, 1, 2]]` returns the
  closed-form `{2 + √2, 2, 2 − √2}` spectrum with `Vᵀ V = I_3`
  orthonormality and reconstruction; the delegation contract
  `eigenvaluesRealSymmetricJacobi(A) ≡ eigendecompositionRealSymmetricJacobi(A).eigenvalues`
  on a 4×4 test matrix; `totalSpinSquared([½, ½])` decomposition
  returns spectrum `{2, 2, 2, 0}` with the eigenvector at column 3
  equal to `±singletStateTwoSpinHalf()` (within `1e-9`) and
  `J² ≈ V · diag(λ) · Vᵀ`; `eigendecompositionHermitian` throws on
  `[[1, i], [-i, 1]]` with a "complex" message while the matching
  `eigenvaluesHermitian` still computes its analytic `{0, 2}`
  spectrum. **No invariant-subspace projector, no intertwiner basis,
  no closure-constraint solver, no Bell-network SU(2) state, no
  area / volume / dihedral expectation, no spherical-tetrahedron /
  flatness / curvature score, no LQG geometry claim, no UI / TSX /
  CSS touched, no i18n key added, no React component changed, no
  top-level `AppMode` change, no URL state / persistence change, no
  new graph topology / state family / observable lens, no SU(2)-aware
  engine preview adapter (still curated qubit mapping), no existing
  proxy formula change, no external citation system, no new npm
  dependency.** The Gluing / Symmetry / Effective Geometry /
  Correlation Summary / Research Notes / Open Problems panels are
  byte-identical to Faz 9D-1; the Engine Preview's heatmaps and
  exact-vs-proxy comparison are unchanged. CLAUDE.md gains a new
  Phase 9D-2-a architecture paragraph (engine section), a new
  constraint **Phase 9D-2-a eigendecomposition honesty (linear
  algebra, not intertwiners)**, and this changelog entry.
  `npm run validate:quantum-engine` 54/54 clean,
  `npm run validate:i18n` clean, `npm run typecheck` clean,
  `npm run build` clean.
- 2026-04-25 — **Faz 9D-1: Tensor-product spin spaces and total angular
  momentum operators added with singlet/triplet self-tests; no intertwiner
  projector or Bell-network state.** Engine-only change. New file
  `src/features/quantum-engine/spinTensorProduct.ts` exports the closed
  `SpinAxis` (`'x' | 'y' | 'z'`) and `SpinTensorProductSpace`
  interface (`{spins, dimensions, totalDimension}`); the variadic
  Kronecker product `tensorProductMatrices(matrices)` (left-fold of the
  existing binary `tensorProductMatrix` from `quantumState.ts` — **no
  duplicate Kronecker implementation**); `buildSpinTensorProductSpace(spins)`
  (validates each spin label, computes per-factor and total dimensions);
  `embeddedSpinOperator(spins, targetIndex, axis)` (single-factor spin
  operator embedded in the tensor product with identities elsewhere);
  `totalSpinOperator(spins, axis)` (sum of all single-factor embeddings);
  `totalSpinSquared(spins) = Jx_total² + Jy_total² + Jz_total²`; plus
  the canonical 2-spin-1/2 building-block kets `singletStateTwoSpinHalf()`
  and `tripletStatesTwoSpinHalf()` returning `{plus, zero, minus}`. One
  small generic helper landed in `linearAlgebra.ts`:
  `expectationValue(ket, operator)` returns `⟨ψ|O|ψ⟩` as a `Complex`
  and is broadly useful (lives in the linear-algebra layer rather than
  the spin module so any future operator matrix-element code can reuse
  it). `index.ts` exports the new symbols. The selftest grew from 39
  → **48 invariants** with 9 new tensor-product checks: dim/totalDim
  for `[½, ½]` and `[1, ½]`; `embeddedSpinOperator` on first/second
  factor equals `Jz⊗I_2` / `I_2⊗Jz` respectively; `totalSpinOperator(_, z)`
  equals both the explicit `diag(1, 0, 0, −1)` and the bottom-up
  `addMatrices` of two embeddings; `totalSpinSquared([½, ½])`
  eigenvalues `{2, 2, 2, 0}` via the existing Phase 9C-1
  real-symmetric Jacobi solver; singlet normalised with `⟨S|J²|S⟩ = 0`
  and `⟨S|J_axis|S⟩ = 0` for every axis; each triplet normalised with
  `⟨T|J²|T⟩ = 2` and `⟨T_±|Jz|T_±⟩ = ±1`, `⟨T_0|Jz|T_0⟩ = 0`; total
  commutators `[Jx_total, Jy_total] = i Jz_total` cyclic for `[½, ½]`.
  **Composite basis convention pinned in module header:** Kronecker
  product of each factor's descending-m basis,
  `idx = Σ_k (j_k − m_k) · D_{k+1}·…·D_{n−1}`. Two-spin-1/2 composite:
  `[|↑↑⟩, |↑↓⟩, |↓↑⟩, |↓↓⟩]`. **No UI was touched, no i18n key added,
  no React component changed, no top-level `AppMode` change, no URL
  state / persistence change, no new graph topology / state family /
  observable lens, no SU(2)-aware engine preview adapter (still curated
  qubit mapping), no intertwiner basis, no closure-constraint solver,
  no Bell-network SU(2) state, no area / volume / dihedral expectation,
  no spherical-tetrahedron / flatness / curvature score, no LQG
  geometry claim, no existing proxy formula change, no external
  citation system, no new npm dependency.** The Gluing / Symmetry /
  Effective Geometry / Correlation Summary / Research Notes / Open
  Problems panels are byte-identical to Faz 9C-3; the Engine Preview's
  node entropy heatmap, exact pairwise MI heatmap, reduced density
  matrix grid, exact-vs-proxy MI comparison, and closing exact-vs-proxy
  callout are unchanged. CLAUDE.md gains a new Phase 9D-1 architecture
  paragraph (engine section), a new constraint **Phase 9D-1 SU(2)
  tensor-product honesty (infrastructure, not intertwiners)**, and
  this changelog entry. `npm run validate:quantum-engine` 48/48 clean,
  `npm run validate:i18n` clean, `npm run typecheck` clean,
  `npm run build` clean.
- 2026-04-25 — **Faz 9C-3: SU(2) spin-j representation building blocks added
  with Casimir and commutator self-tests; no intertwiners or LQG geometry
  claims.** Engine-only change. New file
  `src/features/quantum-engine/spinRepresentation.ts` exports
  `validateSpinJ(j)` (rejects negative / non-half-integer / non-finite),
  `spinDimension(j) = 2j + 1`, `magneticNumbers(j)` in canonical descending
  order `[j, j−1, …, −j]`, `spinJPlus(j)` / `spinJMinus(j)` / `spinJX(j)` /
  `spinJY(j)` / `spinJZ(j)`, the Casimir `spinCasimir(j) = JxJx + JyJy + JzJz`,
  the bundle helper `buildSpinJRepresentation(j)` returning `{j, dimension,
  magneticNumbers, jPlus, jMinus, jX, jY, jZ, casimir}` in one struct, plus
  the two type aliases `SpinJ` and `SpinJRepresentation`. Three small
  generic linear-algebra helpers landed in `linearAlgebra.ts` to support
  the new module: `addMatrices(A, B)` (element-wise, shape-checked),
  `scaleMatrix(A, s)` (complex scalar), and `commutator(A, B) = AB − BA`.
  These three are deliberately not SU(2)-specific — any future
  representation-theory work, Lie-algebra check, or intertwiner closure
  proof can reuse them without adding a domain-specific dependency.
  `index.ts` exports the new symbols. The selftest grew from 27 → **39
  invariants** with 12 new SU(2) checks: validation accepts
  `{0, ½, 1, 3⁄2}` and rejects `{−½, 0.3, NaN, ∞}`; `spinDimension`
  correctness; magnetic-number ordering for `j = ½` and `j = 1`;
  closed-form spin-½ matrices (`Jz = diag(½, −½)`, `Jx = ½σx`,
  `Jy = ½σy`); `j = 1` raising-operator super-diagonals equal `√2`;
  Casimir `J²(½) = ¾ I` and `J²(1) = 2 I` (with the identity built
  inside the test from the input `j`, so the function is genuinely
  computing the matrix sum, not a hardcode); canonical commutators
  `[Jx,Jy] = iJz` cyclic at both `j = ½` and `j = 1`; Hermiticity of
  Jx, Jy, Jz, plus `(J+)† = J−` at both spins; bundle-helper
  dimension / magnetic-number / Casimir consistency. **No UI was
  touched, no i18n key added, no React component changed, no top-level
  `AppMode` change, no URL state / persistence change, no new graph
  topology / state family / observable lens, no SU(2)-aware engine
  preview adapter (still curated qubit mapping), no intertwiner basis,
  no closure constraint, no Bell-network SU(2) state, no area / volume /
  dihedral expectation, no spherical-tetrahedron / flatness / curvature
  score, no LQG geometry claim, no existing proxy formula change, no
  external citation system, no new npm dependency.** The Gluing /
  Symmetry / Effective Geometry / Correlation Summary / Research
  Notes / Open Problems panels are byte-identical to Faz 9C-2; the
  Engine Preview's node entropy heatmap, exact pairwise MI heatmap,
  reduced density matrix grid, exact-vs-proxy MI comparison, and
  closing exact-vs-proxy callout are unchanged. CLAUDE.md gains a new
  Phase 9C-3 architecture paragraph (engine section), a new constraint
  **Phase 9C-3 SU(2) representation honesty (building blocks, not LQG
  geometry)**, and this changelog entry.
  `npm run validate:quantum-engine` 39/39 clean,
  `npm run validate:i18n` clean, `npm run typecheck` clean,
  `npm run build` clean.
- 2026-04-25 — **Faz 9C-2: Exact qubit entropy and pairwise MI heatmaps added
  to the Engine Preview using the general subsystem entropy engine.** New
  engine helper `src/features/quantum-engine/pairwiseMutualInformation.ts`
  exports `computePairwiseMutualInformationMatrix(ket, numQubits)` plus
  `PairwiseMutualInformationCell` (`'diagonal' | 'computed' | 'unsupported'`)
  and `PairwiseMutualInformationMatrix` types. The helper builds a
  symmetric `n × n` matrix by delegating each strict-upper-triangle pair
  to the Phase 9C-1 `mutualInformationQubitSubsystems` and mirroring into
  the lower triangle, so each pair is computed once. `maxComputedBits` is
  recorded as the max bits across computed cells (or `0`). Exported from
  the engine's public `index.ts` alongside the new types.
  `quantumEngine.selftest.ts` now runs **27 invariants** (was 24): three
  new assertions cover Bell pair (2×2, off-diag = 2 bits,
  maxComputedBits = 2), product(4) (every off-diagonal = 0 bits,
  maxComputedBits = 0) and GHZ(4) (every off-diagonal = 1 bit,
  maxComputedBits = 1). UI: `CorrelationSummaryPanel` adds a horizontal
  fill bar to each existing per-qubit entropy card (width =
  `clamp01(entropyBits)` since one bit is the maximum single-qubit
  entropy) and a new exact pairwise MI heatmap below the entropy grid.
  The heatmap is an `inline-grid` with axis labels Q0..Q(n-1), em-dash
  diagonals, accent-tinted off-diagonals (background blended via
  `color-mix(in srgb, var(--accent-soft), var(--surface-1))` driven by
  an `--intensity` CSS custom property in `[0, 1]` computed from
  `cellBits / maxComputedBits`), and dashed `n/a` cells for the
  unreachable `'unsupported'` branch. Wrapped in
  `overflow-x: auto` so narrow screens scroll horizontally. The
  `prefers-reduced-motion` media query zeroes the entropy-bar transition
  in line with the existing global animation policy. New i18n block
  `lab.correlations.enginePreview.heatmaps` shipped EN ↔ TR in lockstep
  (entropyHeatmapLabel / entropyHeatmapBody / entropyFillLabel /
  pairwiseMiLabel / pairwiseMiBody / diagonalLabel /
  unsupportedCellLabel / qubitAxisLabel / exactQubitMiLabel) —
  `validate-ui-i18n.mjs` enforces the same key tree and leaf types on
  both sides. New CSS classes `.entropyHeatmapBody`, `.entropyBarRow`,
  `.entropyBarTrack`, `.entropyBarFill`, `.miHeatmap`,
  `.miHeatmapBody`, `.miHeatmapScroll`, `.miHeatmapGrid`,
  `.miHeatmapHeader`, `.miHeatmapRowLabel`, `.miHeatmapCorner`,
  `.miHeatmapCell`, `.miHeatmapDiagonal`, `.miHeatmapUnsupported`,
  `.miHeatmapValue`, `.heatmapCaption` — every colour pulled from
  existing CSS variables (`--accent`, `--accent-soft`, `--surface-1`,
  `--surface-2`, `--border-subtle`, `--border-medium`, `--text-*`).
  CLAUDE.md gains a new Phase 9C-2 architecture paragraph (engine
  section), a new constraint **Phase 9C-2 heatmap honesty (visual
  normalisation, not a new score)**, and this changelog entry.
  **No top-level `AppMode` change, no URL state / persistence change,
  no new graph topology / state family / observable lens, no new
  `LabPanelId`, no SU(2) representation engine, no intertwiner basis,
  no area / volume / dihedral expectation, no spherical-tetrahedron /
  flatness / curvature score, no existing proxy formula change, no
  external citation system, no new npm dependency.** The Gluing /
  Symmetry / Effective Geometry / Research Notes / Open Problems
  panels are byte-identical to Faz 9C-1; the existing per-qubit
  entropy cards keep their numeric labels / values / secondary lines
  unchanged; the reduced density matrix grid, the Phase 9B.5 exact-
  vs-proxy MI comparison block, the qualitative-comparison
  disclaimer, and the closing exact-vs-proxy callout are unchanged.
  `npm run validate:quantum-engine` 27/27 clean,
  `npm run validate:i18n` clean, `npm run typecheck` clean,
  `npm run build` clean.
- 2026-04-25 — **Faz 9C-1: General real-symmetric Hermitian eigensolver +
  general subsystem von-Neumann entropy + general qubit-subsystem mutual
  information. Cycle-4 / GHZ(4) pair MI now computed.** Engine-only change
  + minimal i18n + CLAUDE.md update — no React component restructure, no
  new `AppMode`, no new topology / family / lens, no new npm dependency.
  `src/features/quantum-engine/entropy.ts` gains a pure-TS Jacobi
  rotation solver: `eigenvaluesRealSymmetricJacobi(matrix, options)`
  (default `tolerance = 1e-12`, `maxIterations = 100·n²`),
  `isEffectivelyRealHermitian(matrix, eps)`,
  `hermitianToRealSymmetric(matrix, eps)`, and a size-dispatched
  `eigenvaluesHermitian(matrix, eps)` (n ≤ 2 closed-form, n ≥ 3 →
  real-symmetric Jacobi; throws on significant complex Hermitian
  off-diagonals). `vonNeumannEntropy(rho, base, eps)` now accepts any
  size via the dispatcher (clamps tiny negatives, throws on
  significantly non-PSD). `src/features/quantum-engine/mutualInformation.ts`
  gains `mutualInformationQubitSubsystems(ket, numQubits, A, B)` —
  builds ρ_A, ρ_B, ρ_AB via `partialTraceQubits` over deterministic
  sorted keep-lists and computes I(A:B) = S(A) + S(B) − S(AB);
  `mutualInformationForTwoQubitPureState` and
  `maybeComputePreviewMutualInformation` are refactored to delegate to
  the general helper, retiring the Phase 9B.5 hardcoded
  `S(AB) = 0` shortcut (the general solver naturally yields
  eigenvalues `{1, 0, 0, 0}` for a pure 2-qubit ρ, so `S(AB) = 0` is
  now a *result*). `MutualInformationResult.unsupported.reason` widens
  to `'requires-complex-hermitian-eigensolver' | 'requires-general-subsystem-entropy'`
  (the legacy reason is kept for backward compat but is not emitted by
  current flows). The dispatcher now returns `'computed'` for every
  state the engine produces today (Bell pair, Cycle-4/GHZ pair, GHZ(3),
  GHZ(4), product(4)); the `'unsupported'` UI branch is preserved as a
  defence against future complex-Hermitian states. Engine `index.ts`
  exports the new symbols (`JacobiOptions`, `isEffectivelyRealHermitian`,
  `hermitianToRealSymmetric`, `eigenvaluesRealSymmetricJacobi`,
  `eigenvaluesHermitian`, `mutualInformationQubitSubsystems`).
  `quantumEngine.selftest.ts` is now **24 invariants** (was 17): one
  pre-existing GHZ-unsupported assertion was *replaced* by its inverted
  9C-1 form (now `'computed'` with GHZ(3) MI = 1 bit, GHZ(4) MI = 1 bit,
  product(4) MI = 0 bits) and seven new assertions cover
  `eigenvaluesHermitian` (2×2 I/2, 4×4 diag(0.5,0,0,0.5)),
  `vonNeumannEntropy` 4×4 diag(0.5,0,0,0.5) = ln 2, GHZ(4) I(Q0:Q1) =
  1 bit, product(4) I(Q0:Q1) = 0, `isEffectivelyRealHermitian` on
  GHZ(4) and Bell ρ_AB, and `eigenvaluesRealSymmetricJacobi` on a
  Bell-shaped 4×4 → eigenvalues `{1, 0, 0, 0}`. UI / i18n: the
  `mutualInformation.unsupportedBody` strings in `src/i18n/ui/{en,tr}.ts`
  are generalised — they no longer mention "Cycle-4 preview is deferred"
  and instead describe the now-only-future complex-Hermitian path; the
  surrounding `computedBody` strings are also generalised so the
  hardcoded-S(AB)=0 phrasing is replaced with a fully general
  description that still notes S(AB)=0 emerges for two-qubit pure
  states. CSS / panel-layout / proxy formula
  (`(strengthMean × alignMean)^1.5`) all unchanged. CLAUDE.md gains a
  new Phase 9C-1 architecture paragraph (engine section), a new
  constraint **Phase 9C-1 eigensolver scope (real-symmetric only)**,
  and an update to the **Phase 9B.5 mutual-information honesty**
  constraint. `npm run validate:quantum-engine` 24/24 clean,
  `npm run validate:i18n` clean, `npm run typecheck` clean,
  `npm run build` clean.
- 2026-04-25 — **Faz 9B.5: Exact two-qubit mutual information added to the
  minimal engine and compared qualitatively with the existing MI proxy.**
  New engine module `src/features/quantum-engine/mutualInformation.ts`
  exports the `MutualInformationResult` discriminated union (`'computed'`
  with subsystem indices, S(A)/S(B)/S(AB) in nats, MI in nats + bits;
  `'unsupported'` with `reason: 'requires-general-subsystem-entropy'`),
  `mutualInformationForTwoQubitPureState(ket)` and the dispatcher
  `maybeComputePreviewMutualInformation(state)`. Pure TS, no React, no
  i18n. Uses the textbook identity I(A:B) = S(A) + S(B) − S(AB) with
  S(AB) = 0 because the global state is pure — so Phase 9B.5 needs no
  4×4 Hermitian eigensolver. ≥ 3-qubit states intentionally return
  `'unsupported'`; the user-facing Engine Preview surfaces this as a
  dashed notice rather than silently approximating. Engine self-test
  expanded from 13 → **17 checks**: Bell |Φ+⟩ exact I = 2 bits with
  full S(A)/S(B)/S(AB) breakdown; product |00⟩ exact I = 0; Bell-pair
  dispatch returns `'computed'`; GHZ(3)/(4)/4-qubit-product dispatch
  returns `'unsupported'` with the right reason. CorrelationSummary
  panel's existing Engine Preview section gained a new MI comparison
  sub-block between the reduced density matrix grid and the closing
  exact-vs-proxy callout — two-card grid (exact MI vs existing proxy)
  when computed, dashed unsupported notice + inline proxy value when
  unsupported. Both branches close with a qualitative-comparison
  disclaimer pinning that proxy is unitless and exact MI is in
  bits/nats. **No new physics formula** (I = S(A) + S(B) − S(AB) is
  the standard quantum-information definition); **the existing
  `mutualInformationProxy = (strengthMean × alignMean)^1.5` formula is
  unchanged**, the proxy value is read verbatim from
  `derived.mutualInformationProxy` and rendered alongside the exact
  result. **Numeric difference between exact MI and proxy is
  deliberately NOT shown** — different units (bits/nats vs unitless),
  different registers; computing a difference would falsely imply they
  were comparable error bars. New i18n block
  `lab.correlations.enginePreview.mutualInformation` (12 leaves)
  shipped EN ↔ TR in lockstep — `validate-ui-i18n.mjs` enforces the
  same key tree and leaf types on both sides. New panel CSS classes:
  `.mutualInfoComparison`, `.mutualInfoComputedBody`,
  `.mutualInfoGrid`, `.mutualInfoCard`, `.mutualInfoBreakdown`,
  `.unsupportedNotice`, `.unsupportedLabel`, `.unsupportedBody`,
  `.unsupportedProxyLine`, `.unsupportedProxyLabel`,
  `.qualitativeComparison`, `.qualitativeComparisonLabel`. New
  CLAUDE.md *Phase 9B.5 mutual-information honesty* constraint pins
  the unit-mismatch rule and the deliberate 4×4 deferral as policy.
  **No top-level `AppMode` change, no URL state change, no persistence
  change, no new graph topology / state family / observable lens, no
  new `LabPanelId`, no new 7th Lab tab, no SU(2) representation
  engine, no intertwiner basis, no area / volume / dihedral
  expectation, no spherical-tetrahedron / flatness / curvature score,
  no existing proxy formula change, no external citation system, no
  new npm dependency.** The Gluing / Symmetry / Effective Geometry /
  Research Notes / Open Problems panels are byte-identical to Faz 9B.
  `npm run validate:i18n` clean, `npm run validate:quantum-engine`
  17/17 self-checks pass, `npm run typecheck` clean, `npm run build`
  clean.
- 2026-04-25 — **Faz 9B: Minimal Qubit Engine Preview wired into Correlation
  Summary with explicit finite-dimensional-model honesty labels.** First UI
  surface for the Phase 9A engine. New pure-TS adapter
  `src/features/lab/quantumEnginePreview.ts` exports `MappingKind`
  (`'dipoleProduct' | 'dipoleBell' | 'cycle4Product' | 'cycle4Ghz'`),
  `EnginePreviewSelection` interface, and `selectMinimalQubitPreview(graphTopology,
  stateFamily)` — a deterministic curated mapping (dipole + uncorrelated → product 2q;
  dipole + anything else → bell-pair; cycle4 + uncorrelated → product 4q; cycle4 +
  anything else → ghz). Pure function, no React, no i18n, every selection carries the
  mandatory `honesty: 'minimal-qubit-model'` literal. `CorrelationSummaryPanel.tsx`
  imports `buildMinimalQubitGraphState`, `computeSingleQubitEntropies` from the
  Phase 9A engine plus the new adapter; computes a triplet (selection → state →
  entropies) inline; renders a new section between Global proxy summary (#4) and
  State-family curated reading (#5). The new section uses `LabSection` with a custom
  `[minimal qubit model]` chip in `headerRight` (NOT a `ProxyBadge` — engine outputs
  are exact within their model rather than proxies, so the four ProxyKinds don't
  fit). Section content: intro paragraph stating model boundary; mapping card
  (topology / family / selected state / qubits / curated reason); per-qubit entropy
  grid (entropyBits + entropyNat per qubit); reduced density matrix grid for qubit 0
  (2 × 2, complex format helper handles real and complex display); accent-tinted
  exact-vs-proxy callout pinning the distinction between "exact within model" and
  "pedagogical proxy of LQG register". Two private helpers in the panel file
  (`stateKindI18nLabel` for kebab→camel mapping of state-kind labels;
  `formatComplex` for matrix cell formatting). New i18n block
  `lab.correlations.enginePreview` shipped EN ↔ TR in lockstep — intro, model chip
  label, mapping field labels (5), mapping reasons (4), state kind labels (3),
  entropy labels + a `qubitLabel(n) => string` function leaf, reduced density
  matrix labels, exact-vs-proxy callout. New panel CSS classes
  (`.modelChip`, `.engineIntro`, `.engineMappingCard`, `.engineMappingGrid`,
  `.engineMappingLabel`, `.engineMappingValue`, `.engineMappingReason`,
  `.engineMappingReasonLabel`, `.entropySectionHead`, `.entropySectionLabel`,
  `.entropyGrid`, `.entropyCard*` ×4, `.matrixSection`, `.matrixHead`,
  `.matrixGrid`, `.matrixCell`, `.exactVsProxyCallout`, `.exactVsProxyLabel`,
  `.exactVsProxyBody`). New CLAUDE.md *Phase 9B engine preview honesty* constraint
  pinning the model boundary at the constraint level. **No top-level `AppMode`
  change, no URL state change, no persistence change, no new graph topology / state
  family / observable lens, no new `LabPanelId`, no new 7th Lab tab, no SU(2)
  representation engine, no intertwiner basis, no area / volume / dihedral
  expectation, no spherical-tetrahedron / flatness / curvature score, no existing
  proxy formula change, no external citation system, no new npm dependency.** The
  Gluing / Symmetry / Effective Geometry / Research Notes / Open Problems panels
  are byte-identical to Faz 9A. `npm run validate:i18n` clean (new
  `lab.correlations.enginePreview` keys present in both locales with matching leaf
  types, including the `qubitLabel` function leaf), `npm run validate:quantum-engine`
  13/13 self-checks pass (engine itself is unchanged), `npm run typecheck` clean,
  `npm run build` clean.
- 2026-04-25 — **Faz 9A: Minimal qubit entanglement engine added with density
  matrices, partial traces and entropy checks; no LQG intertwiner claims.**
  First real computational layer in the project. New feature folder
  `src/features/quantum-engine/` with ten files:
  `complex.ts` (Complex number type + ZERO/ONE/add/sub/mul/conj/abs2/scale
  /approxEqualComplex), `linearAlgebra.ts` (ComplexVector / ComplexMatrix
  + zeroVector / zeroMatrix / identityMatrix / outerProductKetBra / trace
  / dagger / matMul / vectorNormSquared / normalizeStateVector /
  approxEqualMatrix), `quantumState.ts` (basisState / tensorProductVector
  / tensorProductMatrix / bellPhiPlus / productZeroState / ghzState /
  validateNormalizedState — qubit 0 = LSB convention pinned),
  `densityMatrix.ts` (pureDensityMatrix / validateDensityMatrix square +
  Hermitian + Tr=1 / purity Tr(ρ²)), `partialTrace.ts`
  (intToBits / bitsToInt / projectBits + general partialTraceQubits over
  any subset of qubits — keepQubits deduplicated and sorted ascending so
  output is deterministic regardless of caller order), `entropy.ts`
  (eigenvaluesHermitian2x2 closed-form λ± with -eps clamp +
  vonNeumannEntropy 2×2 only with explicit Phase-9A scope error for
  larger sizes + binaryEntropy), `graphState.ts`
  (MinimalQubitGraphStateKind = 'product' | 'bell-pair' | 'ghz' +
  buildMinimalQubitGraphState — every output carries
  `honesty: 'minimal-qubit-model'` literal),
  `singleQubitEntropies.ts` (computeSingleQubitEntropies — convenience
  helper returning per-qubit reduced ρ + entropies in nats and bits),
  `index.ts` (public API barrel), and
  `quantumEngine.selftest.ts` (13 self-checks). Engine is React-, DOM-,
  and i18n-agnostic. **No UI integration in this phase** — Faz 9B will
  add a Lab-side preview surface. **No new npm dependency.** The engine
  uses only the already-installed `typescript` package (via the
  compiler API in the new
  `scripts/validate-quantum-engine.mjs` validator script, which mirrors
  the existing `scripts/validate-i18n.mjs` pattern). The validator
  compiles the engine + selftest to a gitignored temp dir
  (`.tmp-quantum-engine/`, written with `{"type":"commonjs"}` to
  override the project's top-level `"type": "module"` so `require()`
  can load the CommonJS-emitted output) and runs the selftest via
  `require()`; the temp dir is cleaned up on success and failure.
  `package.json` gains one new script `validate:quantum-engine`.
  `.gitignore` gains the temp-dir entry. Self-test results: **13/13
  pass** (Bell |Φ+⟩ normalised; Bell single-qubit ρ = I/2; Bell
  S(ρ) = ln 2 nats and = 1 bit; product |00⟩ S(ρ) = 0; GHZ(3)
  single-qubit S(ρ) = ln 2; partial trace preserves Tr=1 across six
  Bell/product/GHZ keep-permutations; reduced ρ is Hermitian + unit
  trace; pure-state purity Tr(ρ²) = 1; Bell reduced ρ eigenvalues
  {1/2, 1/2}; product reduced ρ eigenvalues {0, 1};
  buildMinimalQubitGraphState yields normalised states across kind ×
  numQubits combinations; computeSingleQubitEntropies returns correct
  length and per-qubit values for Bell, GHZ(3) and |00⟩). **Phase 9A
  scope is explicit in code and docs**: the engine computes a minimal
  qubit model — *not* SU(2) intertwiner-space observables, *not* LQG
  Bell-network states, *not* geometric-operator (area/volume/dihedral
  angle) expectation values, *not* spherical-vs-flat tetrahedron
  curvature signatures, *not* mutual information of a true LQG Hilbert
  space. The SU(2) / intertwiner upgrade is Phase 9C+. A new
  *Phase 9A engine honesty* constraint in CLAUDE.md is the bridge
  between these honest scope boundaries and any future UI consumer.
  **No legacy mode behaviour was changed**: Explore / Learn /
  Challenge / Bridge / Geometry Lab surfaces, all six Lab panels, all
  content data files, persistence + URL hash schema, AppMode union,
  i18n trees — all unchanged. `npm run validate:i18n` clean,
  `npm run typecheck` clean, `npm run build` clean
  (engine TS files are tree-shaken because no UI imports them yet —
  expected),  `npm run validate:quantum-engine` 13/13 pass.
- 2026-04-25 — **Faz 8: Open Problems panel implemented as a research-program
  view tying every Lab future-calculable-observable to its real LQG
  counterpart.** Sixth and final real Geometry Lab panel — replaces the
  Faz 2 placeholder for the `'openProblems'` panel id, completing the
  six-panel Lab. **Discipline: zero new physics formula, zero new
  diagnostic score, zero new ProxyKind, zero external citation system,
  zero pipeline read.** The panel renders eight curated research-paper-
  abstract-style cards. New file `src/data/openProblems.ts` defines:
  the closed `OpenProblemId` union (`shapeMatching`,
  `closureConstraint`, `reducedDensityMatrix`, `longRangeCorrelations`,
  `effectiveGeometryReconstruction`, `cosmologicalSectorMapping`,
  `harmonicCosmology`, `semiclassicalMoments`); the `OpenProblem`
  interface (`id`, `title`, `sourcePanels: LabPanelId[]`,
  `realObservable`, `proxyUsed`, `missingPhysics`, `whyItMatters`,
  `researchDirection`); the eight locale-keyed records (each with EN
  and TR copy in a `Record<Locale, OpenProblemCopy>`); and
  `getOpenProblems(locale)` / `getOpenProblem(id, locale)` getters.
  The pattern mirrors `topologies.ts` / `stateFamilies.ts` — stable
  structural ids in code, localised prose in records — and does **not**
  add a path to `validate-i18n.mjs`'s closed list (the new file is
  not under `lessons/challenges/bridgeLessons/glossary`). Each
  `sourcePanels` array structurally cross-references the diagnostic
  Lab panels where the corresponding `future-calculable-observable`
  row appears, so the eight problems form a coherent
  research-program graph anchored to existing Lab surfaces (the
  spirit of the user-spec'd "auto-generated from diagnostics"
  requirement, satisfied by static cross-reference rather than
  runtime row scraping). New panel CSS module
  `OpenProblemsPanel.module.css` carries problem-card layout
  (`.problemList` / `.problemCard` with accent left border /
  `.problemHeader` / `.problemTitle` / `.problemSourcePanels` /
  `.problemSourceChip` / `.problemFields` / `.problemField` /
  `.problemFieldLabel` / `.problemFieldBody` /
  `.problemFieldBodyResearch`); the panel TSX renders the cards from
  the data getter and reads the panel chrome (intro, field labels,
  source-panel chip row label) from a new `lab.openProblems.*` i18n
  block (intro / problemListAria / sourcePanelsLabel /
  fields.{realObservable, proxyUsed, missingPhysics, whyItMatters,
  researchDirection}). i18n parity validated by
  `validate-ui-i18n.mjs`. **No `<ProxyBadge>` per card** — the
  five-field card structure carries honesty without diluting the
  badge convention, which stays reserved for diagnostic rows.
  **No panel-level scope card or how-to-read callout** — each card
  is self-contained, satisfying the spec's "no duplication of scope
  explanations" hard constraint.

  **Architectural decision.** The Faz 8 spec literally suggested
  adding a top-level `Research` button to `ModeToggle`. The
  implementation keeps Open Problems as the sixth Lab panel because
  (i) every prior phase explicitly forbade extending `AppMode` /
  URL state / persistence, and Faz 8's own hard-constraint list
  forbids those changes; (ii) the Faz 7 `proxiesToObservables`
  Research Note that I shipped two phases ago literally states
  "the Open Problems panel will collect those gaps as a single
  roadmap" — adding a separate `Research` mode would orphan that
  forward reference; (iii) the spec's "NOT as a separate overlay"
  clause is already satisfied by the existing access path
  (ModeToggle → Geometry Lab → Open Problems tab) — that is
  standard navigation, not an overlay. Overlays in this app are
  the Atlas / Library drawers; Lab panels are not overlays. The
  invariant of five top-level peer modes is preserved.

  `LabPanel`'s rendering switch is unchanged — `OpenProblemsPanel`
  stays nullary (no `config` prop) because the panel reads no
  pipeline values; **all six Lab panels are now real**, and no
  `PlaceholderPanel` consumer remains. **No legacy mode behaviour
  was changed**: Explore / Learn / Challenge / Bridge surfaces,
  `ControlPanel`, `VisualizationPanel`, atlas / library overlays,
  content data files, persistence + URL hash schema, the five
  diagnostic / explanatory Lab panels (Gluing, Symmetry, Effective
  Geometry, Correlation, Research Notes), `LabPanel`'s scope note +
  demo-off banner — all unchanged. `npm run validate:i18n` clean,
  `npm run typecheck` clean, `npm run build` clean.
- 2026-04-25 — **Faz 7: Research Notes panel implemented as explanatory
  i18n-backed academic notes without new computations or citation
  system.** Fifth real Geometry Lab panel — replaces the Faz 2
  placeholder for the `'researchNotes'` panel id. **Discipline: zero
  new physics, zero new diagnostic score, zero new ProxyKind, zero
  external citation system, zero new data file.** The panel is
  explanatory only; it does not read the canonical pipeline, runs no
  algorithm against the active state, and renders no `<ProxyBadge>`
  per note (the panel-scope card carries the honesty disclaimer for
  the entire surface, and each note's `inThisApp` field repeats the
  relevant disclaimer in context). New file
  `src/features/lab/panels/ResearchNotesPanel.module.css` carries
  panel-specific note-card layout (`.noteList` / `.noteCard` /
  `.noteTitle` / `.noteThesis` / `.noteSections` / `.noteSection` /
  `.noteSectionLabel` / `.noteSectionBody`); the italic
  accent-bordered `.noteThesis` mirrors the Concept Atlas's
  `.detailLede` pattern. The TSX uses the Faz 5.5 `LabSection` shared
  primitive (with `sharedStyles.sectionCard` + `sharedStyles.cardBody`
  for the panel-scope card) and a small inline `NoteSection` helper
  for the three labelled sub-blocks per note (Why it matters / In
  this app / Future work). New i18n block
  `lab.researchNotes.*` shipped EN ↔ TR in lockstep —
  `validate-ui-i18n.mjs` enforces the same key tree and leaf types on
  both sides. The block carries six note entries:
  `bellNetworkGluing` (Bell-network states and entanglement-induced
  gluing), `geometryHierarchy` (twisted / vector / Regge),
  `homogeneousGraphs` (automorphism invariance and one-node
  observables), `dipoleEffectiveGeometry` (flat-vs-spherical
  tetrahedron framing), `correlations` (correlations in quantum
  geometry and cosmology), and `proxiesToObservables` (the roadmap
  from pedagogical proxies to calculable observables). Each note has
  five fields (`title`, `thesis`, `whyItMatters`, `inThisApp`,
  `futureWork`) — 30 leaf strings per locale plus shared meta
  (`intro`, `panelScopeLabel`, `panelScopeBody`, `noteListAria`,
  `fields.{whyItMatters,inThisApp,futureWork}`). **Notes live in the
  UI i18n tree, not in a new `src/data/researchNotes.ts` file**, so
  `validate-i18n.mjs`'s closed path list (`lessons / challenges /
  bridgeLessons / glossary`) stays untouched; if the note collection
  grows large enough, a future refactor can move it to a dedicated
  data file with a corresponding validator path extension. The
  `LabPanel` rendering switch is unchanged — `ResearchNotesPanel`
  stays nullary (no `config` prop) because the panel reads no
  pipeline values; only the `OpenProblems` panel still calls
  `PlaceholderPanel`. **No legacy mode behaviour was changed**:
  Explore / Learn / Challenge / Bridge surfaces, `ControlPanel`,
  `VisualizationPanel`, atlas / library overlays, content data
  files, persistence + URL hash schema, the four diagnostic Lab
  panels (Gluing, Symmetry, Effective Geometry, Correlation),
  `LabPanel`'s scope note + demo-off banner, and the remaining
  Lab placeholder — all unchanged. `npm run validate:i18n` clean,
  `npm run typecheck` clean, `npm run build` clean.
- 2026-04-25 — **Faz 6.5: Geometry Lab family-reading list shared component
  and demo-off warning added without changing diagnostics or physics
  claims.** Two surgical UX/maintenance changes ahead of Faz 7. (1) New
  shared component `src/features/lab/shared/LabFamilyReadingList.tsx`
  consolidates the curated state-family classification list pattern
  that Symmetry (Faz 4) and Correlation (Faz 6) had each implemented in
  their own panel CSS. The shared CSS classes
  (`.familyReadingList` / `.familyReadingItem` /
  `.familyReadingItemActive` / `.familyReadingName` /
  `.familyReadingActiveChip` / `.familyReadingHeadline` /
  `.familyReadingBody`) live in `LabShared.module.css`; the
  Symmetry-specific eight CSS classes that supported its pre-refactor
  family list and the seven Correlation-specific classes are removed
  from the panel modules. The chip placement adopts Correlation's
  inline-next-to-label pattern as canonical — Symmetry's chip-on-its-own-row
  layout subtly tightens, the only visible layout shift in this
  refactor; **no curated reading text changed in either panel**.
  (2) `LabPanel.tsx` renders a new warn-tinted demo-off context banner
  between the scope note and the panel tab strip, only when
  `config.demoMode === false`. The banner explains that pedagogical-proxy
  values read zero in that mode because the canonical pipeline is fed
  `strength = 0` — the same behaviour `VisualizationPanel` has had
  since Faz 0. New i18n keys `lab.demoOff.{label,body}` shipped EN ↔ TR
  in lockstep; the EN/TR text is the user-supplied verbatim copy.
  **No physics formula was introduced**, no diagnostic row was added,
  no proxy-kind label was changed, no canonical pipeline call was
  modified. The Gluing / Symmetry / Effective Geometry / Correlation
  panels' user-visible content is identical to the pre-Faz-6.5 state
  except for the consolidated chip placement in Symmetry's family list.
  ProxyBadge visibility is preserved everywhere — the demo-off banner
  intentionally has no `ProxyBadge` because it is context, not a
  diagnostic. **No legacy mode behaviour was changed**: Explore /
  Learn / Challenge / Bridge surfaces, `ControlPanel`,
  `VisualizationPanel`, atlas / library overlays, content data files,
  persistence + URL hash schema, the four real Lab panels' canonical
  pipeline reads, and the two remaining Lab placeholders — all
  unchanged. `npm run validate:i18n` clean (the new `lab.demoOff` block
  is the only key tree change, present in both locales),
  `npm run typecheck` clean, `npm run build` clean.
- 2026-04-25 — **Faz 6: Correlation Summary panel implemented using existing
  pedagogical proxy outputs without exact correlator claims.** Fourth real
  Geometry Lab panel — replaces the Faz 2 placeholder for the
  `'correlations'` panel id. Discipline: zero new physics, **zero new
  pair-pair correlation formula** (no `corr(i,j)=…`), **zero exact
  intertwiner-space two-point function calculation**, **zero quantum
  mutual information / reduced density matrix / entanglement entropy
  computation**. Numeric values come verbatim from
  `deriveCorrelationState(strength, family)` and
  `deriveEdgeDetails(topology.edges, strength, family, observableMode)`
  — the same calls the canvas, the Faz 3 Gluing panel and the Faz 5
  Effective Geometry panel make. The `mutualInformationProxy` value is
  surfaced explicitly as a `pedagogical-proxy` with a row note stating
  it is a deterministic toy formula `(strengthMean × alignMean)^1.5`
  and not the quantum mutual information of any density matrix. The
  panel uses the Faz 5.5 shared primitives (`LabSection`,
  `LabDiagnosticRow`, `LabLimitationsList`, `LabCallout`) consumed via
  `LabShared.module.css`. Eight structural sections: (1) academic
  intro, (2) hierarchy framing card explaining pair-level / graph-level
  / exact-correlator honesty levels, (3) 4-card per-pair profile (one
  card per face pair, three pedagogical-proxy values each:
  `localStrength` / `localAlignmentScore` / `localGluingProxy`;
  mismatch deliberately omitted because alignment encodes it),
  (4) 3-card global proxy summary (`antiParallelScore` / `gluingScore`
  / `mutualInformationProxy`), (5) 5-item curated state-family
  readings list (uncorrelated / weakAligned / bellSymmetric /
  frustrated / edgeBiased), active family highlighted, (6) 6
  `LabDiagnosticRow`s — `pairProfile` and `globalTendency`
  (pedagogical-proxy, no row-level number — the numbers live in the
  cards above), `familyReading` (curated-classification, points at
  the reading list above), `symmetryVsCorrelation`
  (conceptual-diagnostic, text-only), `exactCorrelators` and
  `reducedDensityMatrix` (future-calculable-observable, "not computed"
  pills), (7) 5-bullet limitations block, (8) how-to-read callout.
  New panel-specific CSS module (`CorrelationSummaryPanel.module.css`)
  carries pair-card grid + global-card grid + family-readings list
  patterns; the family-readings list visually mirrors Symmetry's
  pattern but is intentionally re-implemented in panel CSS rather
  than being lifted into a fifth shared primitive (the Faz 5.5
  shared-component cap stays intact; lifting belongs to a future
  refactor pass and is flagged in the Faz 6 risks). New i18n block
  `lab.correlations.*` shipped EN ↔ TR in lockstep —
  `validate-ui-i18n.mjs` enforces the same key tree, leaf types, and
  the 5-element `limitations.items` array length on both sides.
  `LabPanel` now forwards `config` to all four real panels; the two
  remaining placeholders (`ResearchNotes`, `OpenProblems`) stay
  nullary delegates to `PlaceholderPanel`. **No legacy mode behaviour
  was changed**: Explore / Learn / Challenge / Bridge surfaces,
  `ControlPanel`, `VisualizationPanel`, atlas / library overlays,
  content data files, persistence + URL hash schema, the Faz 3
  Gluing panel, the Faz 4 Symmetry panel, the Faz 5 Effective
  Geometry panel, and the two remaining Lab placeholders — all
  unchanged. `npm run validate:i18n` clean, `npm run typecheck` clean,
  `npm run build` clean.
- 2026-04-25 — **Faz 5.5: Geometry Lab shared UI primitives extracted without
  changing diagnostics or physics claims.** After three real Lab panels showed
  identical chrome patterns, extracted them into one shared CSS module
  (`src/features/lab/shared/LabShared.module.css`) and four small components
  (`LabSection`, `LabDiagnosticRow`, `LabLimitationsList`, `LabCallout`).
  Refactored Gluing / Symmetry / Effective Geometry panels to consume the
  shared primitives. **No content, no canonical-pipeline read, no proxy-kind
  label, no i18n key, and no academic claim was changed.** The
  `derived.antiParallelScore` / `derived.gluingScore` reads in Gluing and
  Effective Geometry are unchanged; the per-pair `edgeDetails` table in
  Gluing is unchanged (its layout chrome stays panel-specific so the
  pre-refactor left-clustered label+badge cluster is preserved verbatim);
  the curated state-family classifications in Symmetry are unchanged; the
  flat-vs-spherical tetrahedron framing and the dipole-specific scope chip
  in Effective Geometry are unchanged. `LabDiagnosticRow` accepts the
  union of options across the three panels (`value` / `notComputedLabel`
  / `scopeChip`); the `<ProxyBadge>` continues to render on the row
  surface, never tooltip-only, satisfying the *Proxy honesty* constraint.
  `LabSection` renders an optional right-aligned header element so panels
  can host a section-level ProxyBadge cleanly. The two panels that share
  the active-topology-reading-card pattern (Symmetry, Effective Geometry)
  pull `.readingCard` / `.readingHeadline` / `.readingBody` from the
  shared module; their `.readingNote` font-sizes (0.78rem in Symmetry vs
  0.82rem in Effective Geometry) stay panel-specific because the delta
  was deliberate in the originals (label vs paragraph). Panel CSS
  modules shrank — `GluingDiagnosticsPanel.module.css` from 351 lines to
  ~140, `SymmetryDiagnosticsPanel.module.css` from 343 to ~85,
  `EffectiveGeometryPanel.module.css` from 369 to ~75. The four
  remaining placeholder panels (`CorrelationSummary`, `ResearchNotes`,
  `OpenProblems`) and `PlaceholderPanel.tsx` were not touched. **No
  legacy mode behaviour was changed**: Explore / Learn / Challenge /
  Bridge surfaces, `ControlPanel`, `VisualizationPanel`, atlas / library
  overlays, content data files, persistence + URL hash schema — all
  unchanged. `npm run validate:i18n` clean (no i18n keys touched),
  `npm run typecheck` clean, `npm run build` clean.
- 2026-04-25 — **Faz 5: Effective Geometry Summary panel implemented with
  vector / twisted / Regge comparison and topology-specific conceptual
  diagnostics.** Third real Geometry Lab panel — replaces the Faz 2
  placeholder for the `'effectiveGeometry'` panel id. Discipline: zero
  new physics, **zero new "effective geometry score" / "flatness score" /
  "sphericity score" invented**. Numeric values come verbatim from
  `deriveCorrelationState(strength, family)` — the same call the canvas
  stat cards and the Faz 3 Gluing panel make, so the Lab and the canvas
  cannot drift on this metric. Seven structural sections: (1) academic
  intro, (2) hierarchy framing card explaining vector → twisted → Regge
  as increasingly demanding readings of the same combinatorial data, (3)
  three side-by-side comparison cards (`Vector geometry` →
  `pedagogical-proxy`, `Twisted geometry` → `future-calculable-observable`,
  `Regge geometry` → `future-calculable-observable`) each with a "what it
  asks for" / "what this app currently shows" pair, (4) topology-specific
  note (dipole gets the flat-vs-spherical tetrahedron framing with a
  literature-oriented conceptual diagnostic disclaimer; cycle-4 gets the
  cyclic / dihedral framing with an explicit "no spherical-tetrahedron
  reading here" follow-up), (5) seven `EffGeoRow`s — `vectorGeometryProxy`
  and `effectiveGluingTendency` (pedagogical-proxy, surface
  `antiParallelScore` and `gluingScore` from the canonical pipeline);
  `flatTetrahedron` and `sphericalTetrahedron` (conceptual-diagnostic,
  text-only; the Spherical Tetrahedron row carries a dipole-specific chip
  near the title when active topology is not the dipole so the row stays
  visible without misleading the user); `twistedPhaseSpace`,
  `reggeShapeMatching`, `exactExpectations` (future-calculable-observable,
  show a "not computed" pill), (6) five-bullet limitations block, (7)
  how-to-read callout. New `ComparisonCard` and `EffGeoRow` components
  live inside `EffectiveGeometryPanel.tsx` (no shared abstraction yet —
  Faz 5 discipline; flagged as a refactor candidate for Faz 6+ now that
  three real panels share the same row / surface patterns). New CSS
  module (`EffectiveGeometryPanel.module.css`) deliberately duplicates
  Faz 3 / Faz 4 design tokens. `LabPanel` now forwards `config` to all
  three real panels; the three remaining placeholders stay nullary
  delegates to `PlaceholderPanel`. New i18n block `lab.effectiveGeometry.*`
  shipped EN ↔ TR in lockstep — `validate-ui-i18n.mjs` enforces the same
  key tree, leaf types, and the 5-element `limitations.items` array
  length on both sides. **No legacy mode behaviour was changed**: Explore
  / Learn / Challenge / Bridge surfaces, `ControlPanel`,
  `VisualizationPanel`, atlas / library overlays, content data files,
  persistence + URL hash schema, the Faz 3 Gluing Diagnostics panel, the
  Faz 4 Symmetry Diagnostics panel, and the three remaining Lab
  placeholders — all unchanged. `npm run validate:i18n` clean,
  `npm run typecheck` clean, `npm run build` clean.
- 2026-04-25 — **Faz 4: Symmetry / Automorphism Diagnostics panel implemented
  with conceptual diagnostics and curated classifications.** Second real
  Geometry Lab panel — replaces the Faz 2 placeholder for the `'symmetry'`
  panel id. Discipline: zero new physics, zero new toy formulas, **no
  automorphism algorithm**. The panel reads structural metadata only —
  `getTopology(config.graphTopology, locale)` to surface the existing
  locale-aware `topology.symmetryNote` (already shipped in
  `src/data/topologies.ts`, carrying the canonical S₂ × S₄ for the dipole
  and D₄ for cycle-4) and `getStateFamilies(locale)` to enumerate the five
  shippable families for the curated classification list. All curated
  prose lives under a new `lab.symmetry.*` i18n tree — *not* a separate
  `src/data/labSymmetryProfiles.ts` data file: the readings are
  user-facing prose, exactly what i18n is for, so co-locating them in
  `src/i18n/ui/{en,tr}.ts` puts them under `validate-ui-i18n.mjs` parity
  protection at zero cost. New Symmetry-specific surfaces:
  `topologyReading.readings.{dipole,cycle4}` (headline + body each),
  `familyReading.classifications.{uncorrelated,weakAligned,bellSymmetric,frustrated,edgeBiased}`
  (headline + body each, five entries), and the standard six diagnostic
  rows: `topologySymmetry` / `nodeEquivalence` / `edgeOrbit`
  (conceptual-diagnostic), `familyClassification` (curated-classification),
  `fullAutomorphism` / `oneNodeObservables` (future-calculable-observable).
  Each row carries a visible `<ProxyBadge>`; rows that the app does not
  compute show a "not computed" pill rather than a missing value, so the
  gap stays legible. Limitations bullet list (5 items) and how-to-read
  callout mirror the Faz 3 pattern. New CSS module
  (`SymmetryDiagnosticsPanel.module.css`) deliberately duplicates the
  Faz 3 design tokens rather than extracting a shared module — Faz 4
  discipline avoids premature abstraction; if a third real panel reuses
  the structure in Faz 5+, we extract then. `LabPanel` now forwards
  `config` to both `GluingDiagnosticsPanel` and `SymmetryDiagnosticsPanel`;
  the four remaining placeholders stay nullary delegates to
  `PlaceholderPanel`. **No legacy mode behaviour was changed**: Explore /
  Learn / Challenge / Bridge surfaces, `ControlPanel`, `VisualizationPanel`,
  atlas / library overlays, content data files, persistence + URL hash
  schema, the Faz 3 Gluing Diagnostics panel, and the four remaining Lab
  placeholders — all unchanged. `npm run validate:i18n` clean,
  `npm run typecheck` clean, `npm run build` clean.
- 2026-04-25 — **Faz 3: Gluing Diagnostics panel implemented using existing
  pedagogical proxy pipeline.** First real Geometry Lab panel — replaces the
  Faz 2 placeholder for the `'gluing'` panel id. Discipline: zero new physics,
  zero new toy formulas. Every numeric value comes verbatim from the canonical
  pipeline already shared by `VisualizationPanel` + `EdgeDetailCard` —
  `deriveCorrelationState(strength, family)` for global `antiParallelScore` /
  `gluingScore`, and `deriveEdgeDetails(topology.edges, strength, family,
  observableMode)` for per-pair `localStrength` / `localMismatchAngle` /
  `localAlignmentScore` / `localGluingProxy`. Number formatting (`formatNumber(_,
  2)`, `${x.toFixed(1)}°`, `formatNumber(_)` 3-digit) mirrors `EdgeDetailCard`
  exactly so a reader hopping between surfaces sees the same numbers rendered
  identically. Panel structure: (1) academic intro, (2) twisted → vector →
  Regge geometry hierarchy with one-line definition + honest "in this app"
  line per tier, (3) five `DiagnosticRow`s — `Anti-parallel normal alignment`
  (pedagogical-proxy) + `Gluing coherence across face pairs`
  (pedagogical-proxy) + `Face-area matching` (future-calculable-observable) +
  `Shape matching / Regge condition` (future-calculable-observable) +
  `Closure constraint at each node` (future-calculable-observable) — each row
  carries a visible `<ProxyBadge>` on the surface (never tooltip-only) and
  rows without a number show a "not computed" pill instead of a missing
  value, (4) per-pair table over `edgeDetails` with the same four
  EdgeDetail-card values, table header carries one `<ProxyBadge
  kind="pedagogical-proxy">`, (5) five-bullet `Limitations` block mirroring
  the Faz 3 spec (vector-geometry proxy / no twisted-geometry phase-space /
  no Regge shape-matching / no exact LQG intertwiner observables / no
  closure constraint), (6) `How to read this panel` callout explaining the
  badge classes. Wiring: `LabPanel` gained a `config: DemoConfig` prop;
  `App.tsx` forwards it; only `GluingDiagnosticsPanel` consumes it — the
  five remaining placeholders stay nullary delegates to `PlaceholderPanel`.
  i18n: a new `lab.gluing` block (intro / hierarchy.{twisted,vector,regge}
  with name+definition+inThisApp / diagnostics with rowsAria + notComputedLabel
  + 5 row entries each with title+body+proxyNote / pairTable with label +
  caption + 5 column labels / limitations with aria + 5-item array /
  howToRead with label+body) shipped EN ↔ TR in lockstep —
  `validate-ui-i18n.mjs` enforces the same key tree, leaf types, and the
  5-element `limitations.items` array length on both sides. New CSS
  (`GluingDiagnosticsPanel.module.css`) only composes existing design
  tokens; no new colour, no new font. **No legacy mode behaviour was
  changed**: Explore / Learn / Challenge / Bridge surfaces, the
  `ControlPanel`, `VisualizationPanel`, atlas / library overlays, content
  data files, persistence + URL hash schema, and the other five Lab
  placeholders — all unchanged. `npm run validate:i18n` clean,
  `npm run typecheck` clean, `npm run build` clean.
- 2026-04-25 — **Faz 2: Geometry Lab skeleton landed.** Added the fifth peer mode
  (`AppMode === 'lab'`) and the surfaces it will eventually carry, all as placeholders.
  New files: `src/types/lab.ts` (`LabPanelId`, `ProxyKind`, `LAB_PANEL_IDS`,
  `FIRST_LAB_PANEL_ID`, `PROXY_KINDS`, `LAB_PANEL_PROXY_KIND`),
  `src/features/lab/LabPanel.tsx` + `.module.css` (root chrome: header / scope-note /
  panel switcher / body), `src/features/lab/shared/ProxyBadge.tsx` + `.module.css`
  (visible honesty-class tag, four colour-coded kinds),
  `src/features/lab/shared/PlaceholderPanel.tsx` + `.module.css` (shared skeleton —
  label / short goal / sample badge / placeholder body / "later phase" tag), and six
  thin per-panel wrappers under `src/features/lab/panels/`
  (`GluingDiagnosticsPanel`, `SymmetryDiagnosticsPanel`, `EffectiveGeometryPanel`,
  `CorrelationSummaryPanel`, `ResearchNotesPanel`, `OpenProblemsPanel`). `App.tsx`
  grew `activeLabPanelId` state (URL > stored > `FIRST_LAB_PANEL_ID` resolution),
  the `lab` branch in the footer-swap chain, lab-panel reset in `handleCleanStart`,
  and the lab field in the persist + URL-sync effect. `ModeToggle` gained the fifth
  button (Geometry Lab); CSS gained `flex-wrap: wrap` on the pill plus a `<= 520 px`
  media query that shrinks button padding so the row stays single-line on narrow
  phones. URL state: `UrlState.labPanel?: LabPanelId` validated against
  `LAB_PANEL_IDS`, encoded only when `mode === 'lab'`; old hashes unchanged.
  Persistence: `PersistedState.activeLabPanelId?: LabPanelId` added — **no
  `STORAGE_KEY` bump**, the addition is strictly backward-compatible (old snapshots
  read with no field, fall back to `FIRST_LAB_PANEL_ID`). i18n: `modes.lab.{label,hint}`
  + a new `lab` block (aria, eyebrow, heading, subheading, scope note, panel switcher
  aria + active-panel aria function, placeholder/laterPhase/sampleProxy labels,
  proxy-kind short+title pairs for all four kinds, per-panel label+shortGoal+placeholder
  for all six panels) shipped in EN and TR in lockstep. CLAUDE.md *Product shape* now
  lists five modes and notes the Lab mode is a skeleton; *App layout + footer-swap
  pattern* gained a `Lab: LabPanel` entry; new *Geometry Lab skeleton (Faz 2)*
  subsection under *High-level architecture*; *Constraints — Proxy honesty* extended
  with the component-level `ProxyBadge` enforcement. **No legacy mode behaviour was
  changed**: Explore / Learn / Challenge / Bridge surfaces, content data files,
  `ControlPanel`, `VisualizationPanel`, atlas / library overlays, `recommendations`
  helper, all unchanged. `npm run validate:i18n` (content + UI parity) clean,
  `npm run typecheck` clean, `npm run build` clean.
- 2026-04-25 — **Faz 1: Academic identity update (documentation-only).**
  README.md / README.tr.md / index.html / package.json reframed toward the
  **Bell-Network Geometry Lab** — research-oriented pedagogical-lab
  positioning ("A research-oriented pedagogical lab for exploring how
  entanglement, graph symmetry and correlations encode effective quantum
  geometry in Bell-network states"). Both READMEs gained an *Academic
  Direction* / *Akademik Yönelim* section listing the twelve concept
  targets the Lab is being shaped around (Bell-network states,
  entanglement-induced gluing, quantum polyhedra, twisted geometry, vector
  geometry, Regge geometry, automorphism-invariant homogeneous graphs,
  one-node observables, local entanglement entropy, effective geometry on
  dipole graphs, spherical-tetrahedron reading, correlations in quantum
  geometry and cosmology) plus a *Honesty / Scope* / *Dürüstlük / Kapsam*
  section formalising the four-class proxy taxonomy (pedagogical-proxy /
  conceptual-diagnostic / curated-classification /
  future-calculable-observable). `index.html` `<title>` + `description` +
  OG + Twitter Card meta updated to match. `package.json` `description`
  shortened to "Pedagogical lab for entanglement, graph symmetry and
  effective quantum geometry on Bell-network states." CLAUDE.md *Product
  shape* gains a Geometry-Lab framing paragraph (proposed `src/features/lab/`,
  fifth `AppMode='lab'`, per-diagnostic honesty label) and Constraints
  gains a new **Proxy honesty (Geometry Lab discipline)** rule enforcing
  explicit labelling on every future Lab diagnostic. **No code changes:**
  no React component touched, no `AppMode` union edit, no URL-state schema
  change, no persistence-key bump, no i18n UI key added, no data file
  edited. `npm run validate:i18n` (content + UI parity) clean,
  `npm run typecheck` clean, `npm run build` clean.
- 2026-04-22 — **Release-candidate QA pass.** Walked every major user
  flow (first open, onboarding re-trigger, Explore ↔ Learn ↔ Challenge ↔
  Bridge, Atlas / Library open + locale change, Clean start, Reset all
  progress, shared-URL open, TR-mode share, topology change with selected
  edge, narrow-width wrap) and found exactly one real a11y pürüz worth
  fixing at this stage: the `LanguageSwitcher` read "Switch to English"
  (or equivalent) to screen readers on the *already-active* button.
  Added `language.current(name)` to `UI_STRINGS` in both locales
  ("Current language: English" / "Mevcut dil: English") and switched
  `LanguageSwitcher` to use it when `active === true` so the accessible
  label now honestly describes the current state. All other flows,
  cross-mode transitions, reset semantics, and edge-case interactions
  (stale edge id after shared URL on mismatched topology, Reset all
  re-triggering onboarding card, closeAllOverlays on mode jumps) behave
  correctly — deliberately left untouched per the "don't overfix" rule.
  Content unchanged; typecheck + content/UI parity validators + build
  all clean.
- 2026-04-22 — **Final UX polish pass.** Three tight, low-risk refinements
  landed: (1) Atlas `.sectionLabel` normalised to the Lesson / Challenge /
  Bridge spec (`0.64rem` / `0.18em` vs the drifted `0.66rem` / `0.16em`)
  so section headers read identically as the user hops between panels and
  the atlas drawer; (2) `font-style: italic` stripped from three helper /
  empty-state rules — Atlas `.emptyResults`, Atlas `.lessonNote`, Library
  `.emptyState` — because italic is a dated pattern that hurts on-screen
  scanning and tertiary colour alone is already a sufficient "helper text"
  signal (the intentional `.detailLede` italic pull-quote in the Atlas is
  preserved by design); (3) Atlas cross-mode navigation notes shortened —
  "Opening a lesson switches the app to Learn mode." / "Bir lesson'u açmak
  uygulamayı Learn moduna geçirir." became "Opens in Learn mode." /
  "Learn modunda açılır." across Lesson / Challenge / Bridge rows. No new
  dependency, no layout shift, no content touched. Both locales clean on
  content + UI parity; build clean.
- 2026-04-22 — **UX + relation-hub refinement.** Background: the tiny
  `src/features/learning/recommendations.ts` file was folded into
  `src/data/contentIndex.ts` under a new "Recommendations" section
  (co-located with reference builders, outgoing/incoming relations and
  stats — `contentIndex.ts` is now the single relation hub). Only the one
  `LessonPanel` import was updated; the old file is gone with no other
  churn. `overlap()` is documented in-file for future helpers even though
  only `getLessonRecommendations` currently uses it.
  User-facing: Atlas vs Library chrome now makes the role split explicit —
  Atlas heading "Look up a concept" / "Bir kavramı ara" over a
  concept-centred subheading; Library heading "Browse every piece of
  content" / "Tüm içeriğe göz at" with a parallel content-centred
  subheading (new `lib.subheading` key + `.subheading` CSS). ControlPanel
  gained an inline `.resetHint` paragraph between the "Clean start" button
  and the destructive "Reset all progress" link so the distinction is
  readable without hovering — locale-aware copy under `controls.resetHint`.
  Both locales shipped; `npm run validate:i18n` clean on both content and
  UI-tree parity. No new dependency, no UI restructuring, no feature.
- 2026-04-22 — **Bilingual guardrails added.** New
  `scripts/validate-ui-i18n.mjs` checks structural parity between
  `src/i18n/ui/en.ts` and `src/i18n/ui/tr.ts` (same key tree at every
  depth, same leaf type per path — `leaf` / `function` / `array` /
  `object` — and matching array lengths for bullet lists). The existing
  content validator is unchanged; `package.json` now chains both via
  `"validate:i18n": "node scripts/validate-i18n.mjs && node scripts/validate-ui-i18n.mjs"`
  so CI and local runs cover both axes from a single command. CI workflow
  (`.github/workflows/deploy.yml`) untouched — it still calls
  `npm run validate:i18n`. CLAUDE.md gained a prominent "Bilingual
  maintenance rule" block near the top, spelling out that every
  user-visible string must ship in both locales in the same commit, with
  the approved technical-term exemption list preserved. README + TR
  README gained a short one-sentence reminder.
- 2026-04-22 — **Two-level reset controls added.** `App.tsx` grew two
  memoised callbacks that sit alongside the existing "Reset to family
  defaults" (which stays narrow and untouched): `handleCleanStart`
  (Explore mode, default knobs, first-of-kind active ids, selection cleared,
  overlays closed; preserves `locale` / `lessonStates` / `challengeStates` /
  `onboardingSeen`) and `handleResetAllProgress` (everything above plus
  reset `lessonStates` / `challengeStates` / `onboardingSeen`). Both pass
  into `ControlPanel` as props; the panel renders Clean start as a peer
  button to the existing family-defaults reset, and Reset all progress as
  a subtle warn-tinted `.dangerLink` guarded by a `window.confirm`
  (locale-aware confirm copy). New UI_STRINGS entries under
  `controls.cleanStart*` / `controls.resetProgress*` (EN + TR). No new
  dependency, no modal, no touch to URL or persistence plumbing — the
  existing sync effect rewrites both on the next render.
- 2026-04-22 — **validate:i18n wired into CI.** `.github/workflows/deploy.yml`
  now runs `npm run validate:i18n` between `npm ci` and `npm run build`, so
  any EN ↔ TR structural drift fails the workflow before the build and
  before artifacts are uploaded — broken content cannot reach GitHub Pages.
  README and README.tr.md gained a short note confirming the CI behaviour
  and recommending the same command locally before pushing. No other
  workflow changes.
- 2026-04-22 — **i18n validation script shipped.** New
  `scripts/validate-i18n.mjs` + `npm run validate:i18n`. The script parses
  `src/data/{en,tr}/{lessons,challenges,bridgeLessons,glossary}.ts` via the
  already-installed `typescript` compiler API (no new runtime or dev
  dependency) and compares the four paired arrays for structural parity:
  matching length, same id order, same `order` / `prev*` / `next*` chains,
  deep-equal `recommendedConfig` / `setupConfig` / `optionalSetupConfig`,
  identical `relatedConceptIds` / `relatedLessonIds` / `suggestedLessonIds`
  / `suggestedChallengeIds` / `suggestedBridgeLessonIds`, per-item
  `checkpointOptions` / `answerOptions` id + `correct` flags, challenge
  `difficulty` + `type`, bridge `widget`, and glossary `tags` presence.
  User-visible text (`title`, `narrative`, `feedback`, `shortDefinition`, …)
  is deliberately NOT compared. First run caught a real drift: 11 glossary
  entries had `tags` only in TR; parallel EN tag arrays added to restore
  presence parity. README + README.tr.md gained a short maintainer note
  describing when to run the script and what it does (not) check.
- 2026-04-22 — **Public release polish.** README top rewritten for landing (tagline +
  "what you can do here" bullets + live-demo URL slot), *Release highlights* and
  *For GitHub About* sections added, stale roadmap items (local persistence, URL-share)
  removed since they are now shipped, project-structure listing updated to include
  `StartHereCard`, `recommendations`, `persistence`, `urlState`. New top-level
  `LICENSE` (MIT) replaces the README placeholder; README license section links to it.
  New top-level `RELEASE_NOTES.md` with v0.5 public-ready release notes. `index.html`
  gets OpenGraph + Twitter Card + `theme-color` + `color-scheme` meta and a richer
  `<title>` / description. Header subtitle rephrased to "A toy model for entanglement
  and glued-face geometry on small spin networks". `StartHereCard` lede tightened to
  match. `vite.config.ts` `TODO:` note reworded to a positive maintainer hint. No
  feature changes; build remains clean, tsc strict clean.
- 2026-04-22 — **Usability pass shipped (audit-driven).** Session + URL persistence:
  new `src/utils/persistence.ts` (versioned `localStorage` key `bell-network-visualizer:v1`,
  defensive load / best-effort save) and `src/utils/urlState.ts` (hash schema
  `#mode=…&topology=…&family=…&strength=…&lens=…&edge=…&lesson/challenge/bridge=…` with
  union-validated parse). `App.tsx` now resolves initial state with precedence URL > stored >
  defaults, syncs on every state change. First-run onboarding: new `StartHereCard` shown as
  the lead tile of Explore footer when `onboardingSeen` is false, with three entry points
  (Start with Learn / Explore freely / Open Atlas); Header gains a **How to use** button
  that re-shows the card. Mode hierarchy microcopy tightened in `ModeToggle` (per-mode role
  hints surface as `title` + `aria-description`). Cross-mode suggested flow: new
  `src/features/learning/recommendations.ts` helper; `LessonPanel` renders a **Next step**
  block with a concept-overlap challenge + bridge after the checkpoint is revealed. Atlas
  **Where else this appears** section added to `ConceptAtlasPanel` via
  `getContentMentioningConcept`, excluding already-suggested items (inverse index is now
  user-visible). Cleanup: removed the dead `normalAlignment` field from `CorrelationState`
  + `deriveCorrelationState`; updated `PAIR_COUNT` and `stateFamilies.ts` comments to be
  topology-neutral; Header eyebrow now reads `Loop Quantum Gravity · {topology.label}`.
  README restructured around user journey (mode roles, recommended starting path,
  persistence + URL-share explanation). Build: 103 modules (was 98), 74.34 kB CSS, 300.85 kB
  JS, tsc strict clean.
- 2026-04-22 — **Topology Upgrade shipped.** Added a second shippable graph (Cycle-4) next
  to the Dipole: new `GraphTopologyId` / `GraphTopology` types + `DemoConfig.graphTopology`;
  new `src/data/topologies.ts` registry; new shared `FacePairGraphic` primitive and
  `graphGeometry` helpers so `DipoleGraphView` and `CycleGraphView` only hold layout logic;
  topology selector in `ControlPanel`; `VisualizationPanel` switches views by topology;
  `App.tsx` clears `selectedEdgeId` on topology change. Content additions: 1 new lesson
  (`topology-upgrade`), 2 new challenges (`topology-detects-bias`,
  `family-topology-crosstalk`), 1 new bridge lesson (`larger-graph-symmetry` with
  `level-comparison` widget), 2 new glossary entries (`graph-topology`, `edge-pattern`),
  plus topology-aware enrichments of `dipole-graph`, `automorphism`, `homogeneity`,
  `state-family`. `deriveEdgeDetails` now accepts `readonly GraphEdge[]`. Counts: 8 lessons,
  10 challenges, 7 bridges, 17 glossary entries.
- 2026-04-22 — Added maintenance directive at the top of CLAUDE.md and this Changelog
  section so the file stays current automatically across future sessions.
- 2026-04-22 — Initial CLAUDE.md created: commands, product shape, and high-level
  architecture for the four-mode / two-drawer app with the central `contentIndex`
  authoring API.
