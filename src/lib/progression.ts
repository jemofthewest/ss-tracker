import type { ExerciseName, ExerciseEntry, ProgressionRule } from '../types';
import { roundToNearest } from './warmupCalculator';

export function didCompleteExercise(entry: ExerciseEntry): boolean {
  const workSets = entry.sets.filter((s) => s.type === 'work');
  return workSets.length > 0 && workSets.every((s) => s.completed && s.actualReps !== null && s.actualReps >= s.prescribedReps);
}

export function getNextWeight(
  currentWeight: number,
  completed: boolean,
  failureCount: number,
  rule: ProgressionRule,
): { weight: number; failureCount: number; didReset: boolean } {
  if (completed) {
    return {
      weight: currentWeight + rule.incrementPerSession,
      failureCount: 0,
      didReset: false,
    };
  }

  const newFailureCount = failureCount + 1;

  if (newFailureCount >= rule.stallThreshold) {
    const resetWeight = roundToNearest(currentWeight * (1 - rule.resetPercentage));
    return {
      weight: resetWeight,
      failureCount: 0,
      didReset: true,
    };
  }

  return {
    weight: currentWeight,
    failureCount: newFailureCount,
    didReset: false,
  };
}

export function processWorkoutProgression(
  exercises: ExerciseEntry[],
  workingWeights: Record<string, number>,
  failureCounts: Record<string, number>,
  progressionRules: Partial<Record<ExerciseName, ProgressionRule>>,
): {
  workingWeights: Record<string, number>;
  failureCounts: Record<string, number>;
  resets: ExerciseName[];
} {
  const newWeights = { ...workingWeights };
  const newFailures = { ...failureCounts };
  const resets: ExerciseName[] = [];

  for (const entry of exercises) {
    const rule = progressionRules[entry.exerciseName];
    if (!rule) continue;

    const completed = didCompleteExercise(entry);
    const current = workingWeights[entry.exerciseName] ?? 45;
    const failures = failureCounts[entry.exerciseName] ?? 0;

    const result = getNextWeight(current, completed, failures, rule);
    newWeights[entry.exerciseName] = result.weight;
    newFailures[entry.exerciseName] = result.failureCount;
    if (result.didReset) resets.push(entry.exerciseName);
  }

  return { workingWeights: newWeights, failureCounts: newFailures, resets };
}
