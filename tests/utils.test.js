const { test } = require('node:test');
const assert = require('node:assert/strict');
const { hexToNormalizedRGB, mulberry32, computeBuildingLayout, createComposition } = require('../utils.js');

// hexToNormalizedRGB
test('hexToNormalizedRGB — pure red', () => {
  const result = hexToNormalizedRGB(0xFF0000);
  assert.strictEqual(result.r, 1);
  assert.strictEqual(result.g, 0);
  assert.strictEqual(result.b, 0);
});

test('hexToNormalizedRGB — black', () => {
  const result = hexToNormalizedRGB(0x000000);
  assert.strictEqual(result.r, 0);
  assert.strictEqual(result.g, 0);
  assert.strictEqual(result.b, 0);
});

test('hexToNormalizedRGB — white', () => {
  const result = hexToNormalizedRGB(0xFFFFFF);
  assert.strictEqual(result.r, 1);
  assert.strictEqual(result.g, 1);
  assert.strictEqual(result.b, 1);
});

// mulberry32
test('mulberry32 — same seed produces identical sequence', () => {
  const rand1 = mulberry32(42);
  const rand2 = mulberry32(42);
  for (let i = 0; i < 10; i++) {
    assert.strictEqual(rand1(), rand2());
  }
});

test('mulberry32 — different seeds produce different first values', () => {
  const v1 = mulberry32(1)();
  const v2 = mulberry32(2)();
  assert.notStrictEqual(v1, v2);
});

test('mulberry32 — output is in [0, 1)', () => {
  const rand = mulberry32(99);
  for (let i = 0; i < 100; i++) {
    const v = rand();
    assert.ok(v >= 0 && v < 1, `Expected value in [0, 1), got ${v}`);
  }
});

// computeBuildingLayout
test('computeBuildingLayout — returns array of correct length', () => {
  const buildings = computeBuildingLayout(8, mulberry32(1));
  assert.strictEqual(buildings.length, 8);
});

test('computeBuildingLayout — height in [5, 20)', () => {
  const buildings = computeBuildingLayout(20, mulberry32(7));
  for (const b of buildings) {
    assert.ok(b.height >= 5 && b.height < 20, `height ${b.height} out of range`);
  }
});

test('computeBuildingLayout — width in [1, 5)', () => {
  const buildings = computeBuildingLayout(20, mulberry32(7));
  for (const b of buildings) {
    assert.ok(b.width >= 1 && b.width < 5, `width ${b.width} out of range`);
  }
});

test('computeBuildingLayout — x values are evenly spaced', () => {
  const count = 5;
  const buildings = computeBuildingLayout(count, mulberry32(3));
  const expectedSpacing = 31 / count;
  for (let i = 1; i < buildings.length; i++) {
    const gap = buildings[i].x - buildings[i - 1].x;
    assert.ok(
      Math.abs(gap - expectedSpacing) < 1e-10,
      `x spacing at index ${i} was ${gap}, expected ${expectedSpacing}`
    );
  }
});

test('computeBuildingLayout — deterministic with same seed', () => {
  const layout1 = computeBuildingLayout(6, mulberry32(42));
  const layout2 = computeBuildingLayout(6, mulberry32(42));
  for (let i = 0; i < layout1.length; i++) {
    assert.strictEqual(layout1[i].height, layout2[i].height);
    assert.strictEqual(layout1[i].width, layout2[i].width);
    assert.strictEqual(layout1[i].x, layout2[i].x);
  }
});

// createComposition
const STUB_PALETTES = [
  { name: 'a', tones: [0xff0000], sky: [0, 0], curtain: 0 },
  { name: 'b', tones: [0x00ff00], sky: [0, 0], curtain: 0 },
  { name: 'c', tones: [0x0000ff], sky: [0, 0], curtain: 0 },
  { name: 'd', tones: [0xffffff], sky: [0, 0], curtain: 0 },
];

test('createComposition — same seed produces identical palette and layout', () => {
  const layoutFn = (rand) => [{ x: rand() }];
  const r1 = createComposition(42, STUB_PALETTES, layoutFn);
  const r2 = createComposition(42, STUB_PALETTES, layoutFn);
  assert.strictEqual(r1.palette.name, r2.palette.name);
  assert.strictEqual(r1.layout[0].x, r2.layout[0].x);
});

test('createComposition — different seeds select different palettes across a range', () => {
  const layoutFn = () => [];
  const names = new Set();
  for (let seed = 1; seed <= 20; seed++) {
    names.add(createComposition(seed, STUB_PALETTES, layoutFn).palette.name);
  }
  assert.ok(names.size > 1, `Expected multiple palettes across 20 seeds, got: ${[...names].join(', ')}`);
});

test('createComposition — layoutFn receives rand advanced past palette selection', () => {
  let firstRandInLayout;
  const layoutFn = (rand) => { firstRandInLayout = rand(); return []; };
  createComposition(42, STUB_PALETTES, layoutFn);

  const verifyRand = mulberry32(42);
  verifyRand(); // palette selection consumes first call
  assert.strictEqual(firstRandInLayout, verifyRand());
});

test('createComposition — returned rand continues deterministically past layout', () => {
  const layoutFn = (rand) => { rand(); return []; }; // consumes one rand call
  const { rand } = createComposition(42, STUB_PALETTES, layoutFn);

  const verifyRand = mulberry32(42);
  verifyRand(); // palette selection
  verifyRand(); // layout fn
  // both streams are now in sync
  assert.strictEqual(rand(), verifyRand());
  assert.strictEqual(rand(), verifyRand());
});
