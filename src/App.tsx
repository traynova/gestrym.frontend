import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PricingPage from './pages/PricingPage';
import Dashboard from './pages/Dashboard';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ConfirmEmailPage } from './pages/auth/ConfirmEmailPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { SetupBrandingPage } from './pages/auth/SetupBrandingPage';
import { ExercisesPage, TrainingPlansPage, TrainingDetailPage } from './pages/training';
import { CreateTrainingPlanPage } from './pages/training/CreateTrainingPlanPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { RoleRoute } from './components/layout/RoleRoute';

// App component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setup-branding" element={<SetupBrandingPage />} />

          {/* Training Module Routes */}
          <Route path="/training/plans" element={<TrainingPlansPage />} />
          <Route path="/training/:planId" element={<TrainingDetailPage />} />
          <Route path="/training/exercises" element={<ExercisesPage />} />

          {/* Trainer and Gym Routes */}
          <Route element={<RoleRoute allowedRoles={[2, 3]} />}>
            <Route path="/training/create" element={<CreateTrainingPlanPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
