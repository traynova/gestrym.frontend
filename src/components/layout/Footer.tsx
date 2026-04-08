import React from 'react';
import { Dumbbell, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-accent" />
              </div>
              <span className="font-bold text-lg tracking-tight text-primary">TRAYNOVA</span>
            </div>
            <p className="text-slate-500 mb-6 text-sm">
              Potenciando la próxima generación de entrenadores y negocios fitness online.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-primary mb-4">Producto</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">Features</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">Integrations</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">Pricing</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-primary mb-4">Recursos</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">Community</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">Academy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Traynova Inc. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
