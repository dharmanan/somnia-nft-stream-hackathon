
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateDescription = async (title: string, creator: string): Promise<string> => {
  if (!API_KEY) {
    return "Gemini API key is not configured. This is a placeholder description for the magnificent artwork.";
  }

  try {
    const prompt = `You are a world-class art critic for an NFT auction house. Write a short, evocative, and compelling auction description for an NFT titled "${title}" by the artist "${creator}". Describe the potential mood and story behind the artwork. Keep it under 60 words. Do not use markdown or formatting.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    return `An evocative piece titled "${title}" by ${creator}, blending classical themes with a futuristic vision. This artwork challenges perceptions and invites deep contemplation.`;
  }
};
   