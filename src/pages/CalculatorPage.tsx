import { useState } from 'react';
import { WeightInput } from '../components/shared/WeightInput';
import { PlateVisual } from '../components/calculator/PlateVisual';
import { PlateDisplay } from '../components/calculator/PlateDisplay';
import { calculatePlates } from '../lib/plateCalculator';
import { calculateWarmupSets } from '../lib/warmupCalculator';
import { useWorkoutStore } from '../store/useWorkoutStore';

export function CalculatorPage() {
  const settings = useWorkoutStore((s) => s.settings);
  const [weight, setWeight] = useState(135);
  const [showWarmups, setShowWarmups] = useState(false);

  const breakdown = calculatePlates(weight, settings.barWeight, settings.availablePlates);
  const warmupSets = calculateWarmupSets(weight, settings.barWeight);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Plate Calculator</h1>

      <WeightInput value={weight} onChange={setWeight} label="Target Weight (lbs)" min={settings.barWeight} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <PlateVisual breakdown={breakdown} />
        <div className="mt-4">
          <PlateDisplay breakdown={breakdown} />
        </div>
      </div>

      <button
        onClick={() => setShowWarmups(!showWarmups)}
        className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-left font-medium text-gray-700 flex justify-between items-center"
      >
        <span>Warmup Sets</span>
        <span className="text-gray-400">{showWarmups ? '▲' : '▼'}</span>
      </button>

      {showWarmups && warmupSets.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          {warmupSets.map((ws, i) => {
            const wsBreakdown = calculatePlates(ws.prescribedWeight, settings.barWeight, settings.availablePlates);
            const plateStr = wsBreakdown.perSide.length === 0
              ? 'empty bar'
              : wsBreakdown.perSide.map(({ plate, count }) => (count === 1 ? `${plate}` : `${plate}×${count}`)).join(' + ');
            return (
              <div key={i} className="px-4 py-3 flex justify-between items-center">
                <div>
                  <span className="font-semibold">{ws.prescribedWeight} lbs</span>
                  <span className="text-gray-400 mx-2">×</span>
                  <span className="text-gray-600">{ws.prescribedReps} reps</span>
                </div>
                <div className="text-sm text-gray-400">{plateStr}</div>
              </div>
            );
          })}
          <div className="px-4 py-3 flex justify-between items-center bg-blue-50">
            <div>
              <span className="font-bold text-blue-700">{weight} lbs</span>
              <span className="text-gray-400 mx-2">—</span>
              <span className="text-blue-600 font-medium">Work Sets</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
