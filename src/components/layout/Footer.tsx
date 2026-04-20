import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          <div className="md:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/assets/images/LOGO_G.png" alt="Gestrym Logo" className="w-10 h-10 object-contain" />
              <img src="/assets/images/LOGO_GESTRIM.png" alt="GESTRYM" className="h-4 w-auto object-contain" />
            </div>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed max-w-sm">
              El software definitivo para automatizar tu coaching online. Gestiona clientes, crea rutinas y escala tu negocio fitness sin límites.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 tracking-wide">Producto</h4>
            <ul className="space-y-4">
              <li><a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">Funcionalidades</a></li>
              <li><a href="#demo" className="text-slate-400 hover:text-white transition-colors text-sm">Demo Automática</a></li>
              <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors text-sm">Crear cuenta</Link></li>
              <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm">Iniciar sesión</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 tracking-wide">Empresa</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Sobre nosotros</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Contacto</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Centro de Ayuda</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 tracking-wide">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Políticas de Privacidad</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Términos del Servicio</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Gestrym Inc. Todos los derechos reservados.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Diseñado para <img src="/assets/images/LOGO_G.png" className="w-4 h-4 mx-1 object-contain" alt="G" /> el ecosistema fitness
          </p>
        </div>
      </div>
    </footer>
  );
}
