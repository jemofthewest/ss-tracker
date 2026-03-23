import type { ProgramDefinition } from '../types';
import { startingStrengthNLP } from './startingStrength';
import { texasMethod3Day, texasMethod4Day } from './texasMethod';
import { heavyLightMedium } from './heavyLightMedium';

export const PROGRAMS: ProgramDefinition[] = [
  startingStrengthNLP,
  texasMethod3Day,
  texasMethod4Day,
  heavyLightMedium,
];

export function getProgramById(id: string): ProgramDefinition | undefined {
  return PROGRAMS.find((p) => p.id === id);
}
