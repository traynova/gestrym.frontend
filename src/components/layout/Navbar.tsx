import React, { useState } from 'react';
import { Menu, X, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-accent" />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">TRAYNOVA</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-primary font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-primary font-medium transition-colors">How it Works</a>
            <a href="#pricing" className="text-slate-600 hover:text-primary font-medium transition-colors">Pricing</a>
            <div className="flex items-center gap-4 ml-4">
              <button className="text-primary font-semibold hover:text-accent transition-colors">Log In</button>
              <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors">
                Start Free
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-primary">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col space-y-4">
              <a href="#features" className="text-slate-600 font-medium py-2">Features</a>
              <a href="#how-it-works" className="text-slate-600 font-medium py-2">How it Works</a>
              <a href="#pricing" className="text-slate-600 font-medium py-2">Pricing</a>
              <hr className="border-slate-100" />
              <button className="w-full text-left py-2 text-primary font-semibold">Log In</button>
              <button className="w-full bg-primary text-white px-5 py-3 rounded-lg font-semibold text-center">
                Start Free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
