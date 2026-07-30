import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Eye, Clock, ThumbsUp, MessageSquare, X, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCases } from '../hooks/useCases';
import { useBookmarks } from '../hooks/useBookmarks';
import { useSpecializations } from '../hooks/useSpecializations';
import { formatRelativeTime } from '../utils/time';
import AppShell from './AppShell';

const ITEMS_PER_PAGE = 9;

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-pulse">
      <div className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-1.5">
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-2 w-14 bg-slate-100 dark:bg-slate-800/60 rounded" />
          </div>
        </div>
        <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="h-44 bg-slate-100 dark:bg-slate-800/40" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/60 rounded" />
        <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-800/60 rounded" />
        <div className="flex gap-4 pt-2 border-t border-slate-50 dark:border-slate-800">
          <div className="h-3 w-10 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-10 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-10 bg-slate-200 dark:bg-slate-800 rounded" />
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
  const [specOpen, setSpecOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

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
      {/* Search & Page Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex flex-row items-center justify-between gap-4 select-none">
        <h1 className="text-base font-bold text-slate-900 dark:text-white shrink-0 font-display">Cases</h1>
        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search cases..."
            className="w-full pl-10 pr-8 py-2.5 bg-[#F8FAFC] hover:bg-slate-100/70 dark:bg-slate-800 dark:hover:bg-slate-700/70 border border-slate-200/60 dark:border-slate-700 rounded-full text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {query && (
            <button onClick={() => { setQuery(''); setPage(1); }} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Filter Bar with rounded pills */}
      <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center gap-3">
        {/* Status Pill Group */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] dark:bg-slate-800 p-1 rounded-2xl">
          {(['all', 'open', 'resolved'] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                statusFilter === s
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden sm:block" />

        {/* Custom Specialization Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setSpecOpen(!specOpen); setSortOpen(false); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 transition-all"
          >
            <span>{selectedSpecialization ? specializations.find(s => s.id === selectedSpecialization)?.name : 'All Specializations'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          {specOpen && (
            <div className="absolute z-50 top-full left-0 mt-1.5 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-1.5 max-h-56 overflow-y-auto">
              <button
                type="button"
                onClick={() => { setSelectedSpecialization(''); setSpecOpen(false); setPage(1); }}
                className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700"
              >
                All Specializations
              </button>
              {specializations.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setSelectedSpecialization(s.id); setSpecOpen(false); setPage(1); }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700"
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Urgent Pill Toggle */}
        <button
          onClick={() => { setUrgentOnly(!urgentOnly); setPage(1); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-2xl border transition-all ${
            urgentOnly
              ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800'
              : 'bg-[#F1F5F9] dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700 hover:bg-slate-200/60'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${urgentOnly ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
          Urgent only
        </button>

        <div className="flex-1" />

        {/* Custom Sort Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setSortOpen(!sortOpen); setSpecOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-all"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>{sortBy}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          {sortOpen && (
            <div className="absolute z-50 top-full right-0 mt-1.5 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-1.5">
              {(['Newest', 'Oldest', 'Most Commented', 'Most Viewed'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setSortBy(s); setSortOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-xs bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
            No cases found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginated.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/case/${c.id}`)}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40">
                    <div className="flex items-center gap-2.5">
                      <img src={c.authorAvatar} alt="author" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                      <div>
                        <span className="block text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">{c.authorName}</span>
                        <span className="block text-[10px] text-slate-400">{c.category} &bull; {formatRelativeTime(c.createdAt)}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (user) toggle({ caseId: c.id, caseTitle: c.title, caseCover: c.coverImage, authorName: c.authorName, createdAt: new Date().toISOString() });
                      }}
                      className={`text-slate-400 hover:text-rose-500 p-1 transition-colors ${bookmarkIds.has(c.id) ? 'text-rose-500' : ''}`}
                    >
                      <Heart className="w-4 h-4" fill={bookmarkIds.has(c.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div className="h-44 overflow-hidden relative border-b border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40">
                    {c.coverImage ? (
                      <img src={c.coverImage} alt="case" loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                    {c.urgent && <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-rose-500 text-white text-[9px] font-extrabold uppercase rounded-lg shadow-sm">Urgent</span>}
                    {c.status === 'resolved' && <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-emerald-500 text-white text-[9px] font-extrabold uppercase rounded-lg shadow-sm">Resolved</span>}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{c.title}</span>
                        {c.caseNumber && <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-lg font-mono font-semibold shrink-0">{c.caseNumber}</span>}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{c.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800 text-slate-400">
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
              <div className="flex items-center justify-center gap-1.5 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                {pageNumbers.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[34px] px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      p === currentPage
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
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
