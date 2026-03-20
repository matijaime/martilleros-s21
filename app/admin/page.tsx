'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Store token in cookie so middleware can validate it
      document.cookie = `firebase-auth-token=${idToken}; path=/; max-age=3600; SameSite=Lax`;

      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      if (
        firebaseError.code === 'auth/wrong-password' ||
        firebaseError.code === 'auth/user-not-found' ||
        firebaseError.code === 'auth/invalid-credential'
      ) {
        setError('Credenciales incorrectas. Verificá tu email y contraseña.');
      } else {
        setError('Error al iniciar sesión. Intentá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-navy/85" />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-3xl p-10 border border-white/10 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <img src="/logo.png" alt="Academic Hub Logo" className="h-14 w-auto" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              Panel de Administración
            </h1>
            <p className="text-slate-500 text-sm">Academic Hub · Acceso Restringido</p>
          </div>

          {/* Divider */}
          <div className="gold-divider opacity-30 mb-8" />

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-slate-400 text-xs mb-2 font-medium tracking-wide uppercase">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ejemplo.com"
                  required
                  autoComplete="email"
                  className="input-dark pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-slate-400 text-xs mb-2 font-medium tracking-wide uppercase">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="input-dark pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="admin-login-btn"
              disabled={loading}
              className="btn-gold w-full justify-center py-3 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <p className="text-center text-slate-600 text-xs mt-6">
            ← <a href="/" className="hover:text-gold transition-colors">Volver al sitio público</a>
          </p>
        </div>
      </div>
    </div>
  );
}
