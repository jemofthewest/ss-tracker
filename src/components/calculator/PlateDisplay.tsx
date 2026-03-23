import type { PlateBreakdown } from '../../types';

export function PlateDisplay({ breakdown }: { breakdown: PlateBreakdown }) {
  if (breakdown.perSide.length === 0) {
    return <p className="text-center text-gray-500">Empty bar</p>;
  }

  const totalPerSide = breakdown.perSide.reduce(
    (sum, { plate, count }) => sum + plate * count,
    0,
  );

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        Each Side ({totalPerSide} lbs)
      </h3>
      <div className="flex flex-wrap gap-2">
        {breakdown.perSide.map(({ plate, count }) => (
          <div
            key={plate}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-1.5"
          >
            <span className="font-bold text-lg">{plate}</span>
            <span className="text-gray-400 text-sm">× {count}</span>
          </div>
        ))}
      </div>
      {breakdown.remainder > 0 && (
        <p className="text-sm text-amber-600">
          Note: {breakdown.remainder} lbs cannot be loaded with available plates.
          Achievable weight: {breakdown.achievableWeight} lbs
        </p>
      )}
    </div>
  );
}
