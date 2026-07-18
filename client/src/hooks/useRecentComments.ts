import { useEffect, useState } from 'react';
import { fetchRecentComments } from '../services/comment.service';
import type { CaseComment } from '../types/domain';

export function useRecentComments(max = 8) {
  const [comments, setComments] = useState<CaseComment[]>([]);
  useEffect(() => {
    fetchRecentComments(max).then(setComments).catch(() => setComments([]));
  }, [max]);
  return comments;
}
