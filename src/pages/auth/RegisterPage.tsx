import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.endpoints';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Mail, User, Phone, Loader2 } from 'lucide-react';
import { useState } from 'react';

const registerSchema = z.object({
  name: z.string().min(2, 'Ingresa tu nombre completo'),
  email: z.string().email('Ingresa un correo válido'),
  phone: z.string().min(8, 'Ingresa un teléfono válido'),
  role_id: z.coerce.number().min(1)
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorDesc, setErrorDesc] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role_id: 1 // Default to clietn
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    setErrorDesc(null);
    setIsLoading(true);
    try {
      await authApi.register(data);
      navigate('/login');
    } catch (err: any) {
      setErrorDesc(err.response?.data?.error || 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Crea tu cuenta" 
      subtitle="Únete a Gestrym y comienza tu viaje"
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {errorDesc && (
          <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg">
            {errorDesc}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-300">
            Nombre Completo
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-neutral-500" />
            </div>
            <input
              {...register('name')}
              type="text"
              placeholder="Juan Pérez"
              className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-neutral-900/50 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300">
            Correo electrónico
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-neutral-500" />
            </div>
            <input
              {...register('email')}
              type="email"
              placeholder="tu@correo.com"
              className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-neutral-900/50 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300">
            Teléfono
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-neutral-500" />
            </div>
            <input
              {...register('phone')}
              type="tel"
              placeholder="+123456789"
              className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-neutral-900/50 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Tipo de cuenta
          </label>
          <div className="flex gap-4">
            <label className="flex-1">
              <input type="radio" value="1" {...register('role_id')} className="peer sr-only" />
              <div className="text-center py-2 px-3 border border-white/10 rounded-lg cursor-pointer bg-neutral-900/50 text-neutral-400 peer-checked:bg-indigo-600/20 peer-checked:text-indigo-400 peer-checked:border-indigo-500 transition-all hover:bg-neutral-800">
                Cliente
              </div>
            </label>
            <label className="flex-1">
              <input type="radio" value="2" {...register('role_id')} className="peer sr-only" />
              <div className="text-center py-2 px-3 border border-white/10 rounded-lg cursor-pointer bg-neutral-900/50 text-neutral-400 peer-checked:bg-purple-600/20 peer-checked:text-purple-400 peer-checked:border-purple-500 transition-all hover:bg-neutral-800">
                Coach
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-neutral-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Registrarse'}
        </button>

        <p className="mt-4 text-center text-sm text-neutral-400">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
