import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, Shield, Trash2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { adminGet, adminDelete } from '../lib/adminApi';
import AdminLayout from './AdminLayout';
import ConfirmDialog from './ConfirmDialog';

interface AdminReport {
  id: string;
  caseId: string;
  caseNumber: string;
  caseTitle: string;
  specialization: string;
  summary: string;
  severity: string;
  confidence: number;
  status: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 12;

export default function AdminReportsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminReport | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(ITEMS_PER_PAGE) });
      const res = await adminGet(`/reports?${params}`);
      setReports(res.data);
      setTotal(res.total);
    } catch (e: any) {
      toast(e?.message || 'Failed to load reports', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDelete(`/reports/${deleteTarget.id}`);
      toast('Report deleted', 'success');
      setReports(prev => prev.filter(r => r.id !== deleteTarget.id));
      setTotal(prev => prev - 1);
    } catch (e: any) {
      toast(e.message || 'Failed to delete report', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const severityColor = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'moderate': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3">
          <h1 className="text-sm font-bold text-slate-900">AI Reports</h1>
        </header>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-sm">No AI reports found.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((r) => (
                  <div key={r.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
                    <div onClick={() => navigate(`/admin/cases/${r.caseId}`)} className="p-4 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-slate-900 truncate">{r.caseTitle}</h3>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{r.caseNumber} &middot; {r.specialization}</p>
                        </div>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[8px] font-bold border ${severityColor(r.severity)}`}>
                          {r.severity || 'N/A'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-2 mb-2">{r.summary || 'No summary available.'}</p>
                      <div className="flex items-center justify-between text-[9px] text-slate-400 pt-2 border-t border-slate-50">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Confidence: {r.confidence ? `${Math.round(r.confidence * 100)}%` : 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 bg-slate-50 flex">
                      <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(r); }} className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-semibold text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3 h-3" /> Delete Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-6">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40">
                    <ChevronLeft className="w-3 h-3" /> Prev
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let start = Math.max(1, page - 2);
                    if (start + 4 > totalPages) start = totalPages - 4;
                    const p = start + i;
                    if (p < 1 || p > totalPages) return null;
                    return (
                      <button key={p} onClick={() => setPage(p)} className={`min-w-[28px] px-2 py-1.5 text-[10px] font-bold rounded-lg ${p === page ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {p}
                      </button>
                    );
                  })}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40">
                    Next <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete AI Report"
        message={`Are you sure you want to delete the AI report for case "${deleteTarget?.caseTitle || ''}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
