import { useNavigate } from 'react-router-dom';
import { Clock, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';

export default function PendingApproval() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try { await logout(); } catch { /* ignore */ }
    toast('Logged out.', 'info');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 p-10 shadow-xl shadow-slate-100/40 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 text-amber-500" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-[10px] font-bold tracking-wider uppercase mx-auto">
          <ShieldCheck className="w-3.5 h-3.5" /> Pending Verification
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
          Account Pending Approval
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          Your account is currently under review. A hospital administrator will verify your credentials shortly.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong className="block mb-1">What happens next?</strong>
            Once approved, you will receive full access to the MedConnect platform including the dashboard, clinical cases, and community discussions.
          </p>
        </div>
        <p className="text-xs text-slate-400">
          Please contact the administrator if approval is taking longer than expected.
        </p>
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl text-sm font-bold shadow-lg shadow-slate-950/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 bg-black text-white hover:bg-slate-900"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}