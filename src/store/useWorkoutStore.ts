import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type {
  ExerciseName,
  ExerciseSet,
  ExerciseEntry,
  WorkoutSession,
  WorkoutVariant,
  ProgramDefinition,
} from '../types';
import { getProgramById } from '../programs';
import { roundToNearest } from '../lib/warmupCalculator';
import { processWorkoutProgression } from '../lib/progression';

export interface AppSettings {
  barWeight: number;
  availablePlates: number[];
  restTimerSeconds: number;
}

export interface AppState {
  activeProgramId: string;
  workingWeights: Record<string, number>;
  failureCounts: Record<string, number>;
  sessions: WorkoutSession[];
  activeSession: WorkoutSession | null;
  settings: AppSettings;
}

interface Actions {
  startWorkout: () => void;
  completeSet: (exerciseId: string, setId: string, actualWeight?: number, actualReps?: number) => void;
  uncompleteSet: (exerciseId: string, setId: string) => void;
  finishWorkout: () => { resets: ExerciseName[] };
  abandonWorkout: () => void;
  setWorkingWeight: (exercise: ExerciseName, weight: number) => void;
  changeProgram: (programId: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateExerciseWeight: (exerciseId: string, newWeight: number, alsoUpdateWorkingWeight: boolean) => void;
  addExerciseNote: (exerciseId: string, note: string) => void;
  addSessionNote: (note: string) => void;
  deleteSession: (sessionId: string) => void;
  importData: (data: Partial<AppState>) => void;
  getExportData: () => AppState;
}

const DEFAULT_SETTINGS: AppSettings = {
  barWeight: 45,
  availablePlates: [45, 35, 25, 10, 5, 2.5, 1.25],
  restTimerSeconds: 180,
};

const DEFAULT_WEIGHTS: Record<string, number> = {
  squat: 45,
  bench_press: 45,
  deadlift: 45,
  overhead_press: 45,
  power_clean: 45,
  barbell_row: 45,
};

function generateSession(
  program: ProgramDefinition,
  variant: WorkoutVariant,
  workingWeights: Record<string, number>,
): WorkoutSession {
  const template = program.templates.find((t) => t.variant === variant);
  if (!template) throw new Error(`No template for variant ${variant}`);

  const exercises: ExerciseEntry[] = template.exercises.map((rx) => {
    const baseWeight = workingWeights[rx.exerciseName] ?? 45;
    const weight = rx.intensityModifier
      ? roundToNearest(baseWeight * rx.intensityModifier)
      : baseWeight;

    const sets: ExerciseSet[] = Array.from({ length: rx.sets }, () => ({
      id: uuid(),
      type: rx.setType,
      prescribedWeight: weight,
      prescribedReps: rx.reps,
      actualWeight: null,
      actualReps: null,
      completed: false,
    }));

    return {
      id: uuid(),
      exerciseName: rx.exerciseName,
      sets,
      notes: '',
    };
  });

  return {
    id: uuid(),
    programId: program.id,
    variant,
    date: new Date().toISOString().split('T')[0],
    startedAt: new Date().toISOString(),
    completedAt: null,
    exercises,
    notes: '',
    bodyweight: null,
  };
}

export const useWorkoutStore = create<AppState & Actions>()(
  persist(
    (set, get) => ({
      activeProgramId: 'ss_nlp',
      workingWeights: { ...DEFAULT_WEIGHTS },
      failureCounts: {},
      sessions: [],
      activeSession: null,
      settings: { ...DEFAULT_SETTINGS },

      startWorkout: () => {
        const state = get();
        const program = getProgramById(state.activeProgramId);
        if (!program) return;

        // Determine next variant based on last session
        const lastSession = state.sessions.find((s) => s.programId === program.id);
        const rotation = program.workoutRotation;
        let nextIndex = 0;
        if (lastSession) {
          const lastIndex = rotation.indexOf(lastSession.variant);
          nextIndex = (lastIndex + 1) % rotation.length;
        }

        const session = generateSession(program, rotation[nextIndex], state.workingWeights);
        set({ activeSession: session });
      },

      completeSet: (exerciseId, setId, actualWeight?, actualReps?) => {
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              exercises: state.activeSession.exercises.map((ex) =>
                ex.id === exerciseId
                  ? {
                      ...ex,
                      sets: ex.sets.map((s) =>
                        s.id === setId
                          ? {
                              ...s,
                              completed: true,
                              actualWeight: actualWeight ?? s.prescribedWeight,
                              actualReps: actualReps ?? s.prescribedReps,
                            }
                          : s,
                      ),
                    }
                  : ex,
              ),
            },
          };
        });
      },

      uncompleteSet: (exerciseId, setId) => {
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              exercises: state.activeSession.exercises.map((ex) =>
                ex.id === exerciseId
                  ? {
                      ...ex,
                      sets: ex.sets.map((s) =>
                        s.id === setId
                          ? { ...s, completed: false, actualWeight: null, actualReps: null }
                          : s,
                      ),
                    }
                  : ex,
              ),
            },
          };
        });
      },

      finishWorkout: () => {
        const state = get();
        if (!state.activeSession) return { resets: [] };

        const program = getProgramById(state.activeProgramId);
        const completedSession: WorkoutSession = {
          ...state.activeSession,
          completedAt: new Date().toISOString(),
        };

        let resets: ExerciseName[] = [];
        let newWeights = state.workingWeights;
        let newFailures = state.failureCounts;

        if (program) {
          const result = processWorkoutProgression(
            completedSession.exercises,
            state.workingWeights,
            state.failureCounts,
            program.progressionRules,
          );
          newWeights = result.workingWeights;
          newFailures = result.failureCounts;
          resets = result.resets;
        }

        set({
          sessions: [completedSession, ...state.sessions],
          activeSession: null,
          workingWeights: newWeights,
          failureCounts: newFailures,
        });

        return { resets };
      },

      abandonWorkout: () => {
        set({ activeSession: null });
      },

      setWorkingWeight: (exercise, weight) => {
        set((state) => ({
          workingWeights: { ...state.workingWeights, [exercise]: weight },
        }));
      },

      changeProgram: (programId) => {
        set({ activeProgramId: programId, activeSession: null });
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      updateExerciseWeight: (exerciseId, newWeight, alsoUpdateWorkingWeight) => {
        set((state) => {
          if (!state.activeSession) return state;
          const exercise = state.activeSession.exercises.find((ex) => ex.id === exerciseId);
          if (!exercise) return state;

          const updatedWeights = alsoUpdateWorkingWeight
            ? { ...state.workingWeights, [exercise.exerciseName]: newWeight }
            : state.workingWeights;

          return {
            workingWeights: updatedWeights,
            activeSession: {
              ...state.activeSession,
              exercises: state.activeSession.exercises.map((ex) =>
                ex.id === exerciseId
                  ? {
                      ...ex,
                      sets: ex.sets.map((s) =>
                        s.type === 'work' && !s.completed
                          ? { ...s, prescribedWeight: newWeight }
                          : s,
                      ),
                    }
                  : ex,
              ),
            },
          };
        });
      },

      addExerciseNote: (exerciseId, note) => {
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              exercises: state.activeSession.exercises.map((ex) =>
                ex.id === exerciseId ? { ...ex, notes: note } : ex,
              ),
            },
          };
        });
      },

      addSessionNote: (note) => {
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: { ...state.activeSession, notes: note },
          };
        });
      },

      deleteSession: (sessionId) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== sessionId),
        }));
      },

      importData: (data) => {
        set({
          ...(data.activeProgramId && { activeProgramId: data.activeProgramId }),
          ...(data.workingWeights && { workingWeights: data.workingWeights }),
          ...(data.failureCounts && { failureCounts: data.failureCounts }),
          ...(data.sessions && { sessions: data.sessions }),
          ...(data.settings && { settings: { ...DEFAULT_SETTINGS, ...data.settings } }),
        });
      },

      getExportData: () => {
        const state = get();
        return {
          activeProgramId: state.activeProgramId,
          workingWeights: state.workingWeights,
          failureCounts: state.failureCounts,
          sessions: state.sessions,
          activeSession: state.activeSession,
          settings: state.settings,
        };
      },
    }),
    { name: 'ss-tracker' },
  ),
);
