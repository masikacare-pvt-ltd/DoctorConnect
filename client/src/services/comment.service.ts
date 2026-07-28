import { apiGet, apiPost, apiDelete } from '../lib/api';
import type { CaseComment } from '../types/domain';

interface RawComment {
  id: string;
  caseId: string;
  authorId: string;
  authorName?: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export async function fetchComments(caseId: string): Promise<CaseComment[]> {
  const { data } = await apiGet(`/api/comments?caseId=${caseId}`);
  return (data || []).map((c: RawComment) => ({
    id: c.id,
    caseId: c.caseId,
    authorUid: c.authorId,
    authorName: c.authorName,
    authorAvatar: c.authorAvatar,
    text: c.content,
    attachmentName: null,
    createdAt: c.createdAt,
  }));
}

export async function addComment(caseId: string, input: { text: string }): Promise<CaseComment | null> {
  try {
    const { data } = await apiPost('/api/comments', { caseId, content: input.text });
    if (!data) return null;
    return {
      id: data.id,
      caseId: data.caseId,
      authorUid: data.authorId,
      authorName: data.authorName || '',
      authorAvatar: data.authorAvatar || '',
      text: data.content || '',
      attachmentName: null,
      createdAt: data.createdAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function fetchRecentComments(limit = 20): Promise<CaseComment[]> {
  const { data } = await apiGet(`/api/comments/recent?limit=${limit}`);
  return (data || []).map((c: RawComment) => ({
    id: c.id,
    caseId: c.caseId,
    authorUid: c.authorId,
    authorName: c.authorName,
    authorAvatar: c.authorAvatar,
    text: c.content,
    attachmentName: null,
    createdAt: c.createdAt,
  }));
}

export async function removeComment(commentId: string, _caseId: string): Promise<void> {
  await apiDelete(`/api/comments/${commentId}`);
}
