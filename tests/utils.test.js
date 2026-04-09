const { test } = require('node:test');
const assert = require('node:assert/strict');
const { hexToNormalizedRGB, mulberry32, computeBuildingLayout } = require('../utils.js');

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
