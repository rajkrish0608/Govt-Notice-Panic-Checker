import { sanitizeLanguage } from './languageGuard.js';
import { KEYWORDS, CONFIDENCE_LEVELS } from './constants.js';

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

        let data = await response.json();

        // 1. SCAM OVERRIDE RULE (Safety)
        if (detectScamIndicators(text) || data.type === 'SUSPICIOUS_MESSAGE' || data.type === 'SCAM') {
            data = applyScamOverride(data);
        } else {
            // 2. CONFIDENCE SCORE CONSISTENCY (Reliability)
            // Re-calculate confidence based on client-side keyword matches to ensure strict logic
            const calculatedConfidence = calculateClientConfidence(text);

            // If notice is ambiguous (OTHER type), FORCE LOW Confidence regardless of AI opinion
            if (data.type === 'OTHER' || data.type === 'UNKNOWN') {
                data.confidence = CONFIDENCE_LEVELS.LOW;
            } else {
                // Trust the stricter of the two (Client Rule vs AI)
                // If Client says HIGH (lots of matches), we trust it.
                // If Client says LOW (<2 matches), we force LOW to be safe against hallucination.
                if (calculatedConfidence === CONFIDENCE_LEVELS.LOW) {
                    data.confidence = CONFIDENCE_LEVELS.LOW;
                } else if (calculatedConfidence === CONFIDENCE_LEVELS.HIGH) {
                    data.confidence = CONFIDENCE_LEVELS.HIGH;
                }
            }
        }

        // 2. STRICT FORMAT ENFORCEMENT & ABSOLUTE REMOVAL
        // Ensure all 8 sections exist and legal absolutes are removed.
        const sanitizedData = validateAndFixOutput(data);

        return sanitizedData;

    } catch (error) {
        console.error("Analysis Failed:", error);
        return createErrorResult("We could not reach the analysis server. Please ensure the backend is running.");
    }
}

/**
 * Enforces the 8-section output format and sanitizes language.
 */
function validateAndFixOutput(data) {
    const fixed = {
        type: data.type || "OTHER",
        seriousness: data.seriousness || "MEDIUM", // Default to caution
        confidence: data.confidence || "LOW",
        summary: sanitizeLanguage(data.summary) || "Explanation not provided.",
        action: sanitizeLanguage(data.action) || "Verify this notice carefully.",
        nextSteps: Array.isArray(data.nextSteps) && data.nextSteps.length > 0
            ? data.nextSteps.map(s => sanitizeLanguage(s))
            : ["Verify the sender identity.", "Check official portal.", "Consult an expert if unsure."],
        deadlines: data.deadlines || "Not mentioned in the notice",
        redFlags: data.redFlags
            ? sanitizeLanguage(data.redFlags) // Sanitize red flags too
            : null
    };

    // Ensure strictly 3 Next Steps (Pad if needed)
    while (fixed.nextSteps.length < 3) {
        fixed.nextSteps.push("Keep a copy for your records.");
    }
    // Trim if > 3 (Optional, but keeps UI clean)
    if (fixed.nextSteps.length > 3) {
        fixed.nextSteps = fixed.nextSteps.slice(0, 3);
    }

    // Fix Specific Heading Issues (Mapping Backend fields to UI expectations if mismatch)
    // (Our UI ResultCard expects keys: type, seriousness, confidence, summary, action, nextSteps, deadlines, redFlags)
    // This function ensures those keys are populated.

    return fixed;
}

/**
 * Checks for client-side scam triggers as a failsafe.
 */
function detectScamIndicators(text) {
    const triggers = ['lottery', 'won', 'click here', 'bit.ly', 'paytm', 'upi://', 'claim reward', 'winner'];
    return triggers.some(t => text.toLowerCase().includes(t));
}

/**
 * Forces safe values for scam notices.
 */
function applyScamOverride(data) {
    return {
        ...data,
        type: 'SUSPICIOUS_MESSAGE',
        seriousness: 'MEDIUM', // Never HIGH for scams (prevents panic)
        confidence: 'HIGH',    // We are confident it's a scam
        summary: "This message contains patterns typical of scams/phishing (e.g., rewards, urgent payment links).",
        action: "Do not interact with the sender or click any links.",
        redFlags: data.redFlags || "Urgent request for money / Unverified link / Promise of free money",
        nextSteps: [
            "Block the sender immediately.",
            "Do not share any OTP or Password.",
            "Report to cyber crime portal if needed."
        ]
    };
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

/**
 * strict confidence logic:
 * HIGH -> >=6 keyword matches
 * MEDIUM -> 3-5 matches
 * LOW -> <=2 matches
 */
function calculateClientConfidence(text) {
    const cleanText = text.toLowerCase();
    let totalMatches = 0;

    // Count matches across all categories
    Object.values(KEYWORDS).forEach(keywordList => {
        keywordList.forEach(k => {
            if (cleanText.includes(k)) totalMatches++;
        });
    });

    if (totalMatches >= 6) return CONFIDENCE_LEVELS.HIGH;
    if (totalMatches >= 3) return CONFIDENCE_LEVELS.MEDIUM;
    return CONFIDENCE_LEVELS.LOW;
}
