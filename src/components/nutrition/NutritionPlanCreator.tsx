import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, 
  Plus, 
  Save, 
  ChevronRight, 
  ChevronLeft, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { nutritionService } from '../../api/nutritionService';
import { Meal, CreateMealPlanDto } from '../../types/nutrition';
import { toast } from 'react-hot-toast';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function NutritionPlanCreator({ onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [isAIActive, setIsAIActive] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [planData, setPlanData] = useState<CreateMealPlanDto>({
    name: '',
    description: '',
    meals: [
      { name: 'Desayuno', time: '08:00', calories: 0, protein: 0, carbs: 0, fats: 0, foods: [] }
    ]
  });

  const handleGenerateAI = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const generatedPlan = await nutritionService.generateAIMealPlan(aiPrompt);
      setPlanData({
        name: generatedPlan.name,
        description: generatedPlan.description,
        meals: generatedPlan.meals,
        isAI: true
      });
      setStep(2);
      toast.success('¡Plan generado con éxito!');
    } catch (error) {
      toast.error('Error al generar el plan con IA');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!planData.name) {
      toast.error('El nombre del plan es requerido');
      return;
    }
    try {
      await nutritionService.createMealPlan(planData);
      toast.success('Plan guardado exitosamente');
      onSuccess();
    } catch (error) {
      toast.error('Error al guardar el plan');
    }
  };

  const addMeal = () => {
    setPlanData({
      ...planData,
      meals: [...planData.meals, { name: 'Nueva Comida', time: '12:00', calories: 0, protein: 0, carbs: 0, fats: 0, foods: [] }]
    });
  };

  const removeMeal = (index: number) => {
    const newMeals = [...planData.meals];
    newMeals.splice(index, 1);
    setPlanData({ ...planData, meals: newMeals });
  };

  const updateMeal = (index: number, field: keyof Meal, value: any) => {
    const newMeals = [...planData.meals];
    (newMeals[index] as any)[field] = value;
    setPlanData({ ...planData, meals: newMeals });
  };

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            {isAIActive ? 'Generar con IA' : 'Crear Plan Nutricional'}
          </h2>
          <p className="text-slate-500 font-bold text-sm">Paso {step} de 2</p>
        </div>
        <button 
          onClick={() => setIsAIActive(!isAIActive)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase transition-all ${
            isAIActive ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {isAIActive ? 'Cambiar a Manual' : 'Usar IA'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {isAIActive ? (
              <div className="space-y-4">
                <div className="p-6 bg-purple-600/10 border border-purple-500/20 rounded-2xl">
                  <h3 className="text-purple-400 font-black uppercase text-xs mb-4 flex items-center gap-2">
                    <Wand2 className="w-4 h-4" /> Instrucciones para la IA
                  </h3>
                  <textarea 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ej: Crea un plan de 2500kcal para ganar masa muscular, soy vegetariano y entreno por las mañanas..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none min-h-[150px] resize-none"
                  />
                </div>
                <button 
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !aiPrompt}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-purple-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Sparkles className="w-5 h-5" /> Generar Plan Mágico</>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nombre del Plan</label>
                  <input 
                    type="text" 
                    value={planData.name}
                    onChange={(e) => setPlanData({...planData, name: e.target.value})}
                    placeholder="Ej: Definición Extrema"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Descripción</label>
                  <textarea 
                    value={planData.description}
                    onChange={(e) => setPlanData({...planData, description: e.target.value})}
                    placeholder="Objetivos, recomendaciones..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-600 focus:outline-none transition-all min-h-[100px]"
                  />
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2"
                >
                  Siguiente <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {planData.meals.map((meal, index) => (
                <div key={index} className="bg-black/40 border border-white/5 rounded-2xl p-6 relative group">
                  <button 
                    onClick={() => removeMeal(index)}
                    className="absolute top-4 right-4 p-2 text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-500">Nombre</label>
                      <input 
                        type="text" 
                        value={meal.name}
                        onChange={(e) => updateMeal(index, 'name', e.target.value)}
                        className="w-full bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-red-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-500">Hora</label>
                      <input 
                        type="time" 
                        value={meal.time}
                        onChange={(e) => updateMeal(index, 'time', e.target.value)}
                        className="w-full bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-red-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['calories', 'protein', 'carbs', 'fats'].map((macro) => (
                      <div key={macro} className="space-y-1">
                        <label className="text-[8px] font-black uppercase text-slate-600">{macro === 'calories' ? 'kcal' : macro[0]}</label>
                        <input 
                          type="number" 
                          value={(meal as any)[macro]}
                          onChange={(e) => updateMeal(index, macro as any, parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-white/5 rounded-lg px-2 py-1.5 text-center text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={addMeal}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" /> Añadir Comida
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20"
              >
                <Save className="w-4 h-4" /> Guardar Plan
              </button>
            </div>
            
            <button 
              onClick={() => setStep(1)}
              className="w-full py-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Volver a info básica
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
