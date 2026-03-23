import type { PlateBreakdown } from '../types';

const DEFAULT_PLATES = [45, 35, 25, 10, 5, 2.5, 1.25];

export function calculatePlates(
  targetWeight: number,
  barWeight: number = 45,
  availablePlates: number[] = DEFAULT_PLATES,
): PlateBreakdown {
  if (targetWeight <= barWeight) {
    return {
      targetWeight,
      barWeight,
      perSide: [],
      achievableWeight: barWeight,
      remainder: 0,
    };
  }

  let weightPerSide = (targetWeight - barWeight) / 2;
  const perSide: { plate: number; count: number }[] = [];
  const sorted = [...availablePlates].sort((a, b) => b - a);

  for (const plate of sorted) {
    const count = Math.floor(weightPerSide / plate);
    if (count > 0) {
      perSide.push({ plate, count });
      weightPerSide -= plate * count;
    }
  }

  const remainder = Math.round(weightPerSide * 100) / 100;

  return {
    targetWeight,
    barWeight,
    perSide,
    achievableWeight: targetWeight - remainder * 2,
    remainder: remainder * 2,
  };
}

export function formatPlates(breakdown: PlateBreakdown): string {
  if (breakdown.perSide.length === 0) return 'Empty bar';
  return breakdown.perSide
    .map(({ plate, count }) => (count === 1 ? `${plate}` : `${plate}×${count}`))
    .join(' + ');
}
