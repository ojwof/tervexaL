// Tests for the shared tracking-ID module (BRAND_GUIDE §7). Run with `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TRACKING_ALPHABET,
  generateTrackingId,
  normalizeTrackingInput,
  isValidTrackingId,
  parsePieceLabel,
  parseTrackingInput,
  pieceLabel
} from '../src/shared/trackingId.ts';

test('alphabet is the 32 unambiguous characters', () => {
  assert.equal(TRACKING_ALPHABET, '23456789ABCDEFGHJKLMNPQRSTUVWXYZ');
  assert.equal(new Set(TRACKING_ALPHABET).size, 32);
  for (const c of '01OI') assert.ok(!TRACKING_ALPHABET.includes(c), `${c} must be excluded`);
});

test('generateTrackingId: TVX + 5 safe characters, 8 in total', () => {
  const seen = new Set<string>();
  const used = new Set<string>();
  for (let i = 0; i < 5000; i++) {
    const id = generateTrackingId();
    assert.equal(id.length, 8);
    assert.match(id, /^TVX[2-9A-HJ-NP-Z]{5}$/);
    assert.ok(isValidTrackingId(id));
    seen.add(id);
    for (const c of id.slice(3)) used.add(c);
  }
  // 5000 draws from 33.5M: a handful of collisions at most, and every character turns up.
  assert.ok(seen.size > 4990, `too many duplicates: ${5000 - seen.size}`);
  assert.equal(used.size, 32);
});

test('normalizeTrackingInput: trim, uppercase, strip spaces and dashes', () => {
  assert.equal(normalizeTrackingInput('tvx 7k2-m9'), 'TVX7K2M9');
  assert.equal(normalizeTrackingInput('  TVX7K2M9 \n'), 'TVX7K2M9');
  assert.equal(normalizeTrackingInput('t-v-x-7-k-2-m-9'), 'TVX7K2M9');
  const enDash = String.fromCharCode(0x2013); // pasted from a document
  assert.equal(normalizeTrackingInput(`TVX${enDash}7K2M9${enDash}01`), 'TVX7K2M9-01');
});

test('normalizeTrackingInput: keeps the -NN piece suffix on a full ID', () => {
  assert.equal(normalizeTrackingInput('tvx7k2m9-01'), 'TVX7K2M9-01');
  assert.equal(normalizeTrackingInput('tvx 7k2-m9 - 12'), 'TVX7K2M9-12');
  assert.equal(normalizeTrackingInput('TVX7K2M9--03'), 'TVX7K2M9-03');
  // Not a full ID before the dash, so the dash is just stripped.
  assert.equal(normalizeTrackingInput('TVX7K2-99'), 'TVX7K299');
});

test('isValidTrackingId: strict ^TVX[2-9A-HJ-NP-Z]{5}$', () => {
  for (const ok of ['TVX7K2M9', 'TVXQ4X8T', 'TVX22222', 'TVXZZZZZ']) assert.ok(isValidTrackingId(ok), ok);
  for (const bad of [
    '', 'TVX7K2M', 'TVX7K2M9X', 'tvx7k2m9', 'TVX7K2M0', 'TVX7K2MO', 'TVX7K2M1', 'TVX7K2MI',
    'ABC7K2M9', 'XYZ7K2M9', 'TVX 7K2M9', 'TVX7K2M9-01', 'RTO-TVX7K2M9', 'ABC-2026-ABCDEFGH'
  ]) assert.ok(!isValidTrackingId(bad), bad);
});

test('parsePieceLabel: TVXXXXXX-NN resolves to parent and piece number', () => {
  assert.deepEqual(parsePieceLabel('TVX7K2M9-01'), { parentId: 'TVX7K2M9', piece: 1 });
  assert.deepEqual(parsePieceLabel('tvx 7k2-m9-12'), { parentId: 'TVX7K2M9', piece: 12 });
  assert.deepEqual(parsePieceLabel('TVX7K2M902'), { parentId: 'TVX7K2M9', piece: 2 });
  assert.equal(parsePieceLabel('TVX7K2M9'), null);
  assert.equal(parsePieceLabel('TVX7K2M9-00'), null);
  assert.equal(parsePieceLabel('TVX7K2M9-1'), null);
  assert.equal(parsePieceLabel('TVX7K2M9-001'), null);
  assert.equal(parsePieceLabel('TVX7K2M9-PL01'), null);
  assert.equal(parsePieceLabel('TVX7K2M0-01'), null);
});

test('parseTrackingInput: IDs and child labels resolve to the 8-character parent', () => {
  assert.deepEqual(parseTrackingInput('tvx 7k2-m9'), { trackingId: 'TVX7K2M9' });
  assert.deepEqual(parseTrackingInput('TVX7K2M9-03'), { trackingId: 'TVX7K2M9', piece: 3 });
  assert.equal(parseTrackingInput('ABC-2026-ABCD1234'), null);
  assert.equal(parseTrackingInput('hello'), null);
  assert.equal(parseTrackingInput(''), null);
});

test('pieceLabel round-trips through parsePieceLabel', () => {
  const id = generateTrackingId();
  for (const n of [1, 2, 10, 99]) {
    const label = pieceLabel(id, n);
    assert.equal(label, `${id}-${String(n).padStart(2, '0')}`);
    assert.deepEqual(parsePieceLabel(label), { parentId: id, piece: n });
  }
});

test('generateTrackingId uses the random source it is given (server passes crypto.randomInt)', async () => {
  const picks: number[] = [];
  const id = generateTrackingId((max) => { assert.equal(max, 32); picks.push(max); return picks.length - 1; });
  assert.equal(id, 'TVX23456');
  assert.equal(picks.length, 5);
  const { randomInt } = await import('node:crypto');
  for (let i = 0; i < 1000; i++) assert.ok(isValidTrackingId(generateTrackingId((max) => randomInt(max))));
});
