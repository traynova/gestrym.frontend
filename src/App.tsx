import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { RoleRoute } from './components/layout/RoleRoute';

// Mock components para el ejemplo de las rutas por roles
const MockClientDashboard = () => <div className="p-8 text-white">Dashboard Cliente (Role 1)</div>;
const MockCoachDashboard = () => <div className="p-8 text-white">Dashboard Coach (Role 2)</div>;
const MockGymDashboard = () => <div className="p-8 text-white">Dashboard Gym (Role 3)</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ===== EJEMPLO DE USO DE ROLEROUTE ===== */}
          {/* Dashboard Cliente - Role 1 */}
          <Route element={<RoleRoute allowedRoles={[1]} />}>
            <Route path="/client/dashboard" element={<MockClientDashboard />} />
          </Route>

          {/* Dashboard Entrenador - Role 2 */}
          <Route element={<RoleRoute allowedRoles={[2]} />}>
            <Route path="/coach/dashboard" element={<MockCoachDashboard />} />
          </Route>

          {/* Dashboard Gimnasio - Role 3 */}
          <Route element={<RoleRoute allowedRoles={[3]} />}>
            <Route path="/gym/dashboard" element={<MockGymDashboard />} />
          </Route>
          {/* ======================================= */}
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
