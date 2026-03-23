import type { ProgramDefinition } from '../types';

export const texasMethod3Day: ProgramDefinition = {
  id: 'tm_3day',
  name: 'Texas Method (3-Day)',
  description: 'Volume / Recovery / Intensity — 3 days per week',
  workoutRotation: ['volume', 'recovery', 'intensity'],
  templates: [
    {
      variant: 'volume',
      label: 'Volume Day (Monday)',
      exercises: [
        { exerciseName: 'squat', sets: 5, reps: 5, setType: 'work', intensityModifier: 0.9 },
        { exerciseName: 'bench_press', sets: 5, reps: 5, setType: 'work', intensityModifier: 0.9 },
        { exerciseName: 'deadlift', sets: 1, reps: 5, setType: 'work', intensityModifier: 0.9 },
      ],
    },
    {
      variant: 'recovery',
      label: 'Recovery Day (Wednesday)',
      exercises: [
        { exerciseName: 'squat', sets: 2, reps: 5, setType: 'work', intensityModifier: 0.8 },
        { exerciseName: 'overhead_press', sets: 3, reps: 5, setType: 'work', intensityModifier: 0.9 },
        { exerciseName: 'chin_ups', sets: 3, reps: 0, setType: 'work' },
        { exerciseName: 'back_extensions', sets: 3, reps: 10, setType: 'work' },
      ],
    },
    {
      variant: 'intensity',
      label: 'Intensity Day (Friday)',
      exercises: [
        { exerciseName: 'squat', sets: 1, reps: 5, setType: 'work' },
        { exerciseName: 'bench_press', sets: 1, reps: 5, setType: 'work' },
        { exerciseName: 'deadlift', sets: 1, reps: 5, setType: 'work' },
      ],
    },
  ],
  progressionRules: {
    squat: { incrementPerSession: 5, stallThreshold: 3, resetPercentage: 0.1 },
    bench_press: { incrementPerSession: 2.5, stallThreshold: 3, resetPercentage: 0.1 },
    deadlift: { incrementPerSession: 5, stallThreshold: 3, resetPercentage: 0.1 },
    overhead_press: { incrementPerSession: 2.5, stallThreshold: 3, resetPercentage: 0.1 },
  },
  warmupProtocol: 'starting_strength',
};

export const texasMethod4Day: ProgramDefinition = {
  id: 'tm_4day',
  name: 'Texas Method (4-Day)',
  description: 'Intensity/Volume split — each day pairs an intensity lift with a volume lift',
  workoutRotation: ['A', 'B', 'volume_lower', 'volume_upper'],
  templates: [
    {
      variant: 'A',
      label: 'Day 1 — Intensity Squat / Volume Cleans',
      exercises: [
        { exerciseName: 'squat', sets: 1, reps: 5, setType: 'work' },
        { exerciseName: 'power_clean', sets: 5, reps: 3, setType: 'work', intensityModifier: 0.9 },
      ],
    },
    {
      variant: 'B',
      label: 'Day 2 — Intensity Bench / Volume Press',
      exercises: [
        { exerciseName: 'bench_press', sets: 1, reps: 5, setType: 'work' },
        { exerciseName: 'overhead_press', sets: 5, reps: 5, setType: 'work', intensityModifier: 0.9 },
      ],
    },
    {
      variant: 'volume_lower',
      label: 'Day 3 — Intensity Deadlift / Volume Squat',
      exercises: [
        { exerciseName: 'deadlift', sets: 1, reps: 5, setType: 'work' },
        { exerciseName: 'squat', sets: 5, reps: 5, setType: 'work', intensityModifier: 0.9 },
      ],
    },
    {
      variant: 'volume_upper',
      label: 'Day 4 — Intensity Press / Volume Bench',
      exercises: [
        { exerciseName: 'overhead_press', sets: 1, reps: 5, setType: 'work' },
        { exerciseName: 'bench_press', sets: 5, reps: 5, setType: 'work', intensityModifier: 0.9 },
      ],
    },
  ],
  progressionRules: {
    squat: { incrementPerSession: 5, stallThreshold: 3, resetPercentage: 0.1 },
    bench_press: { incrementPerSession: 2.5, stallThreshold: 3, resetPercentage: 0.1 },
    deadlift: { incrementPerSession: 5, stallThreshold: 3, resetPercentage: 0.1 },
    overhead_press: { incrementPerSession: 2.5, stallThreshold: 3, resetPercentage: 0.1 },
    power_clean: { incrementPerSession: 5, stallThreshold: 3, resetPercentage: 0.1 },
  },
  warmupProtocol: 'starting_strength',
};
