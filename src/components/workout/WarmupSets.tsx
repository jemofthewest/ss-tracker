import { useState } from 'react';
import type { ExerciseSet } from '../../types';
import { calculatePlates, formatPlates } from '../../lib/plateCalculator';
import { useWorkoutStore } from '../../store/useWorkoutStore';

interface WarmupSetsProps {
  sets: ExerciseSet[];
}

export function WarmupSets({ sets }: WarmupSetsProps) {
  const [expanded, setExpanded] = useState(false);
  const settings = useWorkoutStore((s) => s.settings);

  if (sets.length === 0) return null;

  return (
    <div className="mb-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left text-sm text-amber-600 font-medium py-1 px-3 flex justify-between items-center"
      >
        <span>Warmup Sets ({sets.length})</span>
        <span>{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="space-y-1 px-3 pb-2">
          {sets.map((s, i) => {
            const plates = calculatePlates(s.prescribedWeight, settings.barWeight, settings.availablePlates);
            return (
              <div key={i} className="flex justify-between items-center text-sm text-gray-500 py-1">
                <span>
                  {s.prescribedWeight} lbs × {s.prescribedReps}
                </span>
                <span className="text-xs text-gray-400">{formatPlates(plates)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
