import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from '../prompts.js';

/**
 * Service to handle LLM interactions.
 * Now using REAL Gemini 1.5 Flash API.
 */
export const llmService = {
    analyzeText: async (text) => {
        console.log("🤖 LLM Service received text for analysis...");

        if (!process.env.LLM_API_KEY) {
            throw new Error("LLM_API_KEY is missing in environment variables");
        }

        try {
            const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

            const result = await model.generateContent({
                contents: [
                    { role: "user", parts: [{ text: SYSTEM_PROMPT + `\n\nAnalyze this notice text:\n"${text}"` }] }
                ]
            });

            const response = await result.response;
            let textResponse = response.text();

            // Clean up markdown formatting if present (e.g. ```json ... ```)
            textResponse = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();

            return JSON.parse(textResponse);

        } catch (error) {
            console.error("Gemini API Error:", error);
            // Fallback to error object structure if AI fails
            return {
                type: "ERROR",
                seriousness: "MEDIUM",
                confidence: "LOW",
                summary: "The AI service encountered an error processing your request.",
                action: "Please try again later.",
                nextSteps: [],
                deadlines: "None",
                redFlags: null
            };
        }
    }
};
