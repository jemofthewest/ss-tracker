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
  description: 'Upper/Lower split — Volume Lower, Volume Upper, Recovery, Intensity',
  workoutRotation: ['volume_lower', 'volume_upper', 'recovery', 'intensity'],
  templates: [
    {
      variant: 'volume_lower',
      label: 'Volume Lower (Day 1)',
      exercises: [
        { exerciseName: 'squat', sets: 5, reps: 5, setType: 'work', intensityModifier: 0.9 },
        { exerciseName: 'deadlift', sets: 1, reps: 5, setType: 'work', intensityModifier: 0.9 },
      ],
    },
    {
      variant: 'volume_upper',
      label: 'Volume Upper (Day 2)',
      exercises: [
        { exerciseName: 'bench_press', sets: 5, reps: 5, setType: 'work', intensityModifier: 0.9 },
        { exerciseName: 'overhead_press', sets: 3, reps: 5, setType: 'work', intensityModifier: 0.9 },
        { exerciseName: 'barbell_row', sets: 3, reps: 5, setType: 'work', intensityModifier: 0.9 },
      ],
    },
    {
      variant: 'recovery',
      label: 'Recovery (Day 3)',
      exercises: [
        { exerciseName: 'squat', sets: 2, reps: 5, setType: 'work', intensityModifier: 0.8 },
        { exerciseName: 'overhead_press', sets: 3, reps: 5, setType: 'work', intensityModifier: 0.8 },
        { exerciseName: 'chin_ups', sets: 3, reps: 0, setType: 'work' },
        { exerciseName: 'back_extensions', sets: 3, reps: 10, setType: 'work' },
      ],
    },
    {
      variant: 'intensity',
      label: 'Intensity (Day 4)',
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
    barbell_row: { incrementPerSession: 5, stallThreshold: 3, resetPercentage: 0.1 },
  },
  warmupProtocol: 'starting_strength',
};
