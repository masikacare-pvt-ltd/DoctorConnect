import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Eye, Clock, ThumbsUp, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCases } from '../hooks/useCases';
import { useBookmarks } from '../hooks/useBookmarks';
import { formatRelativeTime } from '../utils/time';
import AppShell from './AppShell';

export default function CasesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookmarkIds, toggle } = useBookmarks();

  const [query, setQuery] = useState('');
  const { cases, loading } = useCases(undefined, query);

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const q = query.toLowerCase().trim();
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.caseNumber && c.caseNumber.toLowerCase().includes(q)) ||
        c.diseaseTags.some((t) => t.toLowerCase().includes(q)) ||
        c.category.toLowerCase().includes(q)
      );
    });
  }, [cases, query]);

  return (
    <AppShell>
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-sm font-bold text-slate-900 dark:text-white">All Clinical Cases</h1>
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Search className="w-4 h-4" /></div>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search cases…" className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-100" />
          </div>
        </header>

        <main className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-sm">No cases found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((c) => (
                <div key={c.id} onClick={() => navigate(`/case/${c.id}`)} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer">
                  <div className="p-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/20">
                    <div className="flex items-center gap-2">
                      <img src={c.authorAvatar} alt="author" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full border border-slate-200" />
                      <div>
                        <span className="block text-xs font-bold text-slate-800 leading-tight">{c.authorName}</span>
                        <span className="block text-[9px] text-slate-400">{c.category} • {formatRelativeTime(c.createdAt)}</span>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); if (user) toggle({ caseId: c.id, caseTitle: c.title, caseCover: c.coverImage, authorName: c.authorName, createdAt: new Date().toISOString() }); }} className={`text-slate-400 hover:text-rose-500 ${bookmarkIds.has(c.id) ? 'text-rose-500' : ''}`}><Heart className="w-4 h-4" fill={bookmarkIds.has(c.id) ? 'currentColor' : 'none'} /></button>
                  </div>
                  <div className="h-44 overflow-hidden relative border-b border-slate-100">
                    {c.coverImage ? <img src={c.coverImage} alt="case" loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100" />}
                    {c.urgent && <span className="absolute top-3 right-3 px-2 py-0.5 bg-rose-500 text-white text-[9px] font-extrabold uppercase rounded-md">Urgent</span>}
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
          )}
        </main>
    </AppShell>
  );
}
