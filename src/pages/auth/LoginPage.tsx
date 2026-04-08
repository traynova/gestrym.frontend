import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(6, 'Debe tener al menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
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
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorDesc(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <AuthLayout 
      title="Bienvenido de nuevo" 
      subtitle="Inicia sesión en tu cuenta para continuar"
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {errorDesc && (
          <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg">
            {errorDesc}
          </div>
        )}

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
            Contraseña
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-neutral-500" />
            </div>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-neutral-900/50 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-neutral-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Entrar'}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-neutral-900 text-neutral-400 backdrop-blur-xl">
              O ingresa con
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert("Google Login Placeholder")}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-white/10 rounded-lg shadow-sm text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 focus:ring-offset-neutral-900 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <p className="mt-4 text-center text-sm text-neutral-400">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Regístrate
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
