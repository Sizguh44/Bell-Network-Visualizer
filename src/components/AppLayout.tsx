import type { ReactNode } from 'react';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  main: ReactNode;
  footer: ReactNode;
}

export function AppLayout({ header, sidebar, main, footer }: AppLayoutProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>{header}</header>
      <div className={styles.body}>
        <aside className={styles.sidebar}>{sidebar}</aside>
        <section className={styles.main}>{main}</section>
      </div>
      <footer className={styles.footer}>{footer}</footer>
    </div>
  );
}
