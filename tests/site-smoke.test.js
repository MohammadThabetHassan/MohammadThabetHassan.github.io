'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const index = read('index.html');
const app = read('js/app.js');
const certs = JSON.parse(read('certs.json'));

function localReferences(markup) {
  return [...markup.matchAll(/(?:src|href)="([^"#][^"]*)"/g)]
    .map((m) => m[1].split('?')[0])
    .filter((ref) => !/^(https?:|mailto:|tel:|data:)/.test(ref));
}

test('required sections exist and the navigation points at them', () => {
  const ids = ['about', 'skills', 'projects', 'publications', 'achievements', 'certifications', 'contact'];
  for (const id of ids) assert.match(index, new RegExp(`id="${id}"`), `missing section #${id}`);
  const nav = index.match(/<ul class="nav-links">[\s\S]*?<\/ul>/)[0];
  for (const id of ids.filter((s) => s !== 'skills' || true)) {
    assert.match(nav, new RegExp(`href="#${id}"`), `navigation has no link to #${id}`);
  }
});

test('contact details are present and consistent', () => {
  assert.match(index, /mailto:Mohammad_Thabet@hotmail\.com/);
  assert.match(index, /tel:\+971585880343/);
  assert.match(index, /\+971&nbsp;58&nbsp;588&nbsp;0343/);
  assert.match(index, /https:\/\/github\.com\/MohammadThabetHassan/);
  assert.match(index, /https:\/\/www\.linkedin\.com\/in\/mohammadthabet\//);
  assert.doesNotMatch(index, /558 8763/, 'old phone number must not appear');
  assert.doesNotMatch(index, /Internship/, 'stale availability text');
});

test('every local reference in index.html resolves to a file', () => {
  const missing = localReferences(index).filter((ref) => !fs.existsSync(path.join(root, ref)));
  assert.deepEqual(missing, []);
});

test('every local reference in 404.html resolves to a file', () => {
  const missing = localReferences(read('404.html'))
    .map((ref) => ref.replace(/^\//, ''))
    .filter((ref) => ref && !fs.existsSync(path.join(root, ref)));
  assert.deepEqual(missing, []);
});

test('every project has a real cover image in the repository', () => {
  const images = [...app.matchAll(/image:'(img\/projects\/[^']+)'/g)].map((m) => m[1]);
  assert.ok(images.length >= 8, `only ${images.length} project images found`);
  const missing = images.filter((ref) => !fs.existsSync(path.join(root, ref)));
  assert.deepEqual(missing, []);
  for (const m of app.matchAll(/(code|demo|paper|pypi):'([^']+)'/g)) {
    assert.match(m[2], /^https:\/\//, `project link must be https: ${m[2]}`);
  }
});

test('certs.json is complete and every image and link is usable', () => {
  assert.ok(certs.badges.length >= 5);
  assert.ok(certs.certifications.length >= 18);
  for (const b of certs.badges) {
    assert.ok(b.name && b.image && b.url, `badge incomplete: ${JSON.stringify(b)}`);
    assert.ok(fs.existsSync(path.join(root, b.image)), `missing badge image ${b.image}`);
    assert.match(b.url, /^https:\/\/www\.credly\.com\//);
  }
  for (const c of certs.certifications) {
    assert.ok(c.name && c.issuer && c.image && c.category, `certificate incomplete: ${JSON.stringify(c)}`);
    assert.ok(fs.existsSync(path.join(root, c.image)), `missing certificate image ${c.image}`);
    if (c.verify) assert.match(c.verify, /^https:\/\//);
    assert.ok(['cybersecurity', 'ai', 'programming', 'data'].includes(c.category), `unknown category ${c.category}`);
  }
});

test('the CV is a real PDF, not a placeholder', () => {
  const buf = fs.readFileSync(path.join(root, 'cv.pdf'));
  assert.equal(buf.subarray(0, 5).toString(), '%PDF-');
  assert.ok(buf.length > 20000, `cv.pdf is only ${buf.length} bytes`);
});

test('external links use https and open safely', () => {
  assert.doesNotMatch(index, /href="http:\/\//, 'plain http link found');
  for (const m of index.matchAll(/<a [^>]*target="_blank"[^>]*>/g)) {
    assert.match(m[0], /rel="noopener/, `missing rel=noopener on ${m[0]}`);
  }
});

test('static images carry alt text and dimensions', () => {
  for (const m of index.matchAll(/<img [^>]*>/g)) {
    assert.match(m[0], /\balt="/, `missing alt on ${m[0]}`);
    assert.match(m[0], /\bwidth="\d+"/, `missing width on ${m[0]}`);
    assert.match(m[0], /\bheight="\d+"/, `missing height on ${m[0]}`);
  }
});

test('publication DOIs are linked', () => {
  for (const doi of ['10.1109/ICAMAC67779.2025.11398683', '10.1109/SM69703.2026.11614145', '10.1109/SM69703.2026.11614128']) {
    assert.match(index, new RegExp(`https://doi\\.org/${doi.replace(/\./g, '\\.')}`));
  }
});

test('security and contribution guidance are published', () => {
  assert.match(read('SECURITY.md'), /report/i);
  assert.match(read('CONTRIBUTING.md'), /pull request/i);
});
