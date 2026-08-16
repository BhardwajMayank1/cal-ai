const { GoogleGenAI } = require('@google/genai');
const Groq = require('groq-sdk');
const { z } = require('zod');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const nutritionSchema = z.object({
  foodName: z.string(),
  portionEstimate: z.string(),
  confidence: z.number().min(0).max(1),
  nutrition: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    fiber: z.number().optional(),
    sugar: z.number().optional(),
  }),
});

const PROMPT = `Identify the food in this image and estimate its nutrition.
Respond with ONLY valid JSON, no other text, matching exactly this shape:
{
  "foodName": string,
  "portionEstimate": string (e.g. "1 plate (~300g)"),
  "confidence": number between 0 and 1,
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number,
    "sugar": number
  }
}`;

function parseAndValidate(rawText) {
  const cleaned = rawText.replace(/```json|```/g, '').trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error('AI returned invalid JSON: ' + rawText);
  }
  const validated = nutritionSchema.parse(parsed);
  return { ...validated, rawAiResponse: parsed };
}

// --- Gemini call ---
async function callGemini(imageUrl) {
  const imgResponse = await fetch(imageUrl);
  const arrayBuffer = await imgResponse.arrayBuffer();
  const base64Image = Buffer.from(arrayBuffer).toString('base64');
  const mimeType = imgResponse.headers.get('content-type') || 'image/jpeg';

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: [
      { inlineData: { mimeType, data: base64Image } },
      { text: PROMPT },
    ],
  });

  return parseAndValidate(response.text);
}

// --- Groq fallback call ---
async function callGroq(imageUrl) {
  const completion = await groq.chat.completions.create({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: PROMPT },
          { type: 'image_url', image_url: { url: imageUrl } }, // Groq accepts a URL directly
        ],
      },
    ],
  });

  const rawText = completion.choices[0].message.content;
  return parseAndValidate(rawText);
}

// --- Main entry point: tries Gemini, falls back to Groq on 503 ---
async function analyzeFoodImage(imageUrl) {
  try {
    return await callGemini(imageUrl);
  } catch (err) {
    const is503 =
      err.status === 503 ||
      err.message?.includes('503') ||
      err.message?.includes('UNAVAILABLE') ||
      err.message?.includes('overloaded');

    if (!is503) {
      throw err; // some other error (bad JSON, auth failure, etc.) — don't mask it, just fail
    }

    console.warn('Gemini overloaded (503) — falling back to Groq');
    try {
      return await callGroq(imageUrl);
    } catch (groqErr) {
      throw new Error(`Both providers failed. Gemini: 503. Groq: ${groqErr.message}`);
    }
  }
}

module.exports = { analyzeFoodImage };