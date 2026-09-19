import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Mountain, MapPin } from 'lucide-react';
import { useZoneContext } from '@/context';

export default function MineSelectorDropdown({ align = 'left' }) {
  const { minesList, selectedMineId, selectedMine, selectMine } = useZoneContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const dropdownRef = useRef(null);

  // Dropdown is open if hovered OR if user clicked to pin it open
  const isOpen = isHovered || isPinned;

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPinned(false);
        setIsHovered(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleButtonClick = (e) => {
    e.stopPropagation();
    setIsPinned((prev) => !prev);
  };

  const handleSelect = (mineId) => {
    selectMine(mineId);
    setIsPinned(false);
    setIsHovered(false);
  };

  return (
    <div
      className="relative inline-block z-50"
      ref={dropdownRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dropdown trigger button */}
      <button
        type="button"
        onClick={handleButtonClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border rounded-lg text-xs font-semibold transition-all shadow-2xs group ${
          isOpen
            ? 'border-sky-500 ring-2 ring-sky-500/20 text-sky-700 bg-sky-50/40'
            : 'border-slate-200 text-slate-700 hover:border-slate-300'
        }`}
        title="Click to lock open or hover to select MOIL mine"
      >
        <Mountain className="w-3.5 h-3.5 text-sky-600 group-hover:scale-105 transition-transform" />
        <span className="truncate max-w-[130px] sm:max-w-[170px]">
          {selectedMine?.name || 'Select Mine'}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-sky-600' : ''
          }`}
        />
      </button>

      {/* Downward popup menu with smooth Framer Motion drop animation and z-[100] stacking */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute ${
              align === 'right' ? 'right-0' : 'left-0'
            } top-full mt-1.5 w-64 sm:w-72 bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-[100]`}
          >
            <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                MOIL Operational Mines
              </span>
              <span className="text-[10px] text-sky-600 font-semibold">
                {minesList.length} Mines
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-50">
              {minesList.map((mine) => {
                const isSelected = selectedMineId === mine.id;
                return (
                  <button
                    key={mine.id}
                    onClick={() => handleSelect(mine.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors group ${
                      isSelected
                        ? 'bg-sky-50/80 text-sky-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                        }`}
                      >
                        <Mountain className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 truncate">{mine.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 uppercase font-mono">
                            {mine.mineType === 'Underground' ? 'UG' : 'OC'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>
                            {mine.district}, {mine.state}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-slate-500">{mine.reservesMT}M MT</span>
                        </div>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-sky-600 flex-shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
