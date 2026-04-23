import type { ReactNode } from 'react';
import styles from './NarrativeCard.module.css';

interface NarrativeCardProps {
  title: string;
  pill?: string;
  children: ReactNode;
}

export function NarrativeCard({ title, pill, children }: NarrativeCardProps) {
  return (
    <article className={styles.root}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {pill && <span className={styles.pill}>{pill}</span>}
      </header>
      <div className={styles.body}>{children}</div>
    </article>
  );
}
