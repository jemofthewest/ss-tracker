import type { ExerciseEntry } from '../../types';
import { EXERCISE_LABELS } from '../../types';
import { calculateWarmupSets } from '../../lib/warmupCalculator';
import { calculatePlates, formatPlates } from '../../lib/plateCalculator';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { SetRow } from './SetRow';
import { WarmupSets } from './WarmupSets';
import { RestTimer } from './RestTimer';

interface ExerciseCardProps {
  exercise: ExerciseEntry;
  onCompleteSet: (setId: string, actualWeight?: number, actualReps?: number) => void;
  onUncompleteSet: (setId: string) => void;
}

export function ExerciseCard({ exercise, onCompleteSet, onUncompleteSet }: ExerciseCardProps) {
  const settings = useWorkoutStore((s) => s.settings);
  const workSets = exercise.sets.filter((s) => s.type === 'work');
  const completedCount = workSets.filter((s) => s.completed).length;
  const workWeight = workSets[0]?.prescribedWeight ?? 0;
  const warmupSets = calculateWarmupSets(workWeight, settings.barWeight);
  const plates = calculatePlates(workWeight, settings.barWeight, settings.availablePlates);

  let workIndex = 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-900">
            {EXERCISE_LABELS[exercise.exerciseName]}
          </h3>
          <p className="text-sm text-gray-500">
            {workWeight} lbs — {formatPlates(plates)}
          </p>
        </div>
        <div className="text-sm font-medium text-gray-400">
          {completedCount}/{workSets.length}
        </div>
      </div>

      {/* Warmup sets */}
      <WarmupSets sets={warmupSets} />

      {/* Work sets */}
      <div className="divide-y divide-gray-50">
        {exercise.sets.map((s) => {
          const idx = s.type === 'work' ? workIndex++ : 0;
          return (
            <SetRow
              key={s.id}
              set={s}
              index={idx}
              onComplete={(w, r) => onCompleteSet(s.id, w, r)}
              onUncomplete={() => onUncompleteSet(s.id)}
            />
          );
        })}
      </div>

      {/* Rest timer */}
      <div className="px-3 py-2 border-t border-gray-100">
        <RestTimer />
      </div>
    </div>
  );
}
