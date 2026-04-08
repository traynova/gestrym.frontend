import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-neutral-950/80 to-neutral-950 opacity-100"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <h2 className="mt-6 text-center text-4xl font-extrabold text-white tracking-tight">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-400">
          {subtitle}
        </p>

        <div className="mt-8">
          <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/5 py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
