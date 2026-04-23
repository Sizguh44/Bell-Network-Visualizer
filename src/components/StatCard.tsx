import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  uncertainty?: number;
}

export function StatCard({ label, value, hint, uncertainty }: StatCardProps) {
  return (
    <div className={styles.root}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>
        <span>{value}</span>
        {uncertainty !== undefined && (
          <span className={styles.uncertainty}> ± {uncertainty}</span>
        )}
      </div>
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );
}
