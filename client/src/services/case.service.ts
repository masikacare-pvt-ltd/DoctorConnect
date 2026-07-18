import { apiGet, apiPost, apiPatch, apiPut, apiDelete, casesToClient } from '../lib/api';
import type { ClinicalCase, Profile, CaseImage } from '../types/domain';
import type { AiAnalysisResult } from '../types/ai';
import type { CaseInput } from '../validation';

interface RawCaseImage {
  id: string;
  caseId: string;
  uploadedBy: string;
  imageData?: string;
  downloadURL?: string;
  thumbnailURL?: string;
  secureUrl?: string;
  width?: number;
  height?: number;
  size?: number;
  mimeType?: string;
  createdAt: string;
}

export interface CreateCaseResult {
  caseId: string;
  coverImage: string;
  error: string | null;
}

export async function createCase(input: CaseInput, _files: File[], _profile: Profile): Promise<CreateCaseResult> {
  try {
    const { data } = await apiPost('/api/cases', {
      title: input.title,
      description: input.description,
      specialization: input.specializationId,
      urgent: input.urgent,
      diseaseTags: input.diseaseTags,
    });
    let coverImage = '';
    if (_files.length > 0) {
      const form = new FormData();
      for (const f of _files) form.append('images', f);
      const uploadRes = await apiPost(`/api/uploads/case/${data.id}`, form);
      if (uploadRes?.data?.length > 0) {
        coverImage = uploadRes.data[0].imageData || uploadRes.data[0].secureUrl || '';
      }
    }
    return { caseId: data.id, coverImage, error: null };
  } catch (e) {
    return { caseId: '', coverImage: '', error: (e as Error).message || 'Failed to create case' };
  }
}

export interface CaseDetailResult {
  clinicalCase: ClinicalCase;
  images: CaseImage[];
  aiReport: AiAnalysisResult | null;
}

export async function getCase(id: string): Promise<CaseDetailResult | null> {
  try {
    const { data } = await apiGet(`/api/cases/${id}`);
    const images: CaseImage[] = (data.images || []).map((i: RawCaseImage) => ({
      id: i.id,
      caseId: i.caseId,
      uploadedBy: i.uploadedBy,
      downloadURL: i.downloadURL || i.imageData || i.secureUrl || '',
      thumbnailURL: i.thumbnailURL || i.imageData || i.secureUrl || '',
      width: i.width || 0,
      height: i.height || 0,
      size: i.size || 0,
      mimeType: i.mimeType || 'image/jpeg',
      createdAt: i.createdAt,
    }));
    return { clinicalCase: casesToClient(data), images, aiReport: data.aiReport || null };
  } catch {
    return null;
  }
}

export async function editCase(caseId: string, input: Partial<CaseInput>): Promise<void> {
  const body: Record<string, string | boolean | string[]> = {};
  if (input.title !== undefined) body.title = input.title;
  if (input.description !== undefined) body.description = input.description;
  if (input.specializationId !== undefined) body.specialization = input.specializationId;
  if (input.urgent !== undefined) body.urgent = input.urgent;
  if (input.diseaseTags !== undefined) body.diseaseTags = input.diseaseTags;
  try {
    await apiPut(`/api/cases/${caseId}`, body);
  } catch {
    await apiPatch(`/api/cases/${caseId}`, body);
  }
}

export async function deleteCase(caseId: string): Promise<void> {
  await apiDelete(`/api/cases/${caseId}`);
}

export async function likeCase(caseId: string): Promise<boolean> {
  const { liked } = await apiPost(`/api/cases/${caseId}/like`);
  return liked;
}

export async function getCaseLikes(caseId: string): Promise<{ id: string; userId: string; name: string; avatar: string; createdAt: string }[]> {
  const { data } = await apiGet(`/api/cases/${caseId}/likes`);
  return data || [];
}

export async function recordView(caseId: string): Promise<void> {
  await apiGet(`/api/cases/${caseId}`);
}

export async function fetchCases(params?: { specialization?: string; search?: string; page?: number }): Promise<{ cases: ClinicalCase[]; total: number; page: number; limit: number }> {
  const q = new URLSearchParams();
  if (params?.specialization) q.set('specialization', params.specialization);
  if (params?.search) q.set('search', params.search);
  if (params?.page) q.set('page', String(params.page));
  const { data, total, page, limit } = await apiGet(`/api/cases?${q}`);
  return { cases: (data || []).map(casesToClient), total: total || 0, page: page || 1, limit: limit || 20 };
}
