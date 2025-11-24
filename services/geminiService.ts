import { GoogleGenAI, Type } from "@google/genai";
import { Tool } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface AIRecommendation {
  toolId: string;
  reason: string;
}

export const getToolRecommendations = async (
  projectDescription: string, 
  availableTools: Tool[]
): Promise<AIRecommendation[]> => {
  if (!apiKey) {
    console.warn("API Key missing for Gemini");
    return [];
  }

  try {
    // Simplify the tool list for the model to save tokens and focus on relevance
    const catalog = availableTools.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category
    }));

    const modelId = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `I have a catalog of tools: ${JSON.stringify(catalog)}. 
      
      The user wants to do the following project: "${projectDescription}".
      
      Recommend up to 3 specific tools from the catalog that are essential for this project.
      Explain briefly why each tool is needed.
      
      Return the result as a JSON object with a property 'recommendations' which is an array of objects containing 'toolId' and 'reason'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  toolId: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ['toolId', 'reason']
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];

    const json = JSON.parse(text);
    return json.recommendations || [];

  } catch (error) {
    console.error("Error fetching recommendations from Gemini:", error);
    return [];
  }
};