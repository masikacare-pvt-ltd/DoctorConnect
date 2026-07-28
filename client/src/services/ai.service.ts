import { apiPost, apiGet, apiDelete } from '../lib/api';
import type { AiAnalysisResult } from '../types/ai';

export async function requestCaseAnalysis(caseId: string): Promise<AiAnalysisResult> {
  const { data } = await apiPost('/api/ai/generate', { caseId });
  return data as AiAnalysisResult;
}

export async function fetchAiReport(caseId: string): Promise<AiAnalysisResult | null> {
  const { data } = await apiGet(`/api/ai/report/${caseId}`);
  return data;
}

export async function deleteAiReport(caseId: string): Promise<void> {
  await apiDelete(`/api/ai/report/${caseId}`);
}
