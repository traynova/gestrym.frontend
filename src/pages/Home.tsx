import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  Dumbbell, 
  TrendingUp, 
  Users, 
  Laptop,
  ArrowRight,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Zap,
  Globe,
  LineChart,
  Building2,
  UserCircle,
  UserPlus,
  Settings,
  Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService, PublicRole } from '../api/authService';

const benefits = [
  {
    icon: Users,
    title: "Centraliza tu cartera de clientes",
    description: "Organiza historiales, métricas y progreso de todos tus clientes en perfiles individuales interactivos."
  },
  {
    icon: Zap,
    title: "Agiliza tu planificación",
    description: "Crea rutinas en minutos y asígnalas a tus clientes fácilmente mediante plantillas reutilizables."
  },
  {
    icon: Globe,
    title: "Escala tu negocio online",
    description: "Llega a más personas con un portal profesional que eleva el valor percibido de tu servicio."
  },
  {
    icon: LineChart,
    title: "Mejora la retención",
    description: "Mantén a tus clientes motivados mostrándoles su progreso real con gráficos interactivos."
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [roles, setRoles] = useState<PublicRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await authService.getPublicRoles();
        // Limpiamos className por class si viene del backend con nomenclatura React
        const sanitizedData = data.map(role => {
            let description = role.description.replace(/className=/g, 'class=');
            
            // Fix JSX-style self-closing tags (e.g., <span ... />) which are invalid in standard HTML
            // and cause the browser to nest following content inside the small bullet span.
            description = description.replace(/<(span|div|i|li|ul)([^>]*)\s+\/>/g, '<$1$2></$1>');
            // Also handle cases without space before />
            description = description.replace(/<(span|div|i|li|ul)([^>]*)\/>/g, '<$1$2></$1>');
            
            return {
                ...role,
                description
            };
        });
        setRoles(sanitizedData);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  const getRoleIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'gimnasios':
      case 'gimnasio':
        return <Building2 className="w-7 h-7 text-slate-300 group-hover:text-white" />;
      case 'entrenadores':
      case 'entrenador':
        return <UserCircle className="w-7 h-7 text-red-500" />;
      case 'alumnos':
      case 'alumno':
      case 'clientes':
      case 'cliente':
        return <Users className="w-7 h-7 text-slate-300 group-hover:text-white" />;
      default:
        return <Users className="w-7 h-7 text-slate-300 group-hover:text-white" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-950">
        {/* Subtle Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 -z-10" />
        <div className="absolute top-0 left-1/4 -translate-y-12 w-[600px] h-[600px] bg-red-600/10 blur-[120px] rounded-full opacity-60 -z-10" />
        <div className="absolute bottom-0 right-0 translate-y-1/3 translate-x-1/3 w-[800px] h-[800px] bg-red-900/10 blur-[150px] rounded-full opacity-40 -z-10" />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            
            {/* LEFT COLUMN - CONTENT */}
            <div className="flex-1 lg:max-w-xl flex flex-col items-center lg:items-start text-center lg:text-left mt-10 lg:mt-0">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mb-6 inline-block"
               >
                 <span className="text-red-400 font-semibold bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full text-sm flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                   Software Premium para Entrenadores
                 </span>
               </motion.div>
               
               <motion.h1 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="text-5xl md:text-6xl lg:text-[4rem] font-extrabold text-white tracking-tight mb-8 leading-[1.1]"
               >
                 Gestiona tu negocio fitness como un <br className="hidden lg:block"/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">profesional</span>
               </motion.h1>
               
               <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl lg:max-w-md font-light leading-relaxed"
               >
                 Organiza clientes, crea rutinas y escala tu servicio desde un solo lugar.
               </motion.p>
               
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
               >
                  <Link to="/register" className="h-14 px-8 rounded-xl bg-red-600 text-white font-bold text-lg hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
                     Empieza gratis <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button className="h-14 px-8 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 hover:border-slate-600">
                     <PlayCircle className="w-5 h-5 text-slate-400" /> Ver demo
                  </button>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.6 }}
                 className="mt-10 flex items-center flex-col sm:flex-row gap-4 text-sm text-slate-400"
               >
                 <div className="flex -space-x-3">
                    <img className="w-10 h-10 rounded-full border-2 border-slate-950" src="https://i.pravatar.cc/100?img=11" alt="Entrenador 1" />
                    <img className="w-10 h-10 rounded-full border-2 border-slate-950" src="https://i.pravatar.cc/100?img=33" alt="Entrenador 2" />
                    <img className="w-10 h-10 rounded-full border-2 border-slate-950" src="https://i.pravatar.cc/100?img=47" alt="Entrenador 3" />
                 </div>
                 <p className="text-center sm:text-left">Respaldado por más de <span className="text-white font-semibold pb-0.5 border-b border-red-500/50">2,000</span> entrenadores</p>
               </motion.div>
            </div>

            {/* RIGHT COLUMN - VISUAL MOCKUP */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex-1 w-full relative mt-16 lg:mt-0 pb-10"
            >
               <div className="relative w-full max-w-2xl mx-auto lg:ml-auto lg:mr-0 pl-0 lg:pl-10">
                 
                 {/* Decorative Glow */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-gradient-to-tr from-red-600/20 to-transparent blur-3xl rounded-full" />
                 
                 {/* Desktop Mockup */}
                 <div className="relative rounded-2xl p-2 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform -rotate-2 hover:rotate-0 transition-transform duration-500 z-20 overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" alt="Dashboard SaaS Gestrym" className="rounded-xl border border-slate-800/80 object-cover w-full aspect-[16/10] opacity-90 group-hover:opacity-100 transition-opacity duration-300 mix-blend-lighten" />
                 </div>
                 
                 {/* Mobile Mockup (Floating) */}
                 <div className="absolute -bottom-8 -left-4 sm:-bottom-12 sm:-left-12 lg:-left-16 w-32 sm:w-48 lg:w-56 rounded-[2rem] border-[5px] border-slate-900 bg-slate-950 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500 z-30 overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-4 bg-slate-900 rounded-b-xl w-1/2 mx-auto z-40"></div>
                    <img src="https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1974&auto=format&fit=crop" className="w-full h-auto aspect-[9/19] object-cover opacity-80 hover:opacity-100 transition-opacity duration-300 mix-blend-lighten" alt="Mobile App Gestrym" />
                 </div>
               </div>
            </motion.div>
            
        </div>
      </section>

      {/* 1.5. ECOSYSTEM SECTION (MULTI-ROLE) */}
      <section className="py-24 bg-slate-950 border-t border-slate-800/50 relative overflow-hidden" id="ecosystem">
        {/* Gradients */}
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-slate-900 to-transparent -z-10" />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Diseñado para todo el ecosistema fitness</h2>
            <p className="text-xl text-slate-400">Desde la administración de salas de pesas hasta el seguimiento individual de cada alumno.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {loadingRoles ? (
               // Loading Skeleton
               [1, 2, 3].map((i) => (
                 <div key={i} className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl p-8 animate-pulse">
                   <div className="w-14 h-14 bg-slate-800 rounded-2xl mb-6"></div>
                   <div className="h-8 bg-slate-800 rounded w-1/2 mb-4"></div>
                   <div className="space-y-3">
                     <div className="h-4 bg-slate-800 rounded w-full"></div>
                     <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                     <div className="h-4 bg-slate-800 rounded w-4/6"></div>
                   </div>
                 </div>
               ))
            ) : (
              roles.map((role) => {
                const isEntrenador = role.name.toLowerCase().includes('entrenador');
                
                if (isEntrenador) {
                  return (
                    <div key={role.id} className="bg-gradient-to-b from-slate-800 to-slate-900 backdrop-blur border border-red-500/30 rounded-3xl p-8 transform md:-translate-y-4 hover:border-red-500/50 transition-all duration-300 group relative overflow-hidden shadow-lg">
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 to-rose-400" />
                      
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
                          {getRoleIcon(role.name)}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                          Principal
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4">{role.name}</h3>
                      <div 
                        className="description-content [&_ul]:space-y-3 [&_li]:flex [&_li]:items-start [&_li]:gap-3 [&_li]:text-slate-300 [&_span]:shrink-0 [&_span]:mt-2"
                        dangerouslySetInnerHTML={{ __html: role.description }} 
                      />
                    </div>
                  );
                }

                return (
                  <div key={role.id} className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl p-8 hover:bg-slate-800/80 hover:border-slate-700 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 group-hover:bg-slate-700 transition-colors">
                      {getRoleIcon(role.name)}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{role.name}</h3>
                    <div 
                      className="description-content [&_ul]:space-y-3 [&_li]:flex [&_li]:items-start [&_li]:gap-3 [&_li]:text-slate-400 group-hover:[&_li]:text-slate-300 [&_span]:shrink-0 [&_span]:mt-2"
                      dangerouslySetInnerHTML={{ __html: role.description }} 
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden" id="problem">
        <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 tracking-tight">El problema de operar con herramientas genéricas</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
             <div className="bg-slate-800/60 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-colors">
               <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                 <XCircle className="w-6 h-6 text-red-400" />
               </div>
               <h3 className="font-bold text-xl mb-3 text-white">Caos de Excel y WhatsApp</h3>
               <p className="text-slate-400 leading-relaxed">Pierdes horas ajustando celdas, enviando PDFs y buscando mensajes antiguos con cada uno de tus clientes.</p>
             </div>
             <div className="bg-slate-800/60 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-colors">
               <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                 <XCircle className="w-6 h-6 text-red-400" />
               </div>
               <h3 className="font-bold text-xl mb-3 text-white">Pagos manuales</h3>
               <p className="text-slate-400 leading-relaxed">Perseguir a tus clientes cada mes para que realicen sus pagos es incómodo y proyecta una imagen poco profesional.</p>
             </div>
             <div className="bg-slate-800/60 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-colors">
               <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                 <XCircle className="w-6 h-6 text-red-400" />
               </div>
               <h3 className="font-bold text-xl mb-3 text-white">Cero visibilidad</h3>
               <p className="text-slate-400 leading-relaxed">Tus clientes no tienen forma de ver su progreso de forma gráfica e interactiva, lo que impacta en su motivación.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 2.5 HOW IT WORKS SECTION */}
      <section className="py-24 lg:py-32 bg-slate-950 text-white relative overflow-hidden" id="how-it-works">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-20 lg:mb-28">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Crea tu sistema en minutos</h2>
            <p className="text-xl text-slate-400">Implementa Gestrym en tu negocio fitness siguiendo tres simples pasos.</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
             {/* Desktop connecting line */}
             <div className="hidden md:block absolute top-[3rem] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-red-600/0 via-red-600/30 to-red-600/0 -z-10" />
             
             {/* Mobile connecting line */}
             <div className="md:hidden absolute top-[3rem] bottom-[3rem] left-[3rem] w-[2px] bg-gradient-to-b from-red-600/0 via-red-600/30 to-red-600/0 -z-10" />

             <div className="grid md:grid-cols-3 gap-16 md:gap-8 lg:gap-16">
               
               {/* Step 1 */}
               <div className="relative flex flex-row md:flex-col gap-8 md:gap-0 items-start md:items-center text-left md:text-center group">
                 <div className="w-24 h-24 bg-slate-900 border-[6px] border-slate-950 rounded-full flex items-center justify-center md:mb-8 shadow-[0_0_30px_rgba(220,38,38,0.1)] group-hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] group-hover:scale-105 transition-all duration-500 relative z-10 shrink-0">
                    <UserPlus className="w-9 h-9 text-red-500 group-hover:text-red-400 transition-colors" />
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold border-[4px] border-slate-950 shadow-lg text-sm">1</div>
                 </div>
                 <div className="mt-3 md:mt-0">
                   <h3 className="text-2xl font-bold text-white mb-3">Crea tu cuenta en segundos</h3>
                   <p className="text-slate-400 leading-relaxed max-w-xs mx-auto text-lg md:text-base">Date de alta rápidamente, sin necesidad de proporcionar tarjeta de crédito.</p>
                 </div>
               </div>

               {/* Step 2 */}
               <div className="relative flex flex-row md:flex-col gap-8 md:gap-0 items-start md:items-center text-left md:text-center group">
                 <div className="w-24 h-24 bg-slate-900 border-[6px] border-slate-950 rounded-full flex items-center justify-center md:mb-8 shadow-[0_0_30px_rgba(220,38,38,0.1)] group-hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] group-hover:scale-105 transition-all duration-500 relative z-10 shrink-0">
                    <Settings className="w-9 h-9 text-red-500 group-hover:text-red-400 transition-colors" />
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold border-[4px] border-slate-950 shadow-lg text-sm">2</div>
                 </div>
                 <div className="mt-3 md:mt-0">
                   <h3 className="text-2xl font-bold text-white mb-3">Organiza clientes y rutinas</h3>
                   <p className="text-slate-400 leading-relaxed max-w-xs mx-auto text-lg md:text-base">Agrega a tus alumnos y diseña plantillas de entrenamiento reutilizables.</p>
                 </div>
               </div>

               {/* Step 3 */}
               <div className="relative flex flex-row md:flex-col gap-8 md:gap-0 items-start md:items-center text-left md:text-center group">
                 <div className="w-24 h-24 bg-slate-900 border-[6px] border-slate-950 rounded-full flex items-center justify-center md:mb-8 shadow-[0_0_30px_rgba(220,38,38,0.1)] group-hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] group-hover:scale-105 transition-all duration-500 relative z-10 shrink-0">
                    <Rocket className="w-9 h-9 text-red-500 group-hover:text-red-400 transition-colors" />
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold border-[4px] border-slate-950 shadow-lg text-sm">3</div>
                 </div>
                 <div className="mt-3 md:mt-0">
                   <h3 className="text-2xl font-bold text-white mb-3">Gestiona y haz crecer</h3>
                   <p className="text-slate-400 leading-relaxed max-w-xs mx-auto text-lg md:text-base">Envía el acceso a tus alumnos y centraliza todo el ciclo de seguimiento.</p>
                 </div>
               </div>

             </div>
          </div>
        </div>
      </section>

      {/* 3. SOLUTION SECTION */}
      <section className="py-24 bg-slate-50" id="features">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6 tracking-tight">Todo lo que necesitas en un solo lugar</h2>
            <p className="text-xl text-slate-600">Reemplaza tu stack actual con una plataforma SaaS diseñada exclusivamente para automatizar el coaching online.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Gestión de Clientes (CRM)</h3>
              <p className="text-slate-600 leading-relaxed text-lg">Centraliza los datos, historiales, check-ins y cuestionarios iniciales de cada cliente. Mantén toda la información estructurada y accede en un clic.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                <Dumbbell className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Creación de Rutinas</h3>
              <p className="text-slate-600 leading-relaxed text-lg">Constructor visual de entrenamientos. Asigna bloques, superseries, tiempos de descanso y enlaza videos explicativos en segundos utilizando plantillas.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Seguimiento Dinámico</h3>
              <p className="text-slate-600 leading-relaxed text-lg">Mide volumen total, 1RM, evolución de peso corporal y métricas clave. Gráficos interactivos que mantienen al cliente comprometido con su progreso real.</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                <Laptop className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Coaching Online Nativo</h3>
              <p className="text-slate-600 leading-relaxed text-lg">Mensajería integrada, recordatorios automáticos y un portal fluido. Ofrece la experiencia premium necesaria para justificar tus precios High-Ticket.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DEMO / PLATFORM PREVIEW SECTION */}
      <section className="py-24 lg:py-32 bg-slate-950 relative overflow-hidden border-t border-slate-800" id="demo">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
           <div className="text-center mb-10 max-w-3xl mx-auto">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Así se ve Gestrym por dentro</h2>
             <p className="text-xl text-slate-400">Una interfaz intuitiva, limpia y ultra-rápida. Carga en milisegundos y está diseñada para que dominarla te tome menos de 30 minutos.</p>
           </div>
           
           <div className="text-center mb-10">
             <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Explora cómo gestionas tu negocio en segundos</p>
           </div>
           
           {/* Interactive Preview Container */}
           <div className="max-w-5xl mx-auto">
              
              {/* Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-8">
                {['dashboard', 'rutinas', 'clientes', 'progreso'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 capitalize text-sm md:text-base cursor-pointer ${activeTab === tab ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/50'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Image Window */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-700/50 shadow-2xl overflow-hidden group">
                 {/* Window Header */}
                 <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    <div className="mx-auto text-xs text-slate-500 font-medium">app.gestrym.com/admin/{activeTab}</div>
                 </div>

                 {/* Image display */}
                 <div className="relative aspect-[16/10] md:aspect-[16/9] overflow-hidden bg-slate-950">
                    <AnimatePresence mode="wait">
                         <motion.img 
                           key={activeTab}
                           initial={{ opacity: 0, scale: 0.98 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.3 }}
                           src={
                             activeTab === 'dashboard' ? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop' :
                             activeTab === 'rutinas' ? 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070&auto=format&fit=crop' :
                             activeTab === 'clientes' ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop' :
                             'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop'
                           }
                           alt={`Gestrym ${activeTab} preview`}
                           className="w-full h-full object-cover opacity-95 transition-all duration-300"
                         />
                    </AnimatePresence>
                 </div>
              </div>

           </div>
        </div>
      </section>

       {/* 5. BENEFITS SECTION */}
      <section className="py-24 lg:py-32 bg-slate-900 border-t border-slate-800 relative overflow-hidden" id="benefits">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
           <div className="text-center mb-20">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Beneficios que transforman tu negocio</h2>
             <p className="text-xl text-slate-400 max-w-2xl mx-auto">Deja de ser un entrenador sobrepasado y conviértete en el CEO de tu propia marca digital.</p>
           </div>
           
           <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {benefits.map((bene, i) => {
                 const Icon = bene.icon;
                 return (
                   <motion.div 
                     key={i} 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1, duration: 0.5 }}
                     className="group relative bg-slate-800/40 backdrop-blur-sm p-8 lg:p-10 rounded-[2rem] border border-slate-700/50 hover:bg-slate-800/80 hover:border-red-500/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                    >
                     {/* Hover glow effect internally */}
                     <div className="absolute -inset-x-0 -top-1/2 bottom-0 bg-gradient-to-b from-red-500/0 via-red-500/0 to-transparent group-hover:from-red-500/5 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2rem] pointer-events-none" />
                     
                     <div className="relative z-10">
                       <div className="w-14 h-14 bg-slate-950/50 rounded-2xl flex items-center justify-center border border-slate-700/50 group-hover:border-red-500/50 group-hover:bg-red-500/10 transition-colors duration-500 mb-8 mx-auto md:mx-0">
                         <Icon className="w-7 h-7 text-red-400" />
                       </div>
                       
                       <h3 className="text-2xl font-bold text-white mb-4 text-center md:text-left group-hover:text-red-400 transition-colors duration-300">
                         {bene.title}
                       </h3>
                       
                       <p className="text-lg text-slate-400 leading-relaxed text-center md:text-left">
                         {bene.description}
                       </p>
                     </div>
                   </motion.div>
                 );
              })}
           </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-24 lg:py-32 bg-slate-950 relative overflow-hidden">
        {/* Top subtle border */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden border border-slate-800/80 shadow-2xl">
            {/* Background embellishments */}
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                Empieza a gestionar tu negocio fitness <br className="hidden md:block"/> como un profesional
              </h2>
              <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-light">
                Organiza clientes, crea rutinas y escala tu servicio desde hoy.
              </p>
              
              <Link to="/register" className="h-16 px-10 rounded-2xl bg-red-600 text-white font-bold text-xl hover:bg-red-500 transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] transform hover:-translate-y-1 inline-flex items-center justify-center gap-3 w-full sm:w-auto">
                Empieza gratis <ArrowRight className="w-6 h-6" />
              </Link>
              
              {/* Trust Elements */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 text-slate-400 text-sm md:text-base font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-red-500" /> 
                  <span>No necesitas tarjeta de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-red-500" /> 
                  <span>Configuración en menos de 5 minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-red-500" /> 
                  <span>Empieza a usarlo desde hoy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
