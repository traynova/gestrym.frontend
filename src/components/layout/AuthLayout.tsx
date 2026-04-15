import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background aesthetics - Estilo SaaS Moderno Light */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] mix-blend-multiply pointer-events-none -translate-y-1/4 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] mix-blend-multiply pointer-events-none translate-y-1/4 -translate-x-1/4"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="text-center">
            {/* Pequeño tag superior decorativo */}
           <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-sm font-semibold mb-6">
             <span className="w-2 h-2 rounded-full bg-secondary"></span> 
             Gestrym App
           </span>
        </div>

        <h2 className="text-center text-4xl font-extrabold text-primary tracking-tight">
          {title}
        </h2>
        <p className="mt-3 text-center text-[15px] text-slate-500 max-w-sm mx-auto">
          {subtitle}
        </p>

        <div className="mt-10">
          <div className="bg-white border border-slate-200/60 py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl sm:px-10 backdrop-blur-sm">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
