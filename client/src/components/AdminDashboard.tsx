import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, CheckCircle, FileText, Trash2, ArrowRight, X, Check, Ban } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { adminGet, adminPatch } from '../lib/adminApi';
import AdminLayout from './AdminLayout';

interface AdminStats {
  totalDoctors: number;
  pendingApprovals: number;
  approvedDoctors: number;
  totalCases: number;
  recycleBinCount: number;
}

interface PendingDoctor {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [showPending, setShowPending] = useState(false);
  const [pendingDoctors, setPendingDoctors] = useState<PendingDoctor[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);

  useEffect(() => {
    if (!showPending) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [showPending]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await adminGet('/stats');
      setStats(res.data);
    } catch { /* stats non-critical */ }
  }, []);

  const fetchPending = useCallback(async () => {
    setPendingLoading(true);
    try {
      const res = await adminGet('/doctors?status=pending&limit=50');
      setPendingDoctors(res.data);
    } catch { /* ignore */ }
    setPendingLoading(false);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const openPending = () => {
    fetchPending();
    setShowPending(true);
  };

  const handleApprove = async (id: string) => {
    try {
      await adminPatch(`/doctors/${id}/approve`);
      toast('Medical Professional approved', 'info');
      setPendingDoctors(prev => prev.filter(d => d.id !== id));
      fetchStats();
    } catch (e: any) {
      toast(e?.message || 'Failed to approve', 'error');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminPatch(`/doctors/${id}/reject`);
      toast('Medical Professional rejected', 'info');
      setPendingDoctors(prev => prev.filter(d => d.id !== id));
      fetchStats();
    } catch (e: any) {
      toast(e?.message || 'Failed to reject', 'error');
    }
  };

  const statCards = stats ? [
    { label: 'Total Medical Professionals', value: stats.totalDoctors, icon: Users, color: 'text-indigo-600 bg-indigo-50', onClick: () => navigate('/admin/doctors') },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: Clock, color: 'text-amber-600 bg-amber-50', onClick: openPending },
    { label: 'Approved Medical Professionals', value: stats.approvedDoctors, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50', onClick: () => navigate('/admin/doctors') },
    { label: 'Total Cases', value: stats.totalCases, icon: FileText, color: 'text-sky-600 bg-sky-50', onClick: () => navigate('/admin/cases') },
    { label: 'Recycle Bin', value: stats.recycleBinCount, icon: Trash2, color: 'text-rose-600 bg-rose-50', onClick: () => navigate('/admin/recycle-bin') },
  ] : [];

  return (
    <AdminLayout>
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between">
          <h1 className="text-sm font-bold text-slate-900">Dashboard</h1>
        </header>

        <div className="p-4 md:p-6 space-y-6">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {statCards.map(({ label, value, icon: Icon, color, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 text-left transition-all hover:border-indigo-300 hover:shadow-sm cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-xl md:text-2xl font-extrabold text-slate-900">{value}</p>
                </button>
              ))}
            </div>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button onClick={() => navigate('/admin/cases')} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between hover:border-indigo-300 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center"><FileText className="w-4 h-4 text-sky-600" /></div>
                <div className="text-left"><p className="text-xs font-bold text-slate-900">View All Cases</p><p className="text-[10px] text-slate-400">{stats?.totalCases || 0} total</p></div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
            </button>
            <button onClick={openPending} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between hover:border-amber-300 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center"><Clock className="w-4 h-4 text-amber-600" /></div>
                <div className="text-left"><p className="text-xs font-bold text-slate-900">Pending Approvals</p><p className="text-[10px] text-slate-400">{stats?.pendingApprovals || 0} doctors</p></div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
            </button>
          </div>

          {/* Quick nav to doctors page */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900">Quick Actions</h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <button onClick={() => navigate('/admin/doctors')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-left">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><Users className="w-4 h-4 text-indigo-600" /></div>
                <div><p className="text-xs font-bold text-slate-900">Manage Doctors</p><p className="text-[10px] text-slate-400">View, approve, or remove doctors</p></div>
              </button>
              <button onClick={() => navigate('/admin/cases')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-left">
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center"><FileText className="w-4 h-4 text-sky-600" /></div>
                <div><p className="text-xs font-bold text-slate-900">Browse Cases</p><p className="text-[10px] text-slate-400">Review all clinical cases</p></div>
              </button>
              <button onClick={openPending} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 transition-all text-left">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><Clock className="w-4 h-4 text-amber-600" /></div>
                <div><p className="text-xs font-bold text-slate-900">Pending Approvals</p><p className="text-[10px] text-slate-400">{stats?.pendingApprovals || 0} doctors awaiting review</p></div>
              </button>
              <button onClick={() => navigate('/admin/recycle-bin')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 transition-all text-left">
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center"><Trash2 className="w-4 h-4 text-rose-600" /></div>
                <div><p className="text-xs font-bold text-slate-900">Recycle Bin</p><p className="text-[10px] text-slate-400">{stats?.recycleBinCount || 0} deleted cases</p></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals Modal */}
      {showPending && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overscroll-contain" onClick={() => setShowPending(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto overscroll-contain shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Pending Approvals
                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{stats?.pendingApprovals || 0}</span>
              </h3>
              <button onClick={() => setShowPending(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4">
              {pendingLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-slate-200" />
                      <div className="flex-1 space-y-1"><div className="h-3 bg-slate-200 rounded w-1/2" /><div className="h-2 bg-slate-100 rounded w-1/3" /></div>
                    </div>
                  ))}
                </div>
              ) : pendingDoctors.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">No pending approvals.</div>
              ) : (
                <div className="space-y-2">
                  {pendingDoctors.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-all">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                        {doc.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{doc.email} &middot; {new Date(doc.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => handleApprove(doc.id)} className="px-2.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-[9px] font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Approve</button>
                        <button onClick={() => handleReject(doc.id)} className="px-2.5 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-[9px] font-bold flex items-center gap-1"><Ban className="w-3 h-3" /> Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}