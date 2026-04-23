import type {
  GraphTopologyId,
  ObservableMode,
  StateFamily,
} from '../types/graph';
import type { AppMode, LessonId } from '../types/learning';
import type { ChallengeId } from '../types/challenge';
import type { BridgeLessonId } from '../types/bridge';
import { LOCALES, type Locale } from '../i18n/types';

/**
 * The URL-sharable slice of app state. All fields are optional so a partial
 * hash (e.g. "#mode=learn") still works — the caller merges each present
 * field in its usual precedence order.
 *
 * Schema example:
 *   #mode=learn&lesson=topology-upgrade&topology=cycle4&family=frustrated&strength=0.70&lens=uniformity&edge=c23
 */
export interface UrlState {
  lang?: Locale;
  mode?: AppMode;
  topology?: GraphTopologyId;
  family?: StateFamily;
  strength?: number;
  lens?: ObservableMode;
  edge?: string;
  lesson?: LessonId;
  challenge?: ChallengeId;
  bridge?: BridgeLessonId;
}

const APP_MODES: readonly AppMode[] = ['explore', 'learn', 'challenge', 'bridge'];
const TOPOLOGIES: readonly GraphTopologyId[] = ['dipole', 'cycle4'];
const FAMILIES: readonly StateFamily[] = [
  'uncorrelated',
  'weakAligned',
  'bellSymmetric',
  'frustrated',
  'edgeBiased',
];
const LENSES: readonly ObservableMode[] = [
  'alignment',
  'mismatch',
  'gluing',
  'correlation',
  'uniformity',
];

function pickMember<T extends string>(
  value: string | null,
  allowed: readonly T[],
): T | undefined {
  if (!value) return undefined;
  return (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

function pickStrength(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  if (n < 0 || n > 1) return undefined;
  return n;
}

/**
 * Parse a URL hash like `#mode=learn&topology=cycle4` into a typed partial
 * state. Unknown or invalid values are dropped (not coerced), so a malformed
 * URL degrades gracefully to "no opinion" rather than breaking the app.
 *
 * Content ids (lesson / challenge / bridge) are intentionally **not**
 * validated against the id unions here — we pass the raw string through and
 * let the caller check against its own lookup tables.
 */
export function parseUrlHash(hash: string): UrlState {
  if (!hash || hash.length < 2) return {};
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(raw);

  const out: UrlState = {};

  const lang = pickMember(params.get('lang'), LOCALES);
  if (lang) out.lang = lang;

  const mode = pickMember(params.get('mode'), APP_MODES);
  if (mode) out.mode = mode;

  const topology = pickMember(params.get('topology'), TOPOLOGIES);
  if (topology) out.topology = topology;

  const family = pickMember(params.get('family'), FAMILIES);
  if (family) out.family = family;

  const strength = pickStrength(params.get('strength'));
  if (strength !== undefined) out.strength = strength;

  const lens = pickMember(params.get('lens'), LENSES);
  if (lens) out.lens = lens;

  const edge = params.get('edge');
  if (edge) out.edge = edge;

  const lesson = params.get('lesson');
  if (lesson) out.lesson = lesson as LessonId;

  const challenge = params.get('challenge');
  if (challenge) out.challenge = challenge as ChallengeId;

  const bridge = params.get('bridge');
  if (bridge) out.bridge = bridge as BridgeLessonId;

  return out;
}

/**
 * Build a hash fragment (no leading `#`) from the state slice. Omits any
 * undefined or redundant fields so the URL stays as short as possible —
 * e.g. lesson id is only included when mode is `'learn'`.
 */
export function encodeUrlHash(state: UrlState): string {
  const params = new URLSearchParams();

  if (state.lang) params.set('lang', state.lang);
  if (state.mode) params.set('mode', state.mode);
  if (state.topology) params.set('topology', state.topology);
  if (state.family) params.set('family', state.family);
  if (state.strength !== undefined) {
    params.set('strength', state.strength.toFixed(2));
  }
  if (state.lens) params.set('lens', state.lens);
  if (state.edge) params.set('edge', state.edge);

  // Include the active content id only for its own mode, to keep the URL
  // specific to what the user is currently looking at.
  if (state.mode === 'learn' && state.lesson) params.set('lesson', state.lesson);
  if (state.mode === 'challenge' && state.challenge) {
    params.set('challenge', state.challenge);
  }
  if (state.mode === 'bridge' && state.bridge) params.set('bridge', state.bridge);

  return params.toString();
}

/**
 * Replace (not push) the current URL hash. History entries are not created,
 * so the browser back button still leaves the app.
 */
export function writeUrlHash(hash: string): void {
  if (typeof window === 'undefined') return;
  const next = hash ? `#${hash}` : window.location.pathname + window.location.search;
  try {
    window.history.replaceState(null, '', next);
  } catch {
    // No-op — some embedded contexts block history writes.
  }
}
