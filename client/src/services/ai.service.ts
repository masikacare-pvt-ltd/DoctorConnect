import { apiPost, apiGet, apiDelete } from '../lib/api';
import type { AiAnalysisResult } from '../types/ai';

export async function requestCaseAnalysis(caseId: string): Promise<AiAnalysisResult> {
  const res = await apiPost('/api/ai/generate', { caseId });
  return (res?.data ?? res) as AiAnalysisResult;
}

export async function fetchAiReport(caseId: string): Promise<AiAnalysisResult | null> {
  const res = await apiGet(`/api/ai/report/${caseId}`);
  return res?.data ?? res;
}

export async function deleteAiReport(caseId: string): Promise<void> {
  await apiDelete(`/api/ai/report/${caseId}`);
}
