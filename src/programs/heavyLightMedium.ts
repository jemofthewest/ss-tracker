import type { ProgramDefinition } from '../types';

export const heavyLightMedium: ProgramDefinition = {
  id: 'hlm',
  name: 'Heavy-Light-Medium',
  description: 'Varied intensity and exercises — Heavy, Light (-20%), Medium (-10%). Pulls rotate: Deadlift / RDL / SLDL',
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
        { exerciseName: 'overhead_press', sets: 3, reps: 5, setType: 'work' },
        { exerciseName: 'rdl', sets: 3, reps: 8, setType: 'work' },
      ],
    },
    {
      variant: 'medium',
      label: 'Medium Day',
      exercises: [
        { exerciseName: 'squat', sets: 3, reps: 5, setType: 'work', intensityModifier: 0.9 },
        { exerciseName: 'bench_press', sets: 3, reps: 5, setType: 'work', intensityModifier: 0.9 },
        { exerciseName: 'sldl', sets: 3, reps: 5, setType: 'work' },
      ],
    },
  ],
  progressionRules: {
    squat: { incrementPerSession: 5, stallThreshold: 3, resetPercentage: 0.1 },
    bench_press: { incrementPerSession: 2.5, stallThreshold: 3, resetPercentage: 0.1 },
    deadlift: { incrementPerSession: 5, stallThreshold: 3, resetPercentage: 0.1 },
    overhead_press: { incrementPerSession: 2.5, stallThreshold: 3, resetPercentage: 0.1 },
    rdl: { incrementPerSession: 5, stallThreshold: 3, resetPercentage: 0.1 },
    sldl: { incrementPerSession: 5, stallThreshold: 3, resetPercentage: 0.1 },
  },
  warmupProtocol: 'starting_strength',
};
