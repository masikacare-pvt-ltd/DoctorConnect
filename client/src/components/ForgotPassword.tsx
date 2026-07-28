import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast('Please enter your email.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
      toast('Password reset email sent.', 'success');
    } catch (error: any) {
      toast(error?.message || 'Could not send reset email.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 p-8 shadow-xl shadow-slate-100/40">
        <Link to="/login" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-900 mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-display">Reset Password</h2>
        <p className="text-slate-400 text-xs mt-1">We'll send a secure reset link to your email.</p>

        {sent ? (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm">
            Check your inbox at <strong>{email}</strong> for the reset link.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Mail className="w-4 h-4" /></div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@medconnect.org" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all" id="forgot-email-input" />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className={`w-full py-3.5 rounded-xl text-sm font-bold shadow-md transition-all ${isLoading ? 'bg-slate-400 text-slate-100' : 'bg-black hover:bg-slate-900 text-white'}`}>
              {isLoading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
