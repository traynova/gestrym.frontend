import React, { Component, ErrorInfo, ReactNode } from 'react';
import NutritionDashboard from '../../components/nutrition/NutritionDashboard';
import TrainerNutritionDashboard from '../../components/nutrition/TrainerNutritionDashboard';
import { useAuthStore } from '../../store/useAuthStore';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Nutrition Module Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-900/10 border border-red-500/20 rounded-3xl text-center">
          <h2 className="text-xl font-black text-white mb-2 uppercase">Algo salió mal en el módulo de Nutrición</h2>
          <p className="text-red-400 text-sm mb-4">{this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-xs uppercase"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const NutritionView: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {user.role_id === 2 || user.role_id === 3 ? (
        <TrainerNutritionDashboard />
      ) : (
        <NutritionDashboard />
      )}
    </ErrorBoundary>
  );
};

export default NutritionView;
