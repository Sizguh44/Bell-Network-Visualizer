import { useUiText } from '../../i18n';
import styles from './GraphSymmetryCard.module.css';

const PAIR_COLORS = ['#6aa7ff', '#4fb8a6', '#c596ff', '#e8a572'];

/** One mini dipole drawn inside the schematic. */
function MiniDipole({
  leftLabel,
  rightLabel,
  edgeOrder,
  ariaLabel,
}: {
  leftLabel: string;
  rightLabel: string;
  edgeOrder: readonly number[];
  ariaLabel: string;
}) {
  const width = 180;
  const height = 100;
  const padding = 24;
  const leftX = padding;
  const rightX = width - padding;
  const midY = height / 2;
  const spread = 20;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={styles.mini}
      role="img"
      aria-label={ariaLabel}
    >
      {edgeOrder.map((colourIndex, i) => {
        const offset = (i - (edgeOrder.length - 1) / 2) * spread;
        const d = `M ${leftX},${midY} Q ${(leftX + rightX) / 2},${
          midY - offset
        } ${rightX},${midY}`;
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={PAIR_COLORS[colourIndex % PAIR_COLORS.length]}
            strokeWidth={1.8}
            strokeLinecap="round"
            opacity={0.85}
          />
        );
      })}
      <circle cx={leftX} cy={midY} r={10} className={styles.node} />
      <circle cx={rightX} cy={midY} r={10} className={styles.node} />
      <text x={leftX} y={midY + 28} className={styles.label}>
        {leftLabel}
      </text>
      <text x={rightX} y={midY + 28} className={styles.label}>
        {rightLabel}
      </text>
    </svg>
  );
}

/**
 * Visual illustration of the A ↔ B node-swap automorphism of the dipole.
 * Two copies of the dipole side by side plus a caption. Copy is pulled
 * from `UI_STRINGS.graphSymmetry`.
 */
export function GraphSymmetryCard() {
  const g = useUiText().graphSymmetry;
  return (
    <figure className={styles.root} aria-label={g.aria}>
      <figcaption className={styles.heading}>{g.heading}</figcaption>
      <div className={styles.row}>
        <MiniDipole
          leftLabel="A"
          rightLabel="B"
          edgeOrder={[0, 1, 2, 3]}
          ariaLabel={g.miniAria('A', 'B')}
        />
        <div className={styles.arrow} aria-hidden>
          <span className={styles.arrowSymbol}>≈</span>
          <span className={styles.arrowCaption}>{g.arrowCaption}</span>
        </div>
        <MiniDipole
          leftLabel="B"
          rightLabel="A"
          edgeOrder={[0, 1, 2, 3]}
          ariaLabel={g.miniAria('B', 'A')}
        />
      </div>
      <p className={styles.caption}>{g.caption}</p>
    </figure>
  );
}
