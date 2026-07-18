import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, AlertCircle } from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLocalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email address is required.';
    if (!password) newErrors.password = 'Password is required.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast('Please fill in all credentials.', 'error');
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      await login({ email: email.trim(), password });
      toast('Logged in successfully!', 'success');
      // Navigation is handled by PublicRoute once session is confirmed
    } catch (error: any) {
      const code = error?.code;
      let errMsg = 'Failed to sign in. Please verify your credentials.';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') errMsg = 'Invalid email or password.';
      else if (code === 'auth/invalid-email') errMsg = 'Invalid email address format.';
      else if (error?.message) errMsg = error.message;
      toast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = () => {
    toast('Coming soon.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" id="login-container">
      <div className="md:w-1/2 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-8 flex flex-col justify-between items-center text-center relative overflow-hidden">
        <Link to="/" className="absolute top-6 left-6 text-xs font-semibold text-slate-400 hover:text-slate-900 flex items-center gap-1 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full transition-all">
          ← Back to Site
        </Link>
        <div className="my-auto space-y-6 pt-12 md:pt-0">
          <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 active:scale-95 transition-all" onClick={() => navigate('/')}>
            <span className="text-white text-3xl font-bold">+</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-950">MedConnect</h1>
          <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">Professional Doctor Collaboration Platform</p>
          <div className="pt-4 max-w-sm mx-auto">
            <svg viewBox="0 0 600 400" className="w-full h-auto max-w-sm mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="580" height="380" rx="16" fill="#F1F5F9" />
              <rect x="20" y="20" width="560" height="360" rx="12" fill="#FFFFFF" />
              <path d="M20 180H580" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M120 20V380" stroke="#F1F5F9" strokeWidth="2" />
              <path d="M460 20V380" stroke="#F1F5F9" strokeWidth="2" />
              <rect x="40" y="40" width="60" height="80" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
              <path d="M50 70H90" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
              <path d="M50 85H80" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
              <circle cx="55" cy="55" r="3" fill="#EF4444" />
              <circle cx="65" cy="55" r="3" fill="#10B981" />
              <rect x="180" y="40" width="240" height="120" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="3" />
              <rect x="190" y="50" width="100" height="100" rx="4" fill="#1E293B" />
              <rect x="310" y="50" width="100" height="100" rx="4" fill="#1E293B" />
              <circle cx="240" cy="100" r="30" fill="#0F172A" stroke="#64748B" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M225 100C225 85 255 85 255 100C255 112 245 125 240 128C235 125 225 112 225 100Z" fill="#3B82F6" fillOpacity="0.2" stroke="#60A5FA" strokeWidth="1.5" />
              <path d="M240 80V120" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.5" />
              <path d="M220 100H260" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.5" />
              <circle cx="245" cy="95" r="6" fill="#60A5FA" fillOpacity="0.6" />
              <circle cx="360" cy="100" r="30" fill="#0F172A" stroke="#64748B" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M345 100C345 80 375 80 375 100C375 115 365 125 360 128C355 125 345 115 345 100Z" fill="#10B981" fillOpacity="0.2" stroke="#34D399" strokeWidth="1.5" />
              <path d="M360 80V120" stroke="#34D399" strokeWidth="1" strokeOpacity="0.5" />
              <path d="M340 100H380" stroke="#34D399" strokeWidth="1" strokeOpacity="0.5" />
              <circle cx="355" cy="105" r="8" fill="#34D399" fillOpacity="0.6" />
              <g id="doctor-left">
                <path d="M110 380C110 300 130 240 170 240C210 240 230 300 230 380H110Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                <path d="M155 240L170 280L185 240H155Z" fill="#0D9488" />
                <path d="M170 280V380" stroke="#E2E8F0" strokeWidth="1.5" />
                <path d="M150 240C150 270 190 270 190 240" stroke="#475569" strokeWidth="2" fill="none" />
                <path d="M170 265V300" stroke="#475569" strokeWidth="2" fill="none" />
                <circle cx="170" cy="303" r="5" fill="#94A3B8" />
                <circle cx="170" cy="195" r="30" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
                <path d="M140 195C140 160 200 160 200 195C185 180 155 180 140 195Z" fill="#1E293B" />
                <path d="M140 195V210C145 200 150 195 155 195" fill="#1E293B" />
                <circle cx="165" cy="195" r="6" fill="none" stroke="#475569" strokeWidth="2" />
                <circle cx="180" cy="195" r="6" fill="none" stroke="#475569" strokeWidth="2" />
                <line x1="171" y1="195" x2="174" y2="195" stroke="#475569" strokeWidth="2" />
                <path d="M200 280C215 275 235 255 240 250C243 247 245 250 240 255C230 265 210 295 200 300" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round" />
                <rect x="230" y="220" width="35" height="50" rx="4" transform="rotate(15 230 220)" fill="#1E293B" />
                <rect x="234" y="224" width="27" height="42" rx="2" transform="rotate(15 230 220)" fill="#38BDF8" fillOpacity="0.8" />
              </g>
              <g id="doctor-right">
                <path d="M370 380C370 290 395 230 440 230C485 230 510 290 510 380H370Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                <path d="M425 230L440 270L455 230H425Z" fill="#0284C7" />
                <path d="M440 270V380" stroke="#E2E8F0" strokeWidth="1.5" />
                <circle cx="440" cy="180" r="32" fill="#F3F4F6" stroke="#CBD5E1" strokeWidth="1.5" />
                <path d="M408 180C408 145 472 145 472 180" fill="#334155" />
                <path d="M408 175C415 152 465 152 472 175C460 165 420 165 408 175Z" fill="#1E293B" />
                <path d="M400 270C385 265 350 255 330 255C325 255 325 260 330 263C345 270 375 285 390 290" stroke="#F3F4F6" strokeWidth="10" strokeLinecap="round" />
              </g>
              <path d="M20 380H580" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
              <rect x="250" y="340" width="100" height="40" rx="4" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
              <line x1="270" y1="355" x2="330" y2="355" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
              <line x1="270" y1="365" x2="310" y2="365" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
              <rect x="290" y="335" width="20" height="8" rx="2" fill="#475569" />
            </svg>
          </div>
        </div>
        <div className="text-[10px] text-slate-300 font-mono">ESTABLISHED 2026 • CLINICAL EXCELLENCE</div>
      </div>

      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 p-8 shadow-xl shadow-slate-100/40 relative">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-display">Welcome Back</h2>
            <p className="text-slate-400 text-xs mt-0.5">Sign in to continue.</p>
          </div>

          <form onSubmit={handleLocalSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Mail className="w-4 h-4" /></div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                  placeholder="doctor@medconnect.org"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-slate-100'} rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-4 transition-all`}
                  id="login-email-input"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-slate-400 hover:text-slate-900 transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Lock className="w-4 h-4" /></div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 bg-slate-50 border ${errors.password ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-slate-100'} rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-4 transition-all`}
                  id="login-password-input"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.password}</p>}
            </div>

            <button type="submit" disabled={isLoading} className={`w-full py-3.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${isLoading ? 'bg-slate-400 cursor-not-allowed text-slate-100' : 'bg-black hover:bg-slate-900 active:scale-[0.99] text-white'}`} id="login-submit-btn">
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="block text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Or Sign In with</span>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={handleGoogle} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all hover:border-slate-300">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.137 4.114-3.41 0-6.173-2.763-6.173-6.173s2.763-6.173 6.173-6.173c1.554 0 2.97.575 4.053 1.53l3.056-3.056C19.1 2.853 15.86 1.3 12.24 1.3 6.273 1.3 1.3 6.273 1.3 12.24s4.973 10.94 10.94 10.94c5.783 0 10.638-4.084 10.638-10.94 0-.61-.06-1.196-.17-1.755H12.24z" /></svg>
                Google
              </button>
              <button type="button" onClick={() => toast('Apple sign-in is not enabled.', 'info')} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all hover:border-slate-300">
                <svg className="w-4 h-4 text-slate-900 fill-current" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.05-1 .04-2.18.66-2.9 1.5-.62.71-1.16 1.85-1.02 2.96 1.12.09 2.27-.6 2.93-1.41z" /></svg>
                Apple
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-xs">
            <span className="text-slate-400">Don't have an account? </span>
            <button onClick={() => navigate('/signup')} className="font-bold text-slate-900 hover:underline hover:text-indigo-600 transition-colors" id="login-to-signup-btn">Create Account</button>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <Shield className="w-3 h-3 text-emerald-500" /> Secure login for verified doctors only.
          </div>
        </div>
      </div>
    </div>
  );
}
