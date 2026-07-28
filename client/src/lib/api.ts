const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export class ApiError extends Error {
  status: number;
  body: any;
  constructor(message: string, status: number, body?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

async function parseRes(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: text || `HTTP ${res.status}` };
  }
}

export async function apiGet<T = any>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { credentials: 'include', signal });
  const data = await parseRes(res);
  if (!res.ok) throw new ApiError(data?.message || `GET ${path} failed`, res.status, data);
  return data;
}

export async function apiPost<T = any>(path: string, body?: any): Promise<T> {
  const headers: Record<string, string> = {};
  if (!(body instanceof FormData)) headers['content-type'] = 'application/json';
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  const data = await parseRes(res);
  if (!res.ok) throw new ApiError(data?.message || `POST ${path} failed`, res.status, data);
  return data;
}

export async function apiPatch<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await parseRes(res);
  if (!res.ok) throw new ApiError(data?.message || `PATCH ${path} failed`, res.status, data);
  return data;
}

export async function apiPut<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await parseRes(res);
  if (!res.ok) throw new ApiError(data?.message || `PUT ${path} failed`, res.status, data);
  return data;
}

export async function apiDelete<T = any>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { method: 'DELETE', credentials: 'include' });
  const data = await parseRes(res);
  if (!res.ok) throw new ApiError(data?.message || `DELETE ${path} failed`, res.status, data);
  return data;
}

export function casesToClient(raw: any): import('../types/domain').ClinicalCase {
  return {
    id: raw.id,
    caseNumber: raw.caseNumber,
    title: raw.title,
    authorUid: raw.authorId,
    authorName: raw.authorName,
    authorAvatar: raw.authorAvatar,
    specializationId: raw.specialization,
    category: raw.specialization,
    description: raw.description,
    urgent: raw.urgent,
    diseaseTags: raw.diseaseTags || [],
    caseQuote: '',
    status: raw.status || 'open',
    coverImage: raw.coverImage || '',
    aiReportId: raw.aiReportId || raw.aiReport?.id || null,
    viewsCount: raw.viewsCount || 0,
    commentsCount: raw.commentsCount || 0,
    likesCount: raw.likesCount || 0,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}
