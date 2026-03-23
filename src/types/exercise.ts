export type ExerciseName =
  | 'squat'
  | 'bench_press'
  | 'deadlift'
  | 'overhead_press'
  | 'power_clean'
  | 'barbell_row'
  | 'chin_ups'
  | 'back_extensions';

export const EXERCISE_LABELS: Record<ExerciseName, string> = {
  squat: 'Squat',
  bench_press: 'Bench Press',
  deadlift: 'Deadlift',
  overhead_press: 'Overhead Press',
  power_clean: 'Power Clean',
  barbell_row: 'Barbell Row',
  chin_ups: 'Chin-ups',
  back_extensions: 'Back Extensions',
};

export type SetType = 'warmup' | 'work' | 'backoff' | 'rampup';

export interface ExerciseSet {
  id: string;
  type: SetType;
  prescribedWeight: number;
  prescribedReps: number;
  actualWeight: number | null;
  actualReps: number | null;
  completed: boolean;
}

export interface ExerciseEntry {
  id: string;
  exerciseName: ExerciseName;
  sets: ExerciseSet[];
  notes: string;
}
