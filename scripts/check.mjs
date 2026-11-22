import { readFile, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const data = require('../src/data.js');
const library = require('../src/library.js');
const distPath = join(root, 'dist/index.html');
const reportPath = join(root, 'dist/docs/architecture-review.html');

await access(distPath);
await access(reportPath);
const html = await readFile(distPath, 'utf8');

assert.equal(data.REVIEW_SUBJECTS.length, 5, 'catalog should keep five subjects');
assert.equal(data.ACHIEVEMENTS.length, 8, 'catalog should keep eight achievements');
assert.equal(data.REWARDS.length, 4, 'catalog should keep four reward items');
assert.equal(library.isReviewHtml('化学/必修一/全书合订本（完整版）.html'), true);
assert.equal(library.isReviewHtml('化学/必修一/原页总览.html'), false);

assert.match(html, /<meta name="viewport"/, 'mobile viewport metadata is required');
assert.match(html, /<title>知屿 · 暗夜学习营地<\/title>/, 'page title is missing');
assert.ok(html.includes('id="page-library"'), 'library page is missing');
assert.ok(html.includes('id="library-tree"'), 'hierarchical review tree is missing');
assert.ok(html.includes('id="library-subjects"'), 'subject-separated outline tabs are missing');
assert.ok(html.includes('id="graph-explorer"'), 'constellation graph is missing');
assert.ok(html.includes('id="graph-canvas"'), 'constellation graph canvas is missing');
assert.ok(html.includes('id="reader-frame"'), 'full-document reader is missing');
assert.ok(html.includes('id="reader-progress-fill"'), 'scroll progress meter is missing');
assert.ok(html.includes('id="hero-sprite"'), 'original character sprite is missing');
assert.ok(html.includes('id="chest-sprite"'), 'chest sprite is missing');
assert.ok(!/<script[^>]+src=/.test(html), 'dist must not load external scripts');
assert.ok(!/<link[^>]+rel="stylesheet"/.test(html), 'dist must not load external stylesheets');
assert.ok(!/https?:\/\//.test(html.replace('http://www.w3.org/2000/svg', '')), 'dist must remain fully offline');
assert.ok(html.includes('window.localStorage'), 'the storage adapter should remain explicit');

const kb = (Buffer.byteLength(html) / 1024).toFixed(1);
console.log(`Verified dist/index.html: ${kb} KB, full-library reader, offline, self-contained.`);
