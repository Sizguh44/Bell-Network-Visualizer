import type { MouseEvent as ReactMouseEvent } from 'react';
import type {
  EdgeDetail,
  GraphEdge,
  GraphNode,
  StateFamilyPreset,
} from '../../types/graph';
import { PAIR_COLORS } from '../../data/dipoleGraph';
import { MAX_MISMATCH_DEG } from '../graph/deriveCorrelationState';
import { clamp } from '../../utils/format';
import { FacePairGraphic } from './FacePairGraphic';
import type { Point } from './graphGeometry';
import { useUiText } from '../../i18n';
import styles from './CycleGraphView.module.css';

interface CycleGraphViewProps {
  nodes: readonly GraphNode[];
  edges: readonly GraphEdge[];
  strength: number;
  family: StateFamilyPreset;
  details: readonly EdgeDetail[];
  active?: boolean;
  selectedEdgeId: string | null;
  hoveredEdgeId: string | null;
  onSelect: (edgeId: string | null) => void;
  onHover: (edgeId: string | null) => void;
}

const VIEWBOX = { w: 480, h: 300 };
const CENTER: Point = { x: 240, y: 150 };
/** Radius of the circle the four cycle nodes sit on. */
const RADIUS = 108;
const NODE_RADIUS = 11;
const ARROW_LENGTH = 30;
/** How far the edge curve bulges outward from the ring's interior. */
const EDGE_BULGE = 20;

function project(node: GraphNode): Point {
  return {
    x: CENTER.x + node.position.x * RADIUS,
    y: CENTER.y + node.position.y * RADIUS,
  };
}

/** Math-convention angle (°) from `a` toward `b`. */
function edgeAngle(a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  // Flip dy to convert SVG y (down) to math y (up).
  return (Math.atan2(-dy, dx) * 180) / Math.PI;
}

/** Quadratic curve between two endpoints that bulges outward from centre. */
function buildCycleEdgePath(
  from: Point,
  to: Point,
  center: Point,
  bulge: number,
): string {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const ox = midX - center.x;
  const oy = midY - center.y;
  const ol = Math.hypot(ox, oy) || 1;
  const cx = midX + (ox / ol) * bulge;
  const cy = midY + (oy / ol) * bulge;
  return `M ${from.x},${from.y} Q ${cx},${cy} ${to.x},${to.y}`;
}

export function CycleGraphView({
  nodes,
  edges,
  strength,
  family,
  details,
  active = false,
  selectedEdgeId,
  hoveredEdgeId,
  onSelect,
  onHover,
}: CycleGraphViewProps) {
  const t = useUiText();
  const positions = new Map(nodes.map((n) => [n.id, project(n)] as const));
  const s = clamp(strength, 0, 1);

  const handleBackdropClick = (e: ReactMouseEvent<SVGSVGElement>) => {
    if (e.target === e.currentTarget) onSelect(null);
  };

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      className={styles.svg}
      aria-label={t.visualization.cycleCanvasAria}
      onClick={handleBackdropClick}
    >
      <defs>
        <radialGradient id="cycle-node-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect
        x={0}
        y={0}
        width={VIEWBOX.w}
        height={VIEWBOX.h}
        fill="transparent"
        onClick={() => onSelect(null)}
      />

      {edges.map((edge, i) => {
        const from = positions.get(edge.source);
        const to = positions.get(edge.target);
        if (!from || !to) return null;

        const base = edgeAngle(from, to);
        const offset = family.strengthOffsets[i] ?? 0;
        const noise = family.mismatchCoeff[i] ?? 0;
        const localStrength = clamp(s + offset, 0, 1);

        const deviation = noise * MAX_MISMATCH_DEG * (1 - localStrength);
        const sourceAngle = base;
        const targetAngle = base + 180 + deviation;

        const edgePath = buildCycleEdgePath(from, to, CENTER, EDGE_BULGE);
        const color = PAIR_COLORS[i % PAIR_COLORS.length] ?? '#ffffff';
        const emphasis = clamp(details[i]?.emphasis ?? 0, 0, 1);

        return (
          <FacePairGraphic
            key={edge.id}
            edge={edge}
            index={i}
            from={from}
            to={to}
            sourceAngle={sourceAngle}
            targetAngle={targetAngle}
            edgePath={edgePath}
            color={color}
            emphasis={emphasis}
            active={active}
            selectedEdgeId={selectedEdgeId}
            hoveredEdgeId={hoveredEdgeId}
            onSelect={onSelect}
            onHover={onHover}
            nodeRadius={NODE_RADIUS}
            arrowLength={ARROW_LENGTH}
          />
        );
      })}

      {nodes.map((node) => {
        const pos = positions.get(node.id);
        if (!pos) return null;
        return (
          <g
            key={node.id}
            transform={`translate(${pos.x},${pos.y})`}
            className={styles.nodeGroup}
          >
            <circle r={30} fill="url(#cycle-node-glow)" />
            <circle r={NODE_RADIUS} className={styles.node} />
            <text y={4} className={styles.label}>
              {node.label ?? node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
