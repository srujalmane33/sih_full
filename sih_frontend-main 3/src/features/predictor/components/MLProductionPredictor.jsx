import { useState } from 'react';
import {
  Cpu,
  MapPin,
  Settings,
  Sparkles,
  TrendingDown,
  Activity,
  CheckCircle2,
  PlusCircle,
  Clock,
  Loader2,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { calculatePrediction } from '../utils/calculatePrediction';
import { useZoneContext } from '@/context';
import { MOIL_MINES } from '@/data/minesData';
import { API_CONFIG } from '@/config/api.config';


const mapMohsToRockHardness = (mohs) => {
  const val = Number(mohs) || 6;
  if (val < 3.5) return '3 - Very Soft (Sedimentary)';
  if (val < 4.5) return '4 - Soft (Shale/Schist)';
  if (val < 5.5) return '5 - Moderate (Weathered Ore)';
  if (val < 6.5) return '6 - Medium Hard';
  if (val < 7.5) return '7 - Hard (Quartzite/Granite)';
  return '8 - Very Hard (Banded Hematite Jasper)';
};

// Comprehensive telemetry presets mapped from MOIL operational assets + extension prospects
const MINE_PRESETS = {
  'balaghat-ext': {
    id: 'balaghat-ext',
    name: 'Balaghat Extension Prospect',
    locationName: 'Balaghat Extension Prospect',
    latitude: '21.62',
    longitude: '79.82',
    targetQuota: '40000',
    rainfall: '85',
    soilMoisture: '62',
    equipmentDowntime: '16',
    ndvi: '0.38',
    rockHardness: '6 - Medium Hard',
  },
  ...MOIL_MINES.reduce((acc, mine) => {
    acc[mine.id] = {
      id: mine.id,
      name: mine.name,
      locationName: mine.name,
      district: mine.district,
      state: mine.state,
      latitude: String(mine.coordinates?.[0] ?? '21.62'),
      longitude: String(mine.coordinates?.[1] ?? '79.82'),
      targetQuota: String(mine.monthlyTargetMT || 35000),
      rainfall: String(mine.telemetry?.rainfall24h ?? 60),
      soilMoisture: String(mine.telemetry?.soilMoistureIndex ?? 60),
      equipmentDowntime: String(mine.telemetry?.equipmentDowntime ?? 15),
      ndvi: String(
        mine.id === 'ukwa' ? '0.45' :
        mine.id === 'dongri-buzurg' ? '0.42' :
        mine.id === 'chikla' ? '0.40' :
        mine.id === 'balaghat' ? '0.38' :
        mine.id === 'sitasaongi' ? '0.36' :
        mine.id === 'mansar' ? '0.35' :
        mine.id === 'tirodi' ? '0.34' :
        mine.id === 'kandri' ? '0.33' : '0.31'
      ),
      rockHardness: mapMohsToRockHardness(mine.telemetry?.rockHardnessMohs),
    };
    return acc;
  }, {}),
};

const INITIAL_FORM_DATA = MINE_PRESETS['balaghat-ext'];

const ROCK_HARDNESS_OPTIONS = [
  '3 - Very Soft (Sedimentary)',
  '4 - Soft (Shale/Schist)',
  '5 - Moderate (Weathered Ore)',
  '6 - Medium Hard',
  '7 - Hard (Quartzite/Granite)',
  '8 - Very Hard (Banded Hematite Jasper)',
];

export default function MLProductionPredictor({
  title = 'Production Shortfall Simulator & ML Predictor',
  subtitle = 'Input location parameters to compute real-time machine learning predictions & shortfall risk',
  className = '',
}) {
  const [selectedMineKey, setSelectedMineKey] = useState('balaghat-ext');
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const zoneCtx = useZoneContext();

  const handleMineSelect = (mineKey) => {
    setSelectedMineKey(mineKey);
    if (mineKey === 'custom') {
      setFormData((prev) => ({ ...prev, locationName: '' }));
      return;
    }

    const preset = MINE_PRESETS[mineKey];
    if (preset) {
      setFormData({
        locationName: preset.name,
        latitude: preset.latitude,
        longitude: preset.longitude,
        targetQuota: preset.targetQuota,
        rainfall: preset.rainfall,
        soilMoisture: preset.soilMoisture,
        equipmentDowntime: preset.equipmentDowntime,
        ndvi: preset.ndvi,
        rockHardness: preset.rockHardness,
      });
      setErrors({});
      toast.info(`Loaded telemetry for ${preset.name}`, {
        description: `GPS [${preset.latitude}°N, ${preset.longitude}°E] | Target: ${Number(preset.targetQuota).toLocaleString()} T`,
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const errs = {};
    const locName = formData.locationName || formData.name || '';
    if (!locName.trim()) errs.locationName = 'Location name required';

    if (!formData.latitude || isNaN(formData.latitude)) errs.latitude = 'Valid latitude required';
    if (!formData.longitude || isNaN(formData.longitude)) errs.longitude = 'Valid longitude required';
    if (!formData.targetQuota || isNaN(formData.targetQuota) || Number(formData.targetQuota) <= 0) {
      errs.targetQuota = 'Valid positive quota required';
    }
    if (!formData.rainfall || isNaN(formData.rainfall) || Number(formData.rainfall) < 0) {
      errs.rainfall = 'Valid rainfall required';
    }
    if (
      !formData.soilMoisture ||
      isNaN(formData.soilMoisture) ||
      Number(formData.soilMoisture) < 0 ||
      Number(formData.soilMoisture) > 100
    ) {
      errs.soilMoisture = '0-100% required';
    }
    if (
      !formData.equipmentDowntime ||
      isNaN(formData.equipmentDowntime) ||
      Number(formData.equipmentDowntime) < 0
    ) {
      errs.equipmentDowntime = 'Valid hours required';
    }
    if (
      !formData.ndvi ||
      isNaN(formData.ndvi) ||
      Number(formData.ndvi) < 0 ||
      Number(formData.ndvi) > 1
    ) {
      errs.ndvi = '0.0 - 1.0 required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRunPrediction = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix validation errors before computing prediction.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIMULATOR_PREDICT || '/simulator/predict'}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationName: formData.locationName,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
          targetQuota: Number(formData.targetQuota),
          rainfall: Number(formData.rainfall),
          soilMoisture: Number(formData.soilMoisture),
          equipmentDowntime: Number(formData.equipmentDowntime),
          ndvi: Number(formData.ndvi),
          rockHardness: formData.rockHardness,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setPrediction(resData.data);
        toast.success('ML Prediction computed successfully via Backend Pipeline', {
          description: `Predicted: ${resData.data.predictedProductionFormatted} (${resData.data.shortfallPercentage}% shortfall risk)`,
        });
      } else {
        throw new Error(resData.error || 'Server error computing prediction');
      }
    } catch (err) {
      console.warn('Backend API connection warning, falling back to local engine:', err);
      const result = calculatePrediction(formData);
      setPrediction(result);
      toast.info('ML Prediction computed (Fallback Engine)', {
        description: `Predicted: ${result.predictedProductionFormatted} (${result.shortfallPercentage}% shortfall risk)`,
      });
    } finally {
      setLoading(false);
    }
  };


  const handlePinLocation = () => {
    if (!prediction && !formData.locationName) return;

    if (zoneCtx && zoneCtx.addPinnedProspect) {
      zoneCtx.addPinnedProspect({
        name: formData.locationName,
        latitude: formData.latitude,
        longitude: formData.longitude,
        targetQuota: formData.targetQuota,
        rainfall: formData.rainfall,
        soilMoisture: formData.soilMoisture,
        equipmentDowntime: formData.equipmentDowntime,
        predictedProduction: prediction?.predictedProduction || 27400,
        shortfallPercentage: prediction?.shortfallPercentage || 31.5,
        shortfallRisk: prediction?.shortfallRisk || 'HIGH',
        actionPlan: prediction?.actionPlan || [],
      });
    }

    toast.success(`Pinned "${formData.locationName}" to Live Interactive Map!`, {
      description: `GPS [${formData.latitude}°N, ${formData.longitude}°E] has been registered on the telemetry radar.`,
    });
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden ${className}`}>
      {/* 1. Header (Dashboard Light Theme) */}
      <div className="bg-white border-b border-slate-200/80 px-5 py-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200/80 flex items-center justify-center text-cyan-600 shadow-xs flex-shrink-0">
            <Cpu className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
              {title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center self-start sm:self-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold">
            <span className="text-sm leading-none text-cyan-600">✣</span>
            <span>Predictive Engine v2.4</span>
          </div>
        </div>
      </div>

      {/* 2. Main Content: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6 items-start">
        {/* LEFT COLUMN: Location & Environmental Features Form (~42% on desktop) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-cyan-600" />
            <span>LOCATION & ENVIRONMENTAL FEATURES</span>
          </div>

          <form onSubmit={handleRunPrediction} className="space-y-3.5">
            {/* 1. Prospect / Mine Location Name (Full Width) */}
            {/* 1. Prospect / Mine Location Name (Dropdown + Auto-fill) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Prospect / Mine Location Name <span className="text-red-500">*</span>
                </label>
                {selectedMineKey && selectedMineKey !== 'custom' && (
                  <span className="text-[10px] text-cyan-700 font-semibold flex items-center gap-1 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200/70">
                    ✓ Telemetry Auto-Filled
                  </span>
                )}
              </div>

              <select
                value={selectedMineKey}
                onChange={(e) => handleMineSelect(e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors cursor-pointer ${
                  errors.locationName ? 'border-red-400' : 'border-slate-200 focus:border-cyan-500'
                }`}
              >
                <optgroup label="MOIL Operational Mines">
                  {MOIL_MINES.map((mine) => (
                    <option key={mine.id} value={mine.id}>
                      {mine.name} — {mine.district}, {mine.state}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Exploration Prospects">
                  <option value="balaghat-ext">Balaghat Extension Prospect</option>
                  <option value="custom">✦ Custom Prospect (Manual Entry)...</option>
                </optgroup>
              </select>

              {/* If Custom Prospect is selected, show input to enter custom name */}
              {selectedMineKey === 'custom' && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={formData.locationName}
                    onChange={(e) => handleInputChange('locationName', e.target.value)}
                    placeholder="Enter custom prospect or mine location name..."
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-colors"
                    autoFocus
                  />
                </div>
              )}

              {errors.locationName && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.locationName}</p>
              )}
            </div>

            {/* 2-Column Grid for Remaining 8 Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Latitude */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Latitude (°N) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors ${
                    errors.latitude ? 'border-red-400' : 'border-slate-200 focus:border-cyan-500'
                  }`}
                />
              </div>

              {/* Longitude */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Longitude (°E) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors ${
                    errors.longitude ? 'border-red-400' : 'border-slate-200 focus:border-cyan-500'
                  }`}
                />
              </div>

              {/* Target Quota */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Quota (Tons) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.targetQuota}
                  onChange={(e) => handleInputChange('targetQuota', e.target.value)}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors ${
                    errors.targetQuota ? 'border-red-400' : 'border-slate-200 focus:border-cyan-500'
                  }`}
                />
              </div>

              {/* Rainfall */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rainfall (mm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.rainfall}
                  onChange={(e) => handleInputChange('rainfall', e.target.value)}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors ${
                    errors.rainfall ? 'border-red-400' : 'border-slate-200 focus:border-cyan-500'
                  }`}
                />
              </div>

              {/* Soil Moisture */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Soil Moisture (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.soilMoisture}
                  onChange={(e) => handleInputChange('soilMoisture', e.target.value)}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors ${
                    errors.soilMoisture ? 'border-red-400' : 'border-slate-200 focus:border-cyan-500'
                  }`}
                />
              </div>

              {/* Equipment Downtime */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Equipment Downtime (hrs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.equipmentDowntime}
                  onChange={(e) => handleInputChange('equipmentDowntime', e.target.value)}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors ${
                    errors.equipmentDowntime ? 'border-red-400' : 'border-slate-200 focus:border-cyan-500'
                  }`}
                />
              </div>

              {/* Vegetation NDVI */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vegetation NDVI (0-1) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.ndvi}
                  onChange={(e) => handleInputChange('ndvi', e.target.value)}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors ${
                    errors.ndvi ? 'border-red-400' : 'border-slate-200 focus:border-cyan-500'
                  }`}
                />
              </div>

              {/* Rock Hardness Index (Dropdown) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rock Hardness Index <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.rockHardness}
                  onChange={(e) => handleInputChange('rockHardness', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-colors"
                >
                  {ROCK_HARDNESS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Run ML Prediction Model Button (Dashboard Theme Cyan Button) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-700 hover:to-sky-700 active:from-cyan-800 active:to-sky-800 shadow-xs hover:shadow transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Computing ML Prediction...</span>
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4 animate-spin-slow" />
                    <span>⚙ Run ML Prediction Model</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Output UI */}
        <div className="lg:col-span-7 h-full flex flex-col justify-center">
          {/* STATE A: EMPTY STATE (Before button click) */}
          {!prediction && !loading && (
            <div className="h-full min-h-[360px] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 flex flex-col items-center justify-center p-6 text-center transition-all">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200/80 flex items-center justify-center mb-3.5 text-cyan-600 shadow-2xs">
                <Cpu className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                Ready to Compute ML Prediction
              </h3>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Enter your site coordinates & environmental metrics on the left,
                then click <span className="font-semibold text-cyan-700">"Run ML Prediction Model"</span> to output production
                predictions and risk alerts.
              </p>
            </div>
          )}

          {/* STATE B: LOADING STATE */}
          {loading && (
            <div className="h-full min-h-[360px] rounded-xl border border-cyan-200 bg-cyan-50/30 flex flex-col items-center justify-center p-6 text-center animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-sky-600 flex items-center justify-center text-white mb-3.5 shadow-sm">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1">
                Evaluating Geological & Sensor Parameters...
              </h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Running XGBoost & Random Forest reserve inference regression matrix.
              </p>
            </div>
          )}

          {/* STATE C: PREDICTION RESULTS (After button click) */}
          {prediction && !loading && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              {/* Output Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-cyan-600" />
                  <span>⚙ ML MODEL PREDICTION OUTPUT</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Computed at {prediction.computedAt}</span>
                </div>
              </div>

              {/* 3 Prediction Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {/* CARD 1: Predicted Production */}
                <div className="bg-cyan-50/70 border border-cyan-200/90 rounded-xl p-3 sm:p-3.5 transition-all shadow-2xs min-w-0">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 block truncate">
                    Predicted Production
                  </span>
                  <div className="text-xl sm:text-2xl 2xl:text-3xl font-extrabold text-cyan-700 mt-1 tracking-tight truncate">
                    {prediction.predictedProductionFormatted}
                  </div>
                  <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1 truncate">
                    Target: {prediction.targetQuotaFormatted}
                  </p>
                </div>

                {/* CARD 2: Shortfall Risk */}
                <div className="bg-red-50/80 border border-red-200/90 rounded-xl p-3 sm:p-3.5 transition-all shadow-2xs min-w-0">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 block truncate">
                    Shortfall Risk
                  </span>
                  <div className="text-xl sm:text-2xl 2xl:text-3xl font-extrabold text-red-600 mt-1 tracking-tight truncate">
                    {prediction.shortfallRisk}
                  </div>
                  <p className="text-[11px] sm:text-xs font-semibold text-red-600 mt-1 truncate">
                    {prediction.shortfallPercentage}% shortfall est.
                  </p>
                </div>

                {/* CARD 3: Reserve Score */}
                <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-3 sm:p-3.5 transition-all shadow-2xs min-w-0">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 block truncate">
                    Reserve Score
                  </span>
                  <div className="text-xl sm:text-2xl 2xl:text-3xl font-extrabold text-emerald-700 mt-1 tracking-tight truncate">
                    {prediction.reserveScore}%
                  </div>
                  <p className="text-[11px] sm:text-xs font-semibold text-emerald-700 mt-1 truncate">
                    {prediction.reserveConfidence}
                  </p>
                </div>
              </div>

              {/* ML Feature Importance Drivers Card */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>ML Feature Importance Drivers</span>
                  <span className="text-[10px] text-slate-400 font-normal uppercase">Relative Weights</span>
                </h4>

                <div className="space-y-2.5">
                  {prediction.featureImportance.map((feature) => (
                    <div key={feature.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-700 font-medium">{feature.name}</span>
                        <span
                          className={`font-bold ${
                            feature.impactType === 'boost' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {feature.display}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            feature.impactType === 'boost'
                              ? 'bg-emerald-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(5, feature.progress))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescriptive AI Action Plan */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Prescriptive AI Action Plan</span>
                </h4>

                <div className="space-y-2">
                  {prediction.actionPlan.map((action, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-700 leading-snug"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Slate Action Button: Pin Location to Map */}
              <button
                type="button"
                onClick={handlePinLocation}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-black bg-white-900 hover:bg-black-800 active:bg-slate-950 shadow-xs hover:shadow transition-all duration-200"
              >
                <PlusCircle className="w-4 h-4 text-white-400" />
                <span>⊕ Pin Location to Live Interactive Map & Dashboard</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
