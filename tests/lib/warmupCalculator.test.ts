import { describe, it, expect } from 'vitest';
import { calculateWarmupSets, roundToNearest } from '../../src/lib/warmupCalculator';

describe('roundToNearest', () => {
  it('rounds to nearest 5 by default', () => {
    expect(roundToNearest(92)).toBe(90);
    expect(roundToNearest(93)).toBe(95);
    expect(roundToNearest(100)).toBe(100);
  });

  it('rounds to custom increment', () => {
    expect(roundToNearest(97, 2.5)).toBe(97.5);
  });
});

describe('calculateWarmupSets', () => {
  it('returns empty for bar weight or less', () => {
    expect(calculateWarmupSets(45)).toEqual([]);
    expect(calculateWarmupSets(40)).toEqual([]);
  });

  it('returns bar-only warmups for light weight', () => {
    const sets = calculateWarmupSets(60);
    expect(sets.length).toBe(2);
    expect(sets[0].prescribedWeight).toBe(45);
    expect(sets[0].prescribedReps).toBe(5);
    expect(sets[0].type).toBe('warmup');
  });

  it('generates appropriate warmups for 225', () => {
    const sets = calculateWarmupSets(225);
    // Should have 2 bar sets + 3 intermediate sets
    expect(sets.length).toBeGreaterThanOrEqual(4);
    expect(sets[0].prescribedWeight).toBe(45); // bar
    expect(sets[1].prescribedWeight).toBe(45); // bar

    // All warmup weights should be less than work weight
    for (const s of sets) {
      expect(s.prescribedWeight).toBeLessThan(225);
      expect(s.type).toBe('warmup');
    }

    // Weights should be ascending
    for (let i = 1; i < sets.length; i++) {
      expect(sets[i].prescribedWeight).toBeGreaterThanOrEqual(sets[i - 1].prescribedWeight);
    }
  });

  it('generates appropriate warmups for 315', () => {
    const sets = calculateWarmupSets(315);
    // Heavier weight should have more warmup sets
    expect(sets.length).toBeGreaterThanOrEqual(5);

    // Reps should decrease as weight increases (after bar sets)
    const afterBar = sets.filter((s) => s.prescribedWeight > 45);
    for (let i = 1; i < afterBar.length; i++) {
      expect(afterBar[i].prescribedReps).toBeLessThanOrEqual(afterBar[i - 1].prescribedReps);
    }
  });
});
