import {
  Users,
  Search,
  Plus,
  MoreHorizontal,
  XCircle,
  UserPlus,
  Dumbbell,
  ArrowRight,
  Smartphone,
  CheckCircle2,
  Lock,
  Loader2,
  X,
  Mail,
  User as UserIcon,
  Phone,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { authApi, RelationshipResponse } from '../../api/auth.endpoints';
import { useAuthStore } from '../../store/useAuthStore';

export function ClientsView() {
  const { user: currentUser } = useAuthStore();
  const [data, setData] = useState<RelationshipResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'gym'>('all');
  const [tutorialStep] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [issubmitting, setIsSubmitting] = useState(false);
  const [modalForm, setModalForm] = useState({
    name: '',
    email: '',
    phone: '',
    prefix: '+57',
    role_id: 1 // 1: Cliente, 2: Entrenador
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authApi.getRelationships();
      setData(response);
    } catch (error) {
      console.error('Error fetching relationships:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      // Determinar parámetros según rol
      const registrationSource = currentUser.role_id === 3 ? 'gym' : 'trainer';
      
      const payload: any = {
        ...modalForm,
        password: 'pass123', // Password por defecto según requerimiento
        registration_source: registrationSource,
        source_id: (currentUser as any).id || 0 // El store tiene user: {email, role_id}, necesitamos el ID
      };

      await authApi.register(payload);
      
      // Éxito: cerrar modal, limpiar form y refrescar lista
      setShowAddModal(false);
      setModalForm({ name: '', email: '', phone: '', prefix: '+57', role_id: 1 });
      await fetchData();
    } catch (error) {
      console.error('Error registering client:', error);
      alert('Error registrando el usuario. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allClients = [
    ...(data?.independent_clients || []),
    ...(data?.gym_clients.flatMap(g => g.clients) || [])
  ];

  if (isLoading && !data) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Cargando tu cartera de clientes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Clientes</h1>
          <p className="text-slate-500 font-medium max-w-lg">Gestiona tu lista de clientes, ve su estado y accede a sus perfiles.</p>
        </div>
        <div className="flex items-center gap-3 relative group">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-white text-black rounded-2xl font-black text-sm hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" /> Añadir cliente
          </button>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-10 right-0 px-3 py-1.5 bg-red-600 text-white text-[10px] font-black rounded-lg shadow-lg whitespace-nowrap"
          >
            Añade tu primer cliente de prueba
            <div className="absolute top-[-4px] right-4 w-2 h-2 bg-red-600 rotate-45" />
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 bg-slate-900/30 p-2 rounded-2xl border border-white/5">
            <div className="flex bg-slate-900 border border-white/5 rounded-xl p-1 gap-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'all' ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Activos ({allClients.length})
              </button>
              <button
                onClick={() => setActiveTab('gym')}
                className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'gym' ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Todos los grupos
              </button>
            </div>

            <div className="flex-1 flex items-center gap-3 bg-slate-950 border border-white/5 rounded-xl px-4 py-2 group focus-within:border-red-500/50 transition-all">
              <Search className="w-4 h-4 text-slate-600 group-focus-within:text-red-500 transition-colors" />
              <input
                type="text"
                placeholder="Escribe aquí para filtrar por nombre"
                className="bg-transparent border-none text-sm text-white focus:ring-0 placeholder:text-slate-700 w-full"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900/20 rounded-[2.5rem] border border-white/5 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 border-2 border-slate-700 rounded-md" />
                      Nombre
                    </div>
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Plan</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Completado (%)</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Grupos</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allClients.length > 0 ? (
                  allClients.map((client) => (
                    <tr key={client.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-5 h-5 border-2 border-slate-800 rounded-md group-hover:border-slate-700 transition-colors" />
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold border border-white/10 group-hover:border-red-500/20 transition-all">
                              {client.name[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-black text-white">{client.name}</p>
                              <p className="text-[10px] text-slate-600 font-bold">{client.email}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="px-3 py-1.5 bg-orange-500/10 text-orange-500 text-[10px] font-black rounded-lg border border-orange-500/20">
                          Programado
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-xs font-black text-green-500">88%</span>
                          {/* Eliminados los porcentajes repetidos */}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="px-3 py-1.5 bg-slate-800 text-slate-400 text-[10px] font-black rounded-lg border border-white/5 uppercase">
                          Asesoría
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-500 hover:text-white">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <div className="max-w-xs mx-auto space-y-4">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto border border-white/5">
                          <Users className="w-8 h-8 text-slate-700" />
                        </div>
                        <h3 className="text-xl font-black text-white">No hay clientes aún</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                          Añade a tu primer cliente para empezar a asignar programas y métricas.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tutorial Card */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-[380px] space-y-6"
            >
              <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <button
                  onClick={() => setShowTutorial(false)}
                  className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>

                <div className="mb-10">
                  <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Aprende a usar TrainerStudio</h2>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">Te guiamos paso a paso para que saques el máximo partido a la plataforma.</p>
                </div>

                <div className="space-y-4">
                  <TutorialStep
                    number={1}
                    title="Crea tu primer cliente"
                    description="Añádete a ti mismo para ver ambos lados de la plataforma"
                    active={tutorialStep === 1}
                    icon={UserPlus}
                  />
                  <TutorialStep
                    number={2}
                    title="Asigna tu primer entreno"
                    description="Programa un entreno para tu cliente"
                    active={tutorialStep === 2}
                    icon={Dumbbell}
                    locked
                  />
                  <TutorialStep
                    number={3}
                    title="Prueba tu app personalizada"
                    description="Descubre la experiencia de tus clientes"
                    active={tutorialStep === 3}
                    icon={Smartphone}
                    locked
                  />
                  <TutorialStep
                    number={4}
                    title="Completa un ejercicio"
                    description="Marca como hecho o deja un comentario"
                    active={tutorialStep === 4}
                    icon={CheckCircle2}
                    locked
                  />
                </div>

                <div className="mt-10">
                  <button 
                    onClick={() => setShowTutorial(false)}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black transition-all active:scale-[0.98] shadow-lg shadow-green-600/20"
                  >
                    Cerrar tutorial
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Añadir Cliente */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-600/20">
                      <UserPlus className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">Nuevo Registro</h2>
                      <p className="text-slate-500 text-xs font-bold">Crea una nueva cuenta de {modalForm.role_id === 2 ? 'entrenador' : 'cliente'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleAddClient} className="space-y-6">
                  {/* Selector de Rol (Solo si es Gym) */}
                  {currentUser?.role_id === 3 && (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setModalForm({...modalForm, role_id: 1})}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${modalForm.role_id === 1 ? 'border-red-600 bg-red-600/10' : 'border-white/5 bg-slate-950 text-slate-500'}`}
                      >
                        <UserIcon className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase">Cliente</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalForm({...modalForm, role_id: 2})}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${modalForm.role_id === 2 ? 'border-red-600 bg-red-600/10' : 'border-white/5 bg-slate-950 text-slate-500'}`}
                      >
                        <ShieldAlert className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase">Entrenador</span>
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1.5 focus-within:z-20 relative">
                       <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Nombre Completo</label>
                       <div className="relative group">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-red-500 transition-colors" />
                          <input 
                             required
                             type="text"
                             placeholder="Ej: Pedro Díaz"
                             value={modalForm.name}
                             onChange={(e) => setModalForm({...modalForm, name: e.target.value})}
                             className="block w-full pl-12 pr-4 py-3.5 border border-white/5 rounded-2xl bg-slate-950 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-medium"
                          />
                       </div>
                    </div>

                    <div className="space-y-1.5 focus-within:z-20 relative">
                       <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Correo Electrónico</label>
                       <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-red-500 transition-colors" />
                          <input 
                             required
                             type="email"
                             placeholder="cliente@ejemplo.com"
                             value={modalForm.email}
                             onChange={(e) => setModalForm({...modalForm, email: e.target.value})}
                             className="block w-full pl-12 pr-4 py-3.5 border border-white/5 rounded-2xl bg-slate-950 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-medium"
                          />
                       </div>
                    </div>

                    <div className="space-y-1.5 focus-within:z-20 relative">
                       <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Teléfono</label>
                       <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-red-500 transition-colors" />
                          <input 
                             required
                             type="tel"
                             placeholder="312 777 8888"
                             value={modalForm.phone}
                             onChange={(e) => setModalForm({...modalForm, phone: e.target.value})}
                             className="block w-full pl-12 pr-4 py-3.5 border border-white/5 rounded-2xl bg-slate-950 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-medium"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                     <button 
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 py-4 px-6 border border-white/5 bg-slate-950 text-white rounded-2xl font-black text-sm hover:bg-slate-900 transition-all active:scale-[0.98]"
                     >
                        Cancelar
                     </button>
                     <button 
                        type="submit"
                        disabled={issubmitting}
                        className="flex-[2] py-4 px-6 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-sm transition-all active:scale-[0.98] shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                     >
                        {issubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Registrar ahora</>}
                     </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TutorialStep = ({ number, title, description, active, icon: Icon, locked }: any) => (
  <div className={`p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden ${active
      ? 'bg-slate-800 border-white/10 shadow-xl'
      : 'bg-transparent border-white/5 opacity-50 grayscale'
    }`}>
    <div className="flex items-start gap-5 relative z-10">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-colors ${active ? 'bg-white text-black' : 'bg-slate-900 text-slate-600'
        }`}>
        {number}
      </div>
      <div className="flex-1">
        <h4 className={`text-sm font-black mb-1 ${active ? 'text-white' : 'text-slate-500'}`}>{title}</h4>
        <p className={`text-[10px] font-bold leading-relaxed ${active ? 'text-slate-400' : 'text-slate-700'}`}>{description}</p>
      </div>
      {active ? (
        <Icon className="w-5 h-5 text-white self-center transition-all animate-pulse" />
      ) : locked ? (
        <Lock className="w-4 h-4 text-slate-700 self-center" />
      ) : (
        <ArrowRight className="w-4 h-4 text-slate-700 self-center" />
      )}
    </div>
  </div>
);

