import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pickaxe,
  PlusCircle,
  Mountain,
  MapPin,
  Layers,
  Activity,
  Gauge,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  TrendingDown,
  ExternalLink,
  ShieldAlert,
  Radio,
  Clock,
  Truck,
  Droplets,
  AlertTriangle,
  ArrowRight,
  Info,
  Check,
  Wrench,
  Trash2,
  Plus,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { useZoneContext } from '@/context';
import Card from '@/components/common/Card/Card';
import Button from '@/components/common/Button/Button';
import AlertBadge from '@/components/common/AlertBadge/AlertBadge';
import { formatNumber, formatPercentage } from '@/utils/formatters';
import { EQUIPMENT_CATEGORIES, INITIAL_EQUIPMENT_DATA } from '@/data/equipmentData';

const EQUIPMENT_STORAGE_KEY = 'moil_equipment_registry_v1';

// Standard equipment templates
const STANDARD_UG_FLEET = [
  {
    id_temp: 'ug-1',
    name: 'Dual-Drum Shaft Hoisting Winch',
    tag: 'HW-1200',
    category: 'Hoisting & Lifting',
    model: 'GEC Alsthom 1200 kW Double Drum Hoist',
    status: 'Operational',
    healthScore: 92,
    avgDowntimeHours: 14.5,
    availabilityPct: 91.5,
    mtbfHours: 240,
    mttrHours: 7.5,
    nextServiceDate: '2026-10-15',
    maintenanceCostEstimate: '$14,500',
    primaryIssue: 'Nominal brake lining clearance and shaft alignment verified',
    recommendedAction: 'Quarterly hoist rope magnetic testing and lubricant replenishment.',
  },
  {
    id_temp: 'ug-2',
    name: 'Primary Sump Submersible Dewatering Pump',
    tag: 'PMP-150',
    category: 'Dewatering & Pumping',
    model: 'KSB Amarex KRT 150 kW High-Head',
    status: 'Operational',
    healthScore: 88,
    avgDowntimeHours: 18.0,
    availabilityPct: 89.0,
    mtbfHours: 210,
    mttrHours: 9.0,
    nextServiceDate: '2026-10-01',
    maintenanceCostEstimate: '$7,200',
    primaryIssue: 'Suction strainer cleared; non-clog impeller dynamic balance verified',
    recommendedAction: 'Monthly insulation resistance and mechanical seal check.',
  },
  {
    id_temp: 'ug-3',
    name: 'Electric LHD Scooptram Loader (14T)',
    tag: 'LHD-14',
    category: 'Material Handling & Transport',
    model: 'Epiroc Scooptram ST14 Battery-Electric',
    status: 'Operational',
    healthScore: 85,
    avgDowntimeHours: 22.0,
    availabilityPct: 87.5,
    mtbfHours: 180,
    mttrHours: 10.5,
    nextServiceDate: '2026-09-28',
    maintenanceCostEstimate: '$11,000',
    primaryIssue: 'Battery thermal management system operating at optimal temperature',
    recommendedAction: 'Tire wear inspection and hydraulic articulation joint greasing.',
  },
  {
    id_temp: 'ug-4',
    name: 'Main Surface Ventilation Exhaust Fan',
    tag: 'FAN-250',
    category: 'Ventilation & Safety',
    model: 'Howden 250 kW Primary Surface Fan',
    status: 'Operational',
    healthScore: 96,
    avgDowntimeHours: 6.5,
    availabilityPct: 98.0,
    mtbfHours: 480,
    mttrHours: 4.0,
    nextServiceDate: '2026-11-10',
    maintenanceCostEstimate: '$5,500',
    primaryIssue: 'Airflow velocity 145 m³/s maintaining safe underground oxygen index',
    recommendedAction: 'Vibration analysis and bearing grease purge every 500 hours.',
  },
];

const STANDARD_OC_FLEET = [
  {
    id_temp: 'oc-1',
    name: 'Komatsu PC1250 Heavy Hydraulic Shovel',
    tag: 'EXC-1250',
    category: 'Heavy Earthmoving',
    model: 'Komatsu PC1250SP-8 Heavy Duty Excavator',
    status: 'Operational',
    healthScore: 89,
    avgDowntimeHours: 24.0,
    availabilityPct: 86.5,
    mtbfHours: 195,
    mttrHours: 11.0,
    nextServiceDate: '2026-10-12',
    maintenanceCostEstimate: '$22,000',
    primaryIssue: 'Hydraulic boom cylinder seals and bucket teeth inspected',
    recommendedAction: 'Scheduled 500-hour hydraulic oil filtration change.',
  },
  {
    id_temp: 'oc-2',
    name: 'Cat 777E Off-Highway Haul Truck #1',
    tag: 'TRK-777-1',
    category: 'Heavy Earthmoving',
    model: 'Caterpillar 777E 100-Ton Haulage Dump Truck',
    status: 'Operational',
    healthScore: 86,
    avgDowntimeHours: 20.0,
    availabilityPct: 88.0,
    mtbfHours: 215,
    mttrHours: 8.5,
    nextServiceDate: '2026-09-30',
    maintenanceCostEstimate: '$16,000',
    primaryIssue: 'Transmission shift modulation within factory tolerances',
    recommendedAction: 'Inspect suspension struts and retarder cooling lines.',
  },
  {
    id_temp: 'oc-3',
    name: 'Cat 777E Off-Highway Haul Truck #2',
    tag: 'TRK-777-2',
    category: 'Heavy Earthmoving',
    model: 'Caterpillar 777E 100-Ton Haulage Dump Truck',
    status: 'Operational',
    healthScore: 91,
    avgDowntimeHours: 16.0,
    availabilityPct: 90.5,
    mtbfHours: 230,
    mttrHours: 7.5,
    nextServiceDate: '2026-10-18',
    maintenanceCostEstimate: '$14,500',
    primaryIssue: 'Fleet dispatch telematics connected; fuel consumption optimal',
    recommendedAction: 'Standard 250-hour oil and air filter change.',
  },
  {
    id_temp: 'oc-4',
    name: 'Rotary Blast Hole Drill Rig',
    tag: 'DRL-200',
    category: 'Drilling & Blasting',
    model: 'Atlas Copco DML-SP Blast Hole Rig',
    status: 'Operational',
    healthScore: 84,
    avgDowntimeHours: 26.0,
    availabilityPct: 85.0,
    mtbfHours: 170,
    mttrHours: 12.0,
    nextServiceDate: '2026-10-05',
    maintenanceCostEstimate: '$13,000',
    primaryIssue: 'Compressor air delivery pressure steady at 24 Bar',
    recommendedAction: 'Drill string bit sharpening and rotary head lube check.',
  },
];

// Realistic MOIL Presets for quick pre-filling
const PRESET_MINES = [
  {
    name: 'Ukwa North Expansion',
    fullName: 'Ukwa North Deep Incline & Production Unit',
    code: 'UKW-N02',
    district: 'Balaghat',
    state: 'Madhya Pradesh',
    coordinates: [21.968, 80.468],
    mineType: 'Underground',
    depthMeters: 295,
    reservesMT: 14.8,
    monthlyTargetMT: 21000,
    actualProductionMT: 18200,
    avgManganeseGrade: 44.8,
    fleetAvailabilityPct: 83.5,
    riskLevel: 'MEDIUM',
    status: 'Operational with Constraints',
    mineralForm: 'Pyrolusite & Psilomelane',
    primaryBottleneck: 'Level-4 winze haulage hoist electrical trip during peak shift',
    recommendedAction: 'Install secondary backup feeder cable and deploy 2 auxiliary LHD loaders.',
    telemetry: {
      microseismicEvents24h: 5,
      waterInfluxLpm: 155,
      equipmentDowntime: 28.5,
      activeFleetCount: 4,
      soilMoistureIndex: 68.2,
      rainfall24h: 22.0,
    },
    fleet: STANDARD_UG_FLEET,
  },
  {
    name: 'Tirodi Deep Sump Complex',
    fullName: 'Tirodi Manganese Deep Underground & Sump Works',
    code: 'TRD-DP',
    district: 'Balaghat',
    state: 'Madhya Pradesh',
    coordinates: [21.688, 79.715],
    mineType: 'Underground',
    depthMeters: 340,
    reservesMT: 18.2,
    monthlyTargetMT: 28000,
    actualProductionMT: 24500,
    avgManganeseGrade: 46.5,
    fleetAvailabilityPct: 88.0,
    riskLevel: 'LOW',
    status: 'Operational',
    mineralForm: 'Braunite & Cryptomelane',
    primaryBottleneck: 'Haul road consolidation delay between portal and central dump',
    recommendedAction: 'Apply dust suppressant binding agent and realign secondary dump access route.',
    telemetry: {
      microseismicEvents24h: 2,
      waterInfluxLpm: 88,
      equipmentDowntime: 14.0,
      activeFleetCount: 4,
      soilMoistureIndex: 52.0,
      rainfall24h: 8.5,
    },
    fleet: STANDARD_UG_FLEET,
  },
  {
    name: 'Gumgaon West Extension',
    fullName: 'Gumgaon West Shaft & Beneficiation Hub',
    code: 'GMG-W01',
    district: 'Nagpur',
    state: 'Maharashtra',
    coordinates: [21.392, 79.004],
    mineType: 'Opencast',
    depthMeters: 180,
    reservesMT: 22.4,
    monthlyTargetMT: 32000,
    actualProductionMT: 23600,
    avgManganeseGrade: 47.1,
    fleetAvailabilityPct: 76.2,
    riskLevel: 'CRITICAL',
    status: 'Under Maintenance',
    mineralForm: 'Braunite & Pyrolusite',
    primaryBottleneck: 'High groundwater pressure on bench boundary + haul truck hydraulic overheating',
    recommendedAction: 'Immediate non-destructive ultrasonic crack testing and cooling overhaul.',
    telemetry: {
      microseismicEvents24h: 9,
      waterInfluxLpm: 240,
      equipmentDowntime: 56.0,
      activeFleetCount: 4,
      soilMoistureIndex: 82.5,
      rainfall24h: 64.0,
    },
    fleet: STANDARD_OC_FLEET,
  },
];

const INITIAL_FORM = {
  name: '',
  fullName: '',
  code: '',
  district: 'Balaghat',
  state: 'Madhya Pradesh',
  latitude: 21.8741,
  longitude: 80.1983,
  mineType: 'Underground',
  depthMeters: 280,
  reservesMT: 15.0,
  monthlyTargetMT: 20000,
  actualProductionMT: 17000,
  avgManganeseGrade: 45.0,
  fleetAvailabilityPct: 88.0,
  riskLevel: 'MEDIUM',
  status: 'Operational',
  mineralForm: 'Braunite & Pyrolusite',
  primaryBottleneck: 'Haulage cycle congestion during peak extraction shifts',
  recommendedAction: 'Deploy auxiliary loaders and optimize truck dispatch intervals.',
  waterInfluxLpm: 120,
  microseismicEvents24h: 4,
  equipmentDowntime: 20,
  activeFleetCount: 4,
};

export default function AddMinesPage() {
  const navigate = useNavigate();
  const { minesList, addMine, selectMine, resetMines } = useZoneContext();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [equipmentFleet, setEquipmentFleet] = useState(STANDARD_UG_FLEET);
  const [isAddingCustomUnit, setIsAddingCustomUnit] = useState(false);
  const [customUnit, setCustomUnit] = useState({
    name: '',
    tag: '',
    category: 'Heavy Earthmoving',
    model: '',
    status: 'Operational',
    healthScore: 88,
    avgDowntimeHours: 18.0,
    availabilityPct: 88.0,
    nextServiceDate: '2026-10-20',
    primaryIssue: 'Commissioning inspection complete; baseline normal',
    recommendedAction: 'Follow 250-hour lubrication and oil filtration cycle.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [lastAddedMine, setLastAddedMine] = useState(null);

  // Custom registered mines from the state
  const customMines = useMemo(() => {
    return (minesList || []).filter((m) => m.isCustom);
  }, [minesList]);

  // Compute calculated shortfall for preview
  const previewShortfallPct = useMemo(() => {
    const target = Number(formData.monthlyTargetMT) || 0;
    const actual = Number(formData.actualProductionMT) || 0;
    if (target <= 0) return 0;
    const diff = target - actual;
    return diff > 0 ? Math.round((diff / target) * 1000) / 10 : 0;
  }, [formData.monthlyTargetMT, formData.actualProductionMT]);

  // Compute fleet statistics
  const fleetMetrics = useMemo(() => {
    if (!equipmentFleet.length) {
      return { count: 0, avgHealth: 0, avgDowntime: 0, operationalCount: 0 };
    }
    const totalHealth = equipmentFleet.reduce((acc, eq) => acc + (Number(eq.healthScore) || 0), 0);
    const totalDowntime = equipmentFleet.reduce(
      (acc, eq) => acc + (Number(eq.avgDowntimeHours) || 0),
      0
    );
    const operationalCount = equipmentFleet.filter((eq) => eq.status === 'Operational').length;

    return {
      count: equipmentFleet.length,
      avgHealth: Math.round(totalHealth / equipmentFleet.length),
      avgDowntime: Math.round((totalDowntime / equipmentFleet.length) * 10) / 10,
      operationalCount,
    };
  }, [equipmentFleet]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // If user changes mine type, and fleet hasn't been heavily customized, suggest corresponding template
      if (field === 'mineType') {
        if (value.toLowerCase().includes('opencast')) {
          setEquipmentFleet(STANDARD_OC_FLEET);
        } else {
          setEquipmentFleet(STANDARD_UG_FLEET);
        }
      }
      return next;
    });

    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePreFill = (presetIndex = 0) => {
    const preset = PRESET_MINES[presetIndex % PRESET_MINES.length];
    setFormData({
      name: preset.name,
      fullName: preset.fullName,
      code: preset.code,
      district: preset.district,
      state: preset.state,
      latitude: preset.coordinates[0],
      longitude: preset.coordinates[1],
      mineType: preset.mineType,
      depthMeters: preset.depthMeters,
      reservesMT: preset.reservesMT,
      monthlyTargetMT: preset.monthlyTargetMT,
      actualProductionMT: preset.actualProductionMT,
      avgManganeseGrade: preset.avgManganeseGrade,
      fleetAvailabilityPct: preset.fleetAvailabilityPct,
      riskLevel: preset.riskLevel,
      status: preset.status,
      mineralForm: preset.mineralForm,
      primaryBottleneck: preset.primaryBottleneck,
      recommendedAction: preset.recommendedAction,
      waterInfluxLpm: preset.telemetry.waterInfluxLpm,
      microseismicEvents24h: preset.telemetry.microseismicEvents24h,
      equipmentDowntime: preset.telemetry.equipmentDowntime,
      activeFleetCount: preset.telemetry.activeFleetCount,
    });
    setEquipmentFleet(preset.fleet || (preset.mineType === 'Opencast' ? STANDARD_OC_FLEET : STANDARD_UG_FLEET));
    setFormErrors({});
    toast.info(`Populated details and equipment fleet for "${preset.name}"!`);
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM);
    setEquipmentFleet(STANDARD_UG_FLEET);
    setFormErrors({});
    toast.info('Form cleared to defaults.');
  };

  // Fleet management actions
  const handleAddCustomUnit = (e) => {
    e.preventDefault();
    if (!customUnit.name.trim()) {
      toast.error('Please provide an Equipment Name.');
      return;
    }
    const unitTag = customUnit.tag.trim() || `${formData.code || 'EQ'}-${equipmentFleet.length + 1}`;
    const newUnit = {
      ...customUnit,
      id_temp: `custom-${Date.now()}`,
      tag: unitTag,
      healthScore: Number(customUnit.healthScore) || 85,
      avgDowntimeHours: Number(customUnit.avgDowntimeHours) || 18.0,
      availabilityPct: Number(customUnit.availabilityPct) || 88.0,
    };
    setEquipmentFleet((prev) => [...prev, newUnit]);
    setCustomUnit({
      name: '',
      tag: '',
      category: 'Heavy Earthmoving',
      model: '',
      status: 'Operational',
      healthScore: 88,
      avgDowntimeHours: 18.0,
      availabilityPct: 88.0,
      nextServiceDate: '2026-10-20',
      primaryIssue: 'Commissioning inspection complete; baseline normal',
      recommendedAction: 'Follow 250-hour lubrication and oil filtration cycle.',
    });
    setIsAddingCustomUnit(false);
    toast.success(`Added "${newUnit.name}" to mine machinery fleet!`);
  };

  const handleRemoveEquipment = (indexToRemove) => {
    setEquipmentFleet((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    toast.info('Equipment unit removed from configuration.');
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Mine Name is required';
    if (!formData.code.trim()) errors.code = 'Facility Code is required';
    if (!formData.district.trim()) errors.district = 'District is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (Number(formData.reservesMT) <= 0) errors.reservesMT = 'Reserves must be > 0 MT';
    if (Number(formData.monthlyTargetMT) <= 0) errors.monthlyTargetMT = 'Target must be > 0 MT';
    if (Number(formData.avgManganeseGrade) <= 0) errors.avgManganeseGrade = 'Grade must be > 0%';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill all required mine configuration fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const mineCode = formData.code.trim().toUpperCase();

      const newMinePayload = {
        name: formData.name.trim(),
        fullName: formData.fullName.trim() || `${formData.name.trim()} MOIL Facility`,
        code: mineCode,
        district: formData.district.trim(),
        state: formData.state.trim(),
        coordinates: [Number(formData.latitude) || 21.87, Number(formData.longitude) || 80.19],
        mineType: formData.mineType,
        depthMeters: Number(formData.depthMeters) || 250,
        reservesMT: Number(formData.reservesMT) || 10.0,
        monthlyTargetMT: Number(formData.monthlyTargetMT) || 18000,
        actualProductionMT: Number(formData.actualProductionMT) || 15000,
        shortfallPct: previewShortfallPct,
        avgManganeseGrade: Number(formData.avgManganeseGrade) || 45.0,
        fleetAvailabilityPct: Number(fleetMetrics.avgHealth || formData.fleetAvailabilityPct || 85.0),
        riskLevel: formData.riskLevel,
        status: formData.status,
        mineralForm: formData.mineralForm || 'Braunite & Pyrolusite',
        primaryBottleneck: formData.primaryBottleneck || 'Underground ventilation & haulage balance',
        recommendedAction: formData.recommendedAction || 'Continuous gas detection and haul route scheduling.',
        telemetry: {
          waterInfluxLpm: Number(formData.waterInfluxLpm) || 120,
          microseismicEvents24h: Number(formData.microseismicEvents24h) || 4,
          equipmentDowntime: Number(fleetMetrics.avgDowntime || formData.equipmentDowntime || 20),
          activeFleetCount: equipmentFleet.length || Number(formData.activeFleetCount) || 4,
        },
      };

      const created = addMine(newMinePayload);

      // Save configured equipment into the centralized equipment registry
      if (equipmentFleet.length > 0) {
        const createdEquipmentList = equipmentFleet.map((eq, index) => ({
          id: `EQ-${created.code}-${eq.tag || index + 1}`,
          name: eq.name,
          tag: `${created.code}-${eq.tag || `EQ${index + 1}`}`,
          model: eq.model || `${eq.category} Industrial Unit`,
          mineId: created.id,
          mineName: created.name,
          mineCode: created.code,
          category: eq.category || 'Heavy Earthmoving',
          mineType: created.mineType,
          status: eq.status || 'Operational',
          healthScore: Number(eq.healthScore) || 85,
          avgDowntimeHours: Number(eq.avgDowntimeHours) || 18.0,
          availabilityPct: Number(eq.availabilityPct) || 88.0,
          mtbfHours: Number(eq.mtbfHours) || 200,
          mttrHours: Number(eq.mttrHours) || 8.0,
          lastServiceDate: new Date().toISOString().split('T')[0],
          nextServiceDate: eq.nextServiceDate || '2026-10-20',
          maintenanceType: 'Routine Commissioning Maintenance',
          maintenanceCostEstimate: eq.maintenanceCostEstimate || '$12,000',
          primaryIssue: eq.primaryIssue || 'Commissioning inspection complete. Normal vibration and temperatures.',
          recommendedAction: eq.recommendedAction || 'Adhere to scheduled OEM maintenance intervals.',
          telemetry: [
            { label: 'Operating Temp', value: '72°C', status: 'NORMAL', limit: '< 85°C' },
            { label: 'Bearing Vibration', value: '2.4 mm/s', status: 'NORMAL', limit: '< 4.5 mm/s' },
          ],
          maintenanceHistory: [
            {
              date: new Date().toISOString().split('T')[0],
              type: 'Commissioning Inspection',
              notes: `Commissioned with ${created.name}. Baseline telemetry validated.`,
              technician: 'MOIL Site Mechanical Lead',
            },
          ],
        }));

        try {
          const existingRaw = localStorage.getItem(EQUIPMENT_STORAGE_KEY);
          const existingList = existingRaw ? JSON.parse(existingRaw) : INITIAL_EQUIPMENT_DATA;
          const merged = [...createdEquipmentList, ...existingList];
          localStorage.setItem(EQUIPMENT_STORAGE_KEY, JSON.stringify(merged));
        } catch (err) {
          console.error('Failed to save custom equipment to localStorage:', err);
        }
      }

      setLastAddedMine(created);
      toast.success(
        `Mine "${created.name}" and ${equipmentFleet.length} machinery units registered successfully!`
      );

      // Reset form
      setFormData(INITIAL_FORM);
      setEquipmentFleet(STANDARD_UG_FLEET);
      setFormErrors({});
    } catch (err) {
      console.error(err);
      toast.error('Failed to register mine. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isShortfallHigh = previewShortfallPct > 15;

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 bg-sky-50 border border-sky-200 rounded-lg text-sky-700">
              <PlusCircle className="w-5 h-5 text-sky-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Register & Add New MOIL Mine
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Commission a new manganese extraction installation, configure telemetry baselines, assign equipment machinery, and sync with operational dashboards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/equipment')}
            className="flex items-center gap-1.5"
          >
            <Wrench className="w-4 h-4 text-cyan-600" />
            <span>Equipment Portal</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/mines')}
            className="flex items-center gap-1.5"
          >
            <Pickaxe className="w-4 h-4 text-cyan-600" />
            <span>Mines Directory ({minesList?.length || 0})</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-slate-600"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preset Quick Fill Bar */}
      <div className="bg-gradient-to-r from-sky-50/70 via-cyan-50/50 to-white p-4 rounded-xl border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-900">
              Quick Pre-Fill with MOIL Templates & Machinery
            </span>
            <p className="text-xs text-slate-600">
              Auto-fill geological parameters, extraction targets, and heavy machinery fleet with one click:
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRESET_MINES.map((preset, idx) => (
            <button
              key={preset.code}
              type="button"
              onClick={() => handlePreFill(idx)}
              className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 rounded-lg shadow-2xs transition-all hover:border-sky-300"
            >
              + {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form Card on Left (2 cols), Live Preview & Recent on Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: The Register New Mine Card */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Pickaxe className="w-5 h-5 text-sky-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Register New Mine Card
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                All fields validated in real-time
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Facility Identity */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-sky-600" />
                  1. Facility Identification & Classification
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Mine Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ukwa North Expansion"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                        formErrors.name ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Facility Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UKW-N02"
                      value={formData.code}
                      onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                      className={`w-full px-3 py-2 text-sm border font-mono rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                        formErrors.code ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.code && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.code}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Full Facility Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ukwa North Deep Underground & Incline Facility"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Mine Type
                      </label>
                      <select
                        value={formData.mineType}
                        onChange={(e) => handleChange('mineType', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                      >
                        <option value="Underground">Underground (UG)</option>
                        <option value="Opencast">Opencast (OC)</option>
                        <option value="Mixed / Complex">Mixed (UG + OC)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Operational Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                      >
                        <option value="Operational">Operational</option>
                        <option value="Operational with Constraints">Operational w/ Constraints</option>
                        <option value="Under Development">Under Development</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Location & Geography */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  2. Geographical Location & Coordinates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Balaghat, Nagpur, Bhandara"
                      value={formData.district}
                      onChange={(e) => handleChange('district', e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                        formErrors.district ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.district && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.district}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Madhya Pradesh, Maharashtra"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                        formErrors.state ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.state && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.state}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Latitude (°N)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.latitude}
                      onChange={(e) => handleChange('latitude', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Longitude (°E)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.longitude}
                      onChange={(e) => handleChange('longitude', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Reserves & Extraction Targets */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-600" />
                  3. Reserve Base & Production Targets
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Proved Reserves (MT) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="15.0"
                      value={formData.reservesMT}
                      onChange={(e) => handleChange('reservesMT', e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                        formErrors.reservesMT ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.reservesMT && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.reservesMT}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Monthly Target (MT) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="100"
                      placeholder="20000"
                      value={formData.monthlyTargetMT}
                      onChange={(e) => handleChange('monthlyTargetMT', e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                        formErrors.monthlyTargetMT ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.monthlyTargetMT && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.monthlyTargetMT}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Actual Production (MT)
                    </label>
                    <input
                      type="number"
                      step="100"
                      placeholder="17000"
                      value={formData.actualProductionMT}
                      onChange={(e) => handleChange('actualProductionMT', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Avg Grade (% Mn) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="45.0"
                      value={formData.avgManganeseGrade}
                      onChange={(e) => handleChange('avgManganeseGrade', e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                        formErrors.avgManganeseGrade ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.avgManganeseGrade && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.avgManganeseGrade}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Shaft / Bench Depth (m)
                    </label>
                    <input
                      type="number"
                      step="1"
                      placeholder="280"
                      value={formData.depthMeters}
                      onChange={(e) => handleChange('depthMeters', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Fleet Availability (%)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="88.0"
                      value={formData.fleetAvailabilityPct}
                      onChange={(e) => handleChange('fleetAvailabilityPct', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Mineral Form Description
                    </label>
                    <input
                      type="text"
                      placeholder="Braunite & Pyrolusite"
                      value={formData.mineralForm}
                      onChange={(e) => handleChange('mineralForm', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Risk, Prescriptive Strategy & Telemetry */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-sky-600" />
                  4. Risk Assessment & Telemetry Baseline
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Initial Risk Assessment
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleChange('riskLevel', lvl)}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            formData.riskLevel === lvl
                              ? lvl === 'CRITICAL'
                                ? 'bg-red-500 text-white border-red-600 shadow-xs'
                                : lvl === 'HIGH'
                                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                                : lvl === 'MEDIUM'
                                ? 'bg-yellow-500 text-white border-yellow-600 shadow-xs'
                                : 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Water Influx (L/min)
                    </label>
                    <input
                      type="number"
                      placeholder="120"
                      value={formData.waterInfluxLpm}
                      onChange={(e) => handleChange('waterInfluxLpm', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Seismic Events (24h)
                    </label>
                    <input
                      type="number"
                      placeholder="4"
                      value={formData.microseismicEvents24h}
                      onChange={(e) => handleChange('microseismicEvents24h', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Primary Operational Bottleneck
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Describe primary constraint (e.g. Sump capacity, winding hoist cycle, ventilation)..."
                      value={formData.primaryBottleneck}
                      onChange={(e) => handleChange('primaryBottleneck', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Prescriptive Mitigation Action
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Recommended remedial engineering action..."
                      value={formData.recommendedAction}
                      onChange={(e) => handleChange('recommendedAction', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Commissioned Equipment & Machinery Fleet */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-cyan-600" />
                      5. Commissioned Mining Machinery Fleet ({equipmentFleet.length} Units)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure baseline machinery assigned to this mine site. Synced directly with the Equipment & Downtime Portal.
                    </p>
                  </div>

                  {/* Template buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEquipmentFleet(STANDARD_UG_FLEET);
                        toast.info('Loaded Standard Underground Equipment Fleet!');
                      }}
                      className="px-2 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 transition-colors"
                      title="Load Hoist, Dewatering Pump, LHD, Fan"
                    >
                      Underground Fleet
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEquipmentFleet(STANDARD_OC_FLEET);
                        toast.info('Loaded Standard Opencast Equipment Fleet!');
                      }}
                      className="px-2 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 transition-colors"
                      title="Load PC1250 Excavator, 777E Dump Trucks, Drill Rig"
                    >
                      Opencast Fleet
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomUnit(!isAddingCustomUnit)}
                      className="px-2 py-1 text-[11px] font-semibold bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded border border-cyan-200 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Machinery</span>
                    </button>
                  </div>
                </div>

                {/* Fleet summary stats bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Configured Fleet</span>
                    <p className="text-sm font-bold text-slate-800">{fleetMetrics.count} Units</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Active / Ready</span>
                    <p className="text-sm font-bold text-emerald-600">{fleetMetrics.operationalCount} Active</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg Fleet Health</span>
                    <p className="text-sm font-bold text-cyan-700">{fleetMetrics.avgHealth}%</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg Downtime</span>
                    <p className="text-sm font-bold text-amber-600">{fleetMetrics.avgDowntime} hrs/mo</p>
                  </div>
                </div>

                {/* Inline Add Custom Unit Form */}
                <AnimatePresence>
                  {isAddingCustomUnit && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-cyan-50/50 border border-cyan-200 rounded-xl mb-4 overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-cyan-900 flex items-center gap-1.5">
                          <PlusCircle className="w-3.5 h-3.5 text-cyan-600" />
                          Add Custom Equipment Unit
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsAddingCustomUnit(false)}
                          className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                        >
                          ✕ Close
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                            Equipment Name *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Atlas Copco Drill Rig"
                            value={customUnit.name}
                            onChange={(e) => setCustomUnit({ ...customUnit, name: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                            Equipment Tag / Code
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. DRL-01"
                            value={customUnit.tag}
                            onChange={(e) => setCustomUnit({ ...customUnit, tag: e.target.value.toUpperCase() })}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                            Category
                          </label>
                          <select
                            value={customUnit.category}
                            onChange={(e) => setCustomUnit({ ...customUnit, category: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          >
                            {EQUIPMENT_CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                            Model / Specification
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Caterpillar 777E 100T"
                            value={customUnit.model}
                            onChange={(e) => setCustomUnit({ ...customUnit, model: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                            Initial Status
                          </label>
                          <select
                            value={customUnit.status}
                            onChange={(e) => setCustomUnit({ ...customUnit, status: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          >
                            <option value="Operational">Operational</option>
                            <option value="Degraded">Degraded Performance</option>
                            <option value="Maintenance Required">Maintenance Required</option>
                            <option value="Breakdown">Breakdown</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                              Health Index (%)
                            </label>
                            <input
                              type="number"
                              min="10"
                              max="100"
                              value={customUnit.healthScore}
                              onChange={(e) =>
                                setCustomUnit({ ...customUnit, healthScore: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                              Downtime (h/mo)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={customUnit.avgDowntimeHours}
                              onChange={(e) =>
                                setCustomUnit({ ...customUnit, avgDowntimeHours: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                            Primary Diagnostic Issue
                          </label>
                          <input
                            type="text"
                            placeholder="Nominal telemetry baseline verified"
                            value={customUnit.primaryIssue}
                            onChange={(e) => setCustomUnit({ ...customUnit, primaryIssue: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            type="button"
                            size="sm"
                            variant="primary"
                            onClick={handleAddCustomUnit}
                            className="w-full justify-center bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            Add to Fleet
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Equipment Fleet List */}
                {equipmentFleet.length === 0 ? (
                  <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Wrench className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                    <p className="text-xs text-slate-500 font-medium">No machinery assigned yet</p>
                    <p className="text-[11px] text-slate-400">
                      Click "Underground Fleet" or "Opencast Fleet" above to load standard MOIL equipment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {equipmentFleet.map((eq, idx) => (
                      <div
                        key={eq.id_temp || idx}
                        className="p-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-700 shrink-0 mt-0.5">
                            <Wrench className="w-4 h-4 text-cyan-600" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 truncate">{eq.name}</span>
                              <span className="font-mono text-[10px] px-1.5 py-0.2 bg-slate-200/80 text-slate-700 rounded font-semibold">
                                {eq.tag}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                  eq.status === 'Operational'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : eq.status === 'Breakdown'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {eq.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-medium text-slate-600">{eq.category}</span>
                              <span>•</span>
                              <span>{eq.model}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Health Index</span>
                            <div className="flex items-center gap-1.5 justify-end mt-0.5">
                              <div className="w-14 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    eq.healthScore >= 85
                                      ? 'bg-emerald-500'
                                      : eq.healthScore >= 65
                                      ? 'bg-amber-500'
                                      : 'bg-red-500'
                                  }`}
                                  style={{ width: `${eq.healthScore}%` }}
                                />
                              </div>
                              <span className="font-bold text-slate-800">{eq.healthScore}%</span>
                            </div>
                          </div>

                          <div className="text-right hidden sm:block">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Downtime</span>
                            <span className="font-bold text-red-600">{eq.avgDowntimeHours} h/mo</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveEquipment(idx)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Remove equipment unit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResetForm}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Form</span>
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => navigate('/mines')}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSubmitting ? 'Registering Mine & Fleet...' : 'Register Mine to Network'}</span>
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Right 1 Col: Live Preview Card & Recently Registered Mines */}
        <div className="space-y-6">
          {/* Live Preview Card */}
          <Card className="p-5 bg-gradient-to-b from-white to-slate-50/80 border border-sky-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-600" />
                Live Directory Preview
              </span>
              <AlertBadge level={formData.riskLevel} />
            </div>

            {/* Simulated Directory Card */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {formData.name || 'Untitled Mine'}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>
                      {formData.district || 'District'}, {formData.state || 'State'}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {formData.code || 'CODE'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 my-2.5 text-[11px]">
                <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
                  {formData.mineType}
                </span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  Depth: {formData.depthMeters}m
                </span>
                <span className="bg-sky-50 text-sky-700 font-medium px-2 py-0.5 rounded">
                  {formData.status}
                </span>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs mb-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Proved Reserves
                  </span>
                  <strong className="text-slate-800 text-sm">
                    {formData.reservesMT || 0} MT
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Daily Target
                  </span>
                  <strong className="text-slate-800 text-sm">
                    {formatNumber(Math.round((Number(formData.monthlyTargetMT) || 0) / 30))} MT/d
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Avg Grade
                  </span>
                  <strong className="text-cyan-700 text-sm">
                    {formData.avgManganeseGrade || 0}% Mn
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Shortfall
                  </span>
                  <strong
                    className={`text-sm flex items-center gap-0.5 ${
                      isShortfallHigh ? 'text-red-600' : 'text-emerald-600'
                    }`}
                  >
                    {isShortfallHigh ? (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    )}
                    {formatPercentage(previewShortfallPct)}
                  </strong>
                </div>
              </div>

              {/* Telemetry Micro-Pill Preview */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600 mb-3">
                <div className="flex items-center justify-between px-2 py-1 bg-slate-50 border border-slate-100 rounded">
                  <span>Water Influx</span>
                  <strong>{formData.waterInfluxLpm || 0} L/m</strong>
                </div>
                <div className="flex items-center justify-between px-2 py-1 bg-slate-50 border border-slate-100 rounded">
                  <span>Seismic 24h</span>
                  <strong>{formData.microseismicEvents24h || 0} ev</strong>
                </div>
              </div>

              {/* Machinery Fleet Preview Section */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">
                    <Wrench className="w-3 h-3 text-cyan-600" />
                    Fleet Configured:
                  </span>
                  <span className="font-bold text-slate-900">{equipmentFleet.length} Units</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100">
                  <span>Avg Fleet Health</span>
                  <strong className="text-cyan-700">{fleetMetrics.avgHealth}%</strong>
                </div>

                <div className="flex flex-wrap gap-1 mt-1.5">
                  {equipmentFleet.slice(0, 4).map((eq, i) => (
                    <span
                      key={i}
                      className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-mono truncate max-w-[120px]"
                    >
                      {eq.tag || eq.name}
                    </span>
                  ))}
                  {equipmentFleet.length > 4 && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-cyan-50 text-cyan-700 rounded font-medium">
                      +{equipmentFleet.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              Real-time directory card rendering
            </p>
          </Card>

          {/* Success / Last Added Mine Callout */}
          <AnimatePresence>
            {lastAddedMine && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="p-4 bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-emerald-100 rounded-full text-emerald-700 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-emerald-900">
                        {lastAddedMine.name} Commissioned!
                      </h4>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        Mine registered and machinery fleet synced with equipment portal.
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => {
                            selectMine(lastAddedMine.id);
                            navigate('/');
                          }}
                          className="bg-white hover:bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold"
                        >
                          <span>Open Dashboard</span>
                        </Button>
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => navigate('/equipment')}
                          className="bg-white hover:bg-cyan-50 text-cyan-800 border-cyan-300 font-semibold flex items-center gap-1"
                        >
                          <Wrench className="w-3 h-3 text-cyan-600" />
                          <span>View in Equipment</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => navigate('/mines')}
                          className="text-emerald-800 hover:bg-emerald-100/80 font-semibold"
                        >
                          <span>Mines List</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Custom Registered Mines List */}
          <Card className="p-5 bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Pickaxe className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Custom Registered Mines ({customMines.length})
                </h3>
              </div>
              {customMines.length > 0 && (
                <button
                  type="button"
                  onClick={resetMines}
                  className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                  title="Reset to default 9 MOIL mines"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {customMines.length === 0 ? (
              <div className="text-center py-6 px-4 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                <Pickaxe className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-slate-600">No custom mines registered yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Mines you register with the form on the left will appear here and persist across reloads.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {customMines.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-slate-50 hover:bg-sky-50/40 border border-slate-200 hover:border-sky-300 rounded-lg transition-colors flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {m.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 font-mono">
                          {m.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span>{m.district}, {m.state}</span>
                        <span>•</span>
                        <span>{m.reservesMT} MT</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => {
                          selectMine(m.id);
                          navigate('/mines');
                        }}
                        className="text-[11px] py-1 px-2 font-medium"
                      >
                        <span>View</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
