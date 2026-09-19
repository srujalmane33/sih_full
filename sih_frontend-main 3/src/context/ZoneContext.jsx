import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { getJson } from '../services/httpClient';
import { API_CONFIG } from '../config/api.config';
import { getRiskConfig } from '../config/riskLevels.config';
import { MOIL_MINES, getMineById } from '../data/minesData';

const ZoneContext = createContext(null);

const STORAGE_KEY = 'moil_mines_registry_v1';

export function normalizeMine(mine, isCustom = false) {
  if (!mine) return null;
  const district = mine.district || mine.location?.district || 'General District';
  const state = mine.state || mine.location?.state || 'Madhya Pradesh';
  const reservesMT = Number(mine.reservesMT ?? mine.metrics?.provedReservesMT ?? 12.0);
  const monthlyTargetMT = Number(
    mine.monthlyTargetMT ??
      (mine.metrics?.expectedOutputMTPerDay ? mine.metrics.expectedOutputMTPerDay * 30 : 16000)
  );
  const actualProductionMT = Number(
    mine.actualProductionMT ?? Math.round(monthlyTargetMT * 0.85)
  );
  const shortfallPct = Number(
    mine.shortfallPct ??
      mine.metrics?.shortfallPercentage ??
      (monthlyTargetMT > 0 ? ((monthlyTargetMT - actualProductionMT) / monthlyTargetMT) * 100 : 0)
  );
  const avgManganeseGrade = Number(mine.avgManganeseGrade ?? mine.metrics?.averageGrade ?? 44.5);
  const depthMeters = Number(
    mine.depthMeters ?? (typeof mine.depth === 'number' ? mine.depth : parseInt(mine.depth) || 280)
  );
  const riskLevel = (mine.riskLevel || mine.overallRisk || 'LOW').toUpperCase();

  return {
    ...mine,
    id: mine.id || `mine-${Date.now()}`,
    name: mine.name || 'New Mine Installation',
    fullName: mine.fullName || mine.name || 'New MOIL Mining Facility',
    code: mine.code || 'MOIL-NEW',
    district,
    state,
    location: { district, state, ...(mine.location || {}) },
    coordinates: mine.coordinates || [21.8741, 80.1983],
    mineType: mine.mineType || 'Underground',
    depthMeters,
    depth: typeof mine.depth === 'string' ? mine.depth : `${depthMeters}m`,
    reservesMT,
    monthlyTargetMT,
    actualProductionMT,
    shortfallPct: Math.max(0, Math.round(shortfallPct * 10) / 10),
    avgManganeseGrade,
    fleetAvailabilityPct: Number(mine.fleetAvailabilityPct ?? 82.0),
    riskLevel,
    overallRisk: riskLevel,
    riskScore:
      mine.riskScore ??
      (riskLevel === 'CRITICAL' ? 88 : riskLevel === 'HIGH' ? 72 : riskLevel === 'MEDIUM' ? 45 : 22),
    status: mine.status || 'Operational',
    mineralForm: mine.mineralForm || 'Braunite & Pyrolusite',
    mineralForms: mine.mineralForms || [mine.mineralForm || 'Braunite & Pyrolusite'],
    telemetry: {
      microseismicEvents24h: mine.telemetry?.microseismicEvents24h ?? 5,
      waterInfluxLpm:
        mine.telemetry?.waterInfluxLpm ??
        (mine.telemetry?.groundwaterInflow ? Math.round(mine.telemetry.groundwaterInflow * 16.6) : 140),
      equipmentDowntime: mine.telemetry?.equipmentDowntime ?? 24.0,
      activeFleetCount: mine.telemetry?.activeFleetCount ?? 18,
      groundwaterInflow: mine.telemetry?.groundwaterInflow ?? 160.0,
      soilMoistureIndex: mine.telemetry?.soilMoistureIndex ?? 65.0,
      rainfall24h: mine.telemetry?.rainfall24h ?? 15.0,
      slopeStabilityFactor: mine.telemetry?.slopeStabilityFactor ?? 1.45,
      haulRoadTrafficIndex: mine.telemetry?.haulRoadTrafficIndex ?? 42,
      ...(mine.telemetry || {}),
    },
    satellite: {
      lastPass: mine.satellite?.lastPass || new Date().toISOString(),
      sarSubsidenceMm: mine.satellite?.sarSubsidenceMm ?? -2.4,
      spectralBandRatio: mine.satellite?.spectralBandRatio ?? 1.8,
      cloudCoveragePct: mine.satellite?.cloudCoveragePct ?? 15,
      ...(mine.satellite || {}),
    },
    primaryBottleneck:
      mine.primaryBottleneck ||
      'Haulage fleet turnaround cycle & conveyor lubrication frequency',
    recommendedAction:
      mine.recommendedAction ||
      'Schedule predictive maintenance for primary crusher and optimize truck routing.',
    zones: mine.zones || [
      {
        id: `${mine.id || 'mine'}-z1`,
        name: 'Primary Extraction Section',
        code: `${mine.code || 'M'}-1`,
        district,
        state,
        coordinates: mine.coordinates || [21.8741, 80.1983],
        riskLevel,
        riskScore: 50,
        reservesMT: Math.round(reservesMT * 0.6 * 10) / 10,
        monthlyTargetMT: Math.round(monthlyTargetMT * 0.6),
        actualProductionMT: Math.round(actualProductionMT * 0.6),
        shortfallMT: Math.max(0, Math.round((monthlyTargetMT - actualProductionMT) * 0.6)),
        shortfallPct: Math.max(0, Math.round(shortfallPct * 10) / 10),
        oreGrade: avgManganeseGrade,
        status: 'Active',
        bottleneck: 'Regular operations monitoring active.',
      },
    ],
    metrics: {
      provedReservesMT: reservesMT,
      expectedOutputMTPerDay:
        mine.metrics?.expectedOutputMTPerDay ?? Math.round(monthlyTargetMT / 30),
      averageGrade: avgManganeseGrade,
      shortfallPercentage: Math.max(0, Math.round(shortfallPct * 10) / 10),
      ...(mine.metrics || {}),
    },
    isCustom: isCustom || Boolean(mine.isCustom),
    createdAt: mine.createdAt || (isCustom ? new Date().toISOString() : undefined),
  };
}

export function ZoneProvider({ children }) {
  const [feedZones, setFeedZones] = useState([]);
  const [summaryMetrics, setSummaryMetrics] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMineId, setSelectedMineId] = useState('balaghat');
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Persistent Mines Registry State
  const [minesList, setMinesList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m) => normalizeMine(m, m.isCustom));
        }
      }
    } catch (e) {
      console.warn('[ZoneContext] Failed to load custom mines from localStorage:', e);
    }
    return MOIL_MINES.map((m) => normalizeMine(m, false));
  });

  // Add a newly registered mine
  const addMine = useCallback((newMineData) => {
    const slug = (newMineData.name || 'custom-mine')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const id = `${slug}-${Date.now().toString(36)}`;
    const normalized = normalizeMine({ ...newMineData, id }, true);

    setMinesList((prev) => {
      const nextList = [normalized, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
      } catch (err) {
        console.error('[ZoneContext] Failed to save to localStorage:', err);
      }
      return nextList;
    });

    return normalized;
  }, []);

  // Reset mines registry back to initial MOIL dataset
  const resetMines = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error(err);
    }
    const defaultMines = MOIL_MINES.map((m) => normalizeMine(m, false));
    setMinesList(defaultMines);
    setSelectedMineId('balaghat');
  }, []);

  // Load initial feed data
  useEffect(() => {
    let mounted = true;
    async function loadFeed() {
      try {
        setIsLoading(true);
        const data = await getJson(API_CONFIG.ENDPOINTS.FEED);
        if (mounted && data) {
          setFeedZones(data.zones || []);
          setSummaryMetrics(data.summaryMetrics || null);
          setSystemStatus(data.systemStatus || null);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('[ZoneContext] Feed load error:', err);
          setError(err.message);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadFeed();
    return () => { mounted = false; };
  }, []);

  // Currently selected mine object
  const selectedMine = useMemo(() => {
    return (
      minesList.find((m) => m.id === selectedMineId || m.code === selectedMineId) ||
      minesList[0] ||
      getMineById(selectedMineId)
    );
  }, [minesList, selectedMineId]);

  // Select mine handler
  const selectMine = useCallback((mineId) => {
    setSelectedMineId(mineId);
    setSelectedZoneId(null); // Reset zone selection when switching mine
  }, []);

  // Use all feed zones for the main dashboard and map
  const zones = feedZones;

  // Use original summary metrics from feed
  const activeSummaryMetrics = summaryMetrics;

  // Computed: selected zone object
  const selectedZone = useMemo(() => {
    if (!selectedZoneId) return null;
    return zones.find((z) => z.id === selectedZoneId) || null;
  }, [zones, selectedZoneId]);

  // Computed: filtered zones
  const filteredZones = useMemo(() => {
    let result = [...zones];

    // Risk filter
    if (riskFilter && riskFilter !== 'ALL') {
      result = result.filter((z) => z.riskLevel === riskFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (z) =>
          z.name.toLowerCase().includes(q) ||
          z.code.toLowerCase().includes(q) ||
          z.district.toLowerCase().includes(q) ||
          z.state.toLowerCase().includes(q)
      );
    }

    return result;
  }, [zones, riskFilter, searchQuery]);

  // Zone counts by risk for selected mine
  const riskCounts = useMemo(() => {
    const counts = { ALL: zones.length, LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    zones.forEach((z) => {
      const key = (z.riskLevel || 'LOW').toUpperCase();
      if (counts[key] !== undefined) counts[key]++;
    });
    return counts;
  }, [zones]);

  // Select zone
  const selectZone = useCallback((zoneId) => {
    setSelectedZoneId((prev) => (prev === zoneId ? null : zoneId));
  }, []);

  // Update a zone's data (for simulation overrides)
  const updateZone = useCallback((zoneId, updates) => {
    setFeedZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, ...updates } : z))
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      minesList,
      addMine,
      resetMines,
      selectedMineId,
      selectedMine,
      selectMine,
      zones,
      summaryMetrics: activeSummaryMetrics,
      systemStatus,
      isLoading,
      error,
      selectedZoneId,
      selectedZone,
      filteredZones,
      riskFilter,
      riskCounts,
      searchQuery,
      setRiskFilter,
      setSearchQuery,
      selectZone,
      updateZone,
      getRiskConfig,
    }),
    [
      minesList,
      addMine,
      resetMines,
      selectedMineId,
      selectedMine,
      selectMine,
      zones,
      activeSummaryMetrics,
      systemStatus,
      isLoading,
      error,
      selectedZoneId,
      selectedZone,
      filteredZones,
      riskFilter,
      riskCounts,
      searchQuery,
      selectZone,
      updateZone,
    ]
  );

  return (
    <ZoneContext.Provider value={contextValue}>
      {children}
    </ZoneContext.Provider>
  );
}

export function useZoneContext() {
  const ctx = useContext(ZoneContext);
  if (!ctx) {
    throw new Error('useZoneContext must be used within a ZoneProvider');
  }
  return ctx;
}
