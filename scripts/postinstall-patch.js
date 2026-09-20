/**
 * postinstall-patch.js
 *
 * Nuxt 2.13 loads `nuxt.config.ts` (and any .js/.mjs module) through the
 * abandoned `esm` package, which crashes on Node >= 21.4 (OpenSSL/Node
 * internals changed). This patch switches @nuxt/config's module loader over
 * to `jiti`, which has the exact same interface (`jiti(filename)` returns a
 * require-like function) and is already shipped as a transitive dependency.
 *
 * The patch is idempotent and safe to re-run.
 */
const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  '@nuxt',
  'config',
  'dist',
  'config.js'
);

if (!fs.existsSync(target)) {
  console.warn('[postinstall-patch] @nuxt/config not found, skipping esm→jiti patch.');
  process.exit(0);
}

let source = fs.readFileSync(target, 'utf8');
let changed = false;

const replaceOnce = (from, to) => {
  if (source.includes(from)) {
    source = source.replace(from, to);
    changed = true;
    return true;
  }
  return false;
};

// 1. Top-level import: stop requiring the broken `esm` package entirely.
if (replaceOnce(
  "const esm = _interopDefault(require('esm'));",
  "const jiti = _interopDefault(require('jiti'));"
)) {
  console.log('[postinstall-patch] replaced top-level `esm` import with `jiti`.');
}

// 2. Default `createRequire` in loadNuxtConfig (non-Jest path).
if (replaceOnce(
  'createRequire = module => isJest ? _createRequire(module.filename) : esm(module)',
  'createRequire = module => isJest ? _createRequire(module.filename) : jiti(module.filename)'
)) {
  console.log('[postinstall-patch] loadNuxtConfig default createRequire → jiti.');
}

// 3. The normalization step defaults `createRequire` to 'esm'; point it at 'jiti'.
if (replaceOnce(
  "options.createRequire = isJest ? false : 'esm';",
  "options.createRequire = isJest ? false : 'jiti';"
)) {
  console.log('[postinstall-patch] getNuxtConfig default createRequire → jiti.');
}

// 4. Even if something still requests the 'esm' strategy, honour it with jiti.
if (replaceOnce(
  "if (options.createRequire === 'esm') {\n    const esm = require('esm');\n    options.createRequire = module => esm(module);",
  "if (options.createRequire === 'esm') {\n    const jiti = require('jiti');\n    options.createRequire = module => jiti(module.filename);"
)) {
  console.log('[postinstall-patch] createRequire==="esm" branch → jiti.');
}

if (changed) {
  fs.writeFileSync(target, source);
  console.log('[postinstall-patch] @nuxt/config patched to use jiti.');
} else {
  console.log('[postinstall-patch] @nuxt/config already patched, nothing to do.');
}
