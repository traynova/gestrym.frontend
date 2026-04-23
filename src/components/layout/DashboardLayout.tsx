import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Phone, 
  BookOpen, 
  ListTodo, 
  Activity, 
  Dumbbell, 
  GraduationCap, 
  CreditCard, 
  Globe, 
  Bell, 
  Palette, 
  Users2, 
  Code2, 
  HelpCircle,
  Search,
  Book,
  LogOut,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

const NavItem = ({ icon: Icon, label, badge, active, onClick, collapsed }: NavItemProps) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${
      active 
        ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'group-hover:text-red-500 transition-colors'}`} />
    {!collapsed && (
      <>
        <span className="text-sm font-bold tracking-tight flex-1 text-left">{label}</span>
        {badge && (
          <span className="px-2 py-0.5 bg-red-600/20 text-red-500 text-[10px] font-black rounded-md border border-red-500/20">
            {badge}
          </span>
        )}
      </>
    )}
    {collapsed && active && (
      <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
    )}
  </button>
);

const NavSection = ({ title, children, collapsed }: { title: string; children: React.ReactNode; collapsed: boolean }) => (
  <div className="space-y-1 mb-6">
    {!collapsed && <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3">{title}</p>}
    {children}
  </div>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logoutAction } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-black border-r border-white/5 py-6">
      {/* Brand */}
      <div className={`px-6 mb-10 flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}>
        <img src="/assets/images/LOGO_G.png" alt="G" className="w-8 h-8 object-contain" />
        {!isSidebarCollapsed && (
             <img src="/assets/images/LOGO_GESTRIM.png" alt="GESTRYM" className="h-3.5 w-auto object-contain" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
        <NavSection title="Home" collapsed={isSidebarCollapsed}>
          <NavItem icon={Users} label="Clientes" active={isActive('/dashboard')} onClick={() => navigate('/dashboard')} collapsed={isSidebarCollapsed} />
          <NavItem icon={Phone} label="WhatsApp" collapsed={isSidebarCollapsed} />
          <NavItem icon={MessageSquare} label="Chat" badge="Beta" collapsed={isSidebarCollapsed} />
        </NavSection>

        <NavSection title="Biblioteca" collapsed={isSidebarCollapsed}>
          <NavItem 
            icon={BookOpen} 
            label="Programas" 
            active={isActive('/training/plans')} 
            onClick={() => navigate('/training/plans')} 
            collapsed={isSidebarCollapsed} 
          />
          <NavItem icon={ListTodo} label="Formularios" collapsed={isSidebarCollapsed} />
          <NavItem icon={Activity} label="Métricas" collapsed={isSidebarCollapsed} />
          <NavItem 
            icon={Dumbbell} 
            label="Ejercicios" 
            active={isActive('/training/exercises')} 
            onClick={() => navigate('/training/exercises')} 
            collapsed={isSidebarCollapsed} 
          />
          <NavItem icon={GraduationCap} label="Academia" collapsed={isSidebarCollapsed} />
        </NavSection>

        <NavSection title="Configuración" collapsed={isSidebarCollapsed}>
          <NavItem icon={CreditCard} label="Suscripción" collapsed={isSidebarCollapsed} />
          <NavItem icon={Globe} label="Perfil público" collapsed={isSidebarCollapsed} />
          <NavItem icon={Bell} label="Notificaciones" collapsed={isSidebarCollapsed} />
          <NavItem icon={Palette} label="Personalizar App" collapsed={isSidebarCollapsed} />
          <NavItem icon={Users2} label="Equipo" badge="Beta" collapsed={isSidebarCollapsed} />
          <NavItem icon={Code2} label="Desarrolladores" collapsed={isSidebarCollapsed} />
        </NavSection>

        <NavSection title="Soporte" collapsed={isSidebarCollapsed}>
          <NavItem icon={HelpCircle} label="Ayuda" collapsed={isSidebarCollapsed} />
        </NavSection>
      </div>

      <div className="px-3 pt-6 border-t border-white/5">
        <NavItem icon={LogOut} label="Cerrar sesión" onClick={handleLogout} collapsed={isSidebarCollapsed} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarCollapsed ? 80 : 260 }}
        className="hidden lg:block h-screen fixed left-0 top-0 z-50"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] z-[70] lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main 
        className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300"
        style={{ marginLeft: typeof window !== 'undefined' && window.innerWidth > 1024 ? (isSidebarCollapsed ? '80px' : '260px') : 0 }}
      >
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-10 bg-black/80 backdrop-blur-xl z-40">
          <div className="flex items-center gap-6 flex-1">
            <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-800 rounded-xl transition-colors"
            >
                <Menu className="w-6 h-6 text-white" />
            </button>
            <div className="hidden md:flex items-center gap-3 bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-2.5 w-full max-w-md focus-within:border-red-500/50 transition-all">
              <Search className="w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Buscar clientes, programas..." className="bg-transparent border-none text-sm text-white focus:ring-0 placeholder:text-slate-600 w-full" />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white font-bold text-sm">
                <Book className="w-4 h-4" /> Tutoriales
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-bold text-white leading-none mb-1">{user?.email.split('@')[0]}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{user?.role_id === 2 ? 'Entrenador' : 'Gimnasio'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center border-2 border-white/10 shadow-lg p-0.5">
                 <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-red-500 font-black text-sm">
                    {user?.email[0].toUpperCase()}
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-black p-6 lg:p-10 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
