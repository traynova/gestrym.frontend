import { useAuthStore } from '../store/useAuthStore';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const { logoutAction } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <button 
            onClick={() => void logoutAction()}
            className="flex items-center gap-2 px-4 py-2 bg-white text-rose-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Example cards */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 font-medium mb-1">Clientes Activos</h3>
            <p className="text-4xl font-bold text-slate-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 font-medium mb-1">Ingresos Mensuales</h3>
            <p className="text-4xl font-bold text-slate-900">$0</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 font-medium mb-1">Planes Asignados</h3>
            <p className="text-4xl font-bold text-slate-900">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
