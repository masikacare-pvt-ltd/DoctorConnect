export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqChatRequest {
  model: string;
  messages: GroqMessage[];
  temperature: number;
  max_tokens: number;
  response_format?: { type: 'json_object' };
}

export interface GroqChatResponse {
  id: string;
  model: string;
  choices: {
    message: { role: string; content: string };
    finish_reason: string;
  }[];
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

export interface GroqAnalysisJson {
  summary?: string;
  differentials: { condition: string; likelihood: string }[];
  recommendations: string[];
  redFlags: string[];
  questionsToClinician: string[];
  disclaimer?: string;
}

export interface AiAnalysisResult {
  id: string;
  caseId: string;
  createdAt: string;
  model: string;
  aiResponse: string;
  isMedical: boolean;
  nonMedicalReason: string;
  visionWarning?: string;
  structured?: GroqAnalysisJson;
}
