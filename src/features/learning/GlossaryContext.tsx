import { createContext, useContext, type ReactNode } from 'react';
import type { BridgeLessonId } from '../../types/bridge';
import type { ChallengeId } from '../../types/challenge';
import type { LibraryTab } from '../../types/content';
import type { GlossaryEntryId } from '../../types/glossary';
import type { LessonId } from '../../types/learning';

/**
 * App-level navigation overlay context. Exposes the handlers every feature
 * needs to reach the atlas, the library, or any specific content item
 * regardless of which mode the user is currently in.
 */
export interface GlossaryContextValue {
  /** Open the atlas focused on the given entry. */
  openEntry: (id: GlossaryEntryId) => void;
  /** Open the atlas in list view (no focused entry). */
  openAtlas: () => void;
  /** Close the atlas overlay. */
  closeAtlas: () => void;
  /** Open the Content Library, optionally on a specific tab. */
  openLibrary: (tab?: LibraryTab) => void;
  /** Close the Content Library. */
  closeLibrary: () => void;
  /** Jump to a lesson (switches to Learn mode, closes overlays). */
  openLesson: (id: LessonId) => void;
  /** Jump to a challenge (switches to Challenge mode, closes overlays). */
  openChallenge: (id: ChallengeId) => void;
  /** Jump to a bridge lesson (switches to Bridge mode, closes overlays). */
  openBridgeLesson: (id: BridgeLessonId) => void;
}

const GlossaryContext = createContext<GlossaryContextValue | null>(null);

interface GlossaryProviderProps {
  value: GlossaryContextValue;
  children: ReactNode;
}

export function GlossaryProvider({ value, children }: GlossaryProviderProps) {
  return <GlossaryContext.Provider value={value}>{children}</GlossaryContext.Provider>;
}

export function useGlossary(): GlossaryContextValue {
  const ctx = useContext(GlossaryContext);
  if (!ctx) {
    throw new Error('useGlossary must be used inside <GlossaryProvider>.');
  }
  return ctx;
}
