import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { llmService } from './services/llm.js';
import logger from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: "Too many requests, please try again later." }
});
app.use('/api/', limiter);

// CORS with strictly defined origin
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

// Input Validation Schema
const analyzeSchema = z.object({
    text: z.string().min(10, "Text must be at least 10 characters long").max(5000, "Text is too long")
});

// Routes
app.post('/api/analyze', async (req, res, next) => {
    try {
        const validation = analyzeSchema.safeParse(req.body);

        if (!validation.success) {
            const errorMessage = validation.error?.errors?.[0]?.message || "Invalid input data";

            logger.warn(`Validation Error: ${errorMessage}`);
            return res.status(400).json({ error: errorMessage });
        }

        const { text } = validation.data;
        logger.info('Analyzing text...');

        // Call the AI Service
        const analysis = await llmService.analyzeText(text);

        return res.json(analysis);

    } catch (error) {
        next(error); // Pass to error handler
    }
});

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        mode: process.env.LLM_API_KEY ? 'LIVE_AI' : 'MOCK_AI',
        uptime: process.uptime()
    });
});

// Global Error Handler
app.use(errorHandler);

// Serve Static Files (Production)
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'dist')));

    // SPA Catch-all (Regex to avoid path-to-regexp errors)
    app.get(/.*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
}

// Start Server
app.listen(PORT, () => {
    logger.info(`✅ Backend Server running on http://localhost:${PORT}`);
    logger.info(`   - API Endpoint: http://localhost:${PORT}/api/analyze`);
});
