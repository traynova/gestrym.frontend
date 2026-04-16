import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  CheckCircle2, 
  UserCircle,
  Users,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 -z-10" />
        <div className="absolute top-0 left-1/4 -translate-y-12 w-[600px] h-[600px] bg-red-600/10 blur-[120px] rounded-full opacity-40 -z-10" />
        <div className="absolute bottom-0 right-1/4 translate-y-1/3 w-[600px] h-[600px] bg-red-900/10 blur-[120px] rounded-full opacity-40 -z-10" />
        
        {/* 1. HERO SUPERIOR */}
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6"
            >
              Empieza <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">gratis</span> con Gestrym
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-10"
            >
              Gestiona clientes, crea rutinas y escala tu negocio fitness desde un solo lugar.
            </motion.p>
            
            {/* 2. TOGGLE DE PLANES */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-4 mt-8"
            >
              <span className={`text-sm font-semibold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>Mensual</span>
              <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-800 border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-red-500 transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${isAnnual ? 'text-white' : 'text-slate-400'}`}>Anual</span>
                <span className="text-xs font-bold bg-green-500/10 text-green-400 px-2.5 py-0.5 rounded-full border border-green-500/20">
                  Ahorra 20%
                </span>
              </div>
            </motion.div>
          </div>

          {/* 3. TARJETAS DE PLANES */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-8 max-w-6xl mx-auto mb-32 items-center">
            
            {/* PLAN 1 - STARTER */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-slate-700 transition-all flex flex-col h-full"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                <p className="text-slate-400 text-sm h-10">Ideal para entrenadores que inician su camino digital.</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">$0</span>
                <span className="text-slate-400">/mes</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Hasta 5 clientes activos</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Creación de rutinas básicas</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Acceso a plantillas iniciales</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600">
                  <span className="w-5 h-5 shrink-0" />
                  <span>Sin planes de alimentación</span>
                </li>
              </ul>
              <Link to="/register" className="w-full h-12 rounded-xl border border-slate-700 text-white font-bold inline-flex items-center justify-center hover:bg-slate-800 hover:border-slate-600 transition-all">
                Empezar gratis
              </Link>
            </motion.div>

            {/* PLAN 2 - PRO (DESTACADO) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-b from-slate-800 to-slate-900 p-8 rounded-[2rem] border-[2px] border-red-500/50 hover:border-red-500 shadow-[0_0_40px_rgba(220,38,38,0.15)] relative transform md:-translate-y-4 flex flex-col h-full z-10"
            >
              <div className="absolute top-0 inset-x-0 mx-auto -translate-y-1/2 w-max">
                <span className="bg-red-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-lg shadow-red-500/30">
                  Más Popular
                </span>
              </div>
              <div className="mb-8 mt-2">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-slate-300 text-sm h-10">Para profesionales listos para escalar su negocio.</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">
                  ${isAnnual ? '39' : '49'}
                </span>
                <span className="text-slate-300">/mes</span>
                {isAnnual && <div className="text-sm text-red-400 mt-1">Facturado anualmente ($468)</div>}
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-white font-medium">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Clientes ilimitados</span>
                </li>
                <li className="flex items-start gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Planes de alimentación completos</span>
                </li>
                <li className="flex items-start gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Seguimiento y gráficas de progreso</span>
                </li>
                <li className="flex items-start gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Dashboard profesional completo</span>
                </li>
              </ul>
              <Link to="/register" className="w-full h-14 rounded-xl bg-red-600 text-white font-bold inline-flex items-center justify-center hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all transform hover:-translate-y-0.5">
                Elegir plan Pro
              </Link>
            </motion.div>

            {/* PLAN 3 - GYM */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-slate-700 transition-all flex flex-col h-full"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Gym</h3>
                <p className="text-slate-400 text-sm h-10">Centros deportivos y equipos de entrenadores.</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">
                  ${isAnnual ? '159' : '199'}
                </span>
                <span className="text-slate-400">/mes</span>
                {isAnnual && <div className="text-sm text-slate-500 mt-1">Facturado anualmente ($1908)</div>}
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Gestión de múltiples entrenadores</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Administración global de clientes</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Reportes financieros y de retención</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Soporte prioritario 24/7</span>
                </li>
              </ul>
              <Link to="/register" className="w-full h-12 rounded-xl border border-slate-700 text-white font-bold inline-flex items-center justify-center hover:bg-slate-800 hover:border-slate-600 transition-all">
                Contactar / Empezar
              </Link>
            </motion.div>

          </div>
          
          {/* 4. SECCIÓN EXTRA: ¿Para quién es Gestrym? */}
          <div className="max-w-5xl mx-auto border-t border-slate-800/50 pt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white tracking-tight">¿Para quién es Gestrym?</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 hover:border-red-500/30 hover:bg-slate-800/60 transition-all group">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500/10 border border-slate-700 group-hover:border-red-500/20 transition-colors">
                  <UserCircle className="w-6 h-6 text-slate-400 group-hover:text-red-400 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Entrenadores</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Centraliza rutinas, clientes y seguimientos para ofrecer una experiencia premium y organizar tu negocio personal.</p>
              </div>

              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 hover:border-red-500/30 hover:bg-slate-800/60 transition-all group">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500/10 border border-slate-700 group-hover:border-red-500/20 transition-colors">
                  <Building2 className="w-6 h-6 text-slate-400 group-hover:text-red-400 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Gimnasios</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Control total sobre tu staff y alumnos, con métricas centralizadas y un entorno administrable para optimizar recursos.</p>
              </div>

              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 hover:border-red-500/30 hover:bg-slate-800/60 transition-all group">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500/10 border border-slate-700 group-hover:border-red-500/20 transition-colors">
                  <Users className="w-6 h-6 text-slate-400 group-hover:text-red-400 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Alumnos</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Un portal interactivo donde ven su progresión, reciben feedback, y ejecutan sus entrenamientos con perfecta claridad.</p>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
