import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, MessageSquare, Clock, ThumbsUp, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { adminGet, adminDelete } from '../lib/adminApi';
import AdminLayout from './AdminLayout';
import ConfirmDialog from './ConfirmDialog';

interface AdminCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  authorName: string;
  authorAvatar: string;
  specialization: string;
  status: string;
  urgent: boolean;
  viewsCount: number;
  commentsCount: number;
  likesCount: number;
  createdAt: string;
  coverImage: string | null;
}

const ITEMS_PER_PAGE = 12;

export default function AdminCasesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cases, setCases] = useState<AdminCase[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminCase | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(ITEMS_PER_PAGE) });
      if (search) params.set('search', search);
      const res = await adminGet(`/cases?${params}`);
      setCases(res.data);
      setTotal(res.total);
    } catch (e: any) {
      toast(e?.message || 'Failed to load cases', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, toast]);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDelete(`/cases/${deleteTarget.id}`);
      toast('Case deleted', 'success');
      setCases(prev => prev.filter(c => c.id !== deleteTarget.id));
      setTotal(prev => prev - 1);
    } catch (e: any) {
      toast(e.message || 'Failed to delete case', 'error');
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
          <h1 className="text-sm font-bold text-slate-900 shrink-0">All Cases</h1>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search cases..."
              className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
            {search && <button onClick={() => { setSearch(''); setPage(1); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"><X className="w-3 h-3" /></button>}
          </div>
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
            <div className="text-center py-20 text-slate-400 text-sm">No cases found.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {cases.map((c) => (
                  <div key={c.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
                    <div onClick={() => navigate(`/admin/cases/${c.id}`)} className="cursor-pointer">
                      <div className="h-36 bg-slate-100 relative overflow-hidden">
                        {c.coverImage ? (
                          <img src={c.coverImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">No image</div>
                        )}
                        {c.urgent && <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-rose-500 text-white text-[8px] font-extrabold uppercase rounded">Urgent</span>}
                        {c.status === 'resolved' && <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-extrabold uppercase rounded">Resolved</span>}
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">{c.title}</span>
                          <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">{c.caseNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <img src={c.authorAvatar} alt="" className="w-4 h-4 rounded-full" />
                          <span className="text-[10px] text-slate-500 truncate">{c.authorName}</span>
                          <span className="text-[9px] text-slate-400 ml-auto">{c.specialization}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed">{c.description}</p>
                        <div className="flex items-center gap-3 text-[9px] text-slate-400 pt-1 border-t border-slate-50">
                          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{c.commentsCount}</span>
                          <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{c.likesCount}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{c.viewsCount}</span>
                          <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" />{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 bg-slate-50 flex">
                      <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(c); }} className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-semibold text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3 h-3" /> Delete
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
        title="Delete Case"
        message={`Are you sure you want to delete "${deleteTarget?.title || ''}"? This action cannot be undone and will permanently remove all associated data (images, comments, likes).`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </AdminLayout>
  );
}
