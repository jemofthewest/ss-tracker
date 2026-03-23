import { useState } from 'react';
import type { ExerciseEntry } from '../../types';
import { EXERCISE_LABELS } from '../../types';
import { calculateWarmupSets } from '../../lib/warmupCalculator';
import { calculatePlates, formatPlates } from '../../lib/plateCalculator';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { SetRow } from './SetRow';
import { WarmupSets } from './WarmupSets';
import { RestTimer } from './RestTimer';
import { WeightInput } from '../shared/WeightInput';

interface ExerciseCardProps {
  exercise: ExerciseEntry;
  onCompleteSet: (setId: string, actualWeight?: number, actualReps?: number) => void;
  onUncompleteSet: (setId: string) => void;
  onUpdateWeight: (newWeight: number, alsoUpdateWorkingWeight: boolean) => void;
}

export function ExerciseCard({ exercise, onCompleteSet, onUncompleteSet, onUpdateWeight }: ExerciseCardProps) {
  const settings = useWorkoutStore((s) => s.settings);
  const [editingWeight, setEditingWeight] = useState(false);
  const [updateWorking, setUpdateWorking] = useState(true);

  const workSets = exercise.sets.filter((s) => s.type === 'work');
  const completedCount = workSets.filter((s) => s.completed).length;
  const workWeight = workSets[0]?.prescribedWeight ?? 0;
  const warmupSets = calculateWarmupSets(workWeight, settings.barWeight);
  const plates = calculatePlates(workWeight, settings.barWeight, settings.availablePlates);

  let workIndex = 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header — tap weight to edit */}
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <button
          onClick={() => setEditingWeight(!editingWeight)}
          className="text-left active:opacity-70 transition-opacity"
        >
          <h3 className="font-bold text-gray-900">
            {EXERCISE_LABELS[exercise.exerciseName]}
          </h3>
          <p className="text-sm text-gray-500">
            {workWeight} lbs — {formatPlates(plates)}
            {!editingWeight && <span className="text-gray-300 ml-1">✎</span>}
          </p>
        </button>
        <div className="text-sm font-medium text-gray-400">
          {completedCount}/{workSets.length}
        </div>
      </div>

      {/* Inline weight editor */}
      {editingWeight && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 space-y-3">
          <WeightInput
            value={workWeight}
            onChange={(v) => onUpdateWeight(v, updateWorking)}
            increment={5}
            min={settings.barWeight}
          />
          <label className="flex items-center gap-2 text-sm text-gray-600 justify-center">
            <input
              type="checkbox"
              checked={updateWorking}
              onChange={(e) => setUpdateWorking(e.target.checked)}
              className="rounded"
            />
            Also update future working weight
          </label>
          <button
            onClick={() => setEditingWeight(false)}
            className="w-full text-sm text-blue-600 font-medium py-1"
          >
            Done
          </button>
        </div>
      )}

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
