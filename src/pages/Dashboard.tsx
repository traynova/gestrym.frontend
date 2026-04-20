import { useAuthStore } from '../store/useAuthStore';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ClientsView } from './dashboard/ClientsView';

export default function Dashboard() {
  const { user } = useAuthStore();

  // Si es Cliente (Role 1), mostramos su vista específica (Placeholder por ahora)
  if (user?.role_id === 1) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
          <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center border border-red-600/20">
             <img src="/assets/images/LOGO_G.png" alt="G" className="w-12 h-12" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-black text-white mb-2">Bienvenido a Gestrym</h2>
            <p className="text-slate-500 font-medium">Estamos preparando tu sección personalizada.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Vista para Entrenador (2) y Gimnasio (3)
  return (
    <DashboardLayout>
      <ClientsView />
    </DashboardLayout>
  );
}
