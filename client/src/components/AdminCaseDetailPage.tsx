import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, MessageSquare, Eye, ThumbsUp, FileText, AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { adminGet, adminDelete } from '../lib/adminApi';
import AdminLayout from './AdminLayout';
import ConfirmDialog from './ConfirmDialog';

interface AdminComment {
  id: string;
  caseId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

interface AdminCaseImage {
  id: string;
  downloadURL: string;
  thumbnailURL: string;
}

interface AdminAiReport {
  id: string;
  summary: string;
  aiResponse: string;
  confidence: number;
  findings: any;
  severity: string;
  status: string;
  createdAt: string;
}

interface AdminCaseDetail {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  authorName: string;
  authorAvatar: string;
  specialization: string;
  urgent: boolean;
  status: string;
  viewsCount: number;
  commentsCount: number;
  likesCount: number;
  createdAt: string;
  images: AdminCaseImage[];
  aiReport: AdminAiReport | null;
  comments: AdminComment[];
}

export default function AdminCaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<AdminCaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    try {
      const res = await adminGet(`/cases/${caseId}`);
      setDetail(res.data);
    } catch {
      navigate('/admin/cases');
    } finally {
      setLoading(false);
    }
  }, [caseId, navigate]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 text-slate-400 animate-spin" /></div>
      </AdminLayout>
    );
  }

  if (!detail) return null;

  return (
    <AdminLayout>
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/admin/cases')} className="text-slate-400 hover:text-slate-700"><ChevronRight className="w-4 h-4 rotate-180" /></button>
          <h1 className="text-sm font-bold text-slate-900 truncate">{detail.title}</h1>
          <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">{detail.caseNumber}</span>
          <button onClick={() => setShowDelete(true)} className="ml-auto flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50">
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        </header>

        <div className="p-4 md:p-6 space-y-4">
          {/* Case Details */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={detail.authorAvatar} alt="" className="w-7 h-7 rounded-full border border-slate-200" />
                <div>
                  <span className="block text-xs font-bold text-slate-900">{detail.authorName}</span>
                  <span className="block text-[9px] text-slate-400">{detail.specialization} &middot; {new Date(detail.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {detail.urgent && <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[8px] font-extrabold uppercase rounded">Urgent</span>}
                {detail.status === 'resolved' && <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-extrabold uppercase rounded">Resolved</span>}
              </div>
            </div>
            {detail.images.length > 0 && (
              <div className="p-3 space-y-2">
                <div className="h-64 rounded-lg overflow-hidden bg-slate-100">
                  <img src={detail.images[activeImg]?.downloadURL} alt="" className="w-full h-full object-contain" />
                </div>
                {detail.images.length > 1 && (
                  <div className="flex gap-2">
                    {detail.images.map((img, i) => (
                      <button key={img.id} onClick={() => setActiveImg(i)} className={`w-14 h-14 rounded-lg overflow-hidden border-2 ${i === activeImg ? 'border-indigo-500' : 'border-transparent'}`}>
                        <img src={img.thumbnailURL || img.downloadURL} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="p-4">
              <h2 className="text-sm font-bold text-slate-900 mb-2">{detail.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{detail.description}</p>
              <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{detail.commentsCount}</span>
                <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{detail.likesCount}</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{detail.viewsCount} views</span>
              </div>
            </div>
          </div>

          {/* AI Report */}
          {detail.aiReport && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold text-slate-900">AI Clinical Analysis</h3>
                <span className={`ml-auto px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                  detail.aiReport.severity === 'critical' ? 'bg-red-100 text-red-700 border-red-200' :
                  detail.aiReport.severity === 'high' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                  detail.aiReport.severity === 'moderate' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                  'bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}>
                  {detail.aiReport.severity || 'N/A'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{detail.aiReport.summary || detail.aiReport.aiResponse}</p>
              {detail.aiReport.confidence && (
                <div className="flex items-center gap-1.5 mt-2 text-[9px] text-slate-400">
                  <AlertTriangle className="w-3 h-3" />
                  Confidence: {Math.round(detail.aiReport.confidence * 100)}%
                </div>
              )}
            </div>
          )}

          {/* Comments / Discussion */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Peer Discussion ({detail.comments.length})
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {detail.comments.length === 0 ? (
                <p className="text-[11px] text-slate-400 text-center py-4">No comments on this case.</p>
              ) : (
                detail.comments.map((co) => (
                  <div key={co.id} className="flex gap-2.5">
                    <img src={co.authorAvatar} alt="" className="w-6 h-6 rounded-full border border-slate-100 shrink-0 mt-0.5" />
                    <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-800">{co.authorName}</span>
                        <span className="text-[8px] text-slate-400">{new Date(co.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{co.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={showDelete}
        title="Delete Case"
        message={`Are you sure you want to delete "${detail.title}"? This action cannot be undone and will permanently remove all associated data (images, comments, likes, AI report).`}
        loading={deleting}
        onConfirm={async () => {
          setDeleting(true);
          try {
            await adminDelete(`/cases/${detail.id}`);
            navigate('/admin/cases');
          } catch {
            setDeleting(false);
            setShowDelete(false);
          }
        }}
        onCancel={() => setShowDelete(false)}
      />
    </AdminLayout>
  );
}
