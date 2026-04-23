import { useState } from 'react';
import type { DemoConfig } from '../../types/graph';
import { StatCard } from '../../components/StatCard';
import { DipoleGraphView } from './DipoleGraphView';
import { CycleGraphView } from './CycleGraphView';
import { EdgeDetailCard } from './EdgeDetailCard';
import { VisualizationLegend } from './VisualizationLegend';
import { ObservableSummaryCard } from './ObservableSummaryCard';
import { getStateFamily } from '../../data/stateFamilies';
import { getTopology } from '../../data/topologies';
import { deriveCorrelationState } from '../graph/deriveCorrelationState';
import { deriveEdgeDetails } from '../graph/deriveEdgeDetails';
import { deriveObservableSummary } from '../graph/deriveObservableSummary';
import { formatNumber } from '../../utils/format';
import { useLocale, useUiText } from '../../i18n';
import styles from './VisualizationPanel.module.css';

interface VisualizationPanelProps {
  config: DemoConfig;
  /** Lifted to App so Learn / Challenge / Bridge setups can pre-select a pair. */
  selectedEdgeId: string | null;
  onSelectedEdgeChange: (id: string | null) => void;
}

export function VisualizationPanel({
  config,
  selectedEdgeId,
  onSelectedEdgeChange,
}: VisualizationPanelProps) {
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const locale = useLocale();
  const t = useUiText();

  const topology = getTopology(config.graphTopology, locale);
  const family = getStateFamily(config.stateFamily, locale);
  const strength = config.demoMode ? config.entanglementStrength : 0;

  const derived = deriveCorrelationState(strength, family);
  const edgeDetails = deriveEdgeDetails(
    topology.edges,
    strength,
    family,
    config.observableMode,
  );
  const observableSummary = deriveObservableSummary(
    family,
    strength,
    config.observableMode,
    locale,
  );

  const focusedId = selectedEdgeId ?? hoveredEdgeId;
  const focusedDetail = focusedId
    ? edgeDetails.find((d) => d.edgeId === focusedId) ?? null
    : null;

  const commonViewProps = {
    nodes: topology.nodes,
    edges: topology.edges,
    strength,
    family,
    details: edgeDetails,
    active: config.demoMode,
    selectedEdgeId,
    hoveredEdgeId,
    onSelect: onSelectedEdgeChange,
    onHover: setHoveredEdgeId,
  } as const;

  return (
    // `data-export-ref` marks the primary visualization surface for a future
    // snapshot/export helper — no runtime behaviour yet.
    <div className={styles.root} data-export-ref="visualization-panel">
      <div className={styles.header}>
        <div className={styles.headerLead}>
          <span className={styles.eyebrow}>{t.visualization.sceneEyebrow}</span>
          <h2 className={styles.title}>{topology.label}</h2>
        </div>
        <span className={styles.status}>
          <span
            className={config.demoMode ? styles.statusDot : styles.statusDotOff}
            aria-hidden
          />
          {config.demoMode
            ? `${family.label} ${t.visualization.statusFamilySuffix}`
            : t.visualization.statusDemoOff}
        </span>
      </div>

      <div className={styles.canvas}>
        {config.graphTopology === 'cycle4' ? (
          <CycleGraphView {...commonViewProps} />
        ) : (
          <DipoleGraphView {...commonViewProps} />
        )}
        {!focusedId && config.demoMode && (
          <span className={styles.canvasHint} aria-hidden>
            {t.visualization.hoverHint}
          </span>
        )}
      </div>

      <VisualizationLegend />

      <ObservableSummaryCard summary={observableSummary} />

      <div className={styles.stats}>
        <StatCard
          label={t.visualization.statEntanglementStrength}
          value={formatNumber(config.entanglementStrength, 2)}
          hint={t.visualization.statEntanglementHint}
        />
        <StatCard
          label={t.visualization.statAntiParallel}
          value={formatNumber(derived.antiParallelScore)}
          hint={t.visualization.statAntiParallelHint}
        />
        <StatCard
          label={t.visualization.statMutualInformation}
          value={formatNumber(derived.mutualInformationProxy)}
          hint={t.visualization.statMutualInformationHint}
        />
        <StatCard
          label={t.visualization.statGluingScore}
          value={formatNumber(derived.gluingScore)}
          hint={t.visualization.statGluingScoreHint}
        />
      </div>

      <EdgeDetailCard
        detail={focusedDetail}
        pinned={selectedEdgeId !== null}
        observableMode={config.observableMode}
        onClear={() => onSelectedEdgeChange(null)}
      />
    </div>
  );
}
