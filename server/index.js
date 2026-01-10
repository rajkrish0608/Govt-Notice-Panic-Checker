import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { llmService } from './services/llm.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Header Security (Basic)
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
});

// Routes
app.post('/api/analyze', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.length < 5) {
            return res.status(400).json({ error: "Text is too short or missing." });
        }

        // Call the AI Service
        // In Phase 1, this hits the Mock. In Phase 2, it hits Gemini/DeepSeek.
        const analysis = await llmService.analyzeText(text);

        return res.json(analysis);

    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({
            error: "Internal Server Error",
            details: "The AI service is temporarily unavailable. Please try again."
        });
    }
});

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', mode: process.env.LLM_API_KEY ? 'LIVE_AI' : 'MOCK_AI' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Backend Server running on http://localhost:${PORT}`);
    console.log(`   - API Endpoint: http://localhost:${PORT}/api/analyze`);
});
