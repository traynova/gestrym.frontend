import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Save, 
  ChevronRight, 
  ChevronLeft, 
  Dumbbell, 
  Target, 
  Zap,
  X,
  PlusCircle,
  LayoutGrid
} from "lucide-react";
import { useTrainingStore } from "@/store/useTrainingStore";
import { 
  TrainingLoadingSpinner, 
  MiniSpinner,
  ExerciseCard, 
  ExerciseFilters,
  ExerciseSkeletonGrid,
  TrainingNotification
} from "@/components/training";
import { Exercise, TrainingDay, WorkoutExercise, Set, CreateTrainingPlanDTO } from "@/types/training";

// Simple ID generator for local state
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
};

export function CreateTrainingPlanPage() {
  const navigate = useNavigate();
  const { createTrainingPlan, isLoading, exercises, fetchExercises, isLoadingExercises } = useTrainingStore();
  
  // Step state
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState<{type: 'success' | 'error', title: string, message: string} | null>(null);

  // Form state
  const [planData, setPlanData] = useState<Omit<CreateTrainingPlanDTO, 'days'>>({
    name: "",
    description: "",
    durationDays: 7,
    goal: "muscle_gain",
    difficulty: "intermediate"
  });

  const [days, setDays] = useState<TrainingDay[]>([
    { id: generateId(), dayNumber: 1, isCompleted: false, workout: { id: generateId(), exercises: [] } }
  ]);

  // Modal state for exercise selection
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);

  const handleAddDay = () => {
    const nextDayNumber = days.length + 1;
    setDays([...days, { 
      id: generateId(), 
      dayNumber: nextDayNumber, 
      isCompleted: false, 
      workout: { id: generateId(), exercises: [] } 
    }]);
  };

  const handleRemoveDay = (id: string) => {
    if (days.length === 1) return;
    setDays(days.filter(d => d.id !== id).map((d, index) => ({...d, dayNumber: index + 1})));
  };

  const openExerciseModal = (dayId: string) => {
    setActiveDayId(dayId);
    setIsExerciseModalOpen(true);
    if (exercises.length === 0) {
      fetchExercises();
    }
  };

  const handleAddExerciseToDay = (exercise: Exercise) => {
    if (!activeDayId) return;

    setDays(prevDays => prevDays.map(day => {
      if (day.id === activeDayId) {
        const newWorkoutExercise: WorkoutExercise = {
          id: generateId(),
          exerciseId: exercise.id,
          exercise: exercise,
          order: (day.workout?.exercises.length || 0) + 1,
          sets: [
            { id: generateId(), reps: 10, weight: 0, restTime: 60 }
          ]
        };
        return {
          ...day,
          workout: {
            ...day.workout!,
            exercises: [...(day.workout?.exercises || []), newWorkoutExercise]
          }
        };
      }
      return day;
    }));
    
    setNotification({
      type: 'success',
      title: 'Ejercicio añadido',
      message: `${exercise.name} se añadió al día ${days.find(d => d.id === activeDayId)?.dayNumber}`
    });
    
    // Auto close modal if desired or keep open for more
    // setIsExerciseModalOpen(false);
  };

  const handleRemoveExercise = (dayId: string, exerciseId: string) => {
    setDays(prevDays => prevDays.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          workout: {
            ...day.workout!,
            exercises: day.workout!.exercises.filter(ex => ex.id !== exerciseId)
          }
        };
      }
      return day;
    }));
  };

  const handleAddSet = (dayId: string, exerciseId: string) => {
    setDays(prevDays => prevDays.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          workout: {
            ...day.workout!,
            exercises: day.workout!.exercises.map(ex => {
              if (ex.id === exerciseId) {
                return {
                  ...ex,
                  sets: [...ex.sets, { id: generateId(), reps: 10, weight: 0, restTime: 60 }]
                };
              }
              return ex;
            })
          }
        };
      }
      return day;
    }));
  };

  const handleUpdateSet = (dayId: string, exerciseId: string, setId: string, updates: Partial<Set>) => {
    setDays(prevDays => prevDays.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          workout: {
            ...day.workout!,
            exercises: day.workout!.exercises.map(ex => {
              if (ex.id === exerciseId) {
                return {
                  ...ex,
                  sets: ex.sets.map(s => s.id === setId ? { ...s, ...updates } : s)
                };
              }
              return ex;
            })
          }
        };
      }
      return day;
    }));
  };

  const handleRemoveSet = (dayId: string, exerciseId: string, setId: string) => {
    setDays(prevDays => prevDays.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          workout: {
            ...day.workout!,
            exercises: day.workout!.exercises.map(ex => {
              if (ex.id === exerciseId) {
                if (ex.sets.length === 1) return ex;
                return {
                  ...ex,
                  sets: ex.sets.filter(s => s.id !== setId)
                };
              }
              return ex;
            })
          }
        };
      }
      return day;
    }));
  };

  const handleSubmit = async () => {
    if (!planData.name) {
      setNotification({ type: 'error', title: 'Campo requerido', message: 'Por favor asigna un nombre al plan.' });
      return;
    }

    try {
      const finalData: CreateTrainingPlanDTO = {
        ...planData,
        durationDays: days.length,
        days: days.map(({ id, ...rest }) => ({
          ...rest,
          workout: rest.workout ? {
            ...rest.workout,
            exercises: rest.workout.exercises.map(({ exercise, ...exRest }) => ({
              ...exRest,
              id: exRest.id || generateId(),
              sets: exRest.sets.map((set) => ({
                ...set,
                id: set.id || generateId()
              }))
            }))
          } : undefined
        }))
      };

      await createTrainingPlan(finalData);
      setNotification({ type: 'success', title: '¡Éxito!', message: 'Plan de entrenamiento creado correctamente.' });
      setTimeout(() => navigate('/training/plans'), 2000);
    } catch (error) {
      setNotification({ type: 'error', title: 'Error', message: 'No se pudo crear el plan. Intenta de nuevo.' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/training/plans')}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase">Crear Nuevo Plan</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Paso {step} de 2</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {step === 1 ? (
            <button 
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-600/20 transition-all"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-600/20 transition-all disabled:opacity-50"
            >
              {isLoading ? <MiniSpinner /> : <Save className="w-4 h-4" />} Guardar Plan
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <TrainingNotification 
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={() => setNotification(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 ? (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <section className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
              <h2 className="text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-3 text-red-500">
                <LayoutGrid className="w-5 h-5" /> Información Básica
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-full">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nombre del Plan</label>
                  <input 
                    type="text" 
                    value={planData.name}
                    onChange={(e) => setPlanData({...planData, name: e.target.value})}
                    placeholder="Ej: Transformación 30 Días"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-red-600 focus:outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
                
                <div className="space-y-2 col-span-full">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Descripción</label>
                  <textarea 
                    value={planData.description}
                    onChange={(e) => setPlanData({...planData, description: e.target.value})}
                    placeholder="Describe los objetivos de este plan..."
                    rows={4}
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-red-600 focus:outline-none transition-all placeholder:text-slate-700 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Objetivo Principal</label>
                  <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                    <select 
                      value={planData.goal}
                      onChange={(e) => setPlanData({...planData, goal: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-red-600 focus:outline-none transition-all appearance-none"
                    >
                      <option value="muscle_gain">Ganancia Muscular</option>
                      <option value="fat_loss">Pérdida de Grasa</option>
                      <option value="strength">Fuerza</option>
                      <option value="endurance">Resistencia</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Dificultad</label>
                  <div className="relative">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                    <select 
                      value={planData.difficulty}
                      onChange={(e) => setPlanData({...planData, difficulty: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-red-600 focus:outline-none transition-all appearance-none"
                    >
                      <option value="beginner">Principiante</option>
                      <option value="intermediate">Intermedio</option>
                      <option value="advanced">Avanzado</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between mb-4">
               <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Estructura del Plan</h2>
                  <p className="text-slate-500 font-bold text-sm">Define los días y ejercicios de tu rutina</p>
               </div>
               <button 
                  onClick={handleAddDay}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-slate-200 rounded-xl font-black text-xs uppercase transition-all"
               >
                  <Plus className="w-4 h-4" /> Agregar Día
               </button>
            </div>

            <div className="space-y-6">
              {days.map((day) => (
                <motion.div 
                  key={day.id}
                  layout
                  className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm"
                >
                  <div className="px-8 py-5 bg-white/5 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-red-600/20">
                        {day.dayNumber}
                      </div>
                      <h3 className="font-black uppercase tracking-tight text-white/90">Día de Entrenamiento</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openExerciseModal(day.id)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all text-red-500 font-bold text-xs uppercase"
                      >
                        <PlusCircle className="w-4 h-4" /> Agregar Ejercicio
                      </button>
                      {days.length > 1 && (
                        <button 
                          onClick={() => handleRemoveDay(day.id)}
                          className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-8 space-y-4">
                    {day.workout?.exercises.length === 0 ? (
                      <div className="py-10 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-slate-600">
                        <Dumbbell className="w-10 h-10 mb-3 opacity-20" />
                        <p className="text-sm font-bold uppercase tracking-widest">Sin ejercicios seleccionados</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {day.workout?.exercises.map((workoutEx) => (
                          <div key={workoutEx.id} className="bg-black/40 border border-white/5 rounded-2xl p-6">
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden border border-white/10">
                                  <img 
                                    src={workoutEx.exercise?.gifUrl || "/assets/images/exercise-placeholder.png"} 
                                    alt={workoutEx.exercise?.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-black text-lg uppercase leading-tight">{workoutEx.exercise?.name}</h4>
                                  <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{workoutEx.exercise?.target} • {workoutEx.exercise?.equipment}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleRemoveExercise(day.id, workoutEx.id)}
                                className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-3">
                              <div className="grid grid-cols-4 gap-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
                                <div>Serie</div>
                                <div>Reps</div>
                                <div>Peso (kg)</div>
                                <div>Descanso (s)</div>
                              </div>
                              
                              {workoutEx.sets.map((set, setIdx) => (
                                <div key={set.id} className="grid grid-cols-4 gap-4 items-center group">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-[10px] font-black">{setIdx + 1}</div>
                                    {workoutEx.sets.length > 1 && (
                                      <button 
                                        onClick={() => handleRemoveSet(day.id, workoutEx.id, set.id)}
                                        className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-500 transition-all"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                  <input 
                                    type="number" 
                                    value={set.reps}
                                    onChange={(e) => handleUpdateSet(day.id, workoutEx.id, set.id, { reps: parseInt(e.target.value) || 0 })}
                                    className="bg-black/60 border border-white/5 rounded-lg px-3 py-1.5 text-center text-sm font-bold focus:border-red-500 focus:outline-none"
                                  />
                                  <input 
                                    type="number" 
                                    value={set.weight}
                                    onChange={(e) => handleUpdateSet(day.id, workoutEx.id, set.id, { weight: parseInt(e.target.value) || 0 })}
                                    className="bg-black/60 border border-white/5 rounded-lg px-3 py-1.5 text-center text-sm font-bold focus:border-red-500 focus:outline-none"
                                  />
                                  <input 
                                    type="number" 
                                    value={set.restTime}
                                    onChange={(e) => handleUpdateSet(day.id, workoutEx.id, set.id, { restTime: parseInt(e.target.value) || 0 })}
                                    className="bg-black/60 border border-white/5 rounded-lg px-3 py-1.5 text-center text-sm font-bold focus:border-red-500 focus:outline-none"
                                  />
                                </div>
                              ))}
                              
                              <button 
                                onClick={() => handleAddSet(day.id, workoutEx.id)}
                                className="w-full mt-4 py-2 border border-dashed border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-white/20 transition-all"
                              >
                                + Agregar Serie
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Exercise Selection Modal */}
      <AnimatePresence>
        {isExerciseModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExerciseModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Seleccionar Ejercicio</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Añadiendo al día {days.find(d => d.id === activeDayId)?.dayNumber}</p>
                </div>
                <button 
                  onClick={() => setIsExerciseModalOpen(false)}
                  className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                <ExerciseFilters 
                  onFiltersChange={(f) => fetchExercises(f)}
                  isLoading={isLoadingExercises}
                />

                {isLoadingExercises ? (
                  <ExerciseSkeletonGrid count={8} />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {exercises.map((ex) => (
                      <ExerciseCard 
                        key={ex.id}
                        exercise={ex}
                        isAddable={true}
                        onClick={() => handleAddExerciseToDay(ex)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center">
          <TrainingLoadingSpinner message="Guardando plan..." />
        </div>
      )}
    </div>
  );
}
