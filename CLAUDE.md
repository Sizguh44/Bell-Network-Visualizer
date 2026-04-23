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
npm install              # first time only
npm run dev              # Vite dev server (http://localhost:5173)
npm run build            # tsc (strict) + vite build → dist/
npm run preview          # serve the production bundle locally
npm run typecheck        # tsc --noEmit
npm run validate:i18n    # structural EN ↔ TR parity check (no new deps)
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
state family runs unchanged on either. The UI has four peer modes and two overlay drawers,
all layered on a shared explorer:

- **Explore** — free-form demo (footer = 4 theory cards).
- **Learn** — 8 guided lessons with multiple-choice checkpoints.
- **Challenge** — 10 Socratic tasks (prediction · comparison · diagnosis · conceptual).
- **Bridge** — 7 cosmology-bridge lessons (pair → graph → cosmology).
- **Concept Atlas** — 17-entry glossary drawer, concept-centric.
- **Content Library** — tabbed drawer over every authored content kind, content-centric.

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

Sidebar (`ControlPanel`) and main (`VisualizationPanel`) are constant across modes. The two
drawers (`ConceptAtlasPanel`, `ContentLibraryPanel`) are rendered at the App level outside
the layout and overlay everything.

Selection state (`selectedEdgeId`) lives in `App.tsx`, not in `VisualizationPanel`, so
lesson / challenge / bridge "Apply setup" actions can set it.

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
- **`prefers-reduced-motion`** gated for every animation.
- **`data-export-ref="visualization-panel"`** on the main visualization container is an
  inert hook for a future snapshot/export helper — it is not connected to anything yet.

## Changelog

Maintained by Claude per the directive at the top of this file. Newest entries on top.
Format: `YYYY-MM-DD — short imperative description.`

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
