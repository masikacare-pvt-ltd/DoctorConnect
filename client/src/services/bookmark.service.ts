import { apiGet, apiPost } from '../lib/api';
import type { Bookmark } from '../types/domain';

export async function fetchBookmarks(): Promise<Bookmark[]> {
  const { data } = await apiGet('/api/bookmarks');
  return (data || []).map((b: Bookmark) => ({
    caseId: b.caseId,
    caseTitle: b.caseTitle || '',
    caseCover: b.caseCover || '',
    authorName: b.authorName || '',
    createdAt: b.createdAt,
  }));
}

export async function fetchBookmarkIds(): Promise<string[]> {
  const res = await apiGet<{ status: string; data: string[] }>('/api/bookmarks/ids');
  return res.data || [];
}

export async function toggleBookmark(bookmark: Bookmark): Promise<boolean> {
  const res = await apiPost('/api/bookmarks/toggle', { caseId: bookmark.caseId });
  if (res.bookmarked !== undefined) return res.bookmarked;
  return true;
}
