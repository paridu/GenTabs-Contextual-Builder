import { GoogleGenAI } from "@google/genai";
import { AppSchema, AppType, TabContext } from "../types";
import { SYSTEM_PROMPT } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAppFromContext = async (
  tabs: TabContext[],
  userQuery: string
): Promise<AppSchema> => {
  const ai = getClient();
  
  const contextString = tabs.map(t => `[ID: ${t.id}] Title: ${t.title}\nContent: ${t.content}\nURL: ${t.url}`).join('\n---\n');
  
  const prompt = `
Context Data:
${contextString}

User Query: "${userQuery}"

Based on the context and user query, generate a JSON configuration for the most suitable ephemeral app.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json"
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }

  try {
    const result = JSON.parse(text) as AppSchema;
    return {
        ...result,
        createdAt: Date.now()
    };
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Failed to generate app configuration");
  }
};

export const refineAppWithChat = async (
  currentApp: AppSchema,
  chatHistory: { role: string; content: string }[],
  newInstruction: string
): Promise<AppSchema> => {
    const ai = getClient();

    const prompt = `
    Current App Config: ${JSON.stringify(currentApp)}
    
    User Chat History: ${JSON.stringify(chatHistory)}
    
    New Instruction: "${newInstruction}"
    
    Update the app configuration JSON based on the new instruction. Keep the same structure. 
    Modify 'data', 'title', or 'description' as needed.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: "application/json"
        }
    });

    const text = response.text;
     if (!text) {
        throw new Error("No response from Gemini");
    }

    try {
        return {
            ...JSON.parse(text),
            createdAt: Date.now() // Update timestamp to force re-render if needed
        };
    } catch (e) {
        throw new Error("Refinement failed");
    }
}