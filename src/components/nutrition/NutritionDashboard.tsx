import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Coffee, 
  Sun, 
  Moon, 
  Apple,
  Clock,
  Trash2,
  Utensils,
  Sparkles
} from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';

import { nutritionService } from '../../api/nutritionService';
import MacroCard from './MacroCard';
import FoodSearchModal from './FoodSearchModal';
import AIAdjustmentPanel from './AIAdjustmentPanel';
import MealPlanCard from './MealPlanCard';
import NutritionPlanCreator from './NutritionPlanCreator';

const NutritionDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const { data: nutritionData, isLoading } = useQuery({
    queryKey: ['nutrition', dateStr],
    queryFn: () => nutritionService.getDailyLogs(dateStr),
  });

  const { data: mealPlans } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: () => nutritionService.getMealPlans(),
  });

  const changeDate = (days: number) => {
    setSelectedDate(prev => days > 0 ? addDays(prev, 1) : subDays(prev, 1));
  };

  const mealIcons: Record<string, any> = {
    'Breakfast': Coffee,
    'Lunch': Sun,
    'Dinner': Moon,
    'Snack': Apple,
  };

  const groupedFoods = (nutritionData?.data?.foods || []).reduce((acc, log) => {
    if (!acc[log.mealType]) acc[log.mealType] = [];
    acc[log.mealType].push(log);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header with Date Selector */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight">NUTRICIÓN</h1>
            <p className="text-gray-400">Controla tu combustible y optimiza tus resultados.</p>
          </div>
          
          <div className="flex items-center bg-gray-900/50 border border-white/10 rounded-2xl p-1">
            <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div className="px-6 py-2 flex items-center gap-3 font-bold min-w-[180px] justify-center">
              <Calendar className="w-4 h-4 text-emerald-500" />
              {format(selectedDate, 'EEE, MMM d')}
            </div>
            <button onClick={() => changeDate(1)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </header>

        {/* Top Panels: Macros and AI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="h-64 bg-gray-900/50 rounded-3xl animate-pulse" />
            ) : nutritionData ? (
              <MacroCard 
                totals={nutritionData.data.totals} 
                goals={nutritionData.data.goals} 
                progress={nutritionData.data.progress} 
              />
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-900/50 rounded-3xl border border-dashed border-white/10">
                <p className="text-gray-500">No hay datos para esta fecha.</p>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <AIAdjustmentPanel />
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Clock className="w-6 h-6 text-emerald-500" />
            Registro de Hoy
          </h2>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Añadir Alimento
          </button>
        </div>

        {/* Food Groups */}
        <div className="space-y-6">
          {Object.entries(groupedFoods).length > 0 ? (
            Object.entries(groupedFoods).map(([mealType, foods]) => {
              const Icon = mealIcons[mealType] || Apple;
              return (
                <div key={mealType} className="space-y-4">
                  <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {mealType}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {foods.map((log) => (
                      <motion.div
                        layout
                        key={log.id}
                        className="group flex items-center justify-between p-4 bg-gray-900/30 border border-white/5 rounded-2xl hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden">
                            {log.food.imageUrl ? (
                                <img src={log.food.imageUrl} alt={log.food.name} className="w-full h-full object-cover" />
                            ) : (
                                <Utensils className="w-6 h-6 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{log.food.name}</p>
                            <p className="text-xs text-gray-500">{log.quantity}g</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-black text-white">{log.calories} <span className="text-[10px] text-gray-500 font-normal uppercase">kcal</span></p>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg transition-all">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center space-y-4 bg-gray-900/20 rounded-3xl border border-dashed border-white/5">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                <Utensils className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-500">Aún no has registrado alimentos hoy.</p>
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-emerald-500 font-bold hover:underline"
              >
                Comenzar a trackear
              </button>
            </div>
          )}
        </div>

        {/* Meal Plans Section */}
        <div className="pt-12 border-t border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Utensils className="w-6 h-6 text-emerald-500" />
              Planes Alimenticios
            </h2>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsCreatorOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600/10 text-emerald-500 rounded-xl font-bold text-xs uppercase hover:bg-emerald-600/20 transition-all border border-emerald-500/20"
              >
                <Sparkles className="w-4 h-4" /> Crear Plan con IA
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealPlans?.map((plan) => (
              <MealPlanCard 
                key={plan.id}
                title={plan.name} 
                duration="Activo" 
                assignedBy={plan.assignedBy || 'Tú'} 
              />
            ))}
            
            <div 
              onClick={() => setIsCreatorOpen(true)}
              className="border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-600 group hover:border-emerald-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-8 h-8 mb-2 group-hover:text-emerald-500 transition-colors" />
              <p className="text-sm font-medium">Crear Plan Manual</p>
            </div>
          </div>
        </div>
      </div>

      <FoodSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        date={dateStr}
      />

      <AnimatePresence>
        {isCreatorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreatorOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl z-10"
            >
              <NutritionPlanCreator 
                onSuccess={() => setIsCreatorOpen(false)}
                onCancel={() => setIsCreatorOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NutritionDashboard;
