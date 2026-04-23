import type { ReactNode } from 'react';
import type { GlossaryEntryId } from '../../types/glossary';
import { GlossaryLink } from './GlossaryLink';

/**
 * Replace `[[id|display text]]` tokens in a narrative string with inline
 * GlossaryLink buttons. `[[id]]` (no display text) falls back to the id.
 *
 * Safe with or without matches. Returns an array of ReactNode fragments so
 * the caller can drop it straight into a `<p>` or `<span>`.
 */
export function renderGlossaryInline(text: string): ReactNode[] {
  const pattern = /\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const m of text.matchAll(pattern)) {
    const idx = m.index ?? 0;
    if (idx > lastIndex) {
      nodes.push(text.slice(lastIndex, idx));
    }
    const rawId = m[1] ?? '';
    const display = m[2] ?? rawId;
    const id = rawId as GlossaryEntryId;
    nodes.push(
      <GlossaryLink key={`gl-${key++}`} id={id}>
        {display}
      </GlossaryLink>,
    );
    lastIndex = idx + m[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
