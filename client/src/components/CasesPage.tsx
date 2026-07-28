import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Eye, Clock, ThumbsUp, MessageSquare, X, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCases } from '../hooks/useCases';
import { useBookmarks } from '../hooks/useBookmarks';
import { useSpecializations } from '../hooks/useSpecializations';
import { formatRelativeTime } from '../utils/time';
import AppShell from './AppShell';

const ITEMS_PER_PAGE = 9;

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="p-4 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-200" />
          <div className="space-y-1.5">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-2 w-14 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="w-4 h-4 bg-slate-200 rounded" />
      </div>
      <div className="h-44 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-slate-200 rounded" />
        <div className="h-3 w-full bg-slate-100 rounded" />
        <div className="h-3 w-2/3 bg-slate-100 rounded" />
        <div className="flex gap-4 pt-2 border-t border-slate-50">
          <div className="h-3 w-10 bg-slate-200 rounded" />
          <div className="h-3 w-10 bg-slate-200 rounded" />
          <div className="h-3 w-10 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function CasesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookmarkIds, toggle } = useBookmarks();
  const { specializations } = useSpecializations();

  const [query, setQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'Newest' | 'Oldest' | 'Most Commented' | 'Most Viewed'>('Newest');
  const [page, setPage] = useState(1);

  const { cases, loading } = useCases();

  const filtered = useMemo(() => {
    let result = [...cases];

    const q = query.toLowerCase().trim();
    if (q) {
      result = result.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.caseNumber && c.caseNumber.toLowerCase().includes(q)) ||
        c.diseaseTags.some((t) => t.toLowerCase().includes(q)) ||
        c.category.toLowerCase().includes(q)
      );
    }

    if (selectedSpecialization) {
      result = result.filter((c) => c.specializationId === selectedSpecialization);
    }

    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (urgentOnly) {
      result = result.filter((c) => c.urgent);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'Newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'Oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'Most Commented': return b.commentsCount - a.commentsCount;
        case 'Most Viewed': return b.viewsCount - a.viewsCount;
        default: return 0;
      }
    });

    return result;
  }, [cases, query, selectedSpecialization, statusFilter, urgentOnly, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <AppShell>
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center gap-3">
        <h1 className="text-sm font-bold text-slate-900 dark:text-white shrink-0">Cases</h1>
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Search className="w-4 h-4" /></div>
          <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search cases…" className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-100" />
          {query && <button onClick={() => { setQuery(''); setPage(1); }} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>}
        </div>
      </header>

      <div className="px-4 sm:px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          {(['all', 'open', 'resolved'] as const).map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${statusFilter === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-slate-200" />

        <select value={selectedSpecialization} onChange={(e) => { setSelectedSpecialization(e.target.value); setPage(1); }} className="text-xs font-semibold bg-slate-100 border-0 rounded-lg px-3 py-1.5 text-slate-600 focus:ring-2 focus:ring-slate-300 cursor-pointer">
          <option value="">All Specializations</option>
          {specializations.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <div className="w-px h-5 bg-slate-200" />

        <button onClick={() => { setUrgentOnly(!urgentOnly); setPage(1); }} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${urgentOnly ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500 hover:text-slate-700'}`}>
          <span className={`w-2 h-2 rounded-full ${urgentOnly ? 'bg-rose-500' : 'bg-slate-300'}`} />
          Urgent only
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="bg-transparent border-0 text-slate-600 focus:ring-0 cursor-pointer text-xs font-semibold">
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
            <option value="Most Commented">Most Commented</option>
            <option value="Most Viewed">Most Viewed</option>
          </select>
        </div>
      </div>

      <main className="flex-1 p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">No cases found.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginated.map((c) => (
                <div key={c.id} onClick={() => navigate(`/case/${c.id}`)} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer">
                  <div className="p-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/20">
                    <div className="flex items-center gap-2">
                      <img src={c.authorAvatar} alt="author" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full border border-slate-200" />
                      <div>
                        <span className="block text-xs font-bold text-slate-800 leading-tight">{c.authorName}</span>
                        <span className="block text-[9px] text-slate-400">{c.category} &bull; {formatRelativeTime(c.createdAt)}</span>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); if (user) toggle({ caseId: c.id, caseTitle: c.title, caseCover: c.coverImage, authorName: c.authorName, createdAt: new Date().toISOString() }); }} className={`text-slate-400 hover:text-rose-500 ${bookmarkIds.has(c.id) ? 'text-rose-500' : ''}`}><Heart className="w-4 h-4" fill={bookmarkIds.has(c.id) ? 'currentColor' : 'none'} /></button>
                  </div>
                  <div className="h-44 overflow-hidden relative border-b border-slate-100 bg-slate-100">
                    {c.coverImage
                      ? <img src={c.coverImage} alt="case" loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                    }
                    {c.urgent && <span className="absolute top-3 right-3 px-2 py-0.5 bg-rose-500 text-white text-[9px] font-extrabold uppercase rounded-md">Urgent</span>}
                    {c.status === 'resolved' && <span className="absolute top-3 left-3 px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-extrabold uppercase rounded-md">Resolved</span>}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">{c.title}</span>
                        {c.caseNumber && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold shrink-0">{c.caseNumber}</span>}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{c.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-slate-400">
                      <span className="flex items-center gap-1 text-[10px] font-semibold"><MessageSquare className="w-3.5 h-3.5" />{c.commentsCount}</span>
                      <span className="flex items-center gap-1 text-[10px] font-semibold"><ThumbsUp className="w-3.5 h-3.5" />{c.likesCount || 0}</span>
                      <span className="flex items-center gap-1 text-[10px] font-semibold"><Eye className="w-3.5 h-3.5" />{c.viewsCount}</span>
                      <span className="flex items-center gap-1 text-[10px] font-semibold"><Clock className="w-3.5 h-3.5" />{formatRelativeTime(c.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-8">
                <button onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                {pageNumbers.map((p) => (
                  <button key={p} onClick={() => setPage(p)} className={`min-w-[32px] px-2 py-1.5 text-xs font-bold rounded-lg transition-colors ${p === currentPage ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </AppShell>
  );
}
