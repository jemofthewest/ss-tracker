import type { ProgramDefinition } from '../types';

export const heavyLightMedium: ProgramDefinition = {
  id: 'hlm',
  name: 'Heavy-Light-Medium',
  description: 'Three training days with varied intensity — Heavy, Light (-20%), Medium (-10%)',
  workoutRotation: ['heavy', 'light', 'medium'],
  templates: [
    {
      variant: 'heavy',
      label: 'Heavy Day',
      exercises: [
        { exerciseName: 'squat', sets: 3, reps: 5, setType: 'work' },
        { exerciseName: 'bench_press', sets: 3, reps: 5, setType: 'work' },
        { exerciseName: 'deadlift', sets: 1, reps: 5, setType: 'work' },
      ],
    },
    {
      variant: 'light',
      label: 'Light Day',
      exercises: [
        { exerciseName: 'squat', sets: 3, reps: 5, setType: 'work', intensityModifier: 0.8 },
        { exerciseName: 'overhead_press', sets: 3, reps: 5, setType: 'work', intensityModifier: 0.8 },
        { exerciseName: 'back_extensions', sets: 3, reps: 10, setType: 'work' },
        { exerciseName: 'chin_ups', sets: 3, reps: 0, setType: 'work' },
      ],
    },
    {
      variant: 'medium',
      label: 'Medium Day',
      exercises: [
        { exerciseName: 'squat', sets: 3, reps: 5, setType: 'work', intensityModifier: 0.9 },
        { exerciseName: 'bench_press', sets: 3, reps: 5, setType: 'work', intensityModifier: 0.9 },
        { exerciseName: 'power_clean', sets: 5, reps: 3, setType: 'work' },
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
