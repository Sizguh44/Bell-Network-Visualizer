#!/usr/bin/env node
/**
 * validate-ui-i18n
 * ----------------
 * Structural parity check between `src/i18n/ui/en.ts` and
 * `src/i18n/ui/tr.ts`. The TypeScript type system already pulls `UiStrings`
 * from `typeof EN` and declares `TR: UiStrings`, which catches *most* key
 * drift at compile time — but this script is defence in depth and also
 * guards things TS alone does not:
 *
 *   • a future refactor that drops the `: UiStrings` annotation
 *   • leaf-type parity (EN has a `(name) => string` where TR has a bare
 *     string literal, or vice versa)
 *   • array-length parity for bullet lists (`pairBullets`, etc.) — TS only
 *     sees them as `string[]`
 *
 * The script does NOT compare string values — translation quality stays a
 * human review. Only keys at every depth, classification of each leaf
 * (leaf / function / array / object), and array lengths are checked.
 *
 * Zero new dependencies: uses the already-installed `typescript` package
 * as an AST parser. No source code is executed.
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
/*  Shape extractor                                                    */
/* ------------------------------------------------------------------ */

/**
 * Walk an AST node and return a *shape tree*: object literals become
 * plain objects keyed the same way; array literals become
 * `{ __array: true, length, items }`; arrow / function expressions collapse
 * to the sentinel string `'function'`; anything else terminal becomes the
 * sentinel `'leaf'`. Parity can then be verified by walking the two trees
 * in lockstep without ever caring about the translated text itself.
 */
function shapeOf(node) {
  if (!node) return 'leaf';
  switch (node.kind) {
    case ts.SyntaxKind.ArrowFunction:
    case ts.SyntaxKind.FunctionExpression:
      return 'function';
    case ts.SyntaxKind.ArrayLiteralExpression:
      return {
        __array: true,
        length: node.elements.length,
        items: node.elements.map(shapeOf),
      };
    case ts.SyntaxKind.ObjectLiteralExpression: {
      const obj = {};
      for (const prop of node.properties) {
        if (prop.kind !== ts.SyntaxKind.PropertyAssignment) continue;
        let key;
        if (prop.name.kind === ts.SyntaxKind.Identifier) {
          key = prop.name.text;
        } else if (prop.name.kind === ts.SyntaxKind.StringLiteral) {
          key = prop.name.text;
        }
        if (key !== undefined) obj[key] = shapeOf(prop.initializer);
      }
      return obj;
    }
    case ts.SyntaxKind.AsExpression:
    case ts.SyntaxKind.TypeAssertionExpression:
    case ts.SyntaxKind.ParenthesizedExpression:
    case ts.SyntaxKind.SatisfiesExpression:
      return shapeOf(node.expression);
    default:
      // StringLiteral, NumericLiteral, TemplateExpression, Boolean, Null,
      // Identifier (e.g. references to imported constants) — all terminal.
      return 'leaf';
  }
}

/**
 * Find the first top-level `export const X = { … }` in a TypeScript source
 * file and return its shape tree.
 */
function extractUiShape(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const sf = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.ES2020,
    true,
  );
  let shape;
  function visit(node) {
    if (shape) return;
    if (
      ts.isVariableStatement(node) &&
      node.modifiers &&
      node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      for (const decl of node.declarationList.declarations) {
        if (!decl.initializer) continue;
        let target = decl.initializer;
        // Peel annotation/assertion wrappers like `{...} as UiStrings`.
        while (
          target.kind === ts.SyntaxKind.AsExpression ||
          target.kind === ts.SyntaxKind.SatisfiesExpression ||
          target.kind === ts.SyntaxKind.ParenthesizedExpression
        ) {
          target = target.expression;
        }
        if (ts.isObjectLiteralExpression(target)) {
          shape = shapeOf(target);
          return;
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  if (!shape) {
    throw new Error(`No exported object literal found in ${filePath}`);
  }
  return shape;
}

/* ------------------------------------------------------------------ */
/*  Shape comparator                                                   */
/* ------------------------------------------------------------------ */

/** Bucket the shape tree into one of four categories for comparison. */
function classify(value) {
  if (value === 'function') return 'function';
  if (value === 'leaf' || value === 'other') return 'leaf';
  if (value && typeof value === 'object') {
    if (value.__array) return 'array';
    return 'object';
  }
  return 'leaf';
}

const errors = [];
const fmtPath = (p) => (p === '' ? '<root>' : p);

function compareShape(en, tr, path) {
  const ca = classify(en);
  const cb = classify(tr);
  if (ca !== cb) {
    errors.push(
      `path=${fmtPath(path)} type differs — en=${ca} tr=${cb}`,
    );
    return;
  }
  if (ca === 'array') {
    if (en.length !== tr.length) {
      errors.push(
        `path=${fmtPath(path)} array length differs — en=${en.length} tr=${tr.length}`,
      );
      return;
    }
    for (let i = 0; i < en.length; i++) {
      compareShape(en.items[i], tr.items[i], `${path}[${i}]`);
    }
    return;
  }
  if (ca === 'object') {
    const enKeys = Object.keys(en).sort();
    const trKeys = Object.keys(tr).sort();
    for (const k of enKeys) {
      if (!(k in tr)) {
        errors.push(
          `path=${fmtPath(path)}.${k} missing in TR (present in EN)`,
        );
      }
    }
    for (const k of trKeys) {
      if (!(k in en)) {
        errors.push(
          `path=${fmtPath(path)}.${k} missing in EN (present in TR)`,
        );
      }
    }
    for (const k of enKeys) {
      if (k in tr) {
        compareShape(en[k], tr[k], path ? `${path}.${k}` : k);
      }
    }
    return;
  }
  // Both leaf or both function — identical class is enough; content is
  // deliberately not compared.
}

/* ------------------------------------------------------------------ */
/*  Run                                                                */
/* ------------------------------------------------------------------ */

function run() {
  const en = extractUiShape(resolve(ROOT, 'src/i18n/ui/en.ts'));
  const tr = extractUiShape(resolve(ROOT, 'src/i18n/ui/tr.ts'));
  compareShape(en, tr, '');

  if (errors.length > 0) {
    console.error('validate-ui-i18n: FAIL');
    for (const e of errors) console.error('  [ui] ' + e);
    console.error(
      `\n${errors.length} error${errors.length === 1 ? '' : 's'} found.`,
    );
    process.exit(1);
  }

  console.log('✔ ui-strings:    EN and TR trees match');
  console.log('\nvalidate-ui-i18n: UI string parity holds');
}

try {
  run();
} catch (err) {
  console.error('validate-ui-i18n: crashed before completing checks');
  console.error(
    '  ' + (err instanceof Error ? err.message : String(err)),
  );
  process.exit(2);
}
