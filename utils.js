// utils.js — pure utility functions for algo-art-hopper

// Convert hexadecimal color to normalized RGB channels [0, 1]
function hexToNormalizedRGB(hex) {
  return {
    r: ((hex >> 16) & 255) / 255,
    g: ((hex >> 8) & 255) / 255,
    b: (hex & 255) / 255
  };
}

// computeBuildingLayout: returns an array of {x, height, width} objects for city buildings.
// count: number of buildings; rand: seeded PRNG function (e.g. mulberry32 instance).
// Height range 5–20, width range 1–5, spacing derived from count.
function computeBuildingLayout(count, rand) {
  const totalSpan = 31; // scene units, roughly -15.5 to +15.5
  const spacing = totalSpan / count;
  const buildings = [];
  for (let i = 0; i < count; i++) {
    buildings.push({
      height: rand() * 15 + 5,
      width: rand() * 4 + 1,
      x: (i * spacing) - totalSpan / 2 + spacing / 2
    });
  }
  return buildings;
}

// mulberry32: deterministic 32-bit PRNG seeded by a positive integer.
// Returns a factory function; each call to rand() produces a float in [0, 1).
// Same seed always produces the same sequence.
// Usage:
//   const rand = mulberry32(42);
//   rand(); // → 0.something, deterministic
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

if (typeof module !== 'undefined') {
  module.exports = { hexToNormalizedRGB, mulberry32, computeBuildingLayout };
}
