import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nombre, setNombre] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { login, register } = useAuth();
  const { navigateTo } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!email || !password || (!isLogin && !nombre)) {
      return;
    }

    setSubmitting(true);
    if (isLogin) {
      const success = await login(email, password);
      if (success) {
        navigateTo('shop');
      }
    } else {
      const success = await register(email, password, nombre);
      if (success) {
        setIsLogin(true);
        setPassword('');
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gold-500/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full glass rounded-3xl border border-mineral-200/30 dark:border-mineral-800/40 p-8 shadow-2xl relative z-10">

        {/* Header Icon */}
        <div className="flex flex-col items-center mb-8">

          <h2 className="text-3xl font-black font-display tracking-tight text-mineral-800 dark:text-white">
            {isLogin ? 'Login' : 'Crear Cuenta'}
          </h2>
          <p className="text-sm text-mineral-500 dark:text-mineral-400 mt-2 text-center">
            {isLogin
              ? ''
              : 'Únete a Canek y obtén acceso a los especímenes minerales.'
            }
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-mineral-500 dark:text-mineral-400 uppercase tracking-wider block">
                Nombre Completo
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required={!isLogin}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-mineral-200 dark:border-mineral-800 bg-mineral-50/50 dark:bg-mineral-900/50 text-mineral-800 dark:text-mineral-100 placeholder-mineral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-mineral-400" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-mineral-500 dark:text-mineral-400 uppercase tracking-wider block">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-mineral-200 dark:border-mineral-800 bg-mineral-50/50 dark:bg-mineral-900/50 text-mineral-800 dark:text-mineral-100 placeholder-mineral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-mineral-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-mineral-500 dark:text-mineral-400 uppercase tracking-wider block">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="*******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-mineral-200 dark:border-mineral-800 bg-mineral-50/50 dark:bg-mineral-900/50 text-mineral-800 dark:text-mineral-100 placeholder-mineral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-mineral-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-mineral-400 hover:text-mineral-650 dark:hover:text-mineral-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            <span>{submitting ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
          </button>
        </form>

        {/* Separator / Switch tab */}
        <div className="mt-8 pt-6 border-t border-mineral-200/30 dark:border-mineral-800/40 text-center">
          <p className="text-sm text-mineral-500 dark:text-mineral-400">
            {isLogin ? '¿No tienes una cuenta aún?' : '¿Ya tienes una cuenta registrada?'}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setPassword('');
            }}
            className="mt-2 text-sm font-bold hover:underline"
          >
            {isLogin ? 'Registrate aqui' : 'Inicia Sesión aqui'}
          </button>
        </div>

      </div>
    </div>
  );
};
