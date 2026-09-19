import { NavLink } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft } from 'lucide-react';
import { useUIContext } from '@/context';
import { NAVIGATION_ITEMS } from './NavigationItems';

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIContext();
  const [isNear, setIsNear] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mouseY, setMouseY] = useState(100);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth < 1024) return;
      if (!sidebarRef.current) return;
      const rect = sidebarRef.current.getBoundingClientRect();
      const PROXIMITY_MARGIN = 50; // 50px proximity zone outside sidebar edge
      const inX = e.clientX >= 0 && e.clientX <= rect.right + PROXIMITY_MARGIN;
      const inY = e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (inX && inY) {
        setIsNear(true);
        setMouseY(e.clientY - rect.top);
      } else {
        setIsNear(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sidebar expands if user explicitly opened it OR if cursor is hovered / near the sidebar
  const isExpanded = sidebarOpen || isHovered || isNear;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <aside
        ref={sidebarRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r transform transition-all duration-300 ease-in-out flex flex-col relative ${
          isExpanded
            ? 'w-64 translate-x-0 shadow-[8px_0_30px_-4px_rgba(6,182,212,0.15)]'
            : '-translate-x-full lg:translate-x-0 lg:w-16 shadow-xs'
        } ${
          isNear || isHovered
            ? 'border-r-sky-400/80'
            : 'border-r-slate-200'
        }`}
      >
        {/* Cursor Proximity Interactive Glow */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 overflow-hidden"
          style={{
            opacity: isNear || isHovered ? 1 : 0,
            background: `radial-gradient(240px circle at right ${mouseY}px, rgba(14, 165, 233, 0.12), transparent 70%)`,
          }}
        />

        {/* Right border reactive lightbeam */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-[2px] pointer-events-none transition-all duration-300 z-10 ${
            isNear || isHovered
              ? 'bg-gradient-to-b from-sky-400/30 via-cyan-500 to-sky-400/30 opacity-100 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
              : 'bg-transparent opacity-0'
          }`}
        />

        {/* Cursor proximity tracker bead on the border */}
        <div
          className="pointer-events-none absolute right-0 w-[3px] h-14 -mr-[1px] rounded-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent z-20"
          style={{
            top: `${Math.max(0, mouseY - 28)}px`,
            opacity: isNear || isHovered ? 1 : 0,
            boxShadow: '0 0 10px 2px rgba(6, 182, 212, 0.85)',
            transition: 'top 75ms ease-out, opacity 250ms ease-in-out',
          }}
        />

        {/* Close button mobile */}
        <div className="flex items-center justify-end p-3 lg:hidden relative z-10">
          <button
            onClick={toggleSidebar}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto relative z-10">
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200/80 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:translate-x-1'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 transition-colors ${
                      isActive ? 'text-cyan-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span
                    className={`transition-all duration-200 truncate ${
                      isExpanded ? 'opacity-100 block' : 'opacity-0 hidden lg:hidden'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar collapse/expand button (desktop) */}
        <div className="hidden lg:flex p-3 border-t border-slate-200 bg-slate-50/50 relative z-10">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`}
            />
            {isExpanded && <span className="truncate">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
