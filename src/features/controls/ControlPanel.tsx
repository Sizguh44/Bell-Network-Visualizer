import type {
  DemoConfig,
  GraphTopologyId,
  ObservableMode,
  StateFamily,
} from '../../types/graph';
import {
  getDefaultConfig,
  getStateFamilies,
  getStateFamily,
} from '../../data/stateFamilies';
import { getTopologies, getTopology } from '../../data/topologies';
import {
  getObservable,
  getObservables,
} from '../graph/observableDefinitions';
import { useGlossary } from '../learning/GlossaryContext';
import { useLocale, useUiText } from '../../i18n';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  config: DemoConfig;
  onConfigChange: (next: DemoConfig) => void;
  /** Level-1 reset — see `App.handleCleanStart` for the exact scope. */
  onCleanStart: () => void;
  /** Level-2 reset — confirmed before calling; see `App.handleResetAllProgress`. */
  onResetAllProgress: () => void;
}

export function ControlPanel({
  config,
  onConfigChange,
  onCleanStart,
  onResetAllProgress,
}: ControlPanelProps) {
  const { openAtlas } = useGlossary();
  const locale = useLocale();
  const t = useUiText();
  const topologies = getTopologies(locale);
  const stateFamilies = getStateFamilies(locale);
  const observables = getObservables(locale);

  // Changing family keeps the user's current observable lens, demo state, and
  // graph topology; it only snaps strength back to the new family's default.
  const setFamily = (id: StateFamily) => {
    const defaults = getDefaultConfig(id);
    onConfigChange({
      ...defaults,
      observableMode: config.observableMode,
      demoMode: config.demoMode,
      graphTopology: config.graphTopology,
    });
  };

  const setTopology = (id: GraphTopologyId) =>
    onConfigChange({ ...config, graphTopology: id });

  const setObservable = (mode: ObservableMode) =>
    onConfigChange({ ...config, observableMode: mode });

  const setStrength = (value: number) =>
    onConfigChange({ ...config, entanglementStrength: value });

  const toggleDemo = () =>
    onConfigChange({ ...config, demoMode: !config.demoMode });

  const reset = () => {
    const defaults = getDefaultConfig(config.stateFamily);
    onConfigChange({
      ...defaults,
      observableMode: config.observableMode,
      graphTopology: config.graphTopology,
    });
  };

  const activeFamily = getStateFamily(config.stateFamily, locale);
  const activeObservable = getObservable(config.observableMode, locale);
  const activeTopology = getTopology(config.graphTopology, locale);

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>{t.controls.title}</h2>

      <fieldset className={styles.topologyGroup}>
        <legend className={styles.legend}>{t.controls.topology}</legend>
        <div
          className={styles.topologyRow}
          role="radiogroup"
          aria-label={t.controls.topologyAria}
        >
          {topologies.map((top) => {
            const active = config.graphTopology === top.id;
            return (
              <label
                key={top.id}
                className={`${styles.topologyPill} ${active ? styles.pillActive : ''}`}
              >
                <input
                  type="radio"
                  name="graphTopology"
                  value={top.id}
                  checked={active}
                  onChange={() => setTopology(top.id)}
                  className={styles.radioInput}
                />
                <span>{top.label}</span>
              </label>
            );
          })}
        </div>
        <p className={styles.familyDescription}>{activeTopology.shortDescription}</p>
      </fieldset>

      <fieldset className={styles.familyGroup}>
        <legend className={styles.legend}>{t.controls.stateFamily}</legend>
        <div
          className={styles.pillGrid}
          role="radiogroup"
          aria-label={t.controls.stateFamilyAria}
        >
          {stateFamilies.map((f) => {
            const active = config.stateFamily === f.id;
            return (
              <label
                key={f.id}
                className={`${styles.pill} ${active ? styles.pillActive : ''}`}
              >
                <input
                  type="radio"
                  name="stateFamily"
                  value={f.id}
                  checked={active}
                  onChange={() => setFamily(f.id)}
                  className={styles.radioInput}
                />
                <span>{f.label}</span>
              </label>
            );
          })}
        </div>
        <p className={styles.familyDescription}>{activeFamily.shortDescription}</p>
      </fieldset>

      <fieldset className={styles.observableGroup}>
        <legend className={styles.legend}>{t.controls.observableLens}</legend>
        <div className={styles.selectWrapper}>
          <select
            id="observable-mode"
            className={styles.select}
            value={config.observableMode}
            onChange={(e) => setObservable(e.target.value as ObservableMode)}
            aria-label={t.controls.observableLensAria}
          >
            {observables.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          <span className={styles.selectCaret} aria-hidden>
            ▾
          </span>
        </div>
        <p className={styles.observableDescription}>
          {activeObservable.shortDescription}
        </p>
      </fieldset>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>
          <label htmlFor="entanglement-strength">
            {t.controls.strengthLabel}
          </label>
          <span className={styles.fieldValue}>
            {config.entanglementStrength.toFixed(2)}
          </span>
        </div>
        <input
          id="entanglement-strength"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={config.entanglementStrength}
          onChange={(e) => setStrength(Number(e.target.value))}
          className={styles.slider}
        />
      </div>

      <label className={styles.toggleRow}>
        <span>{t.controls.demoModeLabel}</span>
        <button
          type="button"
          role="switch"
          aria-checked={config.demoMode}
          aria-label={t.controls.demoModeAria}
          className={`${styles.toggle} ${config.demoMode ? styles.toggleOn : ''}`}
          onClick={toggleDemo}
        >
          <span className={styles.toggleThumb} />
        </button>
      </label>

      <button type="button" onClick={reset} className={styles.resetButton}>
        {t.controls.reset}
      </button>

      <button
        type="button"
        onClick={onCleanStart}
        className={styles.resetButton}
        title={t.controls.cleanStartTitle}
      >
        {t.controls.cleanStart}
      </button>

      <p className={styles.resetHint}>{t.controls.resetHint}</p>

      <p className={styles.note}>{t.controls.note}</p>

      <button type="button" className={styles.atlasLink} onClick={openAtlas}>
        {t.controls.openAtlas}
      </button>

      <button
        type="button"
        className={styles.dangerLink}
        title={t.controls.resetProgressTitle}
        onClick={() => {
          // Native `window.confirm` keeps us off a custom modal while still
          // guarding a destructive action. Locale-aware copy is passed in.
          if (window.confirm(t.controls.resetProgressConfirm)) {
            onResetAllProgress();
          }
        }}
      >
        {t.controls.resetProgress}
      </button>
    </div>
  );
}
