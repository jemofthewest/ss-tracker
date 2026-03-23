import { useState } from 'react';
import type { ExerciseSet } from '../../types';
import { cn } from '../../lib/utils';

interface SetRowProps {
  set: ExerciseSet;
  index: number;
  onComplete: (actualWeight?: number, actualReps?: number) => void;
  onUncomplete: () => void;
}

export function SetRow({ set, index, onComplete, onUncomplete }: SetRowProps) {
  const [editing, setEditing] = useState(false);
  const [editReps, setEditReps] = useState(set.prescribedReps);

  const isWarmup = set.type === 'warmup';

  const handleToggle = () => {
    if (set.completed) {
      onUncomplete();
    } else if (editing) {
      onComplete(set.prescribedWeight, editReps);
      setEditing(false);
    } else {
      onComplete();
    }
  };

  const handleLongPress = () => {
    if (!set.completed) {
      setEditing(true);
      setEditReps(set.prescribedReps);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 py-3 px-3 rounded-lg transition-colors',
        set.completed && 'bg-green-50',
        isWarmup && 'opacity-70',
      )}
    >
      {/* Set number / type badge */}
      <div className="w-8 text-center">
        {isWarmup ? (
          <span className="text-xs font-medium text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">W</span>
        ) : set.type === 'backoff' ? (
          <span className="text-xs font-medium text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded">B</span>
        ) : (
          <span className="text-sm font-semibold text-gray-500">{index + 1}</span>
        )}
      </div>

      {/* Weight × Reps */}
      <div className="flex-1">
        <span className="font-semibold text-gray-900">{set.prescribedWeight} lbs</span>
        <span className="text-gray-400 mx-1.5">×</span>
        {editing ? (
          <input
            type="number"
            value={editReps}
            onChange={(e) => setEditReps(parseInt(e.target.value) || 0)}
            className="w-12 text-center border border-blue-400 rounded px-1 py-0.5 font-semibold"
            autoFocus
          />
        ) : (
          <span
            className={cn(
              'font-semibold',
              set.completed && set.actualReps !== null && set.actualReps < set.prescribedReps
                ? 'text-red-600'
                : 'text-gray-900',
            )}
          >
            {set.completed && set.actualReps !== null ? set.actualReps : set.prescribedReps}
          </span>
        )}
        {set.prescribedReps > 0 && <span className="text-gray-400 text-sm ml-1">reps</span>}
      </div>

      {/* Complete button */}
      <button
        onClick={handleToggle}
        onContextMenu={(e) => {
          e.preventDefault();
          handleLongPress();
        }}
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all active:scale-95',
          set.completed
            ? 'bg-green-500 text-white'
            : 'bg-gray-100 text-gray-400 border-2 border-gray-200',
        )}
      >
        {set.completed ? '✓' : ''}
      </button>
    </div>
  );
}
