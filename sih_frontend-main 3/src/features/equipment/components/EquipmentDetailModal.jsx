import { useState } from 'react';
import { toast } from 'sonner';
import {
  Wrench,
  Activity,
  Calendar,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Send,
  MapPin,
  Cpu,
  History,
} from 'lucide-react';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';

export default function EquipmentDetailModal({ isOpen, onClose, equipment, onScheduleSuccess }) {
  const [activeTab, setActiveTab] = useState('telemetry'); // telemetry | history | schedule
  const [scheduledDate, setScheduledDate] = useState('');
  const [maintenanceNote, setMaintenanceNote] = useState('');
  const [technician, setTechnician] = useState('Senior Mine Engineer');

  if (!equipment) return null;

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!scheduledDate) {
      toast.error('Please select a valid scheduled service date.');
      return;
    }

    toast.success(`Maintenance Scheduled for ${equipment.tag}!`, {
      description: `Service booked for ${scheduledDate}. Assigned technician: ${technician}.`,
    });

    if (onScheduleSuccess) {
      onScheduleSuccess(equipment.id, scheduledDate, maintenanceNote);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Equipment Telemetry & Maintenance — ${equipment.tag}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5">
        {/* Header Metadata */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{equipment.name}</h3>
              <span className="text-xs font-mono bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded">
                {equipment.tag}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>{equipment.model}</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {equipment.mineName} ({equipment.mineType})
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Health Index</span>
              <span className="text-lg font-extrabold text-slate-900">{equipment.healthScore}%</span>
            </div>
            <div className="w-12 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${
                  equipment.healthScore >= 85
                    ? 'bg-emerald-500'
                    : equipment.healthScore >= 65
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${equipment.healthScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 text-xs font-medium text-slate-600 gap-4">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`pb-2.5 flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'telemetry'
                ? 'border-cyan-600 text-cyan-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Live Telemetry & Diagnostics</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'history'
                ? 'border-cyan-600 text-cyan-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Maintenance Log</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-2.5 flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'schedule'
                ? 'border-cyan-600 text-cyan-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Schedule Maintenance</span>
          </button>
        </div>

        {/* Tab 1: Live Telemetry */}
        {activeTab === 'telemetry' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400">Avg Downtime</span>
                <p className="text-base font-bold text-red-600 mt-0.5">{equipment.avgDowntimeHours} hrs/mo</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400">Availability</span>
                <p className="text-base font-bold text-cyan-700 mt-0.5">{equipment.availabilityPct}%</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400">MTBF</span>
                <p className="text-base font-bold text-slate-800 mt-0.5">{equipment.mtbfHours} hrs</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400">MTTR</span>
                <p className="text-base font-bold text-slate-800 mt-0.5">{equipment.mttrHours} hrs</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-600" />
                Diagnostic Sensor Telemetry
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {equipment.telemetry?.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-xs text-slate-500 block">{t.label}</span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5">{t.value}</span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.status === 'CRITICAL'
                            ? 'bg-red-100 text-red-700'
                            : t.status === 'WARNING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {t.status}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Threshold {t.limit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Prescriptive Maintenance Action
              </span>
              <p className="text-xs text-amber-800 leading-relaxed">{equipment.recommendedAction}</p>
            </div>
          </div>
        )}

        {/* Tab 2: Maintenance History */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Historical Service & Repair Audit Log
            </h4>
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {equipment.maintenanceHistory?.map((log, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                      {log.date}
                    </span>
                    <span className="bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                      {log.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{log.notes}</p>
                  <span className="text-[11px] text-slate-400 block">Technician: {log.technician}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Schedule Maintenance */}
        {activeTab === 'schedule' && (
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scheduled Service Date *
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Maintenance Engineer
                </label>
                <input
                  type="text"
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maintenance Instructions & Spare Part Notes
              </label>
              <textarea
                rows={3}
                placeholder="Enter specific instructions, component part numbers, or diagnostic remarks..."
                value={maintenanceNote}
                onChange={(e) => setMaintenanceNote(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Confirm Service Booking</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
