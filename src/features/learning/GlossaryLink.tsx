import type { ReactNode } from 'react';
import type { GlossaryEntryId } from '../../types/glossary';
import { useGlossary } from './GlossaryContext';
import { useUiText } from '../../i18n';
import styles from './GlossaryLink.module.css';

interface GlossaryLinkProps {
  id: GlossaryEntryId;
  children: ReactNode;
}

/**
 * Inline, dashed-underline button that opens the Concept Atlas on the given
 * entry. Usable inside both JSX (theory cards) and string-driven narratives
 * via `renderGlossaryInline`. The hover tooltip is localised via
 * `UI_STRINGS.header.openInAtlasTitle`.
 */
export function GlossaryLink({ id, children }: GlossaryLinkProps) {
  const { openEntry } = useGlossary();
  const t = useUiText();
  return (
    <button
      type="button"
      className={styles.link}
      onClick={() => openEntry(id)}
      title={t.header.openInAtlasTitle}
    >
      {children}
    </button>
  );
}
