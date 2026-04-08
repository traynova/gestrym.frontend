import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  Dumbbell, 
  TrendingUp, 
  Users, 
  Apple, 
  BarChart3, 
  CalendarCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Dumbbell, title: "Workout Builder", desc: "Crea programas de entrenamiento interactivos con videos y series." },
  { icon: TrendingUp, title: "Progress Tracking", desc: "Monitorea volumen, fuerza y métricas corporales en tiempo real." },
  { icon: Apple, title: "Nutrition Planning", desc: "Asigna macros diarios, planes de comida y seguimiento de calorías." },
  { icon: Users, title: "Client CRM", desc: "Gestiona a todos tus clientes, su estado y comunicación desde un solo lugar." },
  { icon: BarChart3, title: "Analytics", desc: "Panel de control con métricas financieras y retención de clientes." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-slate-900 to-slate-800 -z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay -z-10" />

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-accent text-sm font-medium mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-accent"></span>
              Plataforma todo-en-uno para Entrenadores
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight"
            >
              Escala tu negocio fitness con <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">tecnología inteligente</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto"
            >
              Centraliza la gestión de clientes, automatiza la entrega de entrenamientos y ofrece una experiencia de máximo nivel con tu propia app SaaS.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button className="h-14 px-8 rounded-xl bg-secondary hover:bg-green-400 text-slate-900 font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center">
                Empieza Gratis 
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="h-14 px-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white font-semibold text-lg transition-all w-full sm:w-auto justify-center">
                Ver Demo
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID (Bento Style) */}
      <section className="py-24 bg-slate-50" id="features">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Todo lo que necesitas para operar online</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Sustituye múltiples hojas de Excel y apps genéricas por un ecosistema unificado enfocado en resultados.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-accent mb-6 border border-slate-100">
                  <feat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feat.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white" id="how-it-works">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Simplifica tu proceso en 3 pasos</h2>
              <p className="text-lg text-slate-600 mb-12">Desde el onboarding hasta la facturación, hemos digitalizado el ciclo completo de coaching.</p>
              
              <div className="space-y-8">
                {[
                  { title: "Crea Programas y Plantillas", desc: "Diseña rutinas y planes nutricionales una vez. Guárdalos como plantillas para reutilizarlos." },
                  { title: "Asigna y Automatiza", desc: "Sube clientes a la plataforma, asígnales planes y la app enviará notificaciones por ti." },
                  { title: "Monitorea y Escala", desc: "Revisa los check-ins semanales en minutos a través del panel de cumplimiento." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-primary mb-2">{step.title}</h4>
                      <p className="text-slate-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              {/* Mockup visual */}
              <div className="bg-slate-900 rounded-3xl p-4 shadow-2xl relative z-10 border-4 border-slate-800">
                <div className="bg-slate-800 rounded-2xl h-[500px] w-full flex items-center justify-center overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800/80 to-transparent z-10" />
                   <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" alt="Dashboard" className="w-full h-full object-cover opacity-60" />
                   <div className="absolute inset-0 z-20 flex flex-col p-8">
                      <div className="w-full h-12 bg-white/10 backdrop-blur-md rounded-xl mb-4 border border-white/10" />
                      <div className="w-3/4 h-24 bg-white/10 backdrop-blur-md rounded-xl mb-4 border border-white/10" />
                      <div className="w-1/2 h-32 bg-white/10 backdrop-blur-md rounded-xl mb-4 border border-white/10" />
                   </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="py-24 bg-slate-50" id="pricing">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Planes diseñados para crecer</h2>
            <p className="text-lg text-slate-600">Empieza con lo básico, escala a nivel agencia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-primary mb-2">Starter</h3>
              <p className="text-slate-500 mb-6">Para entrenadores empezando.</p>
              <div className="text-4xl font-extrabold text-primary mb-6">$29<span className="text-lg font-medium text-slate-500">/mes</span></div>
              <ul className="space-y-4 mb-8">
                {['Hasta 15 clientes activos', 'Constructor de rutinas básico', 'Soporte vía email'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl border-2 border-slate-200 text-primary font-bold hover:border-primary transition-colors">Start Free Trial</button>
            </div>
            
            {/* Pro */}
            <div className="bg-primary rounded-3xl p-8 border border-primary relative transform md:-translate-y-4 shadow-2xl">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">MÁS POPULAR</div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-slate-400 mb-6">Para negocios en crecimiento.</p>
              <div className="text-4xl font-extrabold text-white mb-6">$79<span className="text-lg font-medium text-slate-400">/mes</span></div>
              <ul className="space-y-4 mb-8">
                {['Clientes Ilimitados', 'Nutrición y Macros', 'White-labeling (Tu Logo)', 'Automatización de pagos'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl bg-secondary text-primary font-bold hover:bg-green-400 transition-colors">Go Pro</button>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-primary mb-2">Enterprise</h3>
              <p className="text-slate-500 mb-6">Equipos y grandes gimnasios.</p>
              <div className="text-4xl font-extrabold text-primary mb-6">$199<span className="text-lg font-medium text-slate-500">/mes</span></div>
              <ul className="space-y-4 mb-8">
                {['Múltiples Coaches', 'API Access', 'Reportes Avanzados', 'Account Manager Dedicado'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl border-2 border-slate-200 text-primary font-bold hover:border-primary transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
