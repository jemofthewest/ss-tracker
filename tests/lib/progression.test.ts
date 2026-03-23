import { describe, it, expect } from 'vitest';
import { didCompleteExercise, getNextWeight, processWorkoutProgression } from '../../src/lib/progression';
import type { ExerciseEntry, ExerciseSet } from '../../src/types';

function makeSet(overrides: Partial<ExerciseSet> = {}): ExerciseSet {
  return {
    id: '1',
    type: 'work',
    prescribedWeight: 200,
    prescribedReps: 5,
    actualWeight: null,
    actualReps: null,
    completed: false,
    ...overrides,
  };
}

function makeExercise(sets: ExerciseSet[]): ExerciseEntry {
  return { id: '1', exerciseName: 'squat', sets, notes: '' };
}

describe('didCompleteExercise', () => {
  it('returns true when all work sets completed with prescribed reps', () => {
    const ex = makeExercise([
      makeSet({ completed: true, actualReps: 5 }),
      makeSet({ completed: true, actualReps: 5 }),
      makeSet({ completed: true, actualReps: 5 }),
    ]);
    expect(didCompleteExercise(ex)).toBe(true);
  });

  it('returns true when actual reps exceed prescribed', () => {
    const ex = makeExercise([
      makeSet({ completed: true, actualReps: 6 }),
    ]);
    expect(didCompleteExercise(ex)).toBe(true);
  });

  it('returns false when a set has fewer reps', () => {
    const ex = makeExercise([
      makeSet({ completed: true, actualReps: 5 }),
      makeSet({ completed: true, actualReps: 3 }),
      makeSet({ completed: true, actualReps: 5 }),
    ]);
    expect(didCompleteExercise(ex)).toBe(false);
  });

  it('returns false when a set is not completed', () => {
    const ex = makeExercise([
      makeSet({ completed: true, actualReps: 5 }),
      makeSet({ completed: false }),
    ]);
    expect(didCompleteExercise(ex)).toBe(false);
  });

  it('ignores warmup sets', () => {
    const ex = makeExercise([
      makeSet({ type: 'warmup', completed: false }),
      makeSet({ completed: true, actualReps: 5 }),
    ]);
    expect(didCompleteExercise(ex)).toBe(true);
  });
});

describe('getNextWeight', () => {
  const rule = { incrementPerSession: 5, stallThreshold: 3, resetPercentage: 0.1 };

  it('increments weight on success', () => {
    const result = getNextWeight(200, true, 0, rule);
    expect(result.weight).toBe(205);
    expect(result.failureCount).toBe(0);
    expect(result.didReset).toBe(false);
  });

  it('keeps weight on first failure', () => {
    const result = getNextWeight(200, false, 0, rule);
    expect(result.weight).toBe(200);
    expect(result.failureCount).toBe(1);
    expect(result.didReset).toBe(false);
  });

  it('resets after reaching stall threshold', () => {
    const result = getNextWeight(200, false, 2, rule);
    expect(result.weight).toBe(180); // 200 * 0.9 = 180
    expect(result.failureCount).toBe(0);
    expect(result.didReset).toBe(true);
  });

  it('resets to nearest 5', () => {
    const result = getNextWeight(215, false, 2, rule);
    // 215 * 0.9 = 193.5 → rounds to 195
    expect(result.weight).toBe(195);
  });
});

describe('processWorkoutProgression', () => {
  const rules = {
    squat: { incrementPerSession: 5, stallThreshold: 3, resetPercentage: 0.1 },
    bench_press: { incrementPerSession: 2.5, stallThreshold: 3, resetPercentage: 0.1 },
  };

  it('increments weights for completed exercises', () => {
    const exercises: ExerciseEntry[] = [
      {
        id: '1',
        exerciseName: 'squat',
        notes: '',
        sets: [
          makeSet({ completed: true, actualReps: 5 }),
          makeSet({ completed: true, actualReps: 5 }),
          makeSet({ completed: true, actualReps: 5 }),
        ],
      },
    ];
    const result = processWorkoutProgression(
      exercises,
      { squat: 200 },
      {},
      rules,
    );
    expect(result.workingWeights.squat).toBe(205);
    expect(result.resets).toEqual([]);
  });

  it('tracks failures and resets when threshold is reached', () => {
    const exercises: ExerciseEntry[] = [
      {
        id: '1',
        exerciseName: 'squat',
        notes: '',
        sets: [makeSet({ completed: true, actualReps: 3 })],
      },
    ];
    const result = processWorkoutProgression(
      exercises,
      { squat: 200 },
      { squat: 2 },
      rules,
    );
    expect(result.workingWeights.squat).toBe(180);
    expect(result.resets).toEqual(['squat']);
  });
});
