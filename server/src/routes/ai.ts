import { Router, Request, Response } from 'express';
import Groq from 'groq-sdk';
import { prisma } from '../config/prisma';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth';

const router = Router();
let groq: Groq | null = null;
function getGroq(): Groq {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not configured on the server');
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

const TEXT_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const VISION_MODEL = process.env.GROQ_VISION_MODEL || 'llama-3.2-90b-vision-preview';

const SYSTEM_PROMPT = `You are MedConnect AI, a clinical decision-support assistant for licensed physicians. You analyze medical images and clinical case data.

RULES:
- Never greet the user or address them directly.
- Strip any preamble or epilogue. Output ONLY the JSON object.
- No markdown fences, no commentary, no conversational text.

STEP 1 — Medical Relevance Gate:
Check if the content (text + images) is genuinely medical. REJECT if:
- Test data, dummy content, placeholder text, or example content
- Non-medical topics (God, religion, politics, entertainment, random text)
- Vague descriptions without clinical information
If rejected, respond with ONLY this JSON: { "isMedical": false, "nonMedicalReason": "why rejected" }

STEP 2 — If medical, analyze the case text AND any provided medical images. Respond with STRICT JSON ONLY:
{
  "isMedical": true,
  "summary": "Clinical summary of the case based on text AND image findings",
  "differentials": [{ "condition": "string", "likelihood": "low"|"medium"|"high"|"critical" }],
  "recommendations": ["string"],
  "redFlags": ["string"],
  "questionsToClinician": ["string"],
  "disclaimer": "AI-generated, not a substitute for clinical judgement."
}

IMPORTANT: If medical images are provided, analyze them thoroughly — describe what you see (anatomy, abnormalities, findings) and incorporate those findings into the summary and differentials. Respond with ONLY valid JSON, no other text.`;

const SYSTEM_PROMPT_TEXT = `You are MedConnect AI, a clinical decision-support assistant for licensed physicians.

RULES:
- Never greet the user or address them directly.
- Strip any preamble or epilogue. Output ONLY the JSON object.
- No markdown fences, no commentary, no conversational text.

STEP 1 — Medical Relevance Gate:
Check if the content is genuinely medical. REJECT if:
- Test data, dummy content, placeholder text, or example content
- Non-medical topics (God, religion, politics, entertainment, random text)
- Vague descriptions without clinical information
If rejected, respond with ONLY this JSON: { "isMedical": false, "nonMedicalReason": "why rejected" }

STEP 2 — If medical, respond with STRICT JSON ONLY:
{
  "isMedical": true,
  "summary": "Clinical summary based on the case text",
  "differentials": [{ "condition": "string", "likelihood": "low"|"medium"|"high"|"critical" }],
  "recommendations": ["string"],
  "redFlags": ["string"],
  "questionsToClinician": ["string"],
  "disclaimer": "AI-generated, not a substitute for clinical judgement."
}

Respond with ONLY valid JSON, no other text.`;

function sanitizePrompt(text: string): string {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\S+\.(png|jpg|jpeg|gif|webp|svg|bmp|ico)\b/gi, '')
    .replace(/\bimage\s*\d*\b/gi, '')
    .replace(/[<>]/g, '');
}

function toClient(report: any) {
  const parsed = (typeof report.findings === 'object' ? report.findings : {}) as any;
  return {
    id: report.id,
    caseId: report.caseId,
    createdAt: report.createdAt,
    model: report.model,
    aiResponse: report.aiResponse || 'No analysis available.',
    isMedical: report.isMedical ?? true,
    nonMedicalReason: report.nonMedicalReason || '',
    visionWarning: parsed.visionWarning || '',
    structured: {
      summary: report.summary || parsed.summary || '',
      differentials: (parsed.differentials || []).map((d: any) => ({ condition: d.condition || '', likelihood: d.likelihood || '' })),
      recommendations: report.recommendations || [],
      redFlags: report.redFlags || [],
      questionsToClinician: report.questionsToClinician || [],
      disclaimer: report.disclaimer || '',
    },
  };
}

async function callGroqText(userPrompt: string): Promise<any> {
  const completion = await getGroq().chat.completions.create({
    model: TEXT_MODEL,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT_TEXT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.2,
  });
  const raw = completion.choices[0]?.message?.content || '{}';
  let parsed: any = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { isMedical: true, summary: raw };
  }
  return { raw, parsed, model: completion.model };
}

async function callGroqVision(textPrompt: string, images: { mimeType: string; data: string }[]): Promise<any> {
  const content: any[] = [{ type: 'text', text: textPrompt }];
  for (const img of images) {
    content.push({ type: 'image_url', image_url: { url: `data:${img.mimeType};base64,${img.data}` } });
  }
  const completion = await getGroq().chat.completions.create({
    model: VISION_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content },
    ],
    temperature: 0.2,
    max_tokens: 4096,
  });
  const raw = completion.choices[0]?.message?.content || '{}';
  let parsed: any = {};
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      parsed = { isMedical: true, summary: raw };
    }
  } else {
    parsed = { isMedical: true, summary: raw };
  }
  return { raw, parsed, model: completion.model };
}

// POST /api/ai/generate - generate AI analysis for a case
router.post('/generate', requireAuth, async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  try {
    const { caseId } = req.body;
    if (!caseId) return res.status(400).json({ status: 'error', message: 'caseId required' });

    const clinCase = await prisma.clinicalCase.findUnique({
      where: { id: caseId },
      include: {
        author: { include: { profile: true } },
        comments: { where: { deletedAt: null }, include: { author: { include: { profile: true } } }, orderBy: { createdAt: 'asc' } },
        images: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!clinCase) return res.status(404).json({ status: 'error', message: 'Case not found' });

    const commentsSection = clinCase.comments.length > 0
      ? `\n\nDiscussion Comments:\n${clinCase.comments.map((c) => `- ${c.author?.profile?.displayName || c.author?.name || 'Unknown'} said: ${c.content}`).join('\n')}`
      : '';

    const textPrompt = `Case Number: ${clinCase.caseNumber}
Title: ${sanitizePrompt(clinCase.title)}
Specialization: ${clinCase.specialization}
Description: ${sanitizePrompt(clinCase.description)}
Disease Tags: ${(clinCase.diseaseTags || []).join(', ') || 'none'}
Urgent: ${clinCase.urgent}${commentsSection}

Analyze this clinical case. If medical images are attached with this message, examine them carefully and incorporate your visual findings into the analysis.`;

    let raw: string;
    let parsed: any;
    let model: string;

    const imageAttachments = clinCase.images
      .filter((img) => img.imageData)
      .map((img) => {
        const raw: string = img.imageData!;
        const base64: string = raw.includes('base64,') ? (raw.split('base64,').pop() || '') : raw;
        return { mimeType: img.mimeType || 'image/jpeg', data: base64 };
      });

    if (imageAttachments.length > 0) {
      try {
        const result = await callGroqVision(textPrompt, imageAttachments);
        raw = result.raw;
        parsed = result.parsed;
        model = result.model;
      } catch (visionErr: any) {
        const visionMsg = visionErr?.message || 'Cannot read image — this model does not support image input.';
        const result = await callGroqText(textPrompt);
        raw = result.raw;
        parsed = result.parsed;
        model = result.model;
        parsed.visionWarning = visionMsg;
      }
    } else {
      const result = await callGroqText(textPrompt);
      raw = result.raw;
      parsed = result.parsed;
      model = result.model;
    }

    const isMedical = parsed.isMedical !== false;
    const nonMedicalReason = parsed.nonMedicalReason || '';

    const report = await prisma.aIReport.create({
      data: {
        caseId,
        model: model || TEXT_MODEL,
        status: 'completed',
        confidence: 0.5,
        findings: parsed,
        differentialDiagnosis: (parsed.differentials || []).map((d: any) => d.condition),
        recommendations: parsed.recommendations || [],
        redFlags: parsed.redFlags || [],
        questionsToClinician: parsed.questionsToClinician || [],
        summary: parsed.summary || '',
        isMedical,
        nonMedicalReason,
        aiResponse: raw,
        severity: (parsed.differentials || []).some((d: any) => d.likelihood === 'critical') ? 'critical' : 'medium',
        disclaimer: parsed.disclaimer || 'AI-generated, not a substitute for clinical judgement.',
      },
    });

    await prisma.activityLog.create({ data: { userId: user.id, action: 'ai_generate', entityType: 'case', entityId: caseId } });
    res.status(201).json({ status: 'success', data: toClient(report) });
  } catch (e: any) {
    const msg = e.message || '';
    if (msg.includes('API key')) {
      return res.status(500).json({ status: 'error', message: 'AI service is not configured. Please contact the administrator.' });
    }
    res.status(500).json({ status: 'error', message: msg });
  }
});

// GET /api/ai/report/:caseId - latest AI report for a case
router.get('/report/:caseId', requireAuth, async (req: Request, res: Response) => {
  try {
    const report = await prisma.aIReport.findFirst({
      where: { caseId: req.params.caseId as string },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ status: 'success', data: report ? toClient(report) : null });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// DELETE /api/ai/report/:caseId - delete AI report for a case (before regenerating)
router.delete('/report/:caseId', requireAuth, async (req: Request, res: Response) => {
  try {
    await prisma.aIReport.deleteMany({ where: { caseId: req.params.caseId as string } });
    res.json({ status: 'success' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

export default router;
