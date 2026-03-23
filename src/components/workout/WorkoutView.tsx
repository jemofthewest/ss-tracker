import { useState } from 'react';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { getProgramById } from '../../programs';
import { ExerciseCard } from './ExerciseCard';
import { EXERCISE_LABELS } from '../../types';

export function WorkoutView() {
  const {
    activeSession,
    activeProgramId,
    workingWeights,
    startWorkout,
    completeSet,
    uncompleteSet,
    finishWorkout,
    abandonWorkout,
  } = useWorkoutStore();

  const [showResets, setShowResets] = useState<string[] | null>(null);
  const [confirmAbandon, setConfirmAbandon] = useState(false);

  const program = getProgramById(activeProgramId);

  if (!activeSession) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Workout</h1>

        {program && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
            <h2 className="font-semibold text-gray-700">{program.name}</h2>
            <p className="text-sm text-gray-500">{program.description}</p>

            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Current Working Weights
              </h3>
              {Object.entries(workingWeights)
                .filter(([name]) =>
                  program.templates.some((t) =>
                    t.exercises.some((e) => e.exerciseName === name),
                  ),
                )
                .map(([name, weight]) => (
                  <div key={name} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {EXERCISE_LABELS[name as keyof typeof EXERCISE_LABELS] ?? name}
                    </span>
                    <span className="font-semibold text-gray-900">{weight} lbs</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <button
          onClick={startWorkout}
          className="w-full py-4 bg-blue-600 text-white text-lg font-bold rounded-xl active:bg-blue-700 transition-colors shadow-sm"
        >
          Start Workout
        </button>

        {showResets && showResets.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-semibold text-amber-800 mb-1">Weight Reset</h3>
            <p className="text-sm text-amber-700">
              The following exercises were reset 10% due to 3 consecutive failed sessions:
            </p>
            <ul className="mt-2 space-y-1">
              {showResets.map((name) => (
                <li key={name} className="text-sm font-medium text-amber-900">
                  {EXERCISE_LABELS[name as keyof typeof EXERCISE_LABELS] ?? name}
                  {' → '}
                  {workingWeights[name]} lbs
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const template = program?.templates.find((t) => t.variant === activeSession.variant);

  return (
    <div className="space-y-4 pb-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {template?.label ?? activeSession.variant}
          </h1>
          <p className="text-sm text-gray-500">{activeSession.date}</p>
        </div>
      </div>

      {activeSession.exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          onCompleteSet={(setId, w, r) => completeSet(exercise.id, setId, w, r)}
          onUncompleteSet={(setId) => uncompleteSet(exercise.id, setId)}
        />
      ))}

      <div className="space-y-2 pt-4">
        <button
          onClick={() => {
            const result = finishWorkout();
            if (result.resets.length > 0) {
              setShowResets(result.resets);
            }
          }}
          className="w-full py-4 bg-green-600 text-white text-lg font-bold rounded-xl active:bg-green-700 transition-colors"
        >
          Finish Workout
        </button>

        {!confirmAbandon ? (
          <button
            onClick={() => setConfirmAbandon(true)}
            className="w-full py-3 text-red-500 text-sm font-medium"
          >
            Abandon Workout
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                abandonWorkout();
                setConfirmAbandon(false);
              }}
              className="flex-1 py-3 bg-red-500 text-white font-medium rounded-xl"
            >
              Confirm Abandon
            </button>
            <button
              onClick={() => setConfirmAbandon(false)}
              className="flex-1 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
