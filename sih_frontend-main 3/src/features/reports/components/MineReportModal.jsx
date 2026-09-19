import { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Gauge,
  Truck,
  CloudRain,
  Shield,
  Layers,
  Wrench,
  Radio,
} from 'lucide-react';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';
import AlertBadge from '@/components/common/AlertBadge/AlertBadge';
import { formatNumber, formatPercentage } from '@/utils/formatters';

export default function MineReportModal({ isOpen, onClose, mine }) {
  const printRef = useRef(null);

  if (!mine) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(mine, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${mine.id}_report_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const generatedDate = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Mine Report — ${mine.name}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1" ref={printRef}>
        {/* Report Official Letterhead */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/assets/icons/moil-logo.svg" alt="MOIL" className="w-10 h-10" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">MANGANAI</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold uppercase">
                  Official Intelligence Report
                </span>
              </div>
              <p className="text-xs text-slate-500">Ministry of Steel • MOIL Ltd. Telemetry Network</p>
            </div>
          </div>
          <div className="text-left sm:text-right text-xs text-slate-500">
            <div className="flex items-center gap-1.5 sm:justify-end">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-700">{generatedDate} IST</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Ref: MOIL-INTEL-{mine.code}-{new Date().getFullYear()}</p>
          </div>
        </div>

        {/* Mine Metadata Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-[10px] font-semibold uppercase text-slate-400">Mine Type</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{mine.mineType}</p>
            <span className="text-[10px] text-slate-500">Depth: {mine.depthMeters} m</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-[10px] font-semibold uppercase text-slate-400">Location</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{mine.district}</p>
            <span className="text-[10px] text-slate-500">{mine.state}</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-[10px] font-semibold uppercase text-slate-400">Mineral Form</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5 truncate" title={mine.mineralForm}>{mine.mineralForm}</p>
            <span className="text-[10px] text-slate-500">Coordinates: {mine.coordinates.join(', ')}</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-[10px] font-semibold uppercase text-slate-400">Overall Status</span>
            <div className="mt-1">
              <AlertBadge level={mine.riskLevel} />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Risk Score: {mine.riskScore}/100</span>
          </div>
        </div>

        {/* Core KPI Metrics */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-sky-600" />
            Executive Production & Reserve Summary
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-xl">
              <span className="text-[10px] font-bold text-amber-700 uppercase">Total Reserves</span>
              <p className="text-xl font-extrabold text-slate-900 mt-1">{mine.reservesMT} <span className="text-xs font-normal text-slate-500">M MT</span></p>
            </div>
            <div className="p-3.5 bg-red-50/50 border border-red-200/80 rounded-xl">
              <span className="text-[10px] font-bold text-red-700 uppercase">Projected Shortfall</span>
              <p className="text-xl font-extrabold text-red-600 mt-1">{formatNumber(mine.projectedShortfallMT)} <span className="text-xs font-normal text-slate-500">MT</span></p>
              <span className="text-[10px] text-red-500 font-semibold">{mine.shortfallPct}% loss</span>
            </div>
            <div className="p-3.5 bg-cyan-50/50 border border-cyan-200/80 rounded-xl">
              <span className="text-[10px] font-bold text-cyan-700 uppercase">Avg Mn Grade</span>
              <p className="text-xl font-extrabold text-slate-900 mt-1">{mine.avgManganeseGrade}%</p>
            </div>
            <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Fleet Availability</span>
              <p className="text-xl font-extrabold text-slate-900 mt-1">{mine.fleetAvailabilityPct}%</p>
            </div>
          </div>
        </div>

        {/* Operational Telemetry & Environmental Sensors */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-sky-600" />
            IoT Environmental & Telemetry Sensor Data
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="text-slate-500">24h Rainfall:</span>
              <span className="font-bold text-slate-800">{mine.telemetry.rainfall24h} mm</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="text-slate-500">Groundwater Inflow:</span>
              <span className="font-bold text-slate-800">{mine.telemetry.groundwaterInflow} m³/h</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="text-slate-500">Rock Hardness:</span>
              <span className="font-bold text-slate-800">{mine.telemetry.rockHardnessMohs} Mohs</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="text-slate-500">Machine Downtime:</span>
              <span className="font-bold text-slate-800">{mine.telemetry.equipmentDowntime} hrs</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="text-slate-500">Active Fleet Units:</span>
              <span className="font-bold text-slate-800">{mine.telemetry.activeFleetCount}</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="text-slate-500">Slope Stability (FoS):</span>
              <span className="font-bold text-slate-800">{mine.telemetry.slopeStabilityFactor}</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="text-slate-500">Soil Moisture Index:</span>
              <span className="font-bold text-slate-800">{mine.telemetry.soilMoistureIndex}%</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="text-slate-500">SAR Subsidence:</span>
              <span className="font-bold text-slate-800">{mine.satellite.sarSubsidenceMm} mm</span>
            </div>
          </div>
        </div>

        {/* Zone Breakdown Table */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            Zone-Wise Operational Status & Shortfall ({mine.zones.length} Sectors)
          </h4>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Zone Code</th>
                  <th className="py-2.5 px-3">Zone Name</th>
                  <th className="py-2.5 px-3">Risk Level</th>
                  <th className="py-2.5 px-3">Target (MT)</th>
                  <th className="py-2.5 px-3">Actual (MT)</th>
                  <th className="py-2.5 px-3">Shortfall (MT)</th>
                  <th className="py-2.5 px-3">Mn Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mine.zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{zone.code}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">{zone.name}</td>
                    <td className="py-2.5 px-3"><AlertBadge level={zone.riskLevel} /></td>
                    <td className="py-2.5 px-3 text-slate-700 font-mono">{formatNumber(zone.monthlyTargetMT)}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-mono">{formatNumber(zone.actualProductionMT)}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-red-600">-{formatNumber(zone.shortfallMT)} ({zone.shortfallPct}%)</td>
                    <td className="py-2.5 px-3 text-slate-700 font-mono">{zone.oreGrade}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI & Prescriptive Directives */}
        <div className="p-4 bg-sky-50/60 border border-sky-200/80 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-600" />
            <h5 className="text-xs font-bold text-sky-950 uppercase tracking-wider">AI Predictive Bottleneck & Mitigation Directive</h5>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-900">Identified Bottleneck: </span>
            {mine.primaryBottleneck}
          </p>
          <p className="text-xs text-sky-900 font-medium bg-white/80 p-2.5 rounded-lg border border-sky-100 leading-relaxed">
            <span className="font-bold text-sky-950">Recommended Prescriptive Action: </span>
            {mine.recommendedAction}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <span className="text-[11px] text-slate-400">Generated securely by MANGANAI Decision Support Engine</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadJSON} className="text-xs gap-1.5">
              <Download className="w-3.5 h-3.5" /> Download JSON
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint} className="text-xs gap-1.5">
              <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
            </Button>
            <Button variant="secondary" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
