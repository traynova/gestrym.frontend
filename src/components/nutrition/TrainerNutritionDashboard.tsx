import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  ChevronRight, 
  Utensils, 
  Plus,
  Send,
  MoreVertical,
  Activity
} from 'lucide-react';
import { nutritionService } from '../../api/nutritionService';
import { authApi } from '../../api/auth.endpoints';
import { MealPlan } from '../../types/nutrition';
import NutritionPlanCreator from './NutritionPlanCreator';
import { toast } from 'react-hot-toast';

export default function TrainerNutritionDashboard() {
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showPlanCreator, setShowPlanCreator] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<MealPlan[]>([]);

  useEffect(() => {
    fetchClients();
    fetchPlans();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await authApi.getRelationships();
      const allClients = [
        ...(response.independent_clients || []),
        ...((response.gym_clients || []).flatMap(g => g.clients) || [])
      ];
      setClients(allClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      const plans = await nutritionService.getMealPlans();
      setAvailablePlans(plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleAssignPlan = async (planId: string) => {
    if (!selectedClient) return;
    try {
      await nutritionService.assignMealPlan(planId, selectedClient.id.toString());
      toast.success(`Plan asignado a ${selectedClient.name}`);
      setSelectedClient(null);
    } catch (error) {
      toast.error('Error al asignar el plan');
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Gestión Nutricional</h1>
          <p className="text-slate-500 font-medium max-w-lg">Asigna y gestiona los planes alimenticios de tus alumnos.</p>
        </div>
        <button 
          onClick={() => setShowPlanCreator(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-red-600 text-white rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" /> Crear Nuevo Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clients List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar alumno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-red-600 transition-all"
            />
          </div>

          <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden max-h-[600px] overflow-y-auto custom-scrollbar">
            {filteredClients.map((client) => (
              <button 
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`w-full p-6 border-b border-white/5 flex items-center gap-4 transition-all hover:bg-white/5 text-left ${
                  selectedClient?.id === client.id ? 'bg-red-600/10 border-r-2 border-r-red-600' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-black border border-white/5">
                  {client.name[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-black text-white leading-tight">{client.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{client.email}</p>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedClient?.id === client.id ? 'translate-x-1 text-red-500' : 'text-slate-700'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Plan Assignment / Client Detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedClient ? (
              <motion.div 
                key="client-detail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-red-600/10 flex items-center justify-center border border-red-600/20">
                      <Utensils className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedClient.name}</h2>
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Estado: Sin plan asignado
                      </p>
                    </div>
                  </div>
                  <button className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Seleccionar Plan para Asignar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availablePlans.map((plan) => (
                      <div key={plan.id} className="bg-black/40 border border-white/5 rounded-2xl p-6 hover:border-red-600/50 transition-all group">
                        <h4 className="font-black text-white mb-1 uppercase text-sm">{plan.name}</h4>
                        <p className="text-[10px] text-slate-500 mb-4 line-clamp-2">{plan.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-red-500 bg-red-600/10 px-2 py-1 rounded-md">{plan.totalCalories} kcal</span>
                          <button 
                            onClick={() => handleAssignPlan(plan.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-black text-[10px] uppercase hover:bg-slate-200 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Send className="w-3 h-3" /> Asignar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-900/20 border border-dashed border-white/5 rounded-[2.5rem]"
              >
                <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Selecciona un alumno</h3>
                <p className="text-slate-500 text-sm max-w-xs font-medium">Elige un alumno de la lista para gestionar su nutrición o asignar un nuevo plan.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal Creator */}
      <AnimatePresence>
        {showPlanCreator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPlanCreator(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl z-10"
            >
              <NutritionPlanCreator 
                onSuccess={() => {
                  setShowPlanCreator(false);
                  fetchPlans();
                }}
                onCancel={() => setShowPlanCreator(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
