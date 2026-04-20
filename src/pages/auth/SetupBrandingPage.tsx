import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Loader2, 
  Image as ImageIcon, 
  CheckCircle2, 
  User, 
  ChevronLeft, 
  Heart,
  MessageCircle,
  Play
} from 'lucide-react';
import { authService } from '../../api/authService';
import { useAuthStore } from '../../store/useAuthStore';

export function SetupBrandingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [appName, setAppName] = useState(user?.email.split('@')[0] || '');
  const [primaryColor, setPrimaryColor] = useState('#EF4444'); 
  const [secondaryColor, setSecondaryColor] = useState('#0F172A'); // Agregado para el tema Claro/Oscuro
  
  const [avatar, setAvatar] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  
  const [avatarPreview, setAvatarPreview] = useState<string>('/assets/images/LOGO_G.png');
  const [logoPreview, setLogoPreview] = useState<string>('/assets/images/LOGO_GESTRIM.png');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'avatar') {
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
      } else {
        setLogo(file);
        setLogoPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (avatar) formData.append('avatar', avatar);
      if (logo) formData.append('logo', logo);
      formData.append('primary_color', primaryColor);
      formData.append('secondary_color', secondaryColor);
      formData.append('app_name', appName);

      await authService.updateBranding(formData);
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error(error);
      alert('Error guardando configuración');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row overflow-hidden">
      {/* LEFT SIDE - PREVIEW */}
      <div className="flex-1 bg-slate-950 relative flex flex-col items-center justify-center p-8 lg:p-12 border-r border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_70%)]" />
        
        <div className="relative z-10 w-full max-w-sm">
          <p className="text-center text-slate-400 mb-8 font-medium">Así es como tus clientes verán tu app personalizada</p>
          
          {/* PHONE MOCKUP */}
          <div 
            className="relative mx-auto w-[320px] h-[640px] rounded-[3rem] border-[8px] border-slate-800 shadow-[0_0_100px_rgba(239,68,68,0.1)] overflow-hidden flex flex-col transition-colors duration-500"
            style={{ backgroundColor: secondaryColor }}
          >
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-30" />
            
            {/* App Header */}
            <div className="p-6 pt-10 flex items-center justify-between">
              <ChevronLeft className={`w-6 h-6 ${secondaryColor === '#FFFFFF' ? 'text-slate-900' : 'text-slate-400'}`} />
              <div className="px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 text-white" style={{ backgroundColor: primaryColor }}>
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Pendiente
              </div>
            </div>

            {/* App Content (Exercise Example) */}
            <div className="flex-1 overflow-y-auto px-6 space-y-6">
              <div className="aspect-[4/3] bg-slate-800 rounded-2xl overflow-hidden relative border border-white/5">
                 <img src="/assets/images/fitness_lifestyle_1_1776553314200.png" className="w-full h-full object-cover opacity-60" alt="Work" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-white">
                      <Play className="fill-current w-6 h-6" />
                    </div>
                 </div>
              </div>

              <div>
                <h3 className={`text-2xl font-black mb-1 ${secondaryColor === '#FFFFFF' ? 'text-slate-950' : 'text-white'}`}>Press de Banca</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Pecho • 4 Series</p>
              </div>

              <div className="space-y-3">
                <p className={`text-xs leading-relaxed font-medium ${secondaryColor === '#FFFFFF' ? 'text-slate-600' : 'text-slate-400'}`}>
                  Realiza el movimiento de forma controlada, mantén la espalda apoyada en el banco y baja la barra hasta el pecho.
                </p>
                <div className="flex gap-2">
                   <div className={`${secondaryColor === '#FFFFFF' ? 'bg-slate-100' : 'bg-slate-800/50'} p-3 rounded-xl border border-white/5`}>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Repeticiones</p>
                      <p className={`text-sm font-black ${secondaryColor === '#FFFFFF' ? 'text-slate-900' : 'text-white'}`}>10 - 12</p>
                   </div>
                   <div className={`${secondaryColor === '#FFFFFF' ? 'bg-slate-100' : 'bg-slate-800/50'} p-3 rounded-xl border border-white/5`}>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Descanso</p>
                      <p className={`text-sm font-black ${secondaryColor === '#FFFFFF' ? 'text-slate-900' : 'text-white'}`}>90s</p>
                   </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2 font-black">
                <button className="w-full py-4 rounded-2xl font-black text-sm transition-all" style={{ backgroundColor: primaryColor + '15', color: primaryColor }}>
                  Añadir Comentarios
                </button>
                <button className="w-full py-4 rounded-2xl font-black text-sm transition-all" style={{ backgroundColor: primaryColor + '15', color: primaryColor }}>
                  Registrar PR / Peso
                </button>
                <button className="w-full py-4 rounded-2xl font-black text-sm text-white shadow-lg" style={{ backgroundColor: primaryColor }}>
                  Completar Ejercicio
                </button>
              </div>
            </div>

            {/* Bottom Nav */}
            <div className={`p-4 border-t flex justify-around transition-colors ${secondaryColor === '#FFFFFF' ? 'bg-white border-slate-100' : 'bg-slate-900/80 border-white/5'}`}>
                <div className="flex flex-col items-center gap-1" style={{ color: primaryColor }}>
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-[9px] font-black uppercase">Rutinas</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-slate-400">
                    <Heart className="w-5 h-5" />
                    <span className="text-[9px] font-black uppercase">Dieta</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-slate-400">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-[9px] font-black uppercase">Chat</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-slate-400">
                    <User className="w-5 h-5" />
                    <span className="text-[9px] font-black uppercase">Perfil</span>
                </div>
            </div>
          </div>

          {/* Carousel dots mockup */}
          <div className="flex justify-center gap-2 mt-8 opacity-40">
            <div className="w-12 h-1 bg-white rounded-full" />
            <div className="w-12 h-1 bg-white rounded-full" />
            <div className="w-12 h-1 bg-white rounded-full" />
            <div className="w-12 h-1 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="lg:w-[500px] bg-black p-8 lg:p-16 flex flex-col justify-center relative">
        <div className="max-w-sm mx-auto w-full space-y-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-4">Tu estilo, tu marca</h1>
            <p className="text-slate-500 leading-relaxed font-medium">Elige cómo quieres que te vean tus clientes. Si cambias de idea puedes volver a cambiarlo cuando quieras.</p>
          </div>

          <div className="space-y-8">
            {/* Input Nombre App */}
            <div className="space-y-3">
               <label className="text-xs font-black uppercase tracking-widest text-slate-500">Nombre de tu app</label>
               <input 
                 type="text" 
                 value={appName}
                 onChange={(e) => setAppName(e.target.value)}
                 className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-bold"
                 placeholder="Ej: Jhonnier Fitness"
               />
            </div>

            {/* Visual Identity Section */}
            <div className="space-y-5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Identidad visual</label>
              
              {/* Row: Icon/Avatar */}
              <div className="flex items-center justify-between p-4 bg-slate-900/30 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 overflow-hidden">
                    <img src={avatarPreview} className="w-full h-full object-cover" alt="Icon" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Icono</p>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">Perfiles y Notificaciones</p>
                  </div>
                </div>
                <button onClick={() => avatarInputRef.current?.click()} className="text-xs font-black bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition-all">Cambiar</button>
                <input ref={avatarInputRef} type="file" className="hidden" onChange={(e) => handleFileChange(e, 'avatar')} />
              </div>

              {/* Row: Logo */}
              <div className="flex items-center justify-between p-4 bg-slate-900/30 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center p-2">
                    <img src={logoPreview} className="w-full h-full object-contain" alt="Logo" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Tu logo</p>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">Encabezados de App</p>
                  </div>
                </div>
                <button onClick={() => logoInputRef.current?.click()} className="text-xs font-black bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition-all">Cambiar</button>
                <input ref={logoInputRef} type="file" className="hidden" onChange={(e) => handleFileChange(e, 'logo')} />
              </div>

              {/* Row: Color */}
              <div className="flex items-center justify-between p-4 bg-slate-900/30 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl shadow-xl overflow-hidden" style={{ backgroundColor: primaryColor }}>
                    <input 
                      type="color" 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Color principal</p>
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">{primaryColor}</p>
                  </div>
                </div>
                <button className="text-xs font-black bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition-all relative">
                   Cambiar
                   <input 
                      type="color" 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </button>
              </div>

              {/* Row: Background Theme (Secondary Color) */}
              <div className="flex items-center justify-between p-4 bg-slate-900/30 border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/10">
                    <Palette className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Fondo de la App</p>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">Claro u Oscuro</p>
                  </div>
                </div>
                <div className="flex bg-slate-800 p-1 rounded-xl gap-1">
                   <button 
                     onClick={() => setSecondaryColor('#0F172A')}
                     className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${secondaryColor === '#0F172A' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                   >
                     Oscuro
                   </button>
                   <button 
                     onClick={() => setSecondaryColor('#FFFFFF')}
                     className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${secondaryColor === '#FFFFFF' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                   >
                     Claro
                   </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-6">
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-3"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Continuar"}
            </button>
            <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">Puedes cambiar todo esto más tarde en configuración</p>
          </div>
        </div>
      </div>

      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
          >
            <div className="text-center space-y-6 max-w-sm px-6">
               <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.3)] animate-bounce">
                  <CheckCircle2 className="w-12 h-12 text-black" />
               </div>
               <h2 className="text-3xl font-black">¡Marca lista!</h2>
               <p className="text-slate-400 font-medium">Estamos configurando tu plataforma personalizada. Prepárate para el siguiente nivel.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
