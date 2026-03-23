export interface PlateCount {
  plate: number;
  count: number;
}

export interface PlateBreakdown {
  targetWeight: number;
  barWeight: number;
  perSide: PlateCount[];
  achievableWeight: number;
  remainder: number;
}
