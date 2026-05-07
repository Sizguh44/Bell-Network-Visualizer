#!/usr/bin/env node
/**
 * validate-quantum-engine
 * -----------------------
 * Phase 9A — runtime self-test runner for the minimal quantum-
 * information engine at `src/features/quantum-engine/`.
 *
 * The repo has no test runner installed (no Vitest, no Jest), and
 * Phase 9A intentionally avoids adding one. Instead, this script uses
 * the already-installed `typescript` package (via its compiler API,
 * the same dependency `validate-i18n.mjs` uses) to compile the
 * engine + self-test to a temporary directory in CommonJS form, then
 * `require`s the compiled self-test so its top-level assertions run.
 * The temp dir is cleaned up on both success and failure.
 *
 * No new npm dependency. Runs in the same way as the other
 * `scripts/validate-*.mjs` files: `node scripts/validate-quantum-engine.mjs`.
 *
 * Exit codes:
 *   0  — all self-checks pass.
 *   1  — at least one self-check assertion failed.
 *   2  — TypeScript compilation failed or the script crashed before
 *        completing checks.
 */

import { createRequire } from 'node:module';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
/** @type {typeof import('typescript')} */
const ts = require('typescript');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const ENGINE_DIR = resolve(ROOT, 'src/features/quantum-engine');
const TMP_DIR = resolve(ROOT, '.tmp-quantum-engine');
const SELFTEST_OUT = resolve(TMP_DIR, 'quantumEngine.selftest.js');

/** Recursively collect every `.ts` file under `dir`. */
function collectTsFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectTsFiles(full));
    } else if (full.endsWith('.ts')) {
      out.push(full);
    }
  }
  return out;
}

function cleanup() {
  rmSync(TMP_DIR, { recursive: true, force: true });
}

function reportDiagnostics(diagnostics) {
  for (const d of diagnostics) {
    const message = ts.flattenDiagnosticMessageText(d.messageText, '\n');
    if (d.file && d.start !== undefined) {
      const { line, character } = d.file.getLineAndCharacterOfPosition(d.start);
      console.error(`  ${d.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      console.error(`  ${message}`);
    }
  }
}

try {
  cleanup();
  mkdirSync(TMP_DIR, { recursive: true });

  // Top-level `package.json` declares `"type": "module"`, which means
  // any `.js` file Node sees is loaded as ES module by default. Our
  // compiled output is CommonJS (`exports.foo = …`, `require(…)`), so
  // we write a tiny `package.json` into the temp dir that overrides
  // the inherited type to "commonjs". The override scope is just
  // `.tmp-quantum-engine/`; nothing else in the repo is affected.
  writeFileSync(
    resolve(TMP_DIR, 'package.json'),
    '{"type":"commonjs"}\n',
    'utf8',
  );

  // Compile only the engine sources. Use a self-contained set of
  // compiler options — we don't extend the project's `tsconfig.json`
  // because that one is bundler-mode (`noEmit: true`,
  // `moduleResolution: "bundler"`) and we need real `tsc` emit here.
  const sources = collectTsFiles(ENGINE_DIR);
  /** @type {import('typescript').CompilerOptions} */
  const compilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    outDir: TMP_DIR,
    rootDir: ENGINE_DIR,
    declaration: false,
    sourceMap: false,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
  };

  const program = ts.createProgram(sources, compilerOptions);
  const emitResult = program.emit();

  // Collect every diagnostic from the compile + emit pass.
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  if (allDiagnostics.length > 0) {
    console.error('validate-quantum-engine: TypeScript reported diagnostics:');
    reportDiagnostics(allDiagnostics);
    if (emitResult.emitSkipped) {
      throw new Error('TypeScript emit skipped due to compilation errors');
    }
    // Errors that are non-fatal at emit but still indicate a problem.
    const hasErrors = allDiagnostics.some(
      (d) => d.category === ts.DiagnosticCategory.Error,
    );
    if (hasErrors) {
      throw new Error('TypeScript compilation reported errors');
    }
  }

  // Run the compiled self-test. CommonJS `require` synchronously
  // executes the file's top-level statements, which is exactly the
  // selftest's "run all assertions" entry point. If any assertion
  // fails, the selftest calls `process.exit(1)` which terminates this
  // process with the same code — the validator's exit status is
  // therefore the selftest's exit status.
  console.log('validate-quantum-engine: running self-test...\n');
  require(SELFTEST_OUT);

  // If we reach here, the selftest's top-level code completed without
  // calling process.exit. Clean up and exit 0.
  cleanup();
  process.exit(0);
} catch (err) {
  cleanup();
  console.error('\nvalidate-quantum-engine: crashed before completing checks');
  console.error(`  ${err instanceof Error ? err.message : String(err)}`);
  process.exit(2);
}
