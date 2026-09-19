import { useMemo } from 'react';
import { calculateShortfallPhysics } from '@/utils/mathPhysics';

export function useInferenceEngine(params) {
  return useMemo(() => calculateShortfallPhysics(params), [params]);
}
