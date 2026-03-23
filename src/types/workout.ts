import type { ExerciseEntry } from './exercise';

export type WorkoutVariant =
  | 'A' | 'B'
  | 'volume' | 'recovery' | 'intensity'
  | 'volume_lower' | 'volume_upper'
  | 'heavy' | 'light' | 'medium';

export interface WorkoutSession {
  id: string;
  programId: string;
  variant: WorkoutVariant;
  date: string;
  startedAt: string;
  completedAt: string | null;
  exercises: ExerciseEntry[];
  notes: string;
  bodyweight: number | null;
}
