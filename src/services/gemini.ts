// SECURITY NOTE: GEMINI_API_KEY is exposed client-side via vite.config.ts define.
// This is acceptable for local demo / AI Studio deploys. For a public production
// deployment the key must be proxied through a backend — anyone opening DevTools
// can otherwise read and exfiltrate it.

import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const client = apiKey ? new GoogleGenAI({ apiKey }) : null;

let lastCallAt = 0;
const MIN_INTERVAL_MS = 2000;

export function isGeminiAvailable(): boolean {
  return client !== null;
}

export async function generateText(prompt: string, system?: string): Promise<string> {
  if (!client) throw new Error('Gemini not configured');
  const now = Date.now();
  if (now - lastCallAt < MIN_INTERVAL_MS) {
    throw new Error('Хэт хурдан хүсэлт. Түр хүлээнэ үү.');
  }
  lastCallAt = now;
  const res = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: system ? { systemInstruction: system } : undefined,
  });
  return res.text ?? '';
}
