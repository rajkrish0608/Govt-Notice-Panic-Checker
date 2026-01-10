/**
 * Replaces aggressive or panic-inducing words with calm, objective terminology.
 * @param {string} text - The raw output text to sanitize.
 * @returns {string} - The calm version of the text.
 */
export function sanitizeLanguage(text) {
    if (!text) return "";

    const replacements = [
        { regex: /arrest/gi, replacement: 'legal proceedings' },
        { regex: /jail/gi, replacement: 'strict legal outcomes' },
        { regex: /severe punishment/gi, replacement: 'potential regulatory action' },
        { regex: /seize/gi, replacement: 'hold' },
        { regex: /raid/gi, replacement: 'official inspection' },
        { regex: /panic/gi, replacement: 'concern' },
        { regex: /urgent/gi, replacement: 'time-sensitive' },
        { regex: /immediately/gi, replacement: 'promptly' },
        { regex: /defaulter/gi, replacement: 'non-compliant' },
        { regex: /criminal/gi, replacement: 'legal' }
    ];

    let calmText = text;
    replacements.forEach(({ regex, replacement }) => {
        calmText = calmText.replace(regex, replacement);
    });

    return calmText;
}

/**
 * Checks if the content implies a highly threatening situation that needs modulation.
 * @param {string} text 
 * @returns {boolean}
 */
export function needsCalming(text) {
    const panicWords = ['arrest', 'jail', 'raid', 'seize', 'severe'];
    return panicWords.some(word => text.toLowerCase().includes(word));
}
