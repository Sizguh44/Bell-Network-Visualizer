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
