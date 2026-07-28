import { apiGet } from '../lib/api';

export interface MentionUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export async function searchUsers(query: string): Promise<MentionUser[]> {
  if (!query.trim()) return [];
  try {
    const res = await apiGet<{ status: string; data: MentionUser[] }>(`/api/users/search?q=${encodeURIComponent(query)}`);
    return res.data || [];
  } catch {
    return [];
  }
}
