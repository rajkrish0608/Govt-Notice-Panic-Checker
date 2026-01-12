import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import bodyParser from 'body-parser';
import multer from 'multer';
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
    text: z.string().min(10, "Text must be at least 10 characters long").max(5000, "Text is too long").optional()
});

// Configure Multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDF files are allowed!'), false);
        }
    }
});

// Routes
app.post('/api/analyze', upload.single('file'), async (req, res, next) => {
    try {
        let textInput = req.body.text || "";
        let imageData = null;

        // 1. Handle File Uploads
        if (req.file) {
            logger.info(`Processing file: ${req.file.originalname} (${req.file.mimetype})`);

            if (req.file.mimetype === 'application/pdf') {
                // PDF Parsing
                try {
                    const pdfData = await pdf(req.file.buffer);
                    textInput += "\n\n[PDF CONTENT START]\n" + pdfData.text + "\n[PDF CONTENT END]";
                } catch (err) {
                    logger.error(`PDF Parsing Failed: ${err.message}`);
                    throw new Error("Failed to parse PDF file.");
                }
            } else if (req.file.mimetype.startsWith('image/')) {
                // Image Handling for Vision
                imageData = {
                    mimeType: req.file.mimetype,
                    base64: req.file.buffer.toString('base64')
                };
            }
        }

        // 2. Validation
        if (!textInput && !imageData) {
            return res.status(400).json({ error: "Please provide text or upload a file." });
        }

        // 3. AI Analysis
        logger.info('Sending content to AI...');
        const analysis = await llmService.analyzeText(textInput, imageData);

        return res.json(analysis);

    } catch (error) {
        // Multer Errors
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ error: `Upload error: ${error.message}` });
        }
        next(error); // Pass to global error handler
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
