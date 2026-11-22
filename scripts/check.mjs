import { readFile, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const data = require('../src/data.js');
const distPath = join(root, 'dist/index.html');
const reportPath = join(root, 'dist/docs/architecture-review.html');

await access(distPath);
await access(reportPath);
const html = await readFile(distPath, 'utf8');

assert.equal(data.cards.length, 30, 'catalog should keep 30 knowledge cards');
assert.equal(data.ACHIEVEMENTS.length, 8, 'catalog should keep 8 achievements');
assert.equal(data.REWARDS.length, 4, 'catalog should keep 4 reward items');
assert.equal(new Set(data.cards.map((card) => card.id)).size, data.cards.length, 'card ids must be unique');
assert.ok(data.cards.every((card) => card.title && card.core && card.pitfall), 'cards must carry their core learning content');

assert.match(html, /<meta name="viewport"/, 'mobile viewport metadata is required');
assert.match(html, /<title>知屿 · 暗夜学习营地<\/title>/, 'page title is missing');
assert.ok(html.includes('id="page-dashboard"'), 'dashboard page is missing');
assert.ok(html.includes('id="card-grid"'), 'knowledge grid is missing');
assert.ok(html.includes('id="achievement-grid"'), 'achievement grid is missing');
assert.ok(!/<script[^>]+src=/.test(html), 'dist must not load external scripts');
assert.ok(!/<link[^>]+rel="stylesheet"/.test(html), 'dist must not load external stylesheets');
assert.ok(!/https?:\/\//.test(html), 'dist must remain fully offline');
assert.ok(html.includes('window.localStorage'), 'the storage adapter should remain explicit');

const kb = (Buffer.byteLength(html) / 1024).toFixed(1);
console.log(`Verified dist/index.html: ${kb} KB, 30 cards, offline, self-contained.`);
