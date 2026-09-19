import { useState } from 'react';
import { FileText, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useZoneContext } from '@/context';
import MineReportModal from './MineReportModal';

export default function GenerateReportCard() {
  const { selectedMine } = useZoneContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate compilation of telemetry & AI models
    setTimeout(() => {
      setIsGenerating(false);
      setShowModal(true);
      toast.success(`Executive report generated for ${selectedMine?.name || 'Selected Mine'}!`, {
        description: 'Complete sensor telemetry, shortfall analytics, and AI recommendations compiled.',
      });
    }, 900);
  };

  return (
    <>
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Generate Mine Report</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Generate detailed intelligence & shortfall report for <span className="font-semibold text-slate-700">{selectedMine?.name || 'selected mine'}</span>.
            </p>
          </div>
          <span className="p-2 bg-sky-50 text-sky-600 rounded-lg flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </span>
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Report...</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>Generate {selectedMine?.name || 'Mine'} Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      <MineReportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mine={selectedMine}
      />
    </>
  );
}
