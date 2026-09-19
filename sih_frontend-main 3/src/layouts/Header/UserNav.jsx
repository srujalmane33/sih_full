import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function UserNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
        <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white shadow-2xs">
          <User className="w-4 h-4" />
        </div>
        <span className="hidden md:block text-xs font-semibold text-slate-800">Admin</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
          <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Settings className="w-4 h-4 text-slate-500" /> Settings
          </button>
          <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
