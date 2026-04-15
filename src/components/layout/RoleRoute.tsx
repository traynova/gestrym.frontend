import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface RoleRouteProps {
  allowedRoles: number[];
  children?: ReactNode;
}

export const RoleRoute = ({ allowedRoles, children }: RoleRouteProps) => {
  // Obtenemos el usuario del store (se asume que ProtectedRoute ya validó que existe y está autenticado)
  const { user } = useAuthStore();

  // Si por alguna razón no hay usuario, mandarlo al login
  if (!user || !user.role_id) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el rol del usuario está dentro de los roles permitidos
  if (!allowedRoles.includes(user.role_id)) {
    // Lógica para redirigir según el rol del usuario si intenta acceder a algo no permitido
    switch (user.role_id) {
      case 1:
        return <Navigate to="/client/dashboard" replace />;
      case 2:
        return <Navigate to="/coach/dashboard" replace />;
      case 3:
        return <Navigate to="/gym/dashboard" replace />;
      default:
        return <Navigate to="/unauthorized" replace />;
    }
  }

  // Si tiene permiso, renderizamos los hijos o el Outlet de React Router
  return children ? <>{children}</> : <Outlet />;
};
