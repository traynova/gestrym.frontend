import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { authApi, User } from '../../api/auth.endpoints';

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [userData, setUserData] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const confirm = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Token de confirmación no encontrado.');
        return;
      }

      try {
        const response = await authApi.confirmEmail(token);
        setUserData(response.user);
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.response?.data?.error || 'No se pudo confirmar el correo. El enlace puede haber expirado.');
      }
    };

    confirm();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {status === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 z-10"
          >
            <div className="relative">
              <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
              <div className="absolute inset-0 blur-xl bg-red-600/20 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Activando tu cuenta...</h2>
            <p className="text-slate-400">Estamos verificando tu información.</p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div 
            key="success"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-[3rem] shadow-2xl text-center relative z-10 overflow-hidden"
          >
            {/* Success Decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-500" />
            
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full group-hover:bg-green-500/30 transition-all duration-500" />
                <div className="relative w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                  <CheckCircle2 className="w-14 h-14 text-green-500" />
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-6">
               <div className="flex items-center gap-3">
                  <img src="/assets/images/LOGO_G.png" alt="Gestrym" className="w-12 h-12 object-contain" />
                  <img src="/assets/images/LOGO_GESTRIM.png" alt="GESTRYM" className="h-4 w-auto object-contain" />
               </div>
            </div>

            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
              ¡Bienvenido, <span className="text-green-500">{userData?.name.split(' ')[0]}</span>!
            </h2>
            
            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-sm mx-auto">
              Tu cuenta ha sido activada con éxito. Ahora eres parte de la comunidad <span className="text-white font-bold">Gestrym</span>.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-600/20 transition-all active:scale-[0.98] flex items-center justify-center group"
              >
                Comenzar ahora
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div 
            key="error"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl text-center relative z-10"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600" />
            
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">Activación Fallida</h2>
            <p className="text-slate-400 leading-relaxed mb-8">{errorMessage}</p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/register')}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-red-600/20"
              >
                Intentar registro nuevamente
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all active:scale-[0.98]"
              >
                Ir al Inicio
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
