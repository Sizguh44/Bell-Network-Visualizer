import type { StateFamily, StateFamilyPreset } from '../../../types/graph';
import styles from './LabShared.module.css';

interface FamilyReading {
  /** Short qualitative headline rendered above the longer body. */
  headline: string;
  /** Curated paragraph describing the family's reading. */
  body: string;
}

interface LabFamilyReadingListProps {
  /** All shippable state-family presets, in canonical order. */
  families: readonly StateFamilyPreset[];
  /** Currently active family id — its row is highlighted. */
  activeFamilyId: StateFamily;
  /**
   * Map from family id to the curated reading content. Both Symmetry and
   * Correlation panels feed this from their own `lab.<panel>.familyReading.classifications`
   * i18n subtree; the component itself does not load translations.
   */
  readings: Record<StateFamily, FamilyReading>;
  /** Localized "active" chip label rendered next to the active family's name. */
  activeChipLabel: string;
  /**
   * Forwarded to the `<ul>` for screen readers when set. Most callers
   * label their wrapping `LabSection` instead and leave this undefined.
   */
  ariaLabel?: string;
}

/**
 * Faz 6.5 — shared presentation-only family-reading list primitive.
 *
 * Renders the five-card vertical list of curated state-family readings
 * that both `SymmetryDiagnosticsPanel` (Faz 4) and
 * `CorrelationSummaryPanel` (Faz 6) need. The component is
 * deliberately stateless and content-agnostic — it does not interpret
 * the readings, does not classify families, does not synthesise any
 * physics text. It just renders whatever curated prose the caller
 * passes in, with the active family highlighted via the same
 * accent-soft pattern the rest of the Lab uses.
 *
 * Refactor scope (Faz 6.5):
 *   • Symmetry's `<ul className={styles.familyList}>` block is replaced
 *     by `<LabFamilyReadingList ... />`.
 *   • Correlation's `<ul className={styles.familyReadingList}>` block
 *     is replaced by `<LabFamilyReadingList ... />`.
 *   • The Symmetry-specific family-list CSS classes are removed from
 *     `SymmetryDiagnosticsPanel.module.css`; the Correlation-specific
 *     family-reading CSS classes are removed from
 *     `CorrelationSummaryPanel.module.css`. The styles live in
 *     `LabShared.module.css`.
 *   • Visual consolidation: the chip placement adopts Correlation's
 *     "inline next to label" pattern. Symmetry's chip-on-its-own-row
 *     placement (Faz 4) subtly tightens — this is the only visible
 *     layout shift in the refactor; no content changed.
 */
export function LabFamilyReadingList({
  families,
  activeFamilyId,
  readings,
  activeChipLabel,
  ariaLabel,
}: LabFamilyReadingListProps) {
  return (
    <ul className={styles.familyReadingList} aria-label={ariaLabel}>
      {families.map((f) => {
        const reading = readings[f.id];
        const active = f.id === activeFamilyId;
        return (
          <li
            key={f.id}
            className={`${styles.familyReadingItem} ${
              active ? styles.familyReadingItemActive : ''
            }`}
          >
            <span className={styles.familyReadingName}>
              {f.label}
              {active && (
                <span className={styles.familyReadingActiveChip}>
                  {activeChipLabel}
                </span>
              )}
            </span>
            <span className={styles.familyReadingHeadline}>
              {reading.headline}
            </span>
            <span className={styles.familyReadingBody}>{reading.body}</span>
          </li>
        );
      })}
    </ul>
  );
}
