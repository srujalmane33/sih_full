import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { calculateShortfallPhysics } from '../utils/mathPhysics';

const SimulationContext = createContext(null);

const DEFAULT_PARAMS = {
  targetProductionMT: 25000,
  rainfallMm: 30,
  downtimeHours: 12,
  rockHardnessMohs: 5.0,
  blastingDelayDays: 0,
  mineType: 'Opencast',
};

const SCENARIO_PRESETS = [
  {
    id: 'monsoon-inundation',
    name: 'Torrential Monsoon Inundation',
    icon: '🌧️',
    description: 'Extreme rainfall (120 mm) causing pit flooding, slope saturation, and pump overload.',
    params: { rainfallMm: 120, downtimeHours: 36, rockHardnessMohs: 5.0, blastingDelayDays: 4, mineType: 'Opencast' },
  },
  {
    id: 'shovel-breakdown',
    name: 'Critical Shovel Fleet Breakdown',
    icon: '🔧',
    description: 'Major hydraulic excavator fleet failure causing 60+ hours of mechanical downtime.',
    params: { rainfallMm: 15, downtimeHours: 62, rockHardnessMohs: 5.2, blastingDelayDays: 2, mineType: 'Opencast' },
  },
  {
    id: 'hard-rock-intrusion',
    name: 'Chert/Hard Rock Intrusion',
    icon: '⛏️',
    description: 'Unexpected chert band at 7.5 Mohs causing excessive drill wear and slow blasting cycles.',
    params: { rainfallMm: 20, downtimeHours: 18, rockHardnessMohs: 7.5, blastingDelayDays: 5, mineType: 'Underground' },
  },
  {
    id: 'optimal-run',
    name: 'Optimal Extraction Run',
    icon: '✅',
    description: 'Favorable conditions: low rain, high fleet availability, standard ore hardness.',
    params: { rainfallMm: 8, downtimeHours: 4, rockHardnessMohs: 4.8, blastingDelayDays: 0, mineType: 'Opencast' },
  },
];

export function SimulationProvider({ children }) {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [activePresetId, setActivePresetId] = useState(null);
  const [prospectPins, setProspectPins] = useState([]);

  // Live computed simulation results
  const results = useMemo(() => calculateShortfallPhysics(params), [params]);

  // Update a single parameter
  const setParam = useCallback((key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
    setActivePresetId(null); // Clear preset when manually editing
  }, []);

  // Bulk update parameters
  const setAllParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  // Load a scenario preset
  const loadPreset = useCallback((presetId) => {
    const preset = SCENARIO_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setParams((prev) => ({ ...prev, ...preset.params }));
      setActivePresetId(presetId);
    }
  }, []);

  // Reset to defaults
  const resetParams = useCallback(() => {
    setParams(DEFAULT_PARAMS);
    setActivePresetId(null);
  }, []);

  // Prospect pin management
  const addProspectPin = useCallback((pin) => {
    setProspectPins((prev) => [...prev, { ...pin, id: `prospect-${Date.now()}`, createdAt: new Date().toISOString() }]);
  }, []);

  const removeProspectPin = useCallback((pinId) => {
    setProspectPins((prev) => prev.filter((p) => p.id !== pinId));
  }, []);

  const clearProspectPins = useCallback(() => {
    setProspectPins([]);
  }, []);

  const contextValue = useMemo(
    () => ({
      params,
      results,
      presets: SCENARIO_PRESETS,
      activePresetId,
      prospectPins,
      setParam,
      setAllParams,
      loadPreset,
      resetParams,
      addProspectPin,
      removeProspectPin,
      clearProspectPins,
    }),
    [params, results, activePresetId, prospectPins, setParam, setAllParams, loadPreset, resetParams, addProspectPin, removeProspectPin, clearProspectPins]
  );

  return (
    <SimulationContext.Provider value={contextValue}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulationContext() {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    throw new Error('useSimulationContext must be used within a SimulationProvider');
  }
  return ctx;
}
