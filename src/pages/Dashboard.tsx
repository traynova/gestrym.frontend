import { useAuthStore } from '../store/useAuthStore';
import { ClientsView } from './dashboard/ClientsView';
import { ClientDashboard } from './dashboard/ClientDashboard';

export default function Dashboard() {
  const { user } = useAuthStore();

  // Si es Cliente (Role 1), mostramos su vista específica con progreso
  if (user?.role_id === 1) {
    return <ClientDashboard userId={(user as any).id || 0} />;
  }

  // Vista para Entrenador (2) y Gimnasio (3)
  return <ClientsView />;
}
