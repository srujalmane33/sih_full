import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useUIContext } from '@/context';
import UserNav from './UserNav';

export default function Header() {
  const { toggleSidebar } = useUIContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const notifRef = useRef(null);

  // Close notifications popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const sampleNotifications = [
    {
      id: 1,
      title: 'Sentinel-2B Satellite Pass Completed',
      time: '22:24:31 IST',
      desc: 'Spectral band ratio & SAR ground subsidence telemetry updated for Balaghat & Dongri Buzurg.',
      type: 'satellite',
    },
    {
      id: 2,
      title: 'Equipment Breakdown Alert',
      titleColor: 'text-red-700',
      time: '22:15:00 IST',
      desc: 'Shaft Hoisting Winch Motor (BGT-HW-1200) bearing thermal trip reported on Level-2.',
      type: 'critical',
    },
    {
      id: 3,
      title: 'Production Shortfall Alert',
      time: '21:45:00 IST',
      desc: 'Balaghat Deep Incline shortfall rate reached 25.3% due to Level-6 water ingress.',
      type: 'warning',
    },
  ];

  const handleMarkAllRead = () => {
    setUnreadCount(0);
    toast.success('All system notifications marked as read.');
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-3 md:px-6 sticky top-0 z-30 shadow-2xs">
      {/* Left section: Sidebar toggle, Logo, Title */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <img src="/assets/icons/moil-logo.svg" alt="MANGANAI" className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />
          <div className="hidden sm:block">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight tracking-tight">MANGANAI</h1>
            <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest">Manganese Reserve Intelligence</p>
          </div>
        </div>
      </div>

      {/* Right section: Notifications Bell Icon & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Interactive Notifications Bell Icon */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="System Notifications & Telemetry Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover Dropdown with Framer Motion Animation */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">System Telemetry & Alerts</h3>
                    {unreadCount > 0 && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-cyan-600 hover:text-cyan-800 font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {sampleNotifications.map((n) => (
                    <div key={n.id} className="p-3.5 hover:bg-slate-50/80 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-xs font-bold ${n.titleColor || 'text-slate-900'}`}>{n.title}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 text-center">
                  <span className="text-[11px] text-slate-500 font-medium">Telemetry sync active</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <UserNav />
      </div>
    </header>
  );
}
