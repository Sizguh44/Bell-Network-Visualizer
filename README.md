# Bell-Network Visualizer

> **🌍 Dil seçimi:** Bu dosya İngilizcedir. Türkçe sürümü için [README.tr.md](./README.tr.md) — uygulamayı Türkçe çalıştırmak için header'daki **EN / TR** tuşuna da basabilirsin.

**An interactive, browser-only toy model for the intuition that entanglement across shared faces
supports glued-polyhedron geometry in loop quantum gravity.**

Two small spin networks — the **dipole graph** and the **4-node cycle** — become a
playground for state-family and observable-lens experiments, stitched together with guided
lessons, Socratic challenges and cosmology-bridge reflections.

- 🔬 Feel how entanglement strength tightens face normals into near anti-parallel pairs.
- 🎛 Separate *how much* correlation (strength) from *how it is distributed* (state family).
- 🔭 Read the same state through five toy observable lenses without moving the canvas.
- 🧭 Follow eight lessons, ten challenges, seven bridges and a seventeen-entry Concept Atlas.

> **Academic framing — Bell-Network Geometry Lab.** A research-oriented
> pedagogical lab for **Bell-network states** and **effective geometry**
> on small spin networks, focused on the **dipole graph** and the
> **cycle-4 graph**. The Lab separates four epistemic registers: (i)
> pedagogical proxy diagnostics on the canvas, (ii) exact finite-
> dimensional quantum-information results in a minimal qubit model,
> (iii) single-node **SU(2) invariant subspace / intertwiner projector**
> structures for arbitrary spin tuples, and (iv) **projected spin-1/2
> Bell-network states** for the dipole and cycle-4 graphs (link-singlet
> product projected by the tensor product of per-node intertwiner
> projectors).
>
> **The project is not presented as a complete LQG calculation; it is a
> layered research sandbox that separates pedagogical diagnostics, exact
> finite-dimensional quantum-information computations, single-node SU(2)
> intertwiner structures, and restricted spin-1/2 projected Bell-network
> states.** Every numerical output is labelled with its register
> (visible `<ProxyBadge>` chips, model chips, machine-readable `honesty:
> …` literals on engine outputs); the **proxy-vs-exact-observable
> distinction** is enforced at the discipline level. **Future area,
> volume, and dihedral-angle operators** — the next natural step toward
> exact LQG-flavoured observables on these states — are documented as
> roadmap items rather than implemented.
>
> See [*Academic Scope: Bell-Network Geometry Lab*](#academic-scope-bell-network-geometry-lab)
> below for the four-tier breakdown, and the three companion docs in
> [`docs/`](./docs) for the demo flow, honesty-class reference, and
> future-research roadmap.

**Live demo:** `https://<owner>.github.io/Bell-Network-Visualizer/` *(replace `<owner>` with
the GitHub account or organisation that hosts this fork)*.

> No backend, no accounts, no tracking. Everything runs in the tab. Progress, settings and
> the selected pair are kept in `localStorage`, and the URL hash encodes the current
> configuration so any specific setup can be shared as a link.

---

## At a glance

Four peer modes — pick one from the header at any time:

| mode | role |
| --- | --- |
| **Explore** | *Free experimentation.* Play with the four sidebar knobs, hover or click pairs. |
| **Learn** | *Recommended starting path.* Eight guided lessons with an applied setup and a checkpoint each. |
| **Challenge** | *Test your understanding.* Ten Socratic tasks — predict, compare, diagnose, or pin down a concept. |
| **Bridge** | *Zoom out.* Seven reflection-style lessons on graph-level symmetry and cosmological thinking. |

Two overlay drawers, available from any mode:

| drawer | role |
| --- | --- |
| **Concept Atlas** | Concept-centric: seventeen entries with a *what this app does* vs *what full theory does* split, cross-links to lessons, challenges and bridges. |
| **Content Library** | Content-centric: every lesson, challenge, bridge lesson and glossary entry in one searchable, tabbed list. |

## Recommended starting path

If you have never opened the tool before, the *Start here* card in Explore mode points at
the same path:

1. **Open Learn.** Take lesson 1 — it introduces the dipole, the four face pairs and the
   arrows. Reveal the checkpoint, follow the "Next step" hint.
2. **Work through lessons 2–6.** They walk through strength, per-pair inspection, state
   families, observable lenses, and the alignment-vs-shape limit.
3. **Detour into Explore** whenever you want to play with family / strength / lens /
   topology outside a lesson's recommended config.
4. **Open the Atlas** the moment you hit an unfamiliar term — every underlined concept in
   a lesson opens its entry in a side drawer.
5. **Use Challenge** to test distinctions (state vs lens, alignment vs Regge, frustration
   vs weakness, topology vs computation).
6. **Use Bridge** to connect local gluing to graph symmetry and — honestly — to the
   cosmological questions the demo does *not* answer.

You can jump between modes at any time; nothing is linear. The "How to use" button in the
header reopens the guide whenever you want it.

> Best viewed on a desktop display — the layered layout assumes wider viewports, but the
> interface does respond to narrower ones.

## Overview

The same underlying toy state is controlled by four independent knobs:

| knob             | answers                                                           |
| ---------------- | ----------------------------------------------------------------- |
| **Graph topology** | *on which* spin network the state lives (Dipole or Cycle-4)    |
| **State family** | *which* correlation pattern the state carries                     |
| **Strength**     | *how much* overall correlation there is                           |
| **Observable**   | *how you read* the resulting state                                |

Both shippable topologies carry exactly four face pairs, so the same state-family arrays
(strength offsets, mismatch coefficients) run unchanged on either graph — only the
automorphism group differs. The four modes sit orthogonal to those knobs; the Atlas and
Library are available from any mode as drawers.

### Does it remember what I was doing?

Yes. The app keeps every user-facing bit of state in `localStorage` under the key
`bell-network-visualizer:v1`:

- The four knob values (topology, state family, strength, observable lens)
- Which mode you are in, and which lesson / challenge / bridge lesson is active
- Which checkpoints you have revealed in Learn and Challenge
- The currently selected face pair
- Whether you have already seen the *Start here* onboarding card

Refreshing the tab keeps you exactly where you were. No account, no cookies, no server.

### Share a configuration

The URL hash encodes the current configuration, so any specific setup can be sent as a
plain link — no server round-trip, no shortener. Copy the browser URL at any point and
share it; the recipient lands on the same topology, state family, strength, lens, active
lesson / challenge / bridge and selected pair.

```
#mode=learn&lesson=topology-upgrade&topology=cycle4&family=frustrated&strength=0.70&lens=uniformity&edge=c23
```

On load, the URL takes precedence over the recipient's locally stored settings.

## Release highlights

Current version: **v0.5** — the first public-ready cut.

**What you can actually do here today:**

- Two shippable spin-network topologies (Dipole and Cycle-4) with matching four-pair
  structure, so every state family runs unchanged on either and the automorphism group is
  the thing that changes.
- Five deterministic state families (*Uncorrelated*, *Weakly aligned*, *Bell-like
  symmetric*, *Frustrated*, *Edge-biased*) × five observable lenses (*Alignment*,
  *Mismatch*, *Gluing*, *Correlation*, *Uniformity*).
- Per-pair inspection card that stays in sync with the canvas; emphasis redistributes live
  when you change the lens.
- Guided layer: **8** lessons · **10** challenges · **7** bridge lessons ·
  **17** Concept Atlas entries, fully cross-linked via a single content index and an
  inverse-mention index.
- Session persistence (`localStorage`) and URL-hash configuration sharing.
- First-run *Start here* card; a "How to use" button in the header reopens it.

**Who this is for:** physics / mathematical-physics students who have seen an LQG primer
and want a tactile intuition for Bell-network-style correlations; lecturers who want a
shareable, link-addressable toy for a seminar; authors who want to extend the lesson set
without leaving TypeScript strict.

**What it is not:** a real LQG calculation, a graph editor, or a cosmological model. Every
number on screen is a deterministic toy proxy; the *Bridge* module explicitly frames the
distance from any full-theory claim.

## What this is — and what it is not

- ✅ A pedagogical, **static** toy tool (no backend, no API keys, no tracking).
- ✅ Deterministic: the same controls always produce the same picture.
- ✅ Honest about its scope: proxy numbers, clearly labelled as toy.
- ❌ **Not** a real LQG calculation. No intertwiner-space correlators are computed.
- ❌ **Not** a general graph editor. Two topologies ship (Dipole and Cycle-4); both are
  hard-coded.
- ❌ **Not** a cosmological model. The Bridge module frames the distance from there.

## Academic Direction

The project is being repositioned as the **Bell-Network Geometry Lab** — a
focused, browser-only environment for studying small spin networks at the
intersection of quantum information and quantum geometry. The concepts the
Lab is being shaped around (in upcoming phases — none of these are full
calculations yet, and most already appear individually across the Concept
Atlas, lessons, challenges and bridges):

- **Bell-network states** as a one-parameter family of correlated states on
  a fixed graph.
- **Entanglement-induced gluing** between adjacent intertwiners across
  shared faces.
- **Quantum polyhedra** and **twisted geometry** as the local pictures
  associated with each node.
- **Vector geometry** vs. **Regge geometry** — two distinct semiclassical
  limits of the same combinatorial data.
- **Automorphism-invariant homogeneous graphs** (dipole, cycle-4) as the
  simplest stage where graph symmetry is non-trivial but tractable.
- **One-node observables** and **local entanglement entropy** — the
  observables the visualiser is currently approximating.
- **Effective geometry on dipole graphs** and the **spherical-tetrahedron**
  reading at small graphs, mapped to LQG-cosmology toy contexts.
- **Correlations in quantum geometry and cosmology** — how symmetric,
  homogeneous correlations on a graph stand in for cosmological
  homogeneity in toy models.

The Geometry Lab phase reframes these as named research targets — each
labelled with an honesty class (see below) — and exposes them as a
dedicated Lab surface alongside the existing Explore / Learn / Challenge /
Bridge modes. **No Lab code ships in this commit;** this is the
documentation step that fixes the academic register first.

## Honesty / Scope

This project is **not** a full LQG computation engine. The current numbers
on screen are *pedagogical proxies* — deterministic toy formulas designed
to respond in the right qualitative direction, not to compute real
intertwiner-space correlators. The *Bridge* module already frames the
distance from a real cosmological claim, and that register is preserved
everywhere else.

The Geometry Lab phase formalises this: every Lab diagnostic must be
explicitly labelled as one of four honesty kinds, so the user (and the
author) always know what register they are reading.

| label | meaning |
| --- | --- |
| **Pedagogical proxy** | A toy formula that responds in the right direction but does not compute a real LQG quantity. (All current scores fall here.) |
| **Conceptual diagnostic** | A qualitative read on a structural property — symmetry, homogeneity, alignment pattern — not a number to take seriously, but a yes / no / weak / strong indicator. |
| **Curated classification** | A discrete tag chosen from a fixed, author-maintained set (e.g. Bell-like / frustrated / edge-biased family typing). The classification is honest because the set is enumerable, not because the math is exhaustive. |
| **Future calculable observable** | A quantity that *could* be computed honestly from a Bell-network state but is currently only sketched — flagged so the gap is visible rather than hidden. |

No diagnostic in any future Lab panel will be added without one of these
labels. This rule is enforced as a CLAUDE.md constraint (see *Constraints
that have been deliberately preserved*), not a runtime check — the cost of
violating it is that a panel ships unlabelled, which is exactly what this
discipline forbids.

## Academic Scope: Bell-Network Geometry Lab

The project now ships **four distinct epistemic registers** stacked on top
of each other. Each register has a fixed claim envelope; every UI surface
is labelled with which register it belongs to (visible
`<ProxyBadge>` chips, model chips, and machine-readable `honesty: …`
literals on engine outputs). Move up the ladder and the engine produces
more LQG-flavoured numbers; the boundary between exact, proxy, and
future-LQG stays sharp at every step.

### Tier 1 — Pedagogical proxy layer
**What it is.** The canvas / graph diagnostics, the four-knob state
machine, the per-pair toy values (`localStrength`,
`localAlignmentScore`, `localGluingProxy`), the global aggregates
(`antiParallelScore`, `gluingScore`, `mutualInformationProxy`).

**Status.** Pedagogical proxies — deterministic toy formulas that respond
in the right qualitative direction. They are *not* LQG observables.

**Where to find it.** Explore mode canvas, Geometry Lab → Gluing
Diagnostics' pedagogical-proxy rows, Geometry Lab → Correlation
Summary's pair profile and global summary cards.

### Tier 2 — Minimal qubit quantum-information layer
**What it is.** Density matrices `ρ = |ψ⟩⟨ψ|`, partial traces over
arbitrary qubit subsets, von Neumann entropy via Jacobi
eigendecomposition, exact pairwise mutual information
`I(A : B) = S(A) + S(B) − S(A ∪ B)`. Surfaced as the **Minimal Qubit
Engine Preview** in the Correlation Summary panel, with a per-qubit
entropy heatmap and an exact pairwise MI heatmap.

**Status.** Exact within the minimal qubit model — finite-dimensional
quantum-information results computed in closed form on a small Hilbert
space. The mapping from app config to qubit state is curated, not
LQG-derived. The model chip `[minimal qubit model]` and the machine-
readable `honesty: 'minimal-qubit-model'` literal travel with the
state.

**Where to find it.** Geometry Lab → Correlation Summary → Minimal
Qubit Engine Preview. The dipole preview gives a Bell pair (`I = 2`
bits); the cycle-4 preview gives a 4-qubit GHZ (`I = 1` bit on every
pair).

### Tier 3 — Single-node SU(2) representation / intertwiner layer
**What it is.** Spin-`j` matrices (Jx, Jy, Jz, Casimir) for arbitrary
half-integer spins; tensor-product spin spaces; total angular momentum
operators; eigendecomposition of `J_total²`; SU(2)-invariant subspace
projector `P_inv = V V†` for any spin tuple at a single node.

**Status.** Exact SU(2) representation-theory results. The single-node
`mult(j_total = 0)` numbers match the textbook Wigner decomposition
exactly (verified by selftest for `[½, ½]`, `[½, ½, ½, ½]`, `[1, 1]`,
`[1, ½, ½]`). A single-node intertwiner space is *not* a Bell-network
state on its own.

**Where to find it.** Geometry Lab → Correlation Summary → Single-node
SU(2) Intertwiner Sandbox. Header chip `[single-node SU(2) model]`.

### Tier 4 — Spin-1/2 projected Bell-network prototype layer
**What it is.** A `BellNetworkGraph` contract (nodes + spin-labelled
edges, with edge-slot bookkeeping) and a graph-level state builder

> |Ψ_Γ⟩ = ( ⊗_nodes P_inv(node) ) · ( ⊗_edges |S⟩_edge ) / norm

— the link-singlet product projected by the tensor product of per-node
SU(2)-invariant subspace projectors, then L2-normalised. Ships for the
two-node single-edge graph (minimal prototype), the dipole graph
(endpoint dim 256 / graph invariant dim 4), and the cycle-4 graph
(endpoint dim 256 / graph invariant dim 1).

**Status.** Exact within the projected construction. **Not** a
geometry observable, **not** a cosmological state — the state lives on
a fixed combinatorial graph and waits for area / volume / dihedral
operators to be applied. The model chip
`[graph contract · projected spin-1/2 states]` and the machine-readable
`honesty: 'spin-half-projected-bell-network-state'` literal travel
with the state.

**Where to find it.** Geometry Lab → Correlation Summary → Bell-network
Graph Sandbox. All three canonical graphs visible as cards with state
register / kind / endpoint dim / graph invariant dim / per-node
invariant dims / honesty marker.

### What is exact, what is proxy, what is future LQG

| layer | exact within… | not exact LQG because… |
| --- | --- | --- |
| **Tier 1** (pedagogical proxy) | nothing — they are toy formulas | every score is a curated function of the four knobs |
| **Tier 2** (minimal qubit) | finite-dimensional quantum-information arithmetic on a curated qubit state | the topology+family → qubit-state mapping is hand-picked, not derived from LQG |
| **Tier 3** (single-node SU(2)) | SU(2) representation theory at one node | single-node intertwiner space is not a graph-level state |
| **Tier 4** (projected Bell-network) | the projected construction `P_global · ⊗|S⟩ / norm` | no geometry operator is applied to it; spin-1/2 only |
| **future LQG** | textbook LQG kinematic Hilbert space | not implemented yet — see roadmap |

### Companion documentation

Three docs in [`docs/`](./docs) accompany this README:

- **[`docs/academic-demo-flow.md`](./docs/academic-demo-flow.md)** —
  a 5–7 minute Geometry Lab walkthrough mapped to these four tiers,
  with discussion questions at the end.
- **[`docs/honesty-classes.md`](./docs/honesty-classes.md)** — the
  canonical reference for which register is allowed to claim what,
  including the four `<ProxyBadge>` kinds, the three engine honesty
  literals, the three UI model chips, and an explicit "what you cannot
  say" boundary list.
- **[`docs/future-research-roadmap.md`](./docs/future-research-roadmap.md)**
  — three-horizon plan: near-term (area / volume / dihedral / reduced
  ρ on the projected state), mid-term (arbitrary-spin Wigner-3j /
  twisted-vs-Regge), long-term (spin-foam vertex amplitude /
  cosmological sector mapping / refinement / coherent intertwiners).

## Quick Start

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (typically <http://localhost:5173>).

| command             | description                                    |
| ------------------- | ---------------------------------------------- |
| `npm run dev`           | start the Vite dev server                      |
| `npm run build`         | type-check and produce the production bundle   |
| `npm run preview`       | serve the production bundle locally            |
| `npm run typecheck`     | run TypeScript in `--noEmit` mode              |
| `npm run validate:i18n` | check that EN ↔ TR content structures match    |

> **Maintainer note — this repo is bilingual.** Every user-visible string —
> UI chrome, lesson / challenge / bridge / glossary content, button labels,
> confirm dialogs, helper text — must ship in both `src/i18n/ui/en.ts` ↔
> `src/i18n/ui/tr.ts` **and** `src/data/en/*` ↔ `src/data/tr/*` in the same
> commit. Technical LQG terms (spin network, Bell-network, face pair,
> gluing, observable lens, Regge geometry, …) stay English by policy; the
> sentences around them must be translated.
>
> `npm run validate:i18n` now runs two checks back-to-back:
> `validate-i18n.mjs` (content structural parity — ids, orders, prev/next
> chains, config / option / related-id shapes, glossary `tags` presence)
> and `validate-ui-i18n.mjs` (UI string-tree parity — same keys at every
> depth, same leaf type, matching array lengths). It validates structure,
> not translation quality — that stays a human review.
>
> The GitHub Actions deploy workflow runs the same umbrella command before
> `npm run build`, so a structurally-drifted surface fails CI and never
> reaches GitHub Pages. Run the script locally before pushing.

## Content Architecture

The app treats every pedagogical unit as **authored content** with a shared metadata shape and
a single index. That way, adding a lesson or a challenge is a data change — not a component
change.

```
src/
  types/
    content.ts   ← ContentKind, ContentMeta, ContentReference, ContentRelations, ContentStats, LibraryTab
    learning.ts  ← Lesson (extends ContentMeta)
    challenge.ts ← Challenge (extends ContentMeta)
    bridge.ts    ← BridgeLesson (extends ContentMeta)
    glossary.ts  ← GlossaryEntry (extends ContentMeta)
  data/
    topologies.ts     — 2 shippable graph topologies (Dipole, Cycle-4)
    lessons.ts        — 8 lessons
    challenges.ts     — 10 challenges
    bridgeLessons.ts  — 7 bridge lessons
    glossary.ts       — 17 glossary entries
    contentIndex.ts   ← central registry + lookup / relation / stats helpers
```

### Central authoring API

`src/data/contentIndex.ts` is the single import source for every non-graph data helper in the
app. It re-exports every collection plus:

- `getLesson(id)`, `getChallenge(id)`, `getBridgeLesson(id)`, `getGlossaryEntry(id)`,
  `getConceptLabel(id)` — id-based lookup.
- `lessonRef`, `challengeRef`, `bridgeLessonRef`, `glossaryRef` — normalised
  `ContentReference` builders (discriminated union over the four kinds).
- `getContentRef(kind, id)` — overload set for typed generic access.
- `getRelationsForContent(kind, id)` — returns the full set of concepts / lessons /
  challenges / bridges the entry links **out to**.
- `getContentMentioningConcept(conceptId)` — returns every piece of content that points
  **in** at the given concept. The inverse index.
- `getContentStats()` — counts per content kind (honours the optional `hidden` flag).

These helpers are intentionally simple; they exist so future features (cross-link UI, a
knowledge-graph visualisation, exports) can be layered on without touching the data files.

### Atlas vs. Library

Both live as drawer overlays from the header, but they answer different questions:

| | Concept Atlas | Content Library |
|---|---|---|
| Primary axis | **Concept** (one of 15) | **Content kind** (lessons / challenges / bridge / glossary) |
| Entry shape | Short definition + four sections + related concepts + linked content | Tiled list per tab, clickable through to the content in its native mode |
| When it shines | "What does *this concept* mean and where else does it show up?" | "Show me *everything* in the app of type X" |
| Data source | `GLOSSARY_ENTRIES` | All four collections, routed through `contentIndex` |

Both drawers close the other one on open so only one navigation surface is visible at a time.

## How to add new content

All four content types share the same pattern: edit the relevant `src/data/*.ts`, add one
object that satisfies the matching TypeScript type, and optionally link it back from other
entries. TypeScript strict mode will flag any id collision or missing field.

### Add a new lesson

1. Extend the `LessonId` union in `src/types/learning.ts`.
2. Append an object to the `LESSONS` array in `src/data/lessons.ts`. Required fields:
   `id`, `order`, `title`, `shortGoal`, `conceptTags`, `narrative`, `actionPrompt`,
   `recommendedConfig`, `checkpointQuestion`, `checkpointOptions` (≥ 2 options, one with
   `correct: true`), `checkpointExplanation`. Optional: `callouts`,
   `recommendedSelection`, `nextLessonId`, `prevLessonId`, and any `ContentMeta` fields
   (`status`, `hidden`, `authorNote`, `lastUpdatedLabel`).
3. Thread the lesson into any `prevLessonId` / `nextLessonId` chain you want it to join.
4. Reference its `LessonId` from glossary entries (`suggestedLessonIds`) and from
   challenges / bridge lessons (`relatedLessonIds`) where relevant — no code change needed.

### Add a new challenge

1. Extend the `ChallengeId` union in `src/types/challenge.ts`.
2. Append an object to the `CHALLENGES` array in `src/data/challenges.ts`. Required fields:
   `id`, `order`, `title`, `shortGoal`, `difficulty`, `type`, `prompt`, `setupConfig`,
   `answerOptions` (one with `correct: true`), `explanation`, `relatedConceptIds`,
   `relatedLessonIds`. Optional: `setupSelection`, `expectedObservation`, navigation
   ids, and `ContentMeta` fields.
3. Link from glossary entries via `suggestedChallengeIds` and from bridge lessons via
   `suggestedChallengeIds` where pedagogically useful.

### Add a new glossary entry

1. Extend the `GlossaryEntryId` union in `src/types/glossary.ts`. (This union is also used
   as `ConceptTag`, so any lesson tag must live here.)
2. Append an object to `GLOSSARY_ENTRIES` in `src/data/glossary.ts`. Required fields:
   `id`, `label`, `shortDefinition`, `whyItMatters`, `inThisApp`, `inFullTheory`,
   `relatedConceptIds`, `suggestedLessonIds`. Optional: `commonConfusion`,
   `suggestedChallengeIds`, `suggestedBridgeLessonIds`, `tags`, `ContentMeta` fields.
3. If the concept is referenced anywhere — lesson narrative `[[id|label]]` tokens, theory
   card `<GlossaryLink id>`, challenge `relatedConceptIds`, bridge `relatedConceptIds` — it
   will light up automatically.

### Add a new bridge lesson

1. Extend the `BridgeLessonId` union in `src/types/bridge.ts`.
2. Append an object to the `BRIDGE_LESSONS` array in `src/data/bridgeLessons.ts`. Required
   fields: `id`, `order`, `title`, `shortGoal`, `narrative`, `keyIdea`, `commonConfusion`,
   `reflectionPrompts`, `relatedConceptIds`, `relatedLessonIds`. Optional: `actionPrompt`,
   `suggestedChallengeIds`, `optionalSetupConfig`, `widget`
   (`'graph-symmetry'` / `'level-comparison'`), navigation ids, `ContentMeta`.
3. Link from glossary entries via `suggestedBridgeLessonIds` if the concept has a
   cosmology-adjacent angle.

### Content metadata fields

Every content type accepts optional fields via `ContentMeta`:

| field               | purpose                                                     |
| ------------------- | ----------------------------------------------------------- |
| `status`            | `'stable'` (default) · `'draft'` · `'experimental'`         |
| `hidden`            | If `true`, the Content Library hides the entry.             |
| `authorNote`        | Internal note — never rendered.                             |
| `lastUpdatedLabel`  | Display-only update marker such as `'2025-11'`.             |

Existing content does not set these today. They exist as an extension hook for authors to
mark drafts, attach notes, or stage unpublished entries.

## Exploration Workflow (Explore mode)

1. Pick a **graph topology** (Dipole or Cycle-4) from the sidebar.
2. Pick a **state family** from the sidebar pill grid.
3. Tune the **strength** slider.
4. Switch the **observable lens**; emphasis and headline change without moving the canvas.
5. Hover or click a pair to pin a **Face Pair Detail**.
6. Tap any inline term to open the Concept Atlas on that concept.

Switching topology preserves family / strength / lens but clears the selected pair (pair ids
are topology-specific).

## Learning / Challenge / Bridge workflows

Each of the three structured modes follows the same pattern: narrative or prompt → optional
**Apply setup** button that drives the canvas → your response or reflection → per-option
feedback and explanation → outgoing links to related concepts, lessons, challenges and
bridges. Your progress on every individual lesson and challenge is remembered per-item.

When a Learn lesson's explanation is revealed, a **Next step** block points to one related
challenge and/or one bridge lesson (chosen by concept overlap). This makes the suggested
flow between modes explicit without forcing a linear track.

## Concept Atlas + Content Library workflow

- Open the **Atlas** when you want to understand a concept and see everywhere it is used.
  Each entry lists explicitly-suggested lessons / challenges / bridges **plus** a *Where
  else this appears* section that surfaces any further mentions from the inverse index.
- Open the **Library** when you want to browse *all* content of a kind — for discovery,
  review, or authoring.
- From any entry or tile, clicking through switches the app into the matching mode and
  focuses that item, closing the drawers.

## Toy Model Disclaimer

Every number on screen is an illustrative proxy derived from the four knobs through
deterministic formulas (see
[`src/features/graph/deriveCorrelationState.ts`](src/features/graph/deriveCorrelationState.ts)
and [`deriveObservableSummary.ts`](src/features/graph/deriveObservableSummary.ts)). They
respond in the right qualitative direction but do **not** compute real intertwiner-space
correlators. The Bridge module additionally frames the gap between this toy and any honest
cosmological claim.

### Formulas at a glance

Per edge `i`, [`computePairSnapshot`](src/features/graph/deriveCorrelationState.ts):

| quantity              | toy formula                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `localStrength`       | `clamp(s + family.strengthOffsets[i], 0, 1)`                     |
| `localMismatchAngle`  | `\|family.mismatchCoeff[i]\| · 82° · (1 − localStrength)`        |
| `localAlignmentScore` | `cos²(min(localMismatchAngle, 90°))`                             |
| `localGluingProxy`    | `localAlignmentScore · (0.3 + 0.7 · localStrength)`              |

## Project Structure

```
src/
  app/              application root + footer grid
  components/       shared presentational components
  features/
    graph/          computePairSnapshot, derive* helpers,
                    observableDefinitions
    controls/       sidebar (topology selector, family pills,
                    observable dropdown, strength slider,
                    reset, atlas link)
    visualization/  DipoleGraphView, CycleGraphView,
                    FacePairGraphic (shared primitive),
                    graphGeometry (shared helpers),
                    VisualizationPanel, EdgeDetailCard,
                    VisualizationLegend, ObservableSummaryCard
    theory/         TheoryCard, WhyThisMattersCard,
                    FamilyComparisonCard, ObservableNotesCard
    learning/       ModeToggle, LessonPanel, LessonCallout,
                    GlossaryContext, GlossaryLink,
                    renderGlossaryInline, ConceptAtlasPanel,
                    StartHereCard, recommendations
    challenge/      ChallengePanel
    bridge/         BridgePanel, GraphSymmetryCard,
                    LevelComparisonCard
    content/        ContentLibraryPanel
  data/             topologies, dipoleGraph (PAIR_COLORS only),
                    stateFamilies, lessons, glossary,
                    challenges, bridgeLessons, contentIndex
  styles/           global CSS variables and reset
  types/            graph, learning, glossary, challenge, bridge,
                    content
  utils/            format, persistence (localStorage), urlState
                    (URL hash parse/encode)
```

## GitHub Pages Deployment

In production, Vite rewrites `base` to `/Bell-Network-Visualizer/`. If you fork under a
different slug, open [`vite.config.ts`](./vite.config.ts) and change the `REPO_NAME`
constant to match. For a GitHub **user / organisation page** served at the account root,
set the `base` to `'/'` unconditionally instead.

A minimal GitHub Actions workflow lives at
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) and publishes `dist/` to
GitHub Pages on every push to `main`. Under **Settings → Pages**, set **Source** to
*GitHub Actions* — that is the only manual step.

## Roadmap

Ideas that are deliberately out of scope for v0.5 but well-supported by the existing
architecture:

- **More topologies** — 6-node ring, theta graph, double-dipole, small lattices. The
  `src/data/topologies.ts` registry is the single place to add entries; note that
  state-family arrays currently assume exactly four face pairs.
- **Explicit automorphism demos** — interactive node-swap / edge-permutation on the
  canvas, beyond the static mini-widget in the Bridge module.
- **Bridge challenges** — Socratic tasks framed at graph-level and cosmology-level
  questions.
- **Markdown-based authoring** — read lesson / challenge / bridge bodies from `.md` files
  so content edits do not require TypeScript. Content packs could then be imported /
  exported as JSON via the existing `contentIndex` shape.
- **Knowledge-graph visualisation** — `getContentMentioningConcept` already builds the
  inverse index; a force-directed map of concepts ↔ content is a natural next view.
- **Snapshot / export** — the `data-export-ref="visualization-panel"` attribute is an
  inert future hook for PNG / JSON export of the current scene.
- **Richer geometry observables** — dihedral angles, face-area histograms, volume proxies.
- **Intertwiner-inspired parametrisation** replacing the scalar strength knob with a
  continuous family of Bell-network superpositions.
- **Optional 3D tetrahedra mode** (three.js) toggled against the current 2D schematic.

## For GitHub *About*

Maintainer note — suggested metadata for this repository on GitHub:

- **Short description:** *Interactive toy model for Bell-network-style correlations on
  small spin networks — dipole and 4-cycle — with guided lessons, Socratic challenges and
  a cosmology-bridge module.*
- **Website:** the GitHub Pages URL for your fork, e.g.
  `https://<owner>.github.io/Bell-Network-Visualizer/`.
- **Suggested topics:** `loop-quantum-gravity`, `spin-networks`, `bell-network`,
  `quantum-gravity`, `entanglement`, `physics-education`, `interactive-visualization`,
  `typescript`, `react`, `vite`, `github-pages`, `pedagogical-tool`.
- **Pinned blurb (one-liner):** *A browser-only, static toy for the intuition that
  entanglement across shared faces supports glued-polyhedron geometry — with a full
  learning layer on top.*

## License

This project is released under the [MIT License](./LICENSE).
