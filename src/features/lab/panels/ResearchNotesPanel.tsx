import { useUiText } from '../../../i18n';
import { LabSection } from '../shared/LabSection';
import sharedStyles from '../shared/LabShared.module.css';
import styles from './ResearchNotesPanel.module.css';

/**
 * Faz 7 — fifth real Geometry Lab panel.
 *
 * **Honesty discipline.** This panel is **explanatory, not
 * computational**. It introduces no new physics formula, no new
 * diagnostic score, no new ProxyKind. It does not read the canonical
 * pipeline (the four real diagnostic panels — Gluing / Symmetry /
 * Effective Geometry / Correlation Summary — already do that), and it
 * does not run any algorithm against the active state. The panel
 * surfaces six short research notes that connect the Lab's
 * interactive surfaces to the Bell-network research line; each note
 * carries a thesis, a why-it-matters paragraph, an explicit
 * what-this-app-currently-shows disclaimer, and a future-work
 * pointer.
 *
 * **Data location.** Note content lives in
 * `src/i18n/ui/{en,tr}.ts` under the `lab.researchNotes.*` subtree —
 * **no new data file is created**, so the existing
 * `validate-i18n.mjs` path system stays untouched. EN ↔ TR parity is
 * enforced by `validate-ui-i18n.mjs` automatically. If the note
 * collection grows enough that a dedicated data file becomes the
 * cleaner home, that's a future refactor.
 *
 * **No `<ProxyBadge>` per note.** The panel-level scope card carries
 * the "what this app does NOT do" disclaimer for the entire surface,
 * and each note's `In this app` field repeats the relevant honesty
 * statement in context. Adding a per-note badge would dilute the
 * proxy-badge convention (which is reserved for diagnostic rows where
 * it carries semantic weight).
 *
 * Structure (top to bottom):
 *
 *   1. Header — title + short academic intro.
 *   2. Scope card — surface-1 card with the four mandatory honesty
 *      statements as a single paragraph, mirroring the Symmetry
 *      "Graph automorphism — what it means here" and Effective
 *      Geometry "Effective geometry — what this panel reads" patterns.
 *   3. Six note cards (`bellNetworkGluing` → `geometryHierarchy` →
 *      `homogeneousGraphs` → `dipoleEffectiveGeometry` →
 *      `correlations` → `proxiesToObservables`), each with title +
 *      italic accent-bordered thesis + three labelled sub-sections.
 */

const NOTE_IDS = [
  'bellNetworkGluing',
  'geometryHierarchy',
  'homogeneousGraphs',
  'dipoleEffectiveGeometry',
  'correlations',
  'proxiesToObservables',
] as const;

type NoteId = (typeof NOTE_IDS)[number];

export function ResearchNotesPanel() {
  const t = useUiText();
  const r = t.lab.researchNotes;

  return (
    <section
      className={sharedStyles.root}
      aria-label={t.lab.activePanelAria(t.lab.panels.researchNotes.label)}
    >
      {/* --- 1. Header ----------------------------------------- */}
      <header className={sharedStyles.header}>
        <h3 className={sharedStyles.title}>
          {t.lab.panels.researchNotes.label}
        </h3>
        <p className={sharedStyles.intro}>{r.intro}</p>
      </header>

      {/* --- 2. Panel-scope honesty card ----------------------- */}
      {/*
        Scope card carries the four mandatory honesty statements as
        a single paragraph (not a bullet list) so it stays a clean
        block of prose. Visually matches Symmetry's context card and
        Effective Geometry's hierarchy card — the established
        "panel-scope framing" pattern in the Lab.
      */}
      <LabSection
        label={r.panelScopeLabel}
        className={sharedStyles.sectionCard}
      >
        <p className={sharedStyles.cardBody}>{r.panelScopeBody}</p>
      </LabSection>

      {/* --- 3. Note cards ------------------------------------- */}
      <ul className={styles.noteList} aria-label={r.noteListAria}>
        {NOTE_IDS.map((id: NoteId) => {
          const note = r.notes[id];
          return (
            <li key={id} className={styles.noteCard}>
              <h4 className={styles.noteTitle}>{note.title}</h4>
              <p className={styles.noteThesis}>{note.thesis}</p>
              <div className={styles.noteSections}>
                <NoteSection
                  label={r.fields.whyItMatters}
                  body={note.whyItMatters}
                />
                <NoteSection
                  label={r.fields.inThisApp}
                  body={note.inThisApp}
                />
                <NoteSection
                  label={r.fields.futureWork}
                  body={note.futureWork}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Internal — one labelled sub-section inside a note card             */
/*                                                                     */
/*  Three of these per note (Why it matters / In this app /            */
/*  Future work). Kept inline rather than promoted to the shared       */
/*  module because no other Lab panel uses the same structural         */
/*  shape (label + paragraph triplet inside a card); if a future       */
/*  panel reuses it, that's the time to extract.                       */
/* ------------------------------------------------------------------ */

interface NoteSectionProps {
  label: string;
  body: string;
}

function NoteSection({ label, body }: NoteSectionProps) {
  return (
    <div className={styles.noteSection}>
      <span className={styles.noteSectionLabel}>{label}</span>
      <p className={styles.noteSectionBody}>{body}</p>
    </div>
  );
}
