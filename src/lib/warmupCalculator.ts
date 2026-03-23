import type { ExerciseSet } from '../types';
import { v4 as uuid } from 'uuid';

export function roundToNearest(weight: number, increment: number = 5): number {
  return Math.round(weight / increment) * increment;
}

export function calculateWarmupSets(
  workWeight: number,
  barWeight: number = 45,
): ExerciseSet[] {
  if (workWeight <= barWeight) return [];

  const sets: ExerciseSet[] = [];

  // Set 1: Empty bar × 5 × 2
  sets.push(makeWarmupSet(barWeight, 5));
  sets.push(makeWarmupSet(barWeight, 5));

  const range = workWeight - barWeight;

  if (range <= 20) {
    // Very light work weight — just bar warmups are enough
    return sets;
  }

  // Calculate intermediate jumps
  // Target ~3-4 warmup sets between bar and work weight
  const jumps: { pct: number; reps: number }[] = [];

  if (range <= 90) {
    jumps.push({ pct: 0.5, reps: 5 });
    jumps.push({ pct: 0.75, reps: 3 });
  } else if (range <= 180) {
    jumps.push({ pct: 0.4, reps: 5 });
    jumps.push({ pct: 0.6, reps: 3 });
    jumps.push({ pct: 0.8, reps: 2 });
  } else {
    jumps.push({ pct: 0.3, reps: 5 });
    jumps.push({ pct: 0.5, reps: 3 });
    jumps.push({ pct: 0.7, reps: 2 });
    jumps.push({ pct: 0.85, reps: 1 });
  }

  for (const jump of jumps) {
    const weight = roundToNearest(barWeight + range * jump.pct);
    if (weight > barWeight && weight < workWeight) {
      sets.push(makeWarmupSet(weight, jump.reps));
    }
  }

  return sets;
}

function makeWarmupSet(weight: number, reps: number): ExerciseSet {
  return {
    id: uuid(),
    type: 'warmup',
    prescribedWeight: weight,
    prescribedReps: reps,
    actualWeight: null,
    actualReps: null,
    completed: false,
  };
}
