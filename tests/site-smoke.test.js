const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const index = read('index.html');
const projects = JSON.parse(read('projects.json'));

function localReferences(markup) {
  return [...markup.matchAll(/(?:src|href)="([^"#][^":]*)"/g)]
    .map((match) => match[1].split('?')[0])
    .filter((reference) => !reference.startsWith('data:') && !reference.includes('${'));
}

test('portfolio entry point contains required sections and contact routes', () => {
  for (const section of ['id="about"', 'id="skills"', 'id="projects"', 'id="achievements"', 'id="contact"']) {
    assert.match(index, new RegExp(section));
  }
  assert.match(index, /https:\/\/github\.com\/MohammadThabetHassan/);
  assert.match(index, /mailto:Mohammad_Thabet@hotmail\.com/);
});

test('portfolio project data has unique, reviewable repository records', () => {
  assert.ok(projects.length > 0);
  const names = new Set();
  for (const project of projects) {
    assert.equal(typeof project.name, 'string');
    assert.ok(project.name.length > 0);
    assert.equal(names.has(project.name), false, `duplicate project: ${project.name}`);
    names.add(project.name);
    assert.match(project.html_url, /^https:\/\/github\.com\/MohammadThabetHassan\//);
    assert.ok(Array.isArray(project.topics));
  }
});

test('local entry-point references resolve to repository files', () => {
  const missing = localReferences(index).filter((reference) => {
    if (reference.startsWith('http') || reference.startsWith('mailto:') || reference.startsWith('tel:')) return false;
    return !fs.existsSync(path.join(root, reference));
  });
  assert.deepEqual(missing, []);
});

test('security and contribution guidance are published', () => {
  assert.match(read('SECURITY.md'), /Responsible Disclosure|security/i);
  assert.match(read('CONTRIBUTING.md'), /Pull Request|pull request/i);
});
