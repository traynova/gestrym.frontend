import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, Role } from '../../api/auth.endpoints';
import { Mail, User, Loader2, Lock, MapPin, Building2, ChevronRight, Dumbbell, ArrowLeft, Eye, EyeOff, XCircle, CheckCircle2, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneInputField } from '../../components/forms/PhoneInput';
import { parsePhoneNumber } from 'libphonenumber-js';

const registerSchema = z.object({
  name: z.string().min(2, 'Ingresa tu nombre completo'),
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(6, 'Al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
  phone: z.string().min(5, 'Ingresa un teléfono válido'),
  referral_code: z.string().optional(),
  role_id: z.coerce.number().min(1, 'Selecciona un tipo de cuenta'),
  registration_source: z.literal('self'),
  city: z.string().optional(),
  department: z.string().optional(),
  country: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    });
  }
  if (data.role_id === 3) {
    if (!data.city) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La ciudad es obligatoria', path: ['city'] });
    if (!data.department) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'El departamento es obligatorio', path: ['department'] });
    if (!data.country) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'El país es obligatorio', path: ['country'] });
  }
});

type RegisterForm = z.infer<typeof registerSchema>;

const SLIDER_IMAGES = [
  '/assets/images/fitness_lifestyle_1_1776553314200.png',
  '/assets/images/fitness_lifestyle_2_1776553328390.png',
  '/assets/images/fitness_lifestyle_3_1776553454247.png',
];

export function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [modalConfig, setModalConfig] = useState<{
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role_id: 1,
      registration_source: 'self',
      phone: '',
      referral_code: ''
    }
  });

  const selectedRoleId = Number(watch('role_id'));

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await authApi.getRoles();
        setRoles(data);
      } catch (err) {
        setRoles([
          { id: 1, name: 'Cliente', description: 'Atleta o alumno', is_active: true },
          { id: 2, name: 'Entrenador', description: 'Coach profesional', is_active: true },
          { id: 3, name: 'Gimnasio', description: 'Centro deportivo', is_active: true },
        ]);
      } finally {
        setIsLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const phoneNumber = parsePhoneNumber(data.phone);
      const prefix = phoneNumber ? `+${phoneNumber.countryCallingCode}` : '+57';
      const nationalNumber = phoneNumber ? phoneNumber.nationalNumber : data.phone;

      const payload = {
        ...data,
        prefix,
        phone: nationalNumber,
      };

      await authApi.register(payload);
      
      setModalConfig({
        show: true,
        type: 'success',
        title: '¡Registro Exitoso!',
        message: 'Hemos enviado un enlace a tu correo. Por favor, revisa tu bandeja de entrada para activar tu cuenta e iniciar sesión.'
      });
    } catch (err: any) {
      setModalConfig({
        show: true,
        type: 'error',
        title: 'Ups, algo salió mal',
        message: err.response?.data?.error || 'No pudimos procesar tu registro. Por favor, verifica tus datos e inténtalo de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row overflow-hidden relative">
      <AnimatePresence>
        {modalConfig.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1.5 ${modalConfig.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
              
              <div className="mb-6 flex justify-center">
                {modalConfig.type === 'success' ? (
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                    <XCircle className="w-12 h-12 text-red-500" />
                  </div>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">{modalConfig.title}</h3>
              <p className="text-slate-400 leading-relaxed mb-8">{modalConfig.message}</p>
              
              <button
                onClick={() => {
                  setModalConfig({ ...modalConfig, show: false });
                  if (modalConfig.type === 'success') navigate('/login');
                }}
                className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 ${
                  modalConfig.type === 'success' 
                    ? 'bg-green-600 hover:bg-green-500 shadow-green-600/20' 
                    : 'bg-red-600 hover:bg-red-500 shadow-red-600/20'
                }`}
              >
                {modalConfig.type === 'success' ? 'Continuar al Login' : 'Entendido'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-10">
          <div>
            <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-red-400 transition-colors mb-6 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver al inicio
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <img src="/assets/images/LOGO_G.png" alt="Gestrym Logo" className="w-12 h-12 object-contain" />
              <div className="flex flex-col">
                <img src="/assets/images/LOGO_GESTRIM.png" alt="Gestrym" className="h-4 w-auto object-contain self-start" />
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Crea tu cuenta</h2>
              </div>
            </div>
            <p className="text-slate-400">Únete a la plataforma que lleva tu entrenamiento al siguiente nivel.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-400 ml-1">¿Quién eres?</label>
              {isLoadingRoles ? (
                <div className="grid grid-cols-3 gap-3 animate-pulse">
                  {[1, 2, 3].map(i => <div key={i} className="h-14 bg-slate-900 rounded-xl border border-slate-800" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {roles.map((role) => (
                    <label key={role.id} className="relative cursor-pointer">
                      <input type="radio" value={role.id} {...register('role_id')} className="peer sr-only" />
                      <div className="h-full flex flex-col items-center justify-center p-3 border border-slate-800 rounded-2xl bg-slate-900/50 text-slate-500 peer-checked:bg-red-600/10 peer-checked:text-red-500 peer-checked:border-red-500/50 hover:bg-slate-800/80 transition-all duration-200">
                        <span className="text-sm font-bold">{role.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5 relative">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-red-500 transition-colors" />
                  <input {...register('name')} placeholder={selectedRoleId === 3 ? 'Nombre del Gimnasio' : 'Nombre Completo'} className="block w-full pl-12 pr-4 py-3 border border-slate-800 rounded-2xl bg-slate-900/80 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all" />
                </div>
                {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5 relative">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-red-500 transition-colors" />
                  <input {...register('email')} type="email" placeholder="correo@ejemplo.com" className="block w-full pl-12 pr-4 py-3 border border-slate-800 rounded-2xl bg-slate-900/80 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all" />
                </div>
                {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-red-500 transition-colors" />
                    <input 
                      {...register('password')} 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Contraseña" 
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
                  {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
                </div>

                <div className="space-y-1.5 relative">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-red-500 transition-colors" />
                    <input 
                      {...register('confirmPassword')} 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Confirmar" 
                      className="block w-full pl-12 pr-12 py-3 border border-slate-800 rounded-2xl bg-slate-900/80 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all" 
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 ml-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PhoneInputField 
                  name="phone" 
                  control={control} 
                  label="Teléfono Móvil" 
                  error={errors.phone?.message} 
                />

                <div className="space-y-1.5 relative">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Código Referido</label>
                  <div className="relative group">
                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-red-500 transition-colors" />
                    <input 
                      {...register('referral_code')} 
                      type="text" 
                      placeholder="Ej: GEST-123" 
                      className="block w-full pl-12 pr-4 py-3 border border-slate-800 rounded-2xl bg-slate-900/80 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all uppercase" 
                    />
                  </div>
                </div>
              </div>

              {selectedRoleId === 3 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-2">
                  <div className="p-4 bg-red-600/5 border border-red-500/20 rounded-2xl space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-red-500 flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Datos del gimnasio
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input {...register('country')} placeholder="País" className="w-full px-4 py-2 text-sm border border-slate-800 rounded-xl bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-red-500/30" />
                      <input {...register('department')} placeholder="Depto" className="w-full px-4 py-2 text-sm border border-slate-800 rounded-xl bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-red-500/30" />
                      <input {...register('city')} placeholder="Ciudad" className="w-full sm:col-span-2 px-4 py-2 text-sm border border-slate-800 rounded-xl bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-red-500/30" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-4 px-4 rounded-2xl text-base font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all disabled:opacity-50">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Comenzar ahora <ChevronRight className="w-5 h-5 ml-2" /></>}
            </button>

            <p className="text-center text-sm text-slate-500">
              ¿Ya eres usuario?{' '}
              <Link to="/login" className="font-bold text-red-500 hover:text-red-400">Inicia sesión</Link>
            </p>
          </form>
        </div>
      </div>

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
            <h3 className="text-3xl font-extrabold text-white mb-4">Lleva tu negocio al <br/><span className="text-red-500">siguiente nivel</span></h3>
            <p className="text-slate-400 text-lg font-light leading-relaxed">Únete a cientos de profesionales que ya automatizan sus procesos con Gestrym.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfiniteSlider({ images, direction, speed }: { images: string[], direction: 'up' | 'down', speed: number }) {
  return (
    <div className="flex flex-col gap-6 items-center">
      <motion.div animate={{ y: direction === 'up' ? [0, -1000] : [-1000, 0] }} transition={{ duration: speed, repeat: Infinity, ease: "linear" }} className="flex flex-col gap-6">
        {[...images, ...images, ...images, ...images].map((img, i) => (
          <div key={i} className="w-[400px] aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl skew-x-1 group">
             <img src={img} alt="" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
