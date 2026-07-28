import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'Required';
    if (!lastName.trim()) newErrors.lastName = 'Required';
    if (!email.trim()) newErrors.email = 'Required';
    if (!mobile.trim()) newErrors.mobile = 'Required';
    if (!password) newErrors.password = 'Required';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) newErrors.agreeTerms = 'You must agree to terms';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast('Please complete all fields and accept the Terms.', 'error');
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      await register({
        email: email.trim(),
        password,
        confirmPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobile: mobile.trim(),
      });
      toast('Account successfully created! Complete your profile…', 'success');
      navigate('/complete-profile', { state: { firstName: firstName.trim(), lastName: lastName.trim() } });
    } catch (error: any) {
      const code = error?.code;
      let errMsg = 'Failed to create account. Please try again.';
      if (code === 'auth/email-already-in-use') errMsg = 'This email is already registered.';
      else if (code === 'auth/weak-password') errMsg = 'Password is too weak. Please use at least 6 characters.';
      else if (code === 'auth/invalid-email') errMsg = 'Invalid email address format.';
      else if (error?.message) errMsg = error.message;
      toast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" id="signup-container">
      <div className="md:w-5/12 bg-slate-950 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        <Link to="/" className="absolute top-6 left-6 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all">← Back</Link>
        <div className="my-auto space-y-8 pt-12 md:pt-0 relative z-10">
          <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="relative"><Briefcase className="w-8 h-8 text-white stroke-[1.5]" /><div className="absolute inset-0 flex items-center justify-center pt-1.5"><span className="text-white text-xs font-extrabold">+</span></div></div>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display leading-tight">Empowering the Future of Healthcare</h1>
            <p className="text-slate-400 text-sm leading-relaxed">Join a global network of medical professionals. Streamline your patient care with MedConnect's clinical precision tools.</p>
          </div>
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono relative z-10 pt-8 md:pt-0"><span>ESTABLISHED 2026</span><span>MEDICAL EXCELLENCE</span></div>
      </div>

      <div className="md:w-7/12 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-100 p-8 md:p-10 shadow-xl shadow-slate-100/40">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-slate-600 text-[10px] font-bold tracking-wider uppercase mb-4 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" /> Medical Verification Required
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-display">Create Doctor Account</h2>
            <p className="text-slate-400 text-xs mt-0.5">Join MedConnect.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">First Name</label>
                <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); if (errors.firstName) setErrors({ ...errors, firstName: '' }); }} placeholder="e.g., Jonathan" className={`w-full px-4 py-2.5 bg-white border ${errors.firstName ? 'border-rose-400' : 'border-slate-200'} rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all`} id="signup-first-name" />
                {errors.firstName && <p className="text-[10px] text-rose-500 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Last Name</label>
                <input type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); if (errors.lastName) setErrors({ ...errors, lastName: '' }); }} placeholder="e.g., Smith" className={`w-full px-4 py-2.5 bg-white border ${errors.lastName ? 'border-rose-400' : 'border-slate-200'} rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all`} id="signup-last-name" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Email Address</label>
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }); }} placeholder="j.smith@hospital.com" className={`w-full px-4 py-2.5 bg-white border ${errors.email ? 'border-rose-400' : 'border-slate-200'} rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all`} id="signup-email" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Mobile Number</label>
                <input type="text" value={mobile} onChange={(e) => { setMobile(e.target.value); if (errors.mobile) setErrors({ ...errors, mobile: '' }); }} placeholder="+1 (555) 000-0000" className={`w-full px-4 py-2.5 bg-white border ${errors.mobile ? 'border-rose-400' : 'border-slate-200'} rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all`} id="signup-mobile" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Password</label>
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }); }} placeholder="••••••••" className={`w-full px-4 py-2.5 bg-white border ${errors.password ? 'border-rose-400' : 'border-slate-200'} rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all`} id="signup-password" />
              </div>
              <div className="relative">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Confirm Password</label>
                <input type={showPwd ? 'text' : 'password'} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' }); }} placeholder="••••••••" className={`w-full px-4 py-2.5 bg-white border ${errors.confirmPassword ? 'border-rose-400' : 'border-slate-200'} rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all`} id="signup-confirm-password" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute bottom-3 right-3 text-slate-400 hover:text-slate-600 transition-colors">{showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={agreeTerms} onChange={(e) => { setAgreeTerms(e.target.checked); if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: '' }); }} className="mt-1 rounded text-indigo-600 focus:ring-indigo-400" id="signup-terms-checkbox" />
                <span className="text-xs text-slate-400 select-none leading-normal">I agree to the <span className="text-slate-800 font-semibold hover:underline">Terms of Service</span> and <span className="text-slate-800 font-semibold hover:underline">Privacy Policy</span>.</span>
              </label>
              {errors.agreeTerms && <p className="text-[10px] text-rose-500 mt-1">{errors.agreeTerms}</p>}
            </div>

            <button type="submit" disabled={isLoading} className={`w-full py-3 rounded-xl text-sm font-bold shadow-lg shadow-slate-950/10 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 mt-2 ${isLoading ? 'bg-slate-400 cursor-not-allowed text-slate-100' : 'bg-black text-white hover:bg-slate-900'}`} id="signup-submit-btn">
              {isLoading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 text-center text-xs border-t border-slate-100 pt-6">
            <span className="text-slate-400">Already have an account? </span>
            <button onClick={() => navigate('/login')} className="font-bold text-slate-900 hover:underline hover:text-indigo-600 transition-colors" id="signup-to-login-btn">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
