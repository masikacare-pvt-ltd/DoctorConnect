import { useEffect, useState, useCallback } from 'react';
import { fetchBookmarkIds, toggleBookmark } from '../services/bookmark.service';
import type { Bookmark } from '../types/domain';

export function useBookmarks() {
  const [bookmarks] = useState<Bookmark[]>([]);
  const [bookmarkIds, setBookmarkIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      const ids = await fetchBookmarkIds();
      setBookmarkIds(new Set(ids));
    } catch {
      setBookmarkIds(new Set());
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = useCallback(
    async (bookmark: Bookmark) => {
      await toggleBookmark(bookmark);
      const ids = await fetchBookmarkIds();
      setBookmarkIds(new Set(ids));
    },
    [],
  );

  return { bookmarks, bookmarkIds, toggle, refresh: load };
}
