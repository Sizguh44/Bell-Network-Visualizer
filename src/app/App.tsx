import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Header } from '../components/Header';
import { ControlPanel } from '../features/controls/ControlPanel';
import { VisualizationPanel } from '../features/visualization/VisualizationPanel';
import { TheoryCard } from '../features/theory/TheoryCard';
import { WhyThisMattersCard } from '../features/theory/WhyThisMattersCard';
import { FamilyComparisonCard } from '../features/theory/FamilyComparisonCard';
import { ObservableNotesCard } from '../features/theory/ObservableNotesCard';
import { LessonPanel } from '../features/learning/LessonPanel';
import { ChallengePanel } from '../features/challenge/ChallengePanel';
import { BridgePanel } from '../features/bridge/BridgePanel';
import { ConceptAtlasPanel } from '../features/learning/ConceptAtlasPanel';
import { ContentLibraryPanel } from '../features/content/ContentLibraryPanel';
import { StartHereCard } from '../features/learning/StartHereCard';
import {
  GlossaryProvider,
  type GlossaryContextValue,
} from '../features/learning/GlossaryContext';
import { defaultDemoConfig } from '../data/stateFamilies';
import {
  FIRST_LESSON_ID,
  getLesson,
  initialLessonStates,
} from '../data/lessons';
import {
  FIRST_CHALLENGE_ID,
  getChallenge,
  initialChallengeStates,
} from '../data/challenges';
import {
  FIRST_BRIDGE_LESSON_ID,
  getBridgeLesson,
} from '../data/bridgeLessons';
import { getGlossaryEntry } from '../data/glossary';
import type { DemoConfig } from '../types/graph';
import type { GlossaryEntryId } from '../types/glossary';
import type {
  AppMode,
  Lesson,
  LessonId,
  LessonState,
  LessonStates,
} from '../types/learning';
import type {
  Challenge,
  ChallengeId,
  ChallengeState,
  ChallengeStates,
} from '../types/challenge';
import type { BridgeLesson, BridgeLessonId } from '../types/bridge';
import type { LibraryTab } from '../types/content';
import {
  loadPersistedState,
  savePersistedState,
  type PersistedState,
} from '../utils/persistence';
import {
  encodeUrlHash,
  parseUrlHash,
  writeUrlHash,
  type UrlState,
} from '../utils/urlState';
import {
  DEFAULT_LOCALE,
  LanguageProvider,
  LOCALES,
  detectBrowserLocale,
  type Locale,
} from '../i18n';
import styles from './App.module.css';

/* ------------------------------------------------------------------ */
/*  Initial state — URL hash > localStorage > hard-coded defaults      */
/* ------------------------------------------------------------------ */

interface ResolvedInitialState {
  locale: Locale;
  config: DemoConfig;
  appMode: AppMode;
  activeLessonId: LessonId;
  lessonStates: LessonStates;
  activeChallengeId: ChallengeId;
  challengeStates: ChallengeStates;
  activeBridgeLessonId: BridgeLessonId;
  selectedEdgeId: string | null;
  atlasEntryId: GlossaryEntryId | null;
  libraryTab: LibraryTab;
  onboardingSeen: boolean;
}

const LIBRARY_TABS: readonly LibraryTab[] = [
  'lessons',
  'challenges',
  'bridge',
  'glossary',
];

function isLessonStates(value: unknown): value is LessonStates {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isChallengeStates(value: unknown): value is ChallengeStates {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function resolveInitialState(): ResolvedInitialState {
  const urlState: UrlState =
    typeof window === 'undefined' ? {} : parseUrlHash(window.location.hash);
  const stored = loadPersistedState() ?? {};

  // Locale resolution order: URL ?lang > localStorage > navigator.language
  // > hard-coded default. Invalid stored values fall through.
  const storedLocale: Locale | undefined =
    stored.locale && LOCALES.includes(stored.locale) ? stored.locale : undefined;
  const locale: Locale =
    urlState.lang ?? storedLocale ?? detectBrowserLocale() ?? DEFAULT_LOCALE;

  // Config — each field independently resolved so a partial URL just
  // overrides that field without wiping the user's stored preferences.
  const storedConfig: Partial<DemoConfig> = stored.config ?? {};
  const config: DemoConfig = {
    demoMode: storedConfig.demoMode ?? defaultDemoConfig.demoMode,
    stateFamily:
      urlState.family ?? storedConfig.stateFamily ?? defaultDemoConfig.stateFamily,
    entanglementStrength:
      urlState.strength ??
      storedConfig.entanglementStrength ??
      defaultDemoConfig.entanglementStrength,
    observableMode:
      urlState.lens ??
      storedConfig.observableMode ??
      defaultDemoConfig.observableMode,
    graphTopology:
      urlState.topology ??
      storedConfig.graphTopology ??
      defaultDemoConfig.graphTopology,
  };

  const appMode: AppMode = urlState.mode ?? stored.appMode ?? 'explore';

  // Validate content ids against real lookup tables — URL/stored ids that
  // no longer exist fall back to the first-of-kind constant.
  // Id existence is locale-independent — EN is the canonical skeleton.
  const lessonCandidate = urlState.lesson ?? stored.activeLessonId;
  const activeLessonId: LessonId =
    lessonCandidate && getLesson(lessonCandidate, 'en')
      ? lessonCandidate
      : FIRST_LESSON_ID;

  // Id existence checks are locale-independent — EN is the canonical
  // skeleton. We pass 'en' here purely as a lookup probe.
  const challengeCandidate = urlState.challenge ?? stored.activeChallengeId;
  const activeChallengeId: ChallengeId =
    challengeCandidate && getChallenge(challengeCandidate, 'en')
      ? challengeCandidate
      : FIRST_CHALLENGE_ID;

  const bridgeCandidate = urlState.bridge ?? stored.activeBridgeLessonId;
  const activeBridgeLessonId: BridgeLessonId =
    bridgeCandidate && getBridgeLesson(bridgeCandidate, 'en')
      ? bridgeCandidate
      : FIRST_BRIDGE_LESSON_ID;

  const lessonStates: LessonStates = isLessonStates(stored.lessonStates)
    ? { ...initialLessonStates(), ...stored.lessonStates }
    : initialLessonStates();
  const challengeStates: ChallengeStates = isChallengeStates(
    stored.challengeStates,
  )
    ? { ...initialChallengeStates(), ...stored.challengeStates }
    : initialChallengeStates();

  const selectedEdgeId: string | null =
    urlState.edge ?? stored.selectedEdgeId ?? null;

  const atlasEntryId: GlossaryEntryId | null =
    stored.atlasEntryId && getGlossaryEntry(stored.atlasEntryId, 'en')
      ? stored.atlasEntryId
      : null;

  const libraryTab: LibraryTab =
    stored.libraryTab && LIBRARY_TABS.includes(stored.libraryTab)
      ? stored.libraryTab
      : 'lessons';

  const onboardingSeen: boolean = stored.onboardingSeen === true;

  return {
    locale,
    config,
    appMode,
    activeLessonId,
    lessonStates,
    activeChallengeId,
    challengeStates,
    activeBridgeLessonId,
    selectedEdgeId,
    atlasEntryId,
    libraryTab,
    onboardingSeen,
  };
}

/* ------------------------------------------------------------------ */
/*  Root component                                                     */
/* ------------------------------------------------------------------ */

export default function App() {
  // Resolved once at mount — URL + stored state + defaults folded together.
  const initial = useMemo(() => resolveInitialState(), []);

  const [locale, setLocale] = useState<Locale>(initial.locale);
  const toggleLocale = useCallback(
    () => setLocale((prev) => (prev === 'en' ? 'tr' : 'en')),
    [],
  );

  const [config, setConfig] = useState<DemoConfig>(initial.config);
  const [appMode, setAppMode] = useState<AppMode>(initial.appMode);

  const [activeLessonId, setActiveLessonId] = useState<LessonId>(
    initial.activeLessonId,
  );
  const [lessonStates, setLessonStates] = useState<LessonStates>(
    initial.lessonStates,
  );

  const [activeChallengeId, setActiveChallengeId] = useState<ChallengeId>(
    initial.activeChallengeId,
  );
  const [challengeStates, setChallengeStates] = useState<ChallengeStates>(
    initial.challengeStates,
  );

  const [activeBridgeLessonId, setActiveBridgeLessonId] =
    useState<BridgeLessonId>(initial.activeBridgeLessonId);

  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(
    initial.selectedEdgeId,
  );

  const [atlasOpen, setAtlasOpen] = useState(false);
  const [atlasEntryId, setAtlasEntryId] = useState<GlossaryEntryId | null>(
    initial.atlasEntryId,
  );

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryTab, setLibraryTab] = useState<LibraryTab>(initial.libraryTab);

  const [onboardingSeen, setOnboardingSeen] = useState<boolean>(
    initial.onboardingSeen,
  );

  // Selection is per-topology: an edge id from the dipole means nothing on the
  // cycle graph and vice versa. Clear selection whenever the topology changes,
  // but *not* on the initial mount — a shared URL can legitimately carry both
  // a topology and a matching edge id, and we must not wipe it before the
  // visualisation even has a chance to read it.
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    setSelectedEdgeId(null);
  }, [config.graphTopology]);

  // Persist + URL-sync effect. Runs on every relevant state change; both
  // writes are best-effort and never throw.
  useEffect(() => {
    const snapshot: PersistedState = {
      locale,
      config,
      appMode,
      activeLessonId,
      lessonStates,
      activeChallengeId,
      challengeStates,
      activeBridgeLessonId,
      selectedEdgeId,
      atlasEntryId,
      libraryTab,
      onboardingSeen,
    };
    savePersistedState(snapshot);

    const hash = encodeUrlHash({
      lang: locale,
      mode: appMode,
      topology: config.graphTopology,
      family: config.stateFamily,
      strength: config.entanglementStrength,
      lens: config.observableMode,
      edge: selectedEdgeId ?? undefined,
      lesson: activeLessonId,
      challenge: activeChallengeId,
      bridge: activeBridgeLessonId,
    });
    writeUrlHash(hash);
  }, [
    locale,
    config,
    appMode,
    activeLessonId,
    lessonStates,
    activeChallengeId,
    challengeStates,
    activeBridgeLessonId,
    selectedEdgeId,
    atlasEntryId,
    libraryTab,
    onboardingSeen,
  ]);

  const handleLessonStateChange = (id: LessonId, next: LessonState) => {
    setLessonStates((prev) => ({ ...prev, [id]: next }));
  };

  const handleChallengeStateChange = (id: ChallengeId, next: ChallengeState) => {
    setChallengeStates((prev) => ({ ...prev, [id]: next }));
  };

  const applyConfigSetup = useCallback(
    (configPatch: Partial<DemoConfig>, selection: string | null | undefined) => {
      setConfig((prev) => ({ ...prev, ...configPatch }));
      if (selection !== undefined) {
        setSelectedEdgeId(selection);
      }
    },
    [],
  );

  const handleApplyLessonSetup = (lesson: Lesson) =>
    applyConfigSetup(lesson.recommendedConfig, lesson.recommendedSelection);

  const handleApplyChallengeSetup = (challenge: Challenge) =>
    applyConfigSetup(challenge.setupConfig, challenge.setupSelection);

  const handleApplyBridgeSetup = (bridge: BridgeLesson) => {
    if (bridge.optionalSetupConfig) {
      applyConfigSetup(bridge.optionalSetupConfig, undefined);
    }
  };

  // All overlay / mode navigations also close the other overlays so only
  // the most recently requested surface is visible.
  const closeAllOverlays = useCallback(() => {
    setAtlasOpen(false);
    setAtlasEntryId(null);
    setLibraryOpen(false);
  }, []);

  const openEntry = useCallback((id: GlossaryEntryId) => {
    setAtlasEntryId(id);
    setAtlasOpen(true);
    setLibraryOpen(false);
  }, []);

  const openAtlas = useCallback(() => {
    setAtlasEntryId(null);
    setAtlasOpen(true);
    setLibraryOpen(false);
  }, []);

  const closeAtlas = useCallback(() => {
    setAtlasOpen(false);
  }, []);

  const openLibrary = useCallback((tab?: LibraryTab) => {
    setAtlasOpen(false);
    setAtlasEntryId(null);
    setLibraryTab(tab ?? 'lessons');
    setLibraryOpen(true);
  }, []);

  const closeLibrary = useCallback(() => {
    setLibraryOpen(false);
  }, []);

  const openLesson = useCallback(
    (id: LessonId) => {
      setAppMode('learn');
      setActiveLessonId(id);
      closeAllOverlays();
    },
    [closeAllOverlays],
  );

  const openChallenge = useCallback(
    (id: ChallengeId) => {
      setAppMode('challenge');
      setActiveChallengeId(id);
      closeAllOverlays();
    },
    [closeAllOverlays],
  );

  const openBridgeLesson = useCallback(
    (id: BridgeLessonId) => {
      setAppMode('bridge');
      setActiveBridgeLessonId(id);
      closeAllOverlays();
    },
    [closeAllOverlays],
  );

  const dismissOnboarding = useCallback(() => setOnboardingSeen(true), []);
  const showOnboarding = useCallback(() => {
    setAppMode('explore');
    setOnboardingSeen(false);
    closeAllOverlays();
  }, [closeAllOverlays]);

  /**
   * Level-1 reset. Puts the exploration surface back to a neutral state
   * (Explore mode, default knobs, no pair selection, all overlays closed,
   * active-item pointers back to the first-of-kind). Deliberately preserves:
   *
   *   • `locale` — the user's chosen language
   *   • `lessonStates` and `challengeStates` — revealed checkpoints stay
   *   • `onboardingSeen` — the start-here card stays dismissed
   *
   * The persist + URL-sync effect runs on the next render, rewriting the
   * `localStorage` snapshot and URL hash from the fresh values.
   */
  const handleCleanStart = useCallback(() => {
    setConfig(defaultDemoConfig);
    setAppMode('explore');
    setActiveLessonId(FIRST_LESSON_ID);
    setActiveChallengeId(FIRST_CHALLENGE_ID);
    setActiveBridgeLessonId(FIRST_BRIDGE_LESSON_ID);
    setSelectedEdgeId(null);
    closeAllOverlays();
  }, [closeAllOverlays]);

  /**
   * Level-2 reset. Everything Clean start does, *plus* wipe all progress:
   * lesson checkpoints, challenge answers, and the onboarding flag. Locale
   * is still preserved — language choice is not considered progress.
   *
   * The persist effect rewrites `localStorage` with the cleared snapshot on
   * the next render; an explicit `removeItem` is unnecessary but harmless
   * and defends against the rare case where the effect is interrupted.
   */
  const handleResetAllProgress = useCallback(() => {
    handleCleanStart();
    setLessonStates(initialLessonStates());
    setChallengeStates(initialChallengeStates());
    setOnboardingSeen(false);
  }, [handleCleanStart]);

  const glossaryValue = useMemo<GlossaryContextValue>(
    () => ({
      openEntry,
      openAtlas,
      closeAtlas,
      openLibrary,
      closeLibrary,
      openLesson,
      openChallenge,
      openBridgeLesson,
    }),
    [
      openEntry,
      openAtlas,
      closeAtlas,
      openLibrary,
      closeLibrary,
      openLesson,
      openChallenge,
      openBridgeLesson,
    ],
  );

  let footer;
  if (appMode === 'learn') {
    footer = (
      <LessonPanel
        activeLessonId={activeLessonId}
        onChangeLesson={setActiveLessonId}
        lessonStates={lessonStates}
        onLessonStateChange={handleLessonStateChange}
        onApplySetup={handleApplyLessonSetup}
      />
    );
  } else if (appMode === 'challenge') {
    footer = (
      <ChallengePanel
        activeChallengeId={activeChallengeId}
        onChangeChallenge={setActiveChallengeId}
        challengeStates={challengeStates}
        onChallengeStateChange={handleChallengeStateChange}
        onApplySetup={handleApplyChallengeSetup}
      />
    );
  } else if (appMode === 'bridge') {
    footer = (
      <BridgePanel
        activeBridgeLessonId={activeBridgeLessonId}
        onChangeBridgeLesson={setActiveBridgeLessonId}
        onApplySetup={handleApplyBridgeSetup}
      />
    );
  } else {
    footer = (
      <div className={styles.theoryGrid}>
        {!onboardingSeen && (
          <StartHereCard
            onStartLearn={() => {
              setAppMode('learn');
              setActiveLessonId(FIRST_LESSON_ID);
              setOnboardingSeen(true);
            }}
            onExplore={() => setOnboardingSeen(true)}
            onOpenAtlas={() => {
              setOnboardingSeen(true);
              openAtlas();
            }}
            onDismiss={dismissOnboarding}
          />
        )}
        <TheoryCard />
        <WhyThisMattersCard />
        <FamilyComparisonCard config={config} />
        <ObservableNotesCard config={config} />
      </div>
    );
  }

  return (
    <LanguageProvider
      locale={locale}
      setLocale={setLocale}
      toggleLocale={toggleLocale}
    >
      <GlossaryProvider value={glossaryValue}>
        <AppLayout
        header={
          <Header
            mode={appMode}
            onModeChange={setAppMode}
            topologyId={config.graphTopology}
            onShowOnboarding={showOnboarding}
          />
        }
        sidebar={
          <ControlPanel
            config={config}
            onConfigChange={setConfig}
            onCleanStart={handleCleanStart}
            onResetAllProgress={handleResetAllProgress}
          />
        }
        main={
          <VisualizationPanel
            config={config}
            selectedEdgeId={selectedEdgeId}
            onSelectedEdgeChange={setSelectedEdgeId}
          />
        }
        footer={footer}
      />
        <ConceptAtlasPanel
          open={atlasOpen}
          activeEntryId={atlasEntryId}
          onClose={closeAtlas}
          onSelectEntry={setAtlasEntryId}
        />
        <ContentLibraryPanel
          open={libraryOpen}
          activeTab={libraryTab}
          onClose={closeLibrary}
          onChangeTab={setLibraryTab}
        />
      </GlossaryProvider>
    </LanguageProvider>
  );
}
