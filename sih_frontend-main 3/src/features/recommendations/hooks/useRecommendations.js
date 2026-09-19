import { useMemo } from 'react';
import { generateRecommendations } from '../utils/ruleTriggers';

export function useRecommendations(zones, simResults) {
  return useMemo(() => generateRecommendations(zones, simResults), [zones, simResults]);
}
