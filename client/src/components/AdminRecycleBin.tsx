import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, RotateCcw, Clock, Eye, MessageSquare, ThumbsUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { adminGet, adminPost, adminDelete } from '../lib/adminApi';
import AdminLayout from './AdminLayout';
import ConfirmDialog from './ConfirmDialog';

interface RecycleBinCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  authorName: string;
  specialization: string;
  status: string;
  urgent: boolean;
  viewsCount: number;
  commentsCount: number;
  likesCount: number;
  createdAt: string;
  deletedAt: string;
  coverImage: string | null;
}

const ITEMS_PER_PAGE = 12;

export default function AdminRecycleBin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cases, setCases] = useState<RecycleBinCase[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [restoreTarget, setRestoreTarget] = useState<RecycleBinCase | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RecycleBinCase | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(ITEMS_PER_PAGE) });
      const res = await adminGet(`/recycle-bin?${params}`);
      setCases(res.data);
      setTotal(res.total);
    } catch (e: any) {
      toast(e?.message || 'Failed to load recycle bin', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  const handleRestore = async () => {
    if (!restoreTarget) return;
    setRestoring(true);
    try {
      await adminPost(`/cases/${restoreTarget.id}/restore`);
      toast('Case restored', 'success');
      setCases(prev => prev.filter(c => c.id !== restoreTarget.id));
      setTotal(prev => prev - 1);
    } catch (e: any) {
      toast(e.message || 'Failed to restore', 'error');
    } finally {
      setRestoring(false);
      setRestoreTarget(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDelete(`/cases/${deleteTarget.id}`);
      toast('Case permanently deleted', 'success');
      setCases(prev => prev.filter(c => c.id !== deleteTarget.id));
      setTotal(prev => prev - 1);
    } catch (e: any) {
      toast(e.message || 'Failed to delete', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <AdminLayout>
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center gap-3">
          <Trash2 className="w-4 h-4 text-rose-500" />
          <h1 className="text-sm font-bold text-slate-900">Recycle Bin</h1>
          <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">{total}</span>
        </header>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
                  <div className="h-36 bg-slate-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                    <div className="h-2 bg-slate-100 rounded w-full" />
                    <div className="h-2 bg-slate-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-sm">Recycle bin is empty.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {cases.map((c) => (
                  <div key={c.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                    <div onClick={() => navigate(`/admin/cases/${c.id}`)} className="cursor-pointer">
                      <div className="h-36 bg-slate-100 relative overflow-hidden">
                        {c.coverImage ? (
                          <img src={c.coverImage} alt="" className="w-full h-full object-cover opacity-70" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">No image</div>
                        )}
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                          <span className="px-2 py-1 bg-rose-500/90 text-white text-[9px] font-extrabold uppercase rounded">Deleted</span>
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">{c.title}</span>
                          <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">{c.caseNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 truncate">{c.authorName}</span>
                          <span className="text-[9px] text-slate-400 ml-auto">{c.specialization}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] text-slate-400 pt-1 border-t border-slate-50">
                          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{c.commentsCount}</span>
                          <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{c.likesCount}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{c.viewsCount}</span>
                          <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" />{new Date(c.deletedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 bg-slate-50 flex divide-x divide-slate-200">
                      <button onClick={() => setRestoreTarget(c)} className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors">
                        <RotateCcw className="w-3 h-3" /> Restore
                      </button>
                      <button onClick={() => setDeleteTarget(c)} className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-semibold text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3 h-3" /> Delete Forever
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
        open={!!restoreTarget}
        title="Restore Case"
        message={`Restore "${restoreTarget?.title || ''}" to the active cases list?`}
        confirmLabel="Restore"
        confirmIcon={RotateCcw}
        onConfirm={handleRestore}
        onCancel={() => setRestoreTarget(null)}
        loading={restoring}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Permanently Delete"
        message={`Permanently delete "${deleteTarget?.title || ''}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </AdminLayout>
  );
}