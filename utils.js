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

// ─── CompositionEngine interface ─────────────────────────────────────────────
// Three-slot contract for Computational Art History series entries.
// Each sibling sketch supplies its own palettes and layoutFn; the seed/PRNG/
// selection scaffold is shared via createComposition().

/**
 * @typedef {Object} PalettePreset
 * @property {string}   name    - Identifier (e.g. 'nighthawks'), typically a painting title in snake_case
 * @property {number[]} tones   - Five hex integers, light → dark, for room/scene surfaces
 * @property {number[]} sky     - Two hex integers: [horizon, zenith]
 * @property {number}   curtain - Hex integer for the curtain/drape color
 */

/**
 * @typedef {function(rand: function(): number): Object[]} LayoutFn
 * Generates domain-specific scene geometry descriptors from a seeded rand stream.
 * Must consume rand calls in a fixed, deterministic order to preserve seed reproducibility.
 * Example: computeBuildingLayout is the LayoutFn for algo-art-hopper.
 */

/**
 * @typedef {Object} CompositionResult
 * @property {function(): number} rand    - Seeded PRNG advanced past palette selection and layout
 * @property {PalettePreset}      palette - Palette selected for this seed
 * @property {Object[]}           layout  - Geometry descriptors returned by layoutFn
 */

/**
 * @typedef {Object} CompositionEngine
 * @property {PalettePreset[]} palettes  - Domain-specific palette presets
 * @property {LayoutFn}        layoutFn  - Scene layout generator consuming rand in fixed order
 * @property {function(t: number, mouseInfluence: number): {x: number, y: number, z: number}} [cameraFn]
 *   Optional — not yet wired into createComposition. Document your camera grammar here
 *   for series consistency across entries.
 */

/**
 * Creates a seeded composition: initializes PRNG, selects a palette, and generates layout.
 * The returned rand is advanced past palette selection and layout — continue calling it
 * for additional per-load parameters (curtain opacity, pane count, etc.).
 *
 * Usage in a sibling sketch:
 *   const { rand, palette, layout } = createComposition(SEED, MY_PALETTES, myLayoutFn);
 *
 * @param {number}         seed     - Integer seed (from URL hash or Math.random)
 * @param {PalettePreset[]} palettes - Domain-specific palette array (4 presets recommended)
 * @param {LayoutFn}        layoutFn - Layout generator that consumes rand
 * @returns {CompositionResult}
 */
function createComposition(seed, palettes, layoutFn) {
  const rand = mulberry32(seed);
  const palette = palettes[Math.floor(rand() * palettes.length)];
  const layout = layoutFn(rand);
  return { rand, palette, layout };
}

if (typeof module !== 'undefined') {
  module.exports = { hexToNormalizedRGB, mulberry32, computeBuildingLayout, createComposition };
}
