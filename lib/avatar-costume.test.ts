import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_AVATAR_CONFIG,
  CARDIGAN_COLORWAYS,
  resolveCardiganPalette,
  countActiveLayers,
  buildCostumeManifest,
  darkenHex,
  lightenHex,
} from './avatar-costume';

test('CARDIGAN_COLORWAYS includes all 7 reference colorways', () => {
  assert.equal(CARDIGAN_COLORWAYS.length, 7);
  const topRow = CARDIGAN_COLORWAYS.filter((c) => c.row === 'top');
  const bottomRow = CARDIGAN_COLORWAYS.filter((c) => c.row === 'bottom');
  assert.equal(topRow.length, 3);
  assert.equal(bottomRow.length, 3);
});

test('resolveCardiganPalette returns preset colorway or custom hex', () => {
  const defaultPalette = resolveCardiganPalette(DEFAULT_AVATAR_CONFIG);
  assert.equal(defaultPalette.fill, '#A3B7D8');
  assert.equal(defaultPalette.name, 'Periwinkle Sky');

  const customPalette = resolveCardiganPalette({
    ...DEFAULT_AVATAR_CONFIG,
    customCardiganHex: '#D4A5C8',
  });
  assert.equal(customPalette.fill, '#D4A5C8');
  assert.ok(customPalette.name.includes('#D4A5C8'));
});

test('darkenHex and lightenHex produce valid 6-digit hex strings', () => {
  const darker = darkenHex('#A3B7D8', 0.2);
  const lighter = lightenHex('#A3B7D8', 0.2);
  assert.match(darker, /^#[0-9A-F]{6}$/);
  assert.match(lighter, /^#[0-9A-F]{6}$/);
  assert.notEqual(darker, '#A3B7D8');
  assert.notEqual(lighter, '#A3B7D8');
});

test('buildCostumeManifest calculates layer offsets for one-shoulder slouch', () => {
  const manifest = buildCostumeManifest(DEFAULT_AVATAR_CONFIG);
  assert.equal(manifest.activeLayerCount, 8);
  const rightSlouch = manifest.layers.find((l) => l.id === 'cardiganRightSlouch');
  assert.ok(rightSlouch);
  assert.deepEqual(rightSlouch.anchorOffset, {x: -14, y: 22});
});

test('countActiveLayers reflects visibility toggles accurately', () => {
  const modified = {
    ...DEFAULT_AVATAR_CONFIG,
    visibleLayers: {
      ...DEFAULT_AVATAR_CONFIG.visibleLayers,
      cardiganRightSlouch: false,
      cardiganLeftNeat: false,
    },
  };
  assert.equal(countActiveLayers(modified), 6);
});
