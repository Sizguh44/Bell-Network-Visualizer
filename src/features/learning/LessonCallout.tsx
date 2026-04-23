import type { CalloutKind } from '../../types/learning';
import { useUiText } from '../../i18n';
import styles from './LessonCallout.module.css';

interface LessonCalloutProps {
  kind: CalloutKind;
  body: string;
}

/**
 * Labels are pulled from `UI_STRINGS.callouts` so "Key idea" / "Common
 * confusion" / "In this demo" / "In full theory" swap to Turkish in TR mode
 * without the component needing to know which locale is active.
 */
export function LessonCallout({ kind, body }: LessonCalloutProps) {
  const c = useUiText().callouts;
  const label: Record<CalloutKind, string> = {
    key: c.key,
    confusion: c.confusion,
    'in-demo': c.inDemo,
    'in-theory': c.inTheory,
  };
  return (
    <aside className={`${styles.root} ${styles[`kind-${kind}`]}`}>
      <span className={styles.label}>{label[kind]}</span>
      <p className={styles.body}>{body}</p>
    </aside>
  );
}
