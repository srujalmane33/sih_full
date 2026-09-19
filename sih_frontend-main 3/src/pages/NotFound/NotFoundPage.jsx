import { useNavigate } from 'react-router-dom';
import { MapPinOff, ArrowLeft } from 'lucide-react';
import Button from '@/components/common/Button/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center mb-6">
        <MapPinOff className="w-10 h-10 text-slate-500" />
      </div>
      <h1 className="text-3xl font-bold text-slate-100 mb-2">404 — Sector Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md mb-8">
        The requested mine sector or resource does not exist in the MANGANAI intelligence network.
      </p>
      <Button variant="primary" onClick={() => navigate('/')}>
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </Button>
    </div>
  );
}
