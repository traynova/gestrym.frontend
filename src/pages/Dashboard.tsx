import { useAuthStore } from '../store/useAuthStore';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ClientsView } from './dashboard/ClientsView';
import { ClientDashboard } from './dashboard/ClientDashboard';

export default function Dashboard() {
  const { user } = useAuthStore();

  // Si es Cliente (Role 1), mostramos su vista específica con progreso
  if (user?.role_id === 1) {
    return (
      <DashboardLayout>
        {/* Usamos el ID casteado a any temporalmente o extraído si existe en el estado de Zustand */}
        <ClientDashboard userId={(user as any).id || 0} />
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
