import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle, ArrowLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuthStore } from '../../store/useAuthStore';

// Validaciones con Zod
const loginSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Ingresa un correo electrónico válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginForm = z.infer<typeof loginSchema>;

const SLIDER_IMAGES = [
  '/assets/images/fitness_lifestyle_1_1776553314200.png',
  '/assets/images/fitness_lifestyle_2_1776553328390.png',
  '/assets/images/fitness_lifestyle_3_1776553454247.png',
];

export function LoginPage() {
  const navigate = useNavigate();
  const { loginAction, isLoading } = useAuthStore();
  const [errorDesc, setErrorDesc] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setErrorDesc(null);
    try {
      const isInitial = await loginAction(data);
      const currentUser = useAuthStore.getState().user;
      
      // Solo redirigir a setup-branding si es primer login Y es Entrenador (2) o Gimnasio (3)
      if (isInitial === false && (currentUser?.role_id === 2 || currentUser?.role_id === 3)) {
        navigate('/setup-branding');
        return;
      }

      // Redirigir al dashboard general
      navigate('/dashboard');

    } catch (err: any) {
      setErrorDesc(err.message || 'Ocurrió un error inesperado al iniciar sesión.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row overflow-hidden relative">
      {/* LEFT SIDE - FORM */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10 overflow-y-auto">
        <div className="w-full max-w-sm space-y-8 py-10">
          <div>
            <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-red-400 transition-colors mb-6 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver al inicio
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <img src="/assets/images/LOGO_G.png" alt="Gestrym Logo" className="w-12 h-12 object-contain" />
              <div className="flex flex-col">
                <img src="/assets/images/LOGO_GESTRIM.png" alt="Gestrym" className="h-4 w-auto object-contain self-start" />
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Bienvenido</h2>
              </div>
            </div>
            <p className="text-slate-400">Ingresa a tu cuenta para continuar con tu transformación.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {errorDesc && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 text-sm text-red-400 bg-red-900/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {errorDesc}
              </motion.div>
            )}

            <div className="space-y-1.5 focus-within:z-20 relative">
              <label className="text-sm font-semibold text-slate-400 ml-1">Correo electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-red-500 transition-colors" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="correo@ejemplo.com"
                  disabled={isLoading}
                  className="block w-full pl-12 pr-4 py-3 border border-slate-800 rounded-2xl bg-slate-900/80 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 ml-1 font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5 focus-within:z-20 relative">
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-semibold text-slate-400">Contraseña</label>
                <Link to="/forgot-password" className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-red-500 transition-colors" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="block w-full pl-12 pr-12 py-3 border border-slate-800 rounded-2xl bg-slate-900/80 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 ml-1 font-medium">{errors.password.message}</p>}
            </div>

            <div className="flex items-center px-1">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-5 h-5 border border-slate-800 rounded-md bg-slate-900 peer-checked:bg-red-600 peer-checked:border-red-600 transition-all mr-3 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                </div>
                <span className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">Recordarme</span>
              </label>
            </div>

            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-4 px-4 rounded-2xl text-base font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all disabled:opacity-50">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>Entrar a mi cuenta <ChevronRight className="w-5 h-5 ml-2" /></>
              )}
            </button>

            <p className="text-center text-sm text-slate-500 pt-4">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="font-bold text-red-500 hover:text-red-400">Regístrate gratis</Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - CAROUSEL */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-slate-900 border-l border-slate-800/50">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 to-transparent z-10 w-32" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-1 gap-6 w-full h-[120%] -rotate-12 translate-x-20">
            <InfiniteSlider images={SLIDER_IMAGES} direction="up" speed={40} />
            <InfiniteSlider images={SLIDER_IMAGES.reverse()} direction="down" speed={45} />
          </div>
        </div>
        <div className="absolute bottom-12 left-12 right-12 z-20">
          <div className="bg-slate-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-3xl font-extrabold text-white mb-4">Tu mejor versión <br /><span className="text-red-500">empieza aquí</span></h3>
            <p className="text-slate-400 text-lg font-light leading-relaxed">Tu éxito es nuestra pasión. Accede a las herramientas que potenciarán tu rendimiento.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfiniteSlider({ images, direction, speed }: { images: string[], direction: 'up' | 'down', speed: number }) {
  return (
    <div className="flex flex-col gap-6 items-center">
      <motion.div
        animate={{ y: direction === 'up' ? [0, -1000] : [-1000, 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex flex-col gap-6"
      >
        {[...images, ...images, ...images, ...images].map((img, i) => (
          <div key={i} className="w-[400px] aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl skew-x-1 group">
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
