import { useState, useCallback } from 'react';

export function useZoneSelection() {
  const [selectedId, setSelectedId] = useState(null);
  const select = useCallback((id) => setSelectedId((prev) => prev === id ? null : id), []);
  const clear = useCallback(() => setSelectedId(null), []);
  return { selectedId, select, clear };
}
