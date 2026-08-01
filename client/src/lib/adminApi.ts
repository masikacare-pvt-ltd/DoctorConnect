const BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  (import.meta.env.PROD ? window.location.origin : 'http://localhost:5000');
const REQUEST_TIMEOUT_MS = 12_000;
const TOKEN_KEY = 'admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminToken();
}

async function request<T>(method: string, path: string, body?: any): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (token) headers['authorization'] = `Bearer ${token}`;
  const res = await timedFetch(`${BASE}${path}`, { method, headers, credentials: 'include', body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let data: any;
  try { data = JSON.parse(text); } catch { data = { message: text || `HTTP ${res.status}` }; }
  if (!res.ok) throw new Error(data?.message || `${method} ${path} failed`);
  return data;
}

async function timedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted) throw new Error('The server took too long to respond. Please try again.');
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function adminGet<T = any>(path: string) { return request<T>('GET', `/api/admin${path}`); }
export function adminPost<T = any>(path: string, body?: any) { return request<T>('POST', `/api/admin${path}`, body); }
export function adminPatch<T = any>(path: string, body?: any) { return request<T>('PATCH', `/api/admin${path}`, body); }
export function adminDelete<T = any>(path: string) { return request<T>('DELETE', `/api/admin${path}`); }

export async function adminLogin(adminId: string, password: string): Promise<void> {
  const res = await timedFetch(`${BASE}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ adminId, password }),
  });
  const text = await res.text();
  let data: any;
  try { data = JSON.parse(text); } catch { data = { message: text || `HTTP ${res.status}` }; }
  if (!res.ok) throw new Error(data?.message || 'Login failed');
  setAdminToken(data.data.token);
}
