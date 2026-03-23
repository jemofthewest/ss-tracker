import type { ExerciseName, SetType } from './exercise';
import type { WorkoutVariant } from './workout';

export interface ProgressionRule {
  incrementPerSession: number;
  stallThreshold: number;
  resetPercentage: number;
}

export interface ExercisePrescription {
  exerciseName: ExerciseName;
  sets: number;
  reps: number;
  setType: SetType;
  intensityModifier?: number;
}

export interface WorkoutTemplate {
  variant: WorkoutVariant;
  label: string;
  exercises: ExercisePrescription[];
}

export interface ProgramDefinition {
  id: string;
  name: string;
  description: string;
  workoutRotation: WorkoutVariant[];
  templates: WorkoutTemplate[];
  progressionRules: Partial<Record<ExerciseName, ProgressionRule>>;
  warmupProtocol: 'starting_strength';
}
