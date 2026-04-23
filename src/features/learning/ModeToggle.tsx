import type { AppMode } from '../../types/learning';
import { useUiText } from '../../i18n';
import styles from './ModeToggle.module.css';

interface ModeToggleProps {
  mode: AppMode;
  onChange: (next: AppMode) => void;
}

/**
 * The four peer-mode buttons in the header. Copy comes from `UI_STRINGS`
 * (both the visible label and the hover `title` / `aria-description`),
 * so the control swaps language in lockstep with the rest of the app.
 */
export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const t = useUiText();
  const modes: { id: AppMode; label: string; hint: string }[] = [
    {
      id: 'explore',
      label: t.modes.explore.label,
      hint: t.modes.explore.hint,
    },
    {
      id: 'learn',
      label: t.modes.learn.label,
      hint: t.modes.learn.hint,
    },
    {
      id: 'challenge',
      label: t.modes.challenge.label,
      hint: t.modes.challenge.hint,
    },
    {
      id: 'bridge',
      label: t.modes.bridge.label,
      hint: t.modes.bridge.hint,
    },
  ];

  return (
    <div className={styles.root} role="radiogroup" aria-label={t.modes.group}>
      {modes.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-description={m.hint}
            title={m.hint}
            className={`${styles.button} ${active ? styles.active : ''}`}
            onClick={() => onChange(m.id)}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
