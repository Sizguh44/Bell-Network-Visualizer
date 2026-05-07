import type { DemoConfig } from '../types/graph';
import type { AppMode, LessonId, LessonStates } from '../types/learning';
import type { ChallengeId, ChallengeStates } from '../types/challenge';
import type { BridgeLessonId } from '../types/bridge';
import type { GlossaryEntryId } from '../types/glossary';
import type { LibraryTab } from '../types/content';
import type { LabPanelId } from '../types/lab';
import type { Locale } from '../i18n/types';

/**
 * Versioned storage key. Bump the version suffix whenever the persisted shape
 * changes in a way that older data cannot be loaded back. Old keys are left
 * behind intentionally — they can be reclaimed by a migration step later.
 *
 * **Faz 2 note** — adding `'lab'` to `AppMode` and the optional
 * `activeLabPanelId` field is *strictly additive* and backward-compatible:
 *   • old snapshots stored an `appMode` of `'explore' | 'learn' |
 *     'challenge' | 'bridge'`, all of which remain valid in the new union;
 *   • old snapshots have no `activeLabPanelId` field — the resolver falls
 *     back to the first-of-kind constant when reading.
 * No version bump is needed; the v1 key continues to round-trip cleanly.
 */
export const STORAGE_KEY = 'bell-network-visualizer:v1';

/**
 * Minimal shape the app persists across sessions. Everything here is user
 * preference or progress data — nothing derived.
 */
export interface PersistedState {
  locale: Locale;
  config: DemoConfig;
  appMode: AppMode;
  activeLessonId: LessonId;
  lessonStates: LessonStates;
  activeChallengeId: ChallengeId;
  challengeStates: ChallengeStates;
  activeBridgeLessonId: BridgeLessonId;
  /**
   * Geometry Lab panel last viewed. Optional so v1-era snapshots predating
   * the Lab continue to load cleanly — the resolver falls back to
   * `FIRST_LAB_PANEL_ID` when this field is missing.
   */
  activeLabPanelId?: LabPanelId;
  selectedEdgeId: string | null;
  atlasEntryId: GlossaryEntryId | null;
  libraryTab: LibraryTab;
  onboardingSeen: boolean;
}

/**
 * Defensive load. Returns `undefined` for any SSR, missing, malformed or
 * non-object payload — the caller should fall back to defaults in that case.
 * Field-level validation is handled at resolve time by the caller because the
 * union memberships live in their respective data files.
 */
export function loadPersistedState(): Partial<PersistedState> | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return undefined;
    return parsed as Partial<PersistedState>;
  } catch {
    return undefined;
  }
}

/**
 * Save without throwing. Quota errors, private-mode blocks, and deleted
 * `localStorage` objects are all swallowed — persistence is best-effort.
 */
export function savePersistedState(state: PersistedState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // No-op. Session continues with in-memory state.
  }
}
