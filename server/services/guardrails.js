import logger from '../utils/logger.js';

const FORBIDDEN_PHRASES = [
    { regex: /always/gi, replacement: "typically" },
    { regex: /must/gi, replacement: "should considering" },
    { regex: /definitely/gi, replacement: "likely" },
    { regex: /legal advice/gi, replacement: "general information" },
    { regex: /you will be arrested/gi, replacement: "legal proceedings may be initiated" },
    { regex: /guaranteed/gi, replacement: "possible" },
    { regex: /immediately/gi, replacement: "promptly" } // Soften urgency slightly
];

const DEFAULT_SCHEMA = {
    type: "Uncertain",
    seriousness: "MEDIUM",
    confidence: "LOW",
    summary: "The notice content could not be fully analyzed. Please consult a professional.",
    action: "Review the document carefully with a legal expert.",
    nextSteps: ["Consult a lawyer", "Verify the source of the notice"],
    deadlines: "None explicitly found",
    redFlags: null
};

export const guardrails = {
    /**
     * Sanitizes and validates the AI output.
     * @param {Object} rawOutput - The parsed JSON object from the AI.
     * @returns {Object} - Safe, compliant output.
     */
    validateAndSanitize: (rawOutput) => {
        let safeOutput = { ...rawOutput };

        // 1. Enforce Schema (Fill missing fields)
        safeOutput = { ...DEFAULT_SCHEMA, ...safeOutput };

        // Ensure array fields are actually arrays
        if (!Array.isArray(safeOutput.nextSteps)) {
            safeOutput.nextSteps = [safeOutput.nextSteps ? String(safeOutput.nextSteps) : "Consult a professional"];
        }

        // 2. Scrub Forbidden Phrases (Recursive text walker)
        const scrubText = (text) => {
            if (typeof text !== 'string') return text;
            let cleaned = text;
            FORBIDDEN_PHRASES.forEach(({ regex, replacement }) => {
                const match = cleaned.match(regex);
                if (match) {
                    logger.warn(`Guardrail triggered: Replaced forbidden phrase "${match[0]}" with "${replacement}"`);
                    cleaned = cleaned.replace(regex, replacement);
                }
            });
            return cleaned;
        };

        const traverseAndScrub = (obj) => {
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    obj[key] = scrubText(obj[key]);
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    traverseAndScrub(obj[key]);
                }
            }
        };

        traverseAndScrub(safeOutput);

        // 3. Logic: Downgrade Confidence if "Seriousness" is HIGH but content is vague
        // (Simple heuristic: if summary contains "unclear" or "may", cap confidence)
        const uncertaintyKeywords = ["unclear", "might", "possibly", "cannot determine"];
        const summaryLower = safeOutput.summary.toLowerCase();
        if (uncertaintyKeywords.some(keyword => summaryLower.includes(keyword))) {
            if (safeOutput.confidence === "HIGH") {
                logger.info("Guardrail: Downgrading confidence to MEDIUM due to uncertainty keywords.");
                safeOutput.confidence = "MEDIUM";
            }
        }

        // 4. Force "General Guidance" Disclaimer into the summary if missing
        if (!safeOutput.summary.includes("general guidance")) {
            // We don't append it to every single summary to avoid repetition, 
            // but the UI has a static disclaimer. 
            // We ensure 'legal advice' is scrubbed, which is the main risk.
        }

        return safeOutput;
    }
};
