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
import styles from './DipoleGraphView.module.css';

interface DipoleGraphViewProps {
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
const PADDING = 80;
const EDGE_SPREAD = 36;
const NODE_RADIUS = 12;
const ARROW_LENGTH = 46;

/**
 * Fixed fan of base angles for the four left-hand face normals (math
 * convention, 0° = east, +90° = north). The right-hand partner ideally sits
 * at `180° + base`, deviated by the family's per-edge mismatch coefficient.
 */
const LEFT_BASE_ANGLES_DEG = [42, 14, -14, -42];

function project(node: GraphNode): Point {
  const w = VIEWBOX.w - PADDING * 2;
  const h = VIEWBOX.h - PADDING * 2;
  return {
    x: PADDING + ((node.position.x + 1) / 2) * w,
    y: PADDING + ((node.position.y + 1) / 2) * h,
  };
}

function buildDipoleEdgePath(
  from: Point,
  to: Point,
  index: number,
  total: number,
): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const offset = total <= 1 ? 0 : (index - (total - 1) / 2) * EDGE_SPREAD;
  const cx = mx + nx * offset;
  const cy = my + ny * offset;
  return `M ${from.x},${from.y} Q ${cx},${cy} ${to.x},${to.y}`;
}

export function DipoleGraphView({
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
}: DipoleGraphViewProps) {
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
      aria-label={t.visualization.dipoleCanvasAria}
      onClick={handleBackdropClick}
    >
      <defs>
        <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
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

        const base = LEFT_BASE_ANGLES_DEG[i] ?? 0;
        const offset = family.strengthOffsets[i] ?? 0;
        const noise = family.mismatchCoeff[i] ?? 0;
        const localStrength = clamp(s + offset, 0, 1);

        const deviation = noise * MAX_MISMATCH_DEG * (1 - localStrength);
        const sourceAngle = base;
        const targetAngle = 180 + base + deviation;

        const edgePath = buildDipoleEdgePath(from, to, i, edges.length);
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
            <circle r={38} fill="url(#node-glow)" />
            <circle r={NODE_RADIUS} className={styles.node} />
            <text y={NODE_RADIUS + 26} className={styles.label}>
              {node.label ?? node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
