const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { pathToFileURL } = require('url');

// Validates every Three.js symbol used in hopper.js against the vendored ES module build.
// Run before and after upgrading lib/three.module.min.js to catch removed APIs.
const THREE_URL = pathToFileURL(path.resolve(__dirname, '../lib/three.module.min.js')).href;

const CONSTRUCTORS = [
  'BoxGeometry', 'PlaneGeometry', 'ShapeGeometry', 'ExtrudeGeometry',
  'MeshBasicMaterial', 'ShaderMaterial',
  'Mesh', 'Group', 'Scene',
  'PerspectiveCamera', 'WebGLRenderer',
  'AmbientLight', 'Color', 'Vector3',
  'Shape', 'Path',
];

const CONSTANTS = ['DoubleSide', 'FrontSide'];

test('Three.js — constructor symbols exist in vendored build', async () => {
  const THREE = await import(THREE_URL);
  for (const name of CONSTRUCTORS) {
    assert.strictEqual(
      typeof THREE[name], 'function',
      `THREE.${name} should be a constructor function`
    );
  }
});

test('Three.js — constant symbols exist in vendored build', async () => {
  const THREE = await import(THREE_URL);
  for (const name of CONSTANTS) {
    assert.notStrictEqual(THREE[name], undefined, `THREE.${name} should be defined`);
    assert.strictEqual(typeof THREE[name], 'number', `THREE.${name} should be a number`);
  }
});
