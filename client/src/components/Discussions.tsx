import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { Bell, Heart, Send, Paperclip, ChevronRight, FileText, FileDown, Loader2, ThumbsUp, Edit3, Trash2, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useBookmarks } from '../hooks/useBookmarks';
import { useNotifications } from '../hooks/useNotifications';
import { useCaseDetail } from '../hooks/useCaseDetail';
import { editCase, deleteCase } from '../services/case.service';
import { formatRelativeTime } from '../utils/time';
import { getAvatarUrl } from '../utils/avatar';
import { searchUsers } from '../services/user.service';
import type { CaseComment } from '../types/domain';
import type { MentionUser } from '../services/user.service';
import AppShell from './AppShell';

export default function Discussions() {
  const { caseId = '' } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { bookmarkIds, toggle } = useBookmarks();
  const { unreadCount } = useNotifications();
  const { clinicalCase, images, comments, aiReport, loading, liked, likesCount, postComment, deleteComment, toggleLike, fetchLikes, refreshCase } = useCaseDetail(caseId);

  const [commentText, setCommentText] = useState('');
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [showLikes, setShowLikes] = useState(false);
  const [likesData, setLikesData] = useState<{ id: string; userId: string; name: string; avatar: string; createdAt: string }[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editDesc, setEditDesc] = useState('');
  const [sending, setSending] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showMention, setShowMention] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionUsers, setMentionUsers] = useState<MentionUser[]>([]);
  const [mentionActiveIdx, setMentionActiveIdx] = useState(0);
  const mentionStartPosRef = useRef(0);
  const mentionDebounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleMentionSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setMentionUsers([]); return; }
    const users = await searchUsers(q);
    setMentionUsers(users);
    setMentionActiveIdx(0);
  }, []);

  useEffect(() => {
    return () => {
      if (mentionDebounceRef.current) clearTimeout(mentionDebounceRef.current);
    };
  }, []);

  const insertMention = useCallback((mu: MentionUser) => {
    const before = commentText.slice(0, mentionStartPosRef.current);
    const after = commentText.slice(mentionStartPosRef.current + mentionSearch.length + 1);
    const newText = `${before}@${mu.name} ${after}`;
    setCommentText(newText);
    setShowMention(false);
    setMentionUsers([]);
    const newPos = before.length + mu.name.length + 2;
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    });
  }, [commentText, mentionSearch]);

  const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCommentText(value);
    const pos = e.target.selectionStart;
    const textBefore = value.slice(0, pos);
    const atIdx = textBefore.lastIndexOf('@');
    if (atIdx !== -1 && (atIdx === 0 || textBefore[atIdx - 1] === ' ' || textBefore[atIdx - 1] === '\n')) {
      const afterAt = textBefore.slice(atIdx + 1);
      if (!afterAt.includes(' ')) {
        mentionStartPosRef.current = atIdx;
        setMentionSearch(afterAt);
        setShowMention(true);
        if (mentionDebounceRef.current) clearTimeout(mentionDebounceRef.current);
        mentionDebounceRef.current = setTimeout(() => handleMentionSearch(afterAt), 150);
        return;
      }
    }
    setShowMention(false);
    setMentionUsers([]);
  }, [handleMentionSearch]);

  const handleCommentKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMention || mentionUsers.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setMentionActiveIdx(i => Math.min(i + 1, mentionUsers.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setMentionActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (mentionActiveIdx >= 0 && mentionActiveIdx < mentionUsers.length) {
        e.preventDefault();
        insertMention(mentionUsers[mentionActiveIdx]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowMention(false);
      setMentionUsers([]);
    }
  }, [showMention, mentionUsers, mentionActiveIdx, insertMention]);

  useEffect(() => {
    if (!showMention) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.mention-dropdown') && !target.closest('textarea')) {
        setShowMention(false);
        setMentionUsers([]);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMention]);

  const activeUser = profile || { firstName: 'Doctor', lastName: '', designation: '', avatarUrl: '' };
  const currentUserId = user?.id;
  const isAuthor = clinicalCase?.authorUid === currentUserId;

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) { toast('Please write a clinical opinion.', 'error'); return; }
    if (!profile || sending) return;
    setSending(true);
    try {
      await postComment({ text: commentText, attachmentName: attachmentName || null });
      setCommentText('');
      setAttachmentName(null);
    } catch (err: any) {
      toast(err?.message || 'Failed to post comment.', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleLike = async () => {
    const wasLiked = liked;
    await toggleLike();
    const data = await fetchLikes();
    setLikesData(data);
    toast(wasLiked ? 'Removed like.' : 'Liked the case!', 'success');
  };

  const handleShowLikes = async () => {
    const data = await fetchLikes();
    setLikesData(data || []);
    setShowLikes(true);
  };

  const handleEdit = () => {
    if (clinicalCase) {
      setEditDesc(clinicalCase.description);
      setEditMode(true);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDesc.trim()) { toast('Description cannot be empty.', 'error'); return; }
    try {
      await editCase(caseId, { description: editDesc, title: clinicalCase?.title, specializationId: clinicalCase?.specializationId, diseaseTags: clinicalCase?.diseaseTags, urgent: clinicalCase?.urgent });
      toast('Case updated!', 'success');
      setEditMode(false);
      await refreshCase();
    } catch (err: any) {
      toast(err?.message || 'Failed to update case.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this case?')) return;
    try {
      await deleteCase(caseId);
      toast('Case deleted.', 'success');
      navigate('/cases');
    } catch (err: any) {
      toast(err?.message || 'Failed to delete case.', 'error');
    }
  };

  const exportPdf = () => {
    if (!clinicalCase) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(clinicalCase.title, 14, 20);
    doc.setFontSize(10);
    doc.text(`Case ${clinicalCase.caseNumber} ${clinicalCase.category} ${clinicalCase.authorName}`, 14, 28);
    const split = doc.splitTextToSize(clinicalCase.description, 180);
    doc.text(split, 14, 38);
    let y = 38 + split.length * 5 + 6;
    if (aiReport) {
      doc.setFontSize(12);
      doc.text('AI Clinical Analysis', 14, y);
      y += 6;
      doc.setFontSize(9);
      const txt = typeof aiReport.aiResponse === 'string' ? aiReport.aiResponse : JSON.stringify(aiReport.structured || aiReport);
      const ai = doc.splitTextToSize(txt, 180);
      doc.text(ai, 14, y);
      y += ai.length * 4 + 8;
    }
    doc.setFontSize(12);
    doc.text(`Peer Comments (${comments.length})`, 14, y);
    y += 6;
    doc.setFontSize(9);
    comments.forEach((c: CaseComment) => {
      const t = doc.splitTextToSize(`${c.authorName}: ${c.text}`, 180);
      doc.text(t, 14, y);
      y += t.length * 4 + 2;
    });
    doc.save(`MedConnect_${clinicalCase.caseNumber || clinicalCase.id}.pdf`);
  };

  if (loading && !clinicalCase) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>;
  }

  return (
    <AppShell>
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate('/cases')} className="text-slate-400 hover:text-slate-700"><ChevronRight className="w-5 h-5 rotate-180" /></button>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate">{clinicalCase?.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => toast('Notifications up-to-date.', 'info')} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl relative"><Bell className="w-5 h-5" />{unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />}</button>
            {clinicalCase && (
              <button onClick={() => { if (user) toggle({ caseId: clinicalCase.id, caseTitle: clinicalCase.title, caseCover: clinicalCase.coverImage, authorName: clinicalCase.authorName, createdAt: new Date().toISOString() }); }} className={`p-2 rounded-xl transition-colors ${bookmarkIds.has(clinicalCase.id) ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-500 hover:bg-slate-50'}`} title="Bookmark"><Heart className="w-5 h-5" fill={bookmarkIds.has(clinicalCase.id) ? 'currentColor' : 'none'} /></button>
            )}
            <button onClick={exportPdf} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl" title="Export PDF"><FileDown className="w-5 h-5" /></button>
            <div onClick={() => navigate('/profile')} className="flex items-center gap-2.5 cursor-pointer pl-2 border-l border-slate-200">
              <img src={getAvatarUrl(activeUser)} alt="avatar" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 lg:p-4 overflow-y-auto">
          <div className="space-y-6">
            {clinicalCase && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={clinicalCase.authorAvatar} alt="author" referrerPolicy="no-referrer" className="w-9 h-9 rounded-full border border-slate-200" />
                    <div>
                      <span className="block text-sm font-bold text-slate-900">{clinicalCase.authorName}</span>
                      <span className="block text-[10px] text-slate-400">{clinicalCase.category} • {formatRelativeTime(clinicalCase.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAuthor && (
                      <>
                        <button onClick={handleEdit} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors" title="Edit"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={handleDelete} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </>
                    )}
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 font-bold uppercase rounded border border-slate-200 font-mono">{clinicalCase.caseNumber}</span>
                  </div>
                </div>
                {editMode ? (
                  <div className="p-5">
                    <form onSubmit={handleSaveEdit} className="space-y-3">
                      <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={5} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-100" />
                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setEditMode(false)} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                        <button type="submit" className="px-4 py-1.5 bg-black text-white rounded-lg text-xs font-bold">Save</button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <>
                    {images.length > 0 && (
                      <div className="p-4 space-y-3">
                        <div className="h-72 rounded-xl overflow-hidden bg-slate-100">
                          <img src={images[activeImg]?.downloadURL || images[activeImg]?.imageData} alt="case" loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                        </div>
                        {images.length > 1 && (
                          <div className="flex gap-2 flex-wrap">
                            {images.map((img, i) => (
                              <button key={img.id} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === activeImg ? 'border-indigo-500' : 'border-transparent'}`}>
                                <img src={img.thumbnailURL || img.imageData} alt="thumb" loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-5 space-y-3">
                      {clinicalCase.urgent && <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-extrabold uppercase rounded-md">Urgent</span>}
                      <h2 className="text-lg font-bold text-slate-950 font-display">{clinicalCase.title}</h2>
                      <p className="text-sm text-slate-600 leading-relaxed">{clinicalCase.description}</p>
                      {clinicalCase.caseQuote && <blockquote className="border-l-2 border-indigo-300 pl-3 text-sm italic text-slate-500">"{clinicalCase.caseQuote}"</blockquote>}
                      {clinicalCase.diseaseTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {clinicalCase.diseaseTags.map((t, i) => (<span key={i} className="text-[9px] font-semibold bg-indigo-50/70 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100/50">#{t}</span>))}
                        </div>
                      )}
                      <div className="flex items-center gap-4 pt-2 text-slate-400 text-[11px] font-semibold">
                        <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{clinicalCase.commentsCount}</span>
                        <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{clinicalCase.viewsCount} views</span>
                        <button onClick={handleLike} className={`flex items-center gap-1 transition-colors ${liked ? 'text-blue-600' : 'hover:text-blue-600'}`}>
                          <ThumbsUp className="w-3.5 h-3.5" fill={liked ? 'currentColor' : 'none'} />{likesCount}
                        </button>
                        <button onClick={handleShowLikes} className="text-[9px] text-slate-400 hover:text-slate-600 underline decoration-dotted">See who liked</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 font-display mb-4">Peer Discussion</h3>
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {comments.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No clinical opinions yet. Be the first to comment.</p>
                ) : (
                  <AnimatePresence initial={false}>
                  {comments.map((c: CaseComment) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="flex gap-3 group">
                      <img src={c.authorAvatar} alt="author" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-slate-100 shrink-0" />
                      <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-800">{c.authorName}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{formatRelativeTime(c.createdAt)}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.text}</p>
                        {c.attachmentName && <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100"><Paperclip className="w-3 h-3" />{c.attachmentName}</span>}
                      </div>
                      {c.authorUid === user?.id && (
                        <button onClick={() => deleteComment(c.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-opacity text-xs">Delete</button>
                      )}
                    </motion.div>
                  ))}
                  </AnimatePresence>
                )}
              </div>

              <form onSubmit={handlePostComment} className="mt-4 flex gap-2 items-center">
                <div className="flex-1 relative">
                  {showMention && mentionUsers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="mention-dropdown absolute bottom-full left-0 w-full mb-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="max-h-44 overflow-y-auto py-1">
                        {mentionUsers.map((mu, i) => (
                          <button
                            key={mu.id}
                            type="button"
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors ${i === mentionActiveIdx ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                            onMouseEnter={() => setMentionActiveIdx(i)}
                            onClick={() => insertMention(mu)}
                          >
                            <img src={mu.image || getAvatarUrl({ avatarUrl: mu.image || undefined })} alt="" referrerPolicy="no-referrer" className="w-6 h-6 rounded-full border border-slate-100 shrink-0" />
                            <span className="font-medium truncate">{mu.name}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <textarea ref={textareaRef} value={commentText} onChange={handleCommentChange} onKeyDown={handleCommentKeyDown} rows={1} placeholder="Share your clinical opinion... Use @ to mention a doctor" className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:bg-white focus:outline-none transition-all resize-none" />
                </div>
                <button type="submit" disabled={sending} className="px-4 py-3 bg-black hover:bg-slate-900 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 h-full min-h-[42px]">{sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</button>
              </form>
            </div>
          </div>
        </main>

      {showLikes && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setShowLikes(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 max-h-80 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Liked by</h3>
              <button onClick={() => setShowLikes(false)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
            </div>
            {likesData.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No likes yet.</p>
            ) : (
              <div className="space-y-2">
                {likesData.map((l) => (
                  <div key={l.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50">
                    <img src={l.avatar} alt="" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full border border-slate-100" />
                    <span className="text-xs font-semibold text-slate-800">{l.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
