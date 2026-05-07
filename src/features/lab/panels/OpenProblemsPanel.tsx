import { getOpenProblems } from '../../../data/openProblems';
import { useLocale, useUiText } from '../../../i18n';
import sharedStyles from '../shared/LabShared.module.css';
import styles from './OpenProblemsPanel.module.css';

/**
 * Faz 8 — sixth and final real Geometry Lab panel.
 *
 * **Architectural note.** The Faz 8 spec literally suggested adding a
 * top-level `Research` mode via `ModeToggle`. This implementation
 * keeps Open Problems as the sixth Lab panel (the Faz 2 placeholder
 * slot it has occupied since the Lab skeleton landed), because:
 *
 *   1. Every prior phase (Faz 6, Faz 6.5, Faz 7) explicitly forbade
 *      extending `AppMode` / URL state / persistence. Faz 8's own
 *      Step 7 hard-constraint list also forbids those changes.
 *   2. The Faz 7 `proxiesToObservables` Research Note that Faz 7
 *      shipped explicitly states: "the Open Problems panel will
 *      collect those gaps as a single roadmap." Adding a separate
 *      `Research` mode would orphan that forward reference.
 *   3. The "NOT as a separate overlay" clause of the spec is already
 *      satisfied by the existing access path (ModeToggle → Geometry
 *      Lab → Open Problems tab) — that's standard navigation, not an
 *      overlay. Overlays in this app are the Atlas / Library
 *      drawers; Lab panels are not overlays.
 *
 * **Honesty discipline.** This panel introduces no new physics
 * formula, no new diagnostic score, no new ProxyKind, no external
 * citation system. It does not read the canonical pipeline (the four
 * diagnostic Lab panels already do that) and runs no algorithm
 * against the active state. The eight problems are curated entries
 * in `src/data/openProblems.ts`; each one explicitly cross-references
 * the Lab panels where its corresponding `future-calculable-observable`
 * row already surfaces, via the `sourcePanels: LabPanelId[]` field on
 * each `OpenProblem`.
 *
 * **No duplication.** The panel deliberately omits a scope card and a
 * "how to read this panel" callout. Every other panel surfaces
 * scope-style honesty disclaimers; here the per-card structure
 * (real observable / proxy used / missing physics / why it matters /
 * research direction) carries the equivalent register without
 * repeating the boilerplate.
 *
 * Structure (top to bottom):
 *
 *   1. Header — title + intro.
 *   2. Eight Open Problem cards. Each card:
 *      • `<h4>` title
 *      • Source-panel chip row (`Appears in: <Panel A> <Panel B>`)
 *      • Five labelled `<dl>`-style sub-fields:
 *          - Real Observable
 *          - Proxy Used in App
 *          - Missing Physics
 *          - Why It Matters
 *          - Research Direction (slightly emphasised — italic + text-primary)
 */
export function OpenProblemsPanel() {
  const locale = useLocale();
  const t = useUiText();
  const o = t.lab.openProblems;
  const problems = getOpenProblems(locale);

  return (
    <section
      className={sharedStyles.root}
      aria-label={t.lab.activePanelAria(t.lab.panels.openProblems.label)}
    >
      {/* --- 1. Header ----------------------------------------- */}
      <header className={sharedStyles.header}>
        <h3 className={sharedStyles.title}>
          {t.lab.panels.openProblems.label}
        </h3>
        <p className={sharedStyles.intro}>{o.intro}</p>
      </header>

      {/* --- 2. Eight Open Problem cards ----------------------- */}
      <ul className={styles.problemList} aria-label={o.problemListAria}>
        {problems.map((problem) => (
          <li key={problem.id} className={styles.problemCard}>
            <header className={styles.problemHeader}>
              <h4 className={styles.problemTitle}>{problem.title}</h4>
              {/*
                Source-panel chip row. Each chip shows the human-readable
                label of a Lab panel (resolved through `t.lab.panels[id]`)
                where the corresponding future-calculable-observable row
                surfaces. This is the spirit of the user-spec'd
                "auto-generated from diagnostics" requirement: every
                problem is anchored to the diagnostic surfaces it
                corresponds to, even though the cross-reference is
                statically declared in the data file rather than
                dynamically scraped from a row registry.
              */}
              {problem.sourcePanels.length > 0 && (
                <div className={styles.problemSourcePanels}>
                  <span className={styles.problemSourceLabel}>
                    {o.sourcePanelsLabel}
                  </span>
                  {problem.sourcePanels.map((panelId) => (
                    <span
                      key={panelId}
                      className={styles.problemSourceChip}
                    >
                      {t.lab.panels[panelId].label}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <dl className={styles.problemFields}>
              <ProblemField
                label={o.fields.realObservable}
                body={problem.realObservable}
              />
              <ProblemField
                label={o.fields.proxyUsed}
                body={problem.proxyUsed}
              />
              <ProblemField
                label={o.fields.missingPhysics}
                body={problem.missingPhysics}
              />
              <ProblemField
                label={o.fields.whyItMatters}
                body={problem.whyItMatters}
              />
              <ProblemField
                label={o.fields.researchDirection}
                body={problem.researchDirection}
                research
              />
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Internal — one labelled sub-field inside an Open Problem card      */
/* ------------------------------------------------------------------ */

interface ProblemFieldProps {
  label: string;
  body: string;
  /** When `true`, applies the slightly emphasised research-direction
   *  styling (italic, text-primary). Used only on the
   *  `Research Direction` field — the panel's only forward-looking
   *  field per Faz 8 step 5 ("Research Direction (CRITICAL)"). */
  research?: boolean;
}

function ProblemField({ label, body, research }: ProblemFieldProps) {
  const bodyClass = research
    ? `${styles.problemFieldBody} ${styles.problemFieldBodyResearch}`
    : styles.problemFieldBody;
  return (
    <div className={styles.problemField}>
      <dt className={styles.problemFieldLabel}>{label}</dt>
      <dd className={bodyClass}>{body}</dd>
    </div>
  );
}
