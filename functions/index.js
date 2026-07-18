const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { initializeApp, getApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();

const DB = process.env.FIRESTORE_DATABASE_ID;
const db = DB ? getFirestore(getApp(), DB) : getFirestore(getApp());

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function callGroq(system, user, model) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new HttpsError('internal', `Groq error ${res.status}: ${text}`);
  }
  const json = await res.json();
  return json.choices?.[0]?.message?.content || '';
}

const SYSTEM_PROMPT = `You are MedConnect's clinical decision-support assistant for verified physicians.
Given a clinical case, respond ONLY with a JSON object of this exact shape:
{
  "summary": "concise clinical summary (1-2 sentences)",
  "differentials": [{"condition": "string", "likelihood": "low|medium|high"}],
  "recommendations": ["string"],
  "redFlags": ["string"],
  "questionsToClinician": ["string"],
  "disclaimer": "AI-generated; not a substitute for professional judgement."
}
Be precise, cautious, and avoid invented facts.`;

exports.generateCaseAnalysis = onCall(
  { secrets: ['GROQ_API_KEY'], env: ['GROQ_MODEL'] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'You must be signed in.');
    }
    const caseId = request.data?.caseId;
    if (!caseId) {
      throw new HttpsError('invalid-argument', 'caseId is required.');
    }
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

    const caseRef = db.collection('cases').doc(caseId);
    const caseSnap = await caseRef.get();
    if (!caseSnap.exists) {
      throw new HttpsError('not-found', 'Case not found.');
    }
    const c = caseSnap.data();
    if (c.authorUid !== request.auth.uid) {
      throw new HttpsError('permission-denied', 'You can only analyze your own cases.');
    }

    const userPrompt =
      `Title: ${c.title}\nCategory: ${c.category}\nDisease Tags: ${(c.diseaseTags || []).join(', ')}\n` +
      `Description: ${c.description}`;

    const raw = await callGroq(SYSTEM_PROMPT, userPrompt, model);
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      throw new HttpsError('internal', 'AI returned an invalid response.');
    }

    const reportRef = db.collection('aiReports').doc();
    const report = {
      id: reportRef.id,
      caseId,
      createdAt: new Date().toISOString(),
      model,
      aiResponse: parsed.summary || raw,
      structured: {
        summary: parsed.summary || '',
        differentials: parsed.differentials || [],
        recommendations: parsed.recommendations || [],
        redFlags: parsed.redFlags || [],
        questionsToClinician: parsed.questionsToClinician || [],
      },
    };
    await reportRef.set(report);
    await caseRef.update({ aiReportId: report.id });
    return report;
  },
);

exports.onCaseCommentCreated = onDocumentCreated(
  { document: 'comments/{commentId}' },
  async (event) => {
    const comment = event.data?.data();
    if (!comment || !comment.caseId) return;
    const caseSnap = await db.collection('cases').doc(comment.caseId).get();
    if (!caseSnap.exists) return;
    const c = caseSnap.data();
    if (!c || c.authorUid === comment.authorUid) return;
    await db.collection('notifications').add({
      userId: c.authorUid,
      type: 'comment',
      caseId: comment.caseId,
      caseTitle: c.title,
      message: `${comment.authorName} commented on your case "${c.title}"`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  },
);
