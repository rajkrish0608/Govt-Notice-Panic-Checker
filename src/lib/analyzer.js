import { sanitizeLanguage } from './languageGuard';

/**
 * Analyzes the input text by calling the secure Backend API.
 * @param {string} text - The raw text from the notice.
 * @returns {Promise<object>} - Structured analysis result.
 */
export async function analyzeNotice(text) {
    if (!text || text.trim().length < 5) {
        return createErrorResult("Text is too short. Please provide more details.");
    }

    try {
        const response = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();

        // Double-sanitization on client side (Safety Layer 2)
        return {
            ...data,
            summary: sanitizeLanguage(data.summary),
            action: sanitizeLanguage(data.action),
            nextSteps: data.nextSteps ? data.nextSteps.map(s => sanitizeLanguage(s)) : []
        };

    } catch (error) {
        console.error("Analysis Failed:", error);
        return createErrorResult("We could not reach the analysis server. Please ensure the backend is running.");
    }
}

function createErrorResult(msg) {
    return {
        type: "CONNECTION ERROR",
        seriousness: "LOW",
        confidence: "LOW",
        summary: msg,
        action: "Check your internet connection or try again later.",
        nextSteps: [],
        deadlines: "",
        redFlags: null
    };
}
