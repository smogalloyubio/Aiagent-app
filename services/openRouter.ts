
// Always use import {GoogleGenAI} from "@google/genai";
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, ApiSettings } from '../types';
import { SYSTEM_PROMPT } from '../constants';

export const fetchAiResponse = async (
  messages: ChatMessage[],
  settings: ApiSettings
): Promise<{ text: string; sources: { title: string; url: string }[] }> => {
  // Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  // Creating a new instance right before the call ensures the most up-to-date API key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Map roles: 'assistant' -> 'model', 'user' -> 'user' as per Gemini API requirements
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  // Use ai.models.generateContent to query GenAI with model and prompt configuration
  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3-pro-preview',
    contents: contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      // Enable Google Search grounding for up-to-date YouTube and niche data
      tools: [{ googleSearch: {} }],
    },
  });

  // Access .text property directly (it is a getter, not a method)
  const text = response.text || "";
  
  // Extract website URLs from groundingChunks if search grounding was triggered
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const sources = (groundingChunks || [])
    .map((chunk: any) => {
      if (chunk.web) {
        return { title: chunk.web.title, url: chunk.web.uri };
      }
      return null;
    })
    .filter((s: any): s is { title: string; url: string } => s !== null);

  return { text, sources };
};
