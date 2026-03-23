import type { ProgramDefinition } from '../types';

export const startingStrengthNLP: ProgramDefinition = {
  id: 'ss_nlp',
  name: 'Starting Strength NLP',
  description: 'Novice Linear Progression — alternating A/B workouts, 3 days per week',
  workoutRotation: ['A', 'B'],
  templates: [
    {
      variant: 'A',
      label: 'Workout A',
      exercises: [
        { exerciseName: 'squat', sets: 3, reps: 5, setType: 'work' },
        { exerciseName: 'bench_press', sets: 3, reps: 5, setType: 'work' },
        { exerciseName: 'deadlift', sets: 1, reps: 5, setType: 'work' },
      ],
    },
    {
      variant: 'B',
      label: 'Workout B',
      exercises: [
        { exerciseName: 'squat', sets: 3, reps: 5, setType: 'work' },
        { exerciseName: 'overhead_press', sets: 3, reps: 5, setType: 'work' },
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
