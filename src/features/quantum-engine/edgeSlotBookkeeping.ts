/**
 * Mega Phase 9E-4 — edge-slot bookkeeping for Bell-network graphs.
 *
 * Pure TypeScript. No React, no DOM, no i18n. No new npm dependency.
 *
 * What this module provides:
 *
 *   • `canonicaliseEdgeSlots(graph)` — turns a `BellNetworkGraph`
 *     (Phase 9E-2 contract) into a deterministic slot-level
 *     bookkeeping record. Each node's slots are listed in the same
 *     incident-edge order Phase 9E-2 / 9E-3 already use
 *     (`incidentEdgesForNode` filters `graph.edges` in-order); each
 *     edge gets its source-endpoint slot index and target-endpoint
 *     slot index resolved against the corresponding node's slot list.
 *
 *   • `BellNetworkSlotBookkeeping` — the bundled result type.
 *
 * Why this exists:
 *
 *   The Phase 9E-4 projected Bell-network state construction needs
 *   to know **which slot of which node** each edge endpoint
 *   contracts on. The Phase 9E-2 graph contract carries enough
 *   information to derive this (a node's spin tuple is the spins of
 *   its incident edges in `graph.edges` order — that fixes the
 *   per-node slot ordering), but the resolution step is non-trivial
 *   when parallel edges are present (the dipole has 4 edges all
 *   between `n0` and `n1`, so the slot assignment must distinguish
 *   them by edge id, not by endpoint pair). This module makes the
 *   resolution deterministic and reusable.
 *
 * **Honesty discipline (Mega Phase 9E-4).**
 *
 *   • Edge `source` / `target` remain **bookkeeping only** — no
 *     physical orientation. The Phase 9E-4 link-singlet builder uses
 *     them to fix a sign convention for the embedding
 *     `(|source ↑⟩|target ↓⟩ − |source ↓⟩|target ↑⟩) / √2`, but the
 *     resulting projected state is invariant under swapping
 *     `source ↔ target` up to a global sign that drops out of every
 *     observable.
 *
 *   • The slot ordering `incidentEdgesForNode(graph, nodeId)` returns
 *     edges in `graph.edges` order. This **matches** Phase 9E-2's
 *     per-node intertwiner `spinsForNode` ordering and Phase 9E-3's
 *     `summarizeBellNetworkGraph` `incidentEdgeIds` field — so the
 *     slot index of an edge endpoint at a node IS the position of
 *     that edge in the `incidentEdgeIds` array surfaced in the
 *     Bell-network sandbox UI.
 *
 *   • Parallel edges are handled correctly: the dipole's four
 *     parallel edges each get a distinct slot pair `(slot, slot)`
 *     mapping `0→0, 1→1, 2→2, 3→3` under the canonical ordering.
 */

import {
  incidentEdgesForNode,
  validateBellNetworkGraph,
  type BellNetworkEdgeId,
  type BellNetworkGraph,
  type BellNetworkNodeId,
} from './bellNetworkGraph';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** One node's canonical slot list — incident edge ids in
 *  `graph.edges` order. Slot `k` of node `nodeId` corresponds to
 *  `incidentEdgeIds[k]`. */
export interface NodeSlotAssignment {
  nodeId: BellNetworkNodeId;
  incidentEdgeIds: BellNetworkEdgeId[];
}

/** A reference to one endpoint slot in the global slot layout — the
 *  node id plus the local slot index inside that node. */
export interface EdgeEndpointSlot {
  nodeId: BellNetworkNodeId;
  /** Local slot index inside the node (0-based, into the node's
   *  `incidentEdgeIds` list). */
  slotIndex: number;
}

/** Per-edge slot assignment. The Phase 9E-4 link-singlet builder
 *  uses `source` / `target` to fix the singlet's sign convention. */
export interface EdgeSlotAssignment {
  edgeId: BellNetworkEdgeId;
  source: EdgeEndpointSlot;
  target: EdgeEndpointSlot;
  spin: number;
}

/** Bundled bookkeeping: per-node slot lists + per-edge slot
 *  assignments. */
export interface BellNetworkSlotBookkeeping {
  nodeSlots: NodeSlotAssignment[];
  edgeSlots: EdgeSlotAssignment[];
}

/* ------------------------------------------------------------------ */
/*  Canonicalisation                                                   */
/* ------------------------------------------------------------------ */

/**
 * Turn a `BellNetworkGraph` into deterministic slot-level bookkeeping.
 *
 * Algorithm:
 *   1. `validateBellNetworkGraph(graph)` — structural contract check.
 *   2. For each node in `graph.nodes` order, compute its slot list as
 *      the incident edge ids in `graph.edges` order (this is what
 *      `incidentEdgesForNode` already returns; we only extract the
 *      ids).
 *   3. For each edge in `graph.edges` order, resolve its
 *      `source.slotIndex` as the position of `edge.id` in
 *      `nodeSlots[edge.source].incidentEdgeIds`, and similarly for
 *      `target.slotIndex`. Both lookups must succeed because every
 *      edge appears in both endpoints' incident lists by definition;
 *      a missing entry would indicate a bug in `incidentEdgesForNode`
 *      itself, so we throw with an explicit message rather than
 *      returning a half-resolved record.
 *
 * The resulting `BellNetworkSlotBookkeeping` is canonical for any
 * given graph — two callers passing graphs with the same `nodes` /
 * `edges` arrays (in the same order) get byte-identical output.
 * Reordering the graph's `nodes` or `edges` arrays will produce a
 * different (but still canonical) bookkeeping; the Phase 9E-4
 * projected state's *meaning* is invariant under any graph
 * automorphism, but its *ket components* depend on this canonical
 * choice.
 */
export function canonicaliseEdgeSlots(
  graph: BellNetworkGraph,
): BellNetworkSlotBookkeeping {
  validateBellNetworkGraph(graph);

  // 1. Node slot lists.
  const nodeSlots: NodeSlotAssignment[] = [];
  // Map node id → its incidentEdgeIds for fast slot-index lookup.
  const nodeSlotsById = new Map<BellNetworkNodeId, BellNetworkEdgeId[]>();
  for (const node of graph.nodes) {
    const incidentEdgeIds = incidentEdgesForNode(graph, node.id).map(
      (e) => e.id,
    );
    nodeSlots.push({ nodeId: node.id, incidentEdgeIds });
    nodeSlotsById.set(node.id, incidentEdgeIds);
  }

  // 2. Edge slot assignments.
  const edgeSlots: EdgeSlotAssignment[] = [];
  for (const edge of graph.edges) {
    const sourceList = nodeSlotsById.get(edge.source);
    const targetList = nodeSlotsById.get(edge.target);
    if (!sourceList || !targetList) {
      throw new Error(
        `canonicaliseEdgeSlots: edge ${JSON.stringify(edge.id)} references ` +
          `unknown endpoint (this indicates an upstream validation gap)`,
      );
    }
    const sourceSlot = sourceList.indexOf(edge.id);
    const targetSlot = targetList.indexOf(edge.id);
    if (sourceSlot < 0 || targetSlot < 0) {
      throw new Error(
        `canonicaliseEdgeSlots: edge ${JSON.stringify(edge.id)} not found in ` +
          `incident lists (source=${sourceSlot}, target=${targetSlot}) — ` +
          `this indicates a bug in incidentEdgesForNode`,
      );
    }
    edgeSlots.push({
      edgeId: edge.id,
      source: { nodeId: edge.source, slotIndex: sourceSlot },
      target: { nodeId: edge.target, slotIndex: targetSlot },
      spin: edge.spin,
    });
  }

  return { nodeSlots, edgeSlots };
}
