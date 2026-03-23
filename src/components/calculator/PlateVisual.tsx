import type { PlateBreakdown } from '../../types';

const PLATE_COLORS: Record<number, string> = {
  45: 'bg-blue-600 text-white',
  35: 'bg-yellow-500 text-black',
  25: 'bg-green-600 text-white',
  10: 'bg-gray-700 text-white',
  5: 'bg-red-500 text-white',
  2.5: 'bg-orange-400 text-black',
  1.25: 'bg-purple-500 text-white',
};

const PLATE_WIDTHS: Record<number, string> = {
  45: 'h-20',
  35: 'h-18',
  25: 'h-16',
  10: 'h-14',
  5: 'h-12',
  2.5: 'h-10',
  1.25: 'h-8',
};

export function PlateVisual({ breakdown }: { breakdown: PlateBreakdown }) {
  const allPlates = breakdown.perSide.flatMap(({ plate, count }) =>
    Array.from({ length: count }, () => plate),
  );

  if (allPlates.length === 0) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="text-gray-400 text-sm">Empty bar — {breakdown.barWeight} lbs</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-4 overflow-x-auto">
      {/* Left plates (reversed) */}
      <div className="flex items-center gap-0.5">
        {[...allPlates].reverse().map((plate, i) => (
          <div
            key={`l-${i}`}
            className={`w-6 rounded-sm flex items-center justify-center text-[10px] font-bold ${PLATE_COLORS[plate] ?? 'bg-gray-400 text-white'} ${PLATE_WIDTHS[plate] ?? 'h-14'}`}
          >
            {plate}
          </div>
        ))}
      </div>

      {/* Bar */}
      <div className="h-3 bg-gray-400 rounded-sm min-w-[60px] flex items-center justify-center">
        <span className="text-[9px] text-white font-bold">{breakdown.barWeight}</span>
      </div>

      {/* Right plates */}
      <div className="flex items-center gap-0.5">
        {allPlates.map((plate, i) => (
          <div
            key={`r-${i}`}
            className={`w-6 rounded-sm flex items-center justify-center text-[10px] font-bold ${PLATE_COLORS[plate] ?? 'bg-gray-400 text-white'} ${PLATE_WIDTHS[plate] ?? 'h-14'}`}
          >
            {plate}
          </div>
        ))}
      </div>
    </div>
  );
}
