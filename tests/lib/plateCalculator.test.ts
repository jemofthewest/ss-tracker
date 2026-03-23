import { describe, it, expect } from 'vitest';
import { calculatePlates, formatPlates } from '../../src/lib/plateCalculator';

describe('calculatePlates', () => {
  it('returns empty for bar weight or less', () => {
    const result = calculatePlates(45);
    expect(result.perSide).toEqual([]);
    expect(result.achievableWeight).toBe(45);
  });

  it('returns empty for weight less than bar', () => {
    const result = calculatePlates(30);
    expect(result.perSide).toEqual([]);
    expect(result.achievableWeight).toBe(45);
  });

  it('calculates 135 correctly (one 45 per side)', () => {
    const result = calculatePlates(135);
    expect(result.perSide).toEqual([{ plate: 45, count: 1 }]);
    expect(result.achievableWeight).toBe(135);
    expect(result.remainder).toBe(0);
  });

  it('calculates 225 correctly (two 45s per side)', () => {
    const result = calculatePlates(225);
    expect(result.perSide).toEqual([{ plate: 45, count: 2 }]);
    expect(result.achievableWeight).toBe(225);
  });

  it('calculates 185 correctly (45 + 25 per side)', () => {
    const result = calculatePlates(185);
    expect(result.perSide).toEqual([
      { plate: 45, count: 1 },
      { plate: 25, count: 1 },
    ]);
    expect(result.achievableWeight).toBe(185);
  });

  it('handles fractional plates (1.25)', () => {
    const result = calculatePlates(47.5);
    expect(result.perSide).toEqual([{ plate: 1.25, count: 1 }]);
    expect(result.achievableWeight).toBe(47.5);
  });

  it('handles mixed plates for 255', () => {
    const result = calculatePlates(255);
    expect(result.perSide).toEqual([
      { plate: 45, count: 2 },
      { plate: 10, count: 1 },
      { plate: 5, count: 1 },
    ]);
    expect(result.achievableWeight).toBe(255);
  });

  it('reports remainder for unachievable weight', () => {
    const result = calculatePlates(46, 45, [45, 25, 10, 5]);
    expect(result.remainder).toBeGreaterThan(0);
    expect(result.achievableWeight).toBeLessThan(46);
  });

  it('handles custom bar weight', () => {
    const result = calculatePlates(65, 35);
    // (65-35)/2 = 15 per side => 10 + 5
    expect(result.perSide).toEqual([
      { plate: 10, count: 1 },
      { plate: 5, count: 1 },
    ]);
  });
});

describe('formatPlates', () => {
  it('formats empty bar', () => {
    const breakdown = calculatePlates(45);
    expect(formatPlates(breakdown)).toBe('Empty bar');
  });

  it('formats single plate', () => {
    const breakdown = calculatePlates(135);
    expect(formatPlates(breakdown)).toBe('45');
  });

  it('formats multiple plates with counts', () => {
    const breakdown = calculatePlates(225);
    expect(formatPlates(breakdown)).toBe('45×2');
  });
});
