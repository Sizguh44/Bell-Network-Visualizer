import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react';
import type { GraphEdge } from '../../types/graph';
import { clamp } from '../../utils/format';
import {
  angleToUnit,
  arrowGeometry,
  type Point,
} from './graphGeometry';
import { useUiText } from '../../i18n';
import styles from './FacePairGraphic.module.css';

type VisualState = 'active' | 'dimmed' | 'normal';

interface FacePairGraphicProps {
  edge: GraphEdge;
  index: number;
  /** Endpoint positions in canvas coordinates. */
  from: Point;
  to: Point;
  /** Math-convention angle (°) for the arrow anchored at `from`. */
  sourceAngle: number;
  /** Math-convention angle (°) for the arrow anchored at `to`. */
  targetAngle: number;
  /** Pre-built SVG `d` for the edge curve connecting the two endpoints. */
  edgePath: string;
  /** Stroke + text colour for this pair. */
  color: string;
  /** [0, 1] observable-lens-driven emphasis. */
  emphasis: number;
  /** Whether pulsing should run (demoMode on + reduced-motion off). */
  active?: boolean;
  selectedEdgeId: string | null;
  hoveredEdgeId: string | null;
  onSelect: (edgeId: string | null) => void;
  onHover: (edgeId: string | null) => void;
  /** Radius of the endpoint node circle, for arrow offset. */
  nodeRadius?: number;
  /** Total arrow length in canvas px. */
  arrowLength?: number;
}

/**
 * Shared visual for a single face pair: edge curve + two endpoint-anchored
 * arrows + hit regions + halo + pair label. Both `DipoleGraphView` and
 * `CycleGraphView` build their topology-specific geometry (endpoint
 * positions, angles, edge path) and hand it to this component. Everything
 * about selection, hover, focus and emphasis-driven intensity lives here.
 */
export function FacePairGraphic({
  edge,
  index,
  from,
  to,
  sourceAngle,
  targetAngle,
  edgePath,
  color,
  emphasis,
  active = false,
  selectedEdgeId,
  hoveredEdgeId,
  onSelect,
  onHover,
  nodeRadius = 12,
  arrowLength = 46,
}: FacePairGraphicProps) {
  const t = useUiText();
  const focusedId = selectedEdgeId ?? hoveredEdgeId;
  const visualState: VisualState =
    focusedId === edge.id ? 'active' : focusedId ? 'dimmed' : 'normal';
  const isActive = visualState === 'active';
  const isDimmed = visualState === 'dimmed';
  const isSelected = selectedEdgeId === edge.id;

  const baseEdgeOpacity = 0.22 + 0.7 * emphasis;
  const baseArrowOpacity = 0.4 + 0.55 * emphasis;
  const edgeOpacity = isDimmed ? 0.09 : isActive ? 1 : baseEdgeOpacity;
  const arrowOpacity = isDimmed ? 0.18 : isActive ? 1 : baseArrowOpacity;
  const edgeStrokeWidth = (1.5 + 0.6 * emphasis) * (isActive ? 1.9 : 1);
  const arrowStrokeWidth = (1.8 + 0.8 * emphasis) * (isActive ? 1.5 : 1);

  const sourceDir = angleToUnit(sourceAngle);
  const targetDir = angleToUnit(targetAngle);
  const sourceFrom = {
    x: from.x + sourceDir.x * nodeRadius,
    y: from.y + sourceDir.y * nodeRadius,
  };
  const targetFrom = {
    x: to.x + targetDir.x * nodeRadius,
    y: to.y + targetDir.y * nodeRadius,
  };
  const sourceArrow = arrowGeometry(sourceFrom, sourceDir, arrowLength);
  const targetArrow = arrowGeometry(targetFrom, targetDir, arrowLength);

  const handleClick = (e: ReactMouseEvent<SVGGElement>) => {
    e.stopPropagation();
    onSelect(isSelected ? null : edge.id);
  };
  const handleKey = (e: ReactKeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(isSelected ? null : edge.id);
    } else if (e.key === 'Escape' && isSelected) {
      e.preventDefault();
      onSelect(null);
    }
  };

  const labelMid = {
    x: (sourceArrow.tip.x + targetArrow.tip.x) / 2,
    y: (sourceArrow.tip.y + targetArrow.tip.y) / 2,
  };

  const emphasisClamped = clamp(emphasis, 0, 1);

  const classes = [
    styles.pair,
    active ? styles.pairPulsing : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <g
      className={classes}
      style={{ color, animationDelay: `${index * 0.18}s` }}
      onMouseEnter={() => onHover(edge.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(edge.id)}
      onBlur={() => onHover(null)}
      onClick={handleClick}
      onKeyDown={handleKey}
      role="button"
      tabIndex={0}
      aria-label={t.visualization.facePairAria(index + 1, isSelected)}
      aria-pressed={isSelected}
      data-emphasis={emphasisClamped.toFixed(2)}
    >
      <path d={edgePath} className={styles.hitEdge} />

      {isActive && (
        <path d={edgePath} className={styles.haloEdge} style={{ stroke: color }} />
      )}

      <path
        d={edgePath}
        className={styles.edge}
        style={{
          stroke: color,
          strokeWidth: edgeStrokeWidth,
          opacity: edgeOpacity,
        }}
      />

      <line {...sourceArrow.line} className={styles.hitArrow} />
      <line
        {...sourceArrow.line}
        stroke="currentColor"
        strokeWidth={arrowStrokeWidth}
        strokeLinecap="round"
        style={{ opacity: arrowOpacity }}
      />
      <path
        d={sourceArrow.head}
        fill="currentColor"
        style={{ opacity: arrowOpacity }}
      />

      <line {...targetArrow.line} className={styles.hitArrow} />
      <line
        {...targetArrow.line}
        stroke="currentColor"
        strokeWidth={arrowStrokeWidth}
        strokeLinecap="round"
        style={{ opacity: arrowOpacity }}
      />
      <path
        d={targetArrow.head}
        fill="currentColor"
        style={{ opacity: arrowOpacity }}
      />

      {isActive && (
        <text
          x={labelMid.x}
          y={labelMid.y}
          className={styles.pairLabel}
          fill="currentColor"
        >
          {index + 1}
        </text>
      )}
    </g>
  );
}
