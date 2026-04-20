import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Loader2, AlertCircle, ArrowLeft, ChevronRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '../../api/auth.endpoints';

const resetSchema = z.object({
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Debes confirmar tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ResetForm = z.infer<typeof resetSchema>;

const SLIDER_IMAGES = [
  '/assets/images/fitness_lifestyle_1_1776553314200.png',
  '/assets/images/fitness_lifestyle_2_1776553328390.png',
  '/assets/images/fitness_lifestyle_3_1776553454247.png',
];

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorDesc, setErrorDesc] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    if (!token) {
      setErrorDesc('Token inválido o ausente en la URL.');
      return;
    }

    setIsLoading(true);
    setErrorDesc(null);
    try {
      await authApi.resetPassword({
        token,
        password: data.password,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorDesc(err.response?.data?.error || 'Token de recuperación inválido o expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row overflow-hidden relative">
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10 overflow-y-auto">
        <div className="w-full max-w-sm space-y-8 py-10">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div>
                  <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-red-400 transition-colors mb-6 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al login
                  </Link>
                  <div className="flex items-center gap-3 mb-2">
                    <img src="/assets/images/LOGO_G.png" alt="G" className="w-12 h-12 object-contain" />
                    <div className="flex flex-col">
                       <img src="/assets/images/LOGO_GESTRIM.png" alt="GESTRYM" className="h-4 w-auto object-contain self-start" />
                       <h2 className="text-3xl font-extrabold text-white tracking-tight">Restablecer</h2>
                    </div>
                  </div>
                  <p className="text-slate-400">Ingresa tu nueva contraseña para recuperar el acceso.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  {errorDesc && (
                    <div className="p-4 text-sm text-red-400 bg-red-900/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-left">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {errorDesc}
                    </div>
                  )}

                  <div className="space-y-1.5 focus-within:z-20 relative">
                    <label className="text-sm font-semibold text-slate-400 ml-1">Nueva Contraseña</label>
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

                  <div className="space-y-1.5 focus-within:z-20 relative">
                    <label className="text-sm font-semibold text-slate-400 ml-1">Confirmar Contraseña</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-red-500 transition-colors" />
                      <input 
                        {...register('confirmPassword')} 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••" 
                        disabled={isLoading}
                        className="block w-full pl-12 pr-4 py-3 border border-slate-800 rounded-2xl bg-slate-900/80 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all" 
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 ml-1 font-medium">{errors.confirmPassword.message}</p>}
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-4 px-4 rounded-2xl text-base font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all disabled:opacity-50">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>Actualizar contraseña <ChevronRight className="w-5 h-5 ml-2" /></>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold text-white">¡Actualizada!</h2>
                  <p className="text-slate-400">Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión nuevamente.</p>
                </div>
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center py-4 px-4 rounded-2xl text-base font-bold text-white bg-red-600 hover:bg-red-500 transition-all shadow-lg shadow-red-600/20"
                >
                  Ir al login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SIDE - CAROUSEL (reused from ForgotPasswordPage) */}
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
            <h3 className="text-3xl font-extrabold text-white mb-4">Nueva etapa, <br/><span className="text-red-500">nueva seguridad</span></h3>
            <p className="text-slate-400 text-lg font-light leading-relaxed">Protege tu progreso. Una contraseña fuerte es la base de tu disciplina.</p>
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
             <img src={img} alt="" className="w-full h-full object-cover grayscale-[0.2] transition-all opacity-60 group-hover:opacity-100 group-hover:grayscale-0 duration-700" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
