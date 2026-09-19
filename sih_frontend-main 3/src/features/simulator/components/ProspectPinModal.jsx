import { useState } from 'react';
import { useSimulationContext } from '@/context';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/Button/Button';
import RangeSlider from '@/components/common/Slider/RangeSlider';

export default function ProspectPinModal({ isOpen, onClose }) {
  const { addProspectPin } = useSimulationContext();
  const [name, setName] = useState('');
  const [lat, setLat] = useState(21.65);
  const [lng, setLng] = useState(79.80);
  const [grade, setGrade] = useState(40);
  const [depth, setDepth] = useState(150);

  const handleSubmit = () => {
    if (!name.trim()) return;
    addProspectPin({
      name: name.trim(),
      coordinates: [lat, lng],
      estimatedGradeMn: grade,
      depthEstimateMeters: depth,
      confidenceScore: Math.round(Math.random() * 30 + 60),
    });
    onClose();
    setName('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Drop Prospecting Pin">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Pin Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Prospect Alpha-7"
            className="mt-1.5 w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 shadow-2xs"
          />
        </div>
        <RangeSlider label="Latitude" value={lat} onChange={setLat} min={20} max={23} step={0.001} />
        <RangeSlider label="Longitude" value={lng} onChange={setLng} min={78} max={82} step={0.001} />
        <RangeSlider label="Est. Mn Grade" value={grade} onChange={setGrade} min={10} max={55} step={0.5} unit="%" />
        <RangeSlider label="Est. Depth" value={depth} onChange={setDepth} min={20} max={500} step={10} unit=" m" />
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">Drop Pin</Button>
        </div>
      </div>
    </Modal>
  );
}
