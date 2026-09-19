import { LayoutDashboard, Map, FlaskConical, FileText, Settings, Pickaxe, Wrench, PlusCircle } from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'mines', label: 'Mines', icon: Pickaxe, path: '/mines' },
  { id: 'add-mines', label: 'Add Mines', icon: PlusCircle, path: '/add-mines' },
  { id: 'equipment', label: 'Equipment & Downtime', icon: Wrench, path: '/equipment' },
  { id: 'map', label: 'Map Explorer', icon: Map, path: '/map' },
  { id: 'simulator', label: 'Simulator', icon: FlaskConical, path: '/simulator' },
  { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];
