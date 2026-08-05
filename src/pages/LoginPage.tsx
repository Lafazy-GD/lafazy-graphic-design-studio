import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useSeo } from '@/lib/seo';
import { GlowOrb } from '@/components/ui';

export function LoginPage() {
  useSeo({ title: 'Admin Login' });
  const { session, signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  if (session) return <Navigate to="/admin" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setInfo(null);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) setError(error);
      else navigate('/admin');
    } else if (mode === 'signup') {
      const { error } = await signUp(email, password);
      if (error) setError(error);
      else setInfo('Account created! You can now sign in.');
      setMode('login');
    } else {
      const { error } = await resetPassword(email);
      if (error) setError(error);
      else setInfo('Password reset email sent. Check your inbox.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center section-padding relative overflow-hidden">
      <GlowOrb className="w-[500px] h-[500px] bg-brand-500 top-0 left-1/4" />
      <GlowOrb className="w-[400px] h-[400px] bg-accent-500 bottom-0 right-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-strong rounded-3xl p-8 sm:p-10 shadow-glass">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center shadow-glow mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Admin Login' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              {mode === 'login' ? 'Sign in to manage your studio' : mode === 'signup' ? 'Set up your admin account' : 'Enter your email to reset'}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-11" placeholder="admin@lafazystudio.com" />
              </div>
            </div>
            {mode !== 'reset' && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-11" placeholder="••••••••" />
                </div>
              </div>
            )}
            {error && <p className="text-sm text-danger-400">{error}</p>}
            {info && <p className="text-sm text-green-400">{info}</p>}
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Please wait...' : <>
                {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Email'}
                <ArrowRight className="w-4 h-4" />
              </>}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-2 text-center text-sm">
            {mode === 'login' && (
              <>
                <button onClick={() => { setMode('signup'); setError(null); setInfo(null); }} className="text-gray-400 hover:text-white transition-colors">
                  Don't have an account? <span className="text-brand-400">Sign up</span>
                </button>
                <button onClick={() => { setMode('reset'); setError(null); setInfo(null); }} className="text-gray-500 hover:text-gray-300 transition-colors inline-flex items-center justify-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" /> Forgot password?
                </button>
              </>
            )}
            {mode !== 'login' && (
              <button onClick={() => { setMode('login'); setError(null); setInfo(null); }} className="text-gray-400 hover:text-white transition-colors">
                Back to <span className="text-brand-400">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
