import { useState } from 'react';
import { ProgressDashboard } from '../../components/progress/ProgressDashboard';
import { AddMetricsModal } from '../../components/progress/AddMetricsModal';
import { AddPhotoModal } from '../../components/progress/AddPhotoModal';
import { Activity, Camera } from 'lucide-react';

interface ClientDashboardProps {
  userId: number;
}

export function ClientDashboard({ userId }: ClientDashboardProps) {
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    // Incrementing key forces re-mount of ProgressDashboard to fetch new data
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 p-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Mi Progreso</h1>
          <p className="text-slate-500 font-medium max-w-lg">
            Aquí puedes ver tu evolución. Registra tus medidas y sube fotos periódicamente.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsMetricsOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-700 transition-all shadow-lg active:scale-[0.98]"
          >
            <Activity className="w-4 h-4" /> Registrar Medidas
          </button>
          
          <button 
            onClick={() => setIsPhotoOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
          >
            <Camera className="w-4 h-4" /> Subir Foto
          </button>
        </div>
      </div>

      <ProgressDashboard key={refreshKey} userId={userId} />

      <AddMetricsModal 
        isOpen={isMetricsOpen} 
        onClose={() => setIsMetricsOpen(false)} 
        onSuccess={handleSuccess} 
      />

      <AddPhotoModal 
        isOpen={isPhotoOpen} 
        onClose={() => setIsPhotoOpen(false)} 
        onSuccess={handleSuccess} 
      />
    </div>
  );
}
