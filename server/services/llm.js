import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from '../prompts.js';
import logger from '../utils/logger.js';
import { guardrails } from './guardrails.js';

/**
 * Service to handle LLM interactions.
 * Now using REAL Gemini 1.5 Flash API.
 */
export const llmService = {
    analyzeText: async (text, imageData = null) => {
        logger.info("🤖 LLM Service received input for analysis...");

        // FAIL-SAFE FALLBACK RESPONSE
        const FALLBACK_RESPONSE = {
            type: "Uncertain",
            seriousness: "MEDIUM",
            confidence: "LOW",
            summary: "The notice could not be reliably analyzed. Verification is recommended.",
            action: "Consult a professional to verify this document.",
            nextSteps: ["Do not panic", "Verify the source", "Consult a legal expert"],
            deadlines: "None found",
            redFlags: null
        };

        if (!process.env.LLM_API_KEY) {
            logger.error("LLM_API_KEY is missing");
            return FALLBACK_RESPONSE;
        }

        try {
            const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);
            // Use gemini-1.5-flash for vision capabilities
            // Use gemini-1.5-flash-latest for availability
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

            const textPart = SYSTEM_PROMPT + `\n\nAnalyze this notice text:\n"${text}"`;

            let promptParts = [textPart];

            if (imageData) {
                logger.info("📎 Attaching image to analysis request");
                // Gemini API expects 'inlineData' for base64 images
                promptParts.push({
                    inlineData: {
                        data: imageData.base64,
                        mimeType: imageData.mimeType
                    }
                });
            }

            const result = await model.generateContent(promptParts);

            const response = await result.response;
            let textResponse = response.text();

            // Clean up markdown formatting
            textResponse = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();

            let parsedResult;
            try {
                parsedResult = JSON.parse(textResponse);
            } catch (parseError) {
                logger.error(`JSON Parse Error: ${parseError.message}`);
                // If AI returns bad JSON, strictly return fallback
                return FALLBACK_RESPONSE;
            }

            // Apply Safety Guardrails
            // Should never throw, but if it does, the outer catch handles it.
            const safeResult = guardrails.validateAndSanitize(parsedResult);

            return safeResult;

        } catch (error) {
            logger.error(`Gemini API/Pipeline Error: ${error.message}`);
            // Global Kill Switch: Return safe fallback on ANY error
            return FALLBACK_RESPONSE;
        }
    }
};
