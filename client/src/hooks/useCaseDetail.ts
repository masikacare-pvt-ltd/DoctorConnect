import { useEffect, useState, useCallback, useRef } from 'react';
import { getCase, likeCase, getCaseLikes } from '../services/case.service';
import { fetchComments, addComment, removeComment } from '../services/comment.service';
import { requestCaseAnalysis, deleteAiReport } from '../services/ai.service';
import type { ClinicalCase, CaseImage, CaseComment } from '../types/domain';
import type { AiAnalysisResult } from '../types/ai';
import type { CommentInput } from '../validation';

const cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 30_000;

export function useCaseDetail(caseId: string) {
  const [clinicalCase, setClinicalCase] = useState<ClinicalCase | null>(null);
  const [images, setImages] = useState<CaseImage[]>([]);
  const [comments, setComments] = useState<CaseComment[]>([]);
  const [aiReport, setAiReport] = useState<AiAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likes, setLikes] = useState<{ id: string; userId: string; name: string; avatar: string; createdAt: string }[]>([]);
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    const cached = cache.get(caseId);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      const d = cached.data;
      setClinicalCase(d.clinicalCase);
      setLikesCount(d.clinicalCase.likesCount || 0);
      setImages(d.images);
      if (d.aiReport) setAiReport(d.aiReport);
      setComments(d.comments);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [result, cs] = await Promise.all([
      getCase(caseId),
      fetchComments(caseId),
    ]);
    if (!mountedRef.current) return;
    if (result) {
      const c = result.clinicalCase;
      setClinicalCase(c);
      setLikesCount(c.likesCount || 0);
      if (result.aiReport) setAiReport(result.aiReport);
      if (result.images.length > 0) {
        setImages(result.images);
      } else if (c.coverImage) {
        setImages([{ id: 'cover', caseId, uploadedBy: c.authorUid, downloadURL: c.coverImage, thumbnailURL: c.coverImage, width: 0, height: 0, size: 0, mimeType: 'image/jpeg', createdAt: c.createdAt }]);
      }
    }
    setComments(cs);
    setLoading(false);
    cache.set(caseId, { data: { clinicalCase: result?.clinicalCase, images: result?.images || [], aiReport: result?.aiReport, comments: cs }, ts: Date.now() });
  }, [caseId]);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => { mountedRef.current = false; };
  }, [load]);

  const postComment = useCallback(
    async (input: CommentInput) => {
      const newComment = await addComment(caseId, { text: input.text });
      if (newComment) {
        setComments((prev) => [...prev, newComment]);
        setClinicalCase((prev) => prev ? { ...prev, commentsCount: (prev.commentsCount || 0) + 1 } : prev);
      } else {
        const cs = await fetchComments(caseId);
        setComments(cs);
        setClinicalCase((prev) => prev ? { ...prev, commentsCount: cs.length } : prev);
      }
    },
    [caseId],
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      await removeComment(commentId, caseId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setClinicalCase((prev) => prev ? { ...prev, commentsCount: Math.max(0, (prev.commentsCount || 0) - 1) } : prev);
    },
    [caseId],
  );

  const toggleLike = useCallback(async () => {
    const isLiked = await likeCase(caseId);
    setLiked(isLiked);
    setLikesCount((prev) => (isLiked ? prev + 1 : Math.max(0, prev - 1)));
  }, [caseId]);

  const fetchLikes = useCallback(async () => {
    const data = await getCaseLikes(caseId);
    setLikes(data);
    return data;
  }, [caseId]);

  const generateAi = useCallback(async () => {
    setAiLoading(true);
    try {
      const result = await requestCaseAnalysis(caseId);
      setAiReport(result);
    } finally {
      setAiLoading(false);
    }
  }, [caseId]);

  const regenerateAi = useCallback(async () => {
    setAiLoading(true);
    try {
      await deleteAiReport(caseId);
      const result = await requestCaseAnalysis(caseId);
      setAiReport(result);
    } finally {
      setAiLoading(false);
    }
  }, [caseId]);

  const refreshCase = useCallback(async () => {
    const result = await getCase(caseId);
    if (result) {
      setClinicalCase(result.clinicalCase);
      setLikesCount(result.clinicalCase.likesCount || 0);
      if (result.aiReport) setAiReport(result.aiReport);
      if (result.images.length > 0) setImages(result.images);
    }
  }, [caseId]);

  return {
    clinicalCase,
    images,
    comments,
    aiReport,
    loading,
    aiLoading,
    liked,
    likesCount,
    likes,
    postComment,
    deleteComment,
    toggleLike,
    fetchLikes,
    generateAi,
    regenerateAi,
    refreshCase,
  };
}
