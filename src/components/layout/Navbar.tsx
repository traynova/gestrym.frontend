import { useState, useEffect } from 'react';
import { Menu, X, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Escuchar el evento de scroll para aplicar el fondo difuminado de forma dinámica
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-0' : 'bg-transparent border-b border-transparent py-2'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">GESTRYM</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#problem" className="text-slate-300 hover:text-white transition-colors font-medium text-sm lg:text-base">El Problema</a>
            <a href="#features" className="text-slate-300 hover:text-white transition-colors font-medium text-sm lg:text-base">Solución</a>
            <a href="#demo" className="text-slate-300 hover:text-white transition-colors font-medium text-sm lg:text-base">Demo</a>
            <a href="#benefits" className="text-slate-300 hover:text-white transition-colors font-medium text-sm lg:text-base">Beneficios</a>
            <Link to="/pricing" className="text-slate-300 hover:text-white transition-colors font-medium text-sm lg:text-base">Precios</Link>
            <div className="flex items-center gap-5 ml-4 border-l border-white/10 pl-8">
              <Link to="/login" className="text-slate-300 font-semibold hover:text-white transition-colors">Log In</Link>
              <Link to="/register" className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transform hover:-translate-y-0.5 inline-block">
                Empieza gratis
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2 focus:outline-none">
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden absolute w-full"
          >
            <div className="px-6 pt-4 pb-8 flex flex-col space-y-5">
              <a href="#problem" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white font-medium py-2 text-lg">El Problema</a>
              <a href="#features" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white font-medium py-2 text-lg">Solución</a>
              <a href="#demo" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white font-medium py-2 text-lg">Demo</a>
              <a href="#benefits" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white font-medium py-2 text-lg">Beneficios</a>
              <Link to="/pricing" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white font-medium py-2 text-lg block">Precios</Link>
              
              <hr className="border-white/10 my-2" />
              
              <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-left py-2 text-white font-semibold text-lg block">Log In</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="w-full bg-red-600 text-white px-5 py-3.5 rounded-xl font-bold text-center hover:bg-red-500 transition-colors block text-lg shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                Empieza gratis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
