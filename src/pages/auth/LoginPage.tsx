import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

import { useAuthStore } from '../../store/useAuthStore';
import { AuthLayout } from '../../components/layout/AuthLayout';

// Validaciones con Zod
const loginSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Ingresa un correo electrónico válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { loginAction, isLoading } = useAuthStore();
  const [errorDesc, setErrorDesc] = useState<string | null>(null);

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
      // 1. Llamamos a nuestra acción de Zustand
      await loginAction(data);
      
      // 2. Extraemos el usuario actualizado sincrónicamente
      const currentUser = useAuthStore.getState().user;

      // 3. Manejamos el ruteo estricto basado en jerarquía
      if (currentUser?.role_id === 1) {
        navigate('/client/dashboard');
      } else if (currentUser?.role_id === 2) {
        navigate('/coach/dashboard');
      } else if (currentUser?.role_id === 3) {
        navigate('/gym/dashboard');
      } else {
        // Fallback por defecto (ej: Admins)
        navigate('/dashboard');
      }

    } catch (err: any) {
      // Dado que el authService fue configurado para hacer 'throw new Error(mensaje)',
      // podemos consumir err.message directamente sin bucear en axios response.
      setErrorDesc(err.message || 'Ocurrió un error inesperado al iniciar sesión.');
    }
  };

  return (
    <AuthLayout 
      title="Bienvenido a Gestrym" 
      subtitle="Ingresa tus credenciales para acceder a tu plataforma."
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Manejador de Errores Visual */}
        {errorDesc && (
          <div className="flex items-center gap-3 p-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{errorDesc}</p>
          </div>
        )}

        {/* Input Email */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              placeholder="tu@correo.com"
              disabled={isLoading}
              className={`block w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.email ? 'border-red-300 focus:border-red-500 ring-red-200' : 'border-slate-200 focus:border-primary'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-500 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Input Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              className={`block w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.password ? 'border-red-300 focus:border-red-500 ring-red-200' : 'border-slate-200 focus:border-primary'
              }`}
            />
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-500 font-medium">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
              Recordarme
            </label>
          </div>

          <div className="text-sm">
            <Link to="/forgot-password" className="font-semibold text-primary hover:text-accent transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-primary hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Verificando...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>

        <p className="mt-8 text-center text-sm text-slate-500">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-bold text-primary hover:text-accent transition-colors">
            Crea una cuenta gratis
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
