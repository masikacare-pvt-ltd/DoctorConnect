const configuredBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
// Never make a deployed browser wait on a non-existent local server. The
// production deployment must set VITE_API_URL to the API deployment URL.
const BASE = configuredBase || (import.meta.env.PROD ? window.location.origin : 'http://localhost:5000');
const REQUEST_TIMEOUT_MS = 12_000;

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

async function request(path: string, init: RequestInit = {}, signal?: AbortSignal): Promise<Response> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });

  try {
    return await fetch(`${BASE}${path}`, { ...init, credentials: 'include', signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted && !signal?.aborted) {
      throw new ApiError('The server took too long to respond. Please try again.', 408);
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}

export async function apiGet<T = any>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await request(path, {}, signal);
  const data = await parseRes(res);
  if (!res.ok) throw new ApiError(data?.message || `GET ${path} failed`, res.status, data);
  return data;
}

export async function apiPost<T = any>(path: string, body?: any): Promise<T> {
  const headers: Record<string, string> = {};
  if (!(body instanceof FormData)) headers['content-type'] = 'application/json';
  const res = await request(path, {
    method: 'POST',
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  const data = await parseRes(res);
  if (!res.ok) throw new ApiError(data?.message || `POST ${path} failed`, res.status, data);
  return data;
}

export async function apiPatch<T = any>(path: string, body?: any): Promise<T> {
  const res = await request(path, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await parseRes(res);
  if (!res.ok) throw new ApiError(data?.message || `PATCH ${path} failed`, res.status, data);
  return data;
}

export async function apiPut<T = any>(path: string, body?: any): Promise<T> {
  const res = await request(path, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await parseRes(res);
  if (!res.ok) throw new ApiError(data?.message || `PUT ${path} failed`, res.status, data);
  return data;
}

export async function apiDelete<T = any>(path: string): Promise<T> {
  const res = await request(path, { method: 'DELETE' });
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
    caseType: raw.caseType || 'Normal',
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
