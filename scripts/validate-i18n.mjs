#!/usr/bin/env node
/**
 * validate-i18n
 * -------------
 * A lightweight structural linter for the EN/TR content pairs under
 * `src/data/{en,tr}/`. It checks that authored translations do not drift
 * from the canonical English structure — same ids in the same order, same
 * cross-link arrays, same prev/next chains, same checkpoint option shapes,
 * etc. User-visible text (`title`, `narrative`, `feedback`, …) is deliberately
 * NOT compared; this script is about structural integrity, not translation
 * quality.
 *
 * Zero runtime dependencies: parses the TypeScript sources directly via the
 * already-installed `typescript` compiler API. Run via:
 *
 *     npm run validate:i18n
 *
 * Exit codes:
 *   0 — every paired array matches structurally
 *   1 — at least one mismatch (each one listed on stderr)
 */

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const require = createRequire(import.meta.url);
/** @type {typeof import('typescript')} */
const ts = require('typescript');

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/* ------------------------------------------------------------------ */
/*  AST value extractor                                                */
/*                                                                     */
/*  Walks an object / array literal and turns it into a plain JS value */
/*  the validator can deep-equal. Unsupported kinds become sentinels   */
/*  (strings like "<ident:x>") so they are visible in diff output but  */
/*  still comparable.                                                  */
/* ------------------------------------------------------------------ */

function literalValue(node) {
  if (!node) return undefined;
  switch (node.kind) {
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
      return node.text;
    case ts.SyntaxKind.NumericLiteral:
      return Number(node.text);
    case ts.SyntaxKind.TrueKeyword:
      return true;
    case ts.SyntaxKind.FalseKeyword:
      return false;
    case ts.SyntaxKind.NullKeyword:
      return null;
    case ts.SyntaxKind.PrefixUnaryExpression: {
      const inner = literalValue(node.operand);
      if (
        node.operator === ts.SyntaxKind.MinusToken &&
        typeof inner === 'number'
      ) {
        return -inner;
      }
      return inner;
    }
    case ts.SyntaxKind.ArrayLiteralExpression:
      return node.elements.map(literalValue);
    case ts.SyntaxKind.ObjectLiteralExpression: {
      const out = {};
      for (const prop of node.properties) {
        if (prop.kind !== ts.SyntaxKind.PropertyAssignment) continue;
        let key;
        if (prop.name.kind === ts.SyntaxKind.Identifier) {
          key = prop.name.text;
        } else if (prop.name.kind === ts.SyntaxKind.StringLiteral) {
          key = prop.name.text;
        }
        if (key !== undefined) out[key] = literalValue(prop.initializer);
      }
      return out;
    }
    case ts.SyntaxKind.AsExpression:
    case ts.SyntaxKind.TypeAssertionExpression:
    case ts.SyntaxKind.ParenthesizedExpression:
    case ts.SyntaxKind.SatisfiesExpression:
      return literalValue(node.expression);
    case ts.SyntaxKind.Identifier:
      return node.text === 'undefined' ? undefined : `<ident:${node.text}>`;
    default:
      return `<kind:${ts.SyntaxKind[node.kind] ?? node.kind}>`;
  }
}

/**
 * Locate the first top-level exported `const X = [...]` in a source file
 * and return the extracted array elements as plain JS values.
 */
function extractExportedArray(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const sf = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.ES2020,
    true,
  );
  let result;
  function visit(node) {
    if (result) return;
    if (
      ts.isVariableStatement(node) &&
      node.modifiers &&
      node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      for (const decl of node.declarationList.declarations) {
        if (decl.initializer) {
          const init =
            decl.initializer.kind === ts.SyntaxKind.AsExpression
              ? decl.initializer.expression
              : decl.initializer;
          if (ts.isArrayLiteralExpression(init)) {
            result = init.elements.map(literalValue);
            return;
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  if (!result) {
    throw new Error(`No exported array literal found in ${filePath}`);
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  Deep equality                                                      */
/* ------------------------------------------------------------------ */

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === 'object') {
    const ka = Object.keys(a).sort();
    const kb = Object.keys(b).sort();
    if (ka.length !== kb.length) return false;
    for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return false;
    for (const k of ka) if (!deepEqual(a[k], b[k])) return false;
    return true;
  }
  return false;
}

/**
 * Render a value for error output, truncated so large configs do not
 * flood the log. Arrays and objects collapse to a one-line JSON snippet.
 */
function preview(value) {
  const MAX = 80;
  let rendered;
  try {
    rendered = JSON.stringify(value);
  } catch {
    rendered = String(value);
  }
  if (rendered === undefined) rendered = 'undefined';
  return rendered.length > MAX ? rendered.slice(0, MAX - 1) + '…' : rendered;
}

/* ------------------------------------------------------------------ */
/*  Checks                                                             */
/* ------------------------------------------------------------------ */

const errors = [];
const recordError = (kind, msg) => errors.push(`[${kind}] ${msg}`);

/**
 * Core check runner. For each paired entry it verifies that every field in
 * `structuralFields` is deep-equal across the two locales and that each
 * `nestedArrayFields` entry's per-item structural sub-fields match too.
 *
 * @param {string} kind                           - content kind name (lessons, …)
 * @param {Array<object>} enArr                   - english entries
 * @param {Array<object>} trArr                   - turkish entries
 * @param {string} idKey                          - primary id property
 * @param {string[]} structuralFields             - top-level fields to compare
 * @param {Array<{field:string,fields:string[]}>} nestedArrayFields - per-item sub-checks
 */
function checkArrayShape(
  kind,
  enArr,
  trArr,
  idKey,
  structuralFields,
  nestedArrayFields = [],
) {
  if (enArr.length !== trArr.length) {
    recordError(
      kind,
      `length mismatch: en=${enArr.length} tr=${trArr.length}`,
    );
    return;
  }
  for (let i = 0; i < enArr.length; i++) {
    const en = enArr[i];
    const tr = trArr[i];
    const enId = en?.[idKey];
    const trId = tr?.[idKey];
    if (enId !== trId) {
      recordError(
        kind,
        `index ${i}: ${idKey} differs — en=${String(enId)} tr=${String(trId)}`,
      );
      continue;
    }
    const id = enId;
    for (const f of structuralFields) {
      if (!deepEqual(en[f], tr[f])) {
        recordError(
          kind,
          `id=${id} field=${f} differs\n      en: ${preview(en[f])}\n      tr: ${preview(tr[f])}`,
        );
      }
    }
    for (const nested of nestedArrayFields) {
      const eA = Array.isArray(en[nested.field]) ? en[nested.field] : [];
      const tA = Array.isArray(tr[nested.field]) ? tr[nested.field] : [];
      if (eA.length !== tA.length) {
        recordError(
          kind,
          `id=${id} ${nested.field}.length differs — en=${eA.length} tr=${tA.length}`,
        );
        continue;
      }
      for (let j = 0; j < eA.length; j++) {
        for (const f of nested.fields) {
          if (!deepEqual(eA[j]?.[f], tA[j]?.[f])) {
            recordError(
              kind,
              `id=${id} ${nested.field}[${j}].${f} differs — en=${preview(eA[j]?.[f])} tr=${preview(tA[j]?.[f])}`,
            );
          }
        }
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Run                                                                */
/* ------------------------------------------------------------------ */

function load(relPath) {
  return extractExportedArray(resolve(ROOT, relPath));
}

function run() {
  const lessonsEn = load('src/data/en/lessons.ts');
  const lessonsTr = load('src/data/tr/lessons.ts');
  const challengesEn = load('src/data/en/challenges.ts');
  const challengesTr = load('src/data/tr/challenges.ts');
  const bridgesEn = load('src/data/en/bridgeLessons.ts');
  const bridgesTr = load('src/data/tr/bridgeLessons.ts');
  const glossaryEn = load('src/data/en/glossary.ts');
  const glossaryTr = load('src/data/tr/glossary.ts');

  checkArrayShape(
    'lessons',
    lessonsEn,
    lessonsTr,
    'id',
    [
      'order',
      'conceptTags',
      'recommendedConfig',
      'recommendedSelection',
      'prevLessonId',
      'nextLessonId',
    ],
    [{ field: 'checkpointOptions', fields: ['id', 'correct'] }],
  );

  checkArrayShape(
    'challenges',
    challengesEn,
    challengesTr,
    'id',
    [
      'order',
      'difficulty',
      'type',
      'setupConfig',
      'setupSelection',
      'relatedConceptIds',
      'relatedLessonIds',
      'prevChallengeId',
      'nextChallengeId',
    ],
    [{ field: 'answerOptions', fields: ['id', 'correct'] }],
  );

  checkArrayShape(
    'bridgeLessons',
    bridgesEn,
    bridgesTr,
    'id',
    [
      'order',
      'widget',
      'relatedConceptIds',
      'relatedLessonIds',
      'suggestedChallengeIds',
      'optionalSetupConfig',
      'prevBridgeLessonId',
      'nextBridgeLessonId',
    ],
  );

  checkArrayShape(
    'glossary',
    glossaryEn,
    glossaryTr,
    'id',
    [
      'relatedConceptIds',
      'suggestedLessonIds',
      'suggestedChallengeIds',
      'suggestedBridgeLessonIds',
    ],
  );

  // Soft structural check on glossary `tags`: presence must match, but the
  // tag strings themselves may differ by locale (the EN entry tags English
  // keywords, the TR entry may tag Turkish keywords).
  for (let i = 0; i < glossaryEn.length; i++) {
    const en = glossaryEn[i];
    const tr = glossaryTr[i];
    if (!en || !tr || en.id !== tr.id) continue;
    const enHas = Array.isArray(en.tags);
    const trHas = Array.isArray(tr.tags);
    if (enHas !== trHas) {
      recordError(
        'glossary',
        `id=${en.id} tags presence differs — en=${enHas} tr=${trHas}`,
      );
    }
  }

  if (errors.length > 0) {
    console.error('validate-i18n: FAIL');
    for (const e of errors) console.error('  ' + e);
    console.error(
      `\n${errors.length} error${errors.length === 1 ? '' : 's'} found.`,
    );
    process.exit(1);
  }

  const pad = (s) => s.padEnd(14);
  console.log(`✔ ${pad('lessons:')} ${lessonsEn.length} entries, structure matches`);
  console.log(`✔ ${pad('challenges:')} ${challengesEn.length} entries, structure matches`);
  console.log(`✔ ${pad('bridgeLessons:')} ${bridgesEn.length} entries, structure matches`);
  console.log(`✔ ${pad('glossary:')} ${glossaryEn.length} entries, structure matches`);
  console.log('\nvalidate-i18n: all locale structures match');
}

try {
  run();
} catch (err) {
  console.error('validate-i18n: crashed before completing checks');
  console.error('  ' + (err instanceof Error ? err.message : String(err)));
  process.exit(2);
}
