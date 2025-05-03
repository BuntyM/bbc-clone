import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import handleSummarizationRequest from './src/api/summarize.js';
import handleFactCheckRequest from './src/api/factCheck.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) { console.warn("!!! WARNING: OPENAI_API_KEY not set..."); }

app.use(cors());
app.use(express.json());

// --- API Routes ---
app.post('/api/summarize', (req, res) => {
    try { handleSummarizationRequest(req, res, apiKey); }
    catch (error) { console.error("Unhandled error in /api/summarize:", error); if (!res.headersSent) { res.status(500).json({ error: "Internal server error." }); } }
});

app.post('/api/fact-check', (req, res) => {
    try { handleFactCheckRequest(req, res, apiKey); }
    catch (error) { console.error("Unhandled error in /api/fact-check:", error); if (!res.headersSent) { res.status(500).json({ error: "Internal server error." }); } }
});


// --- Serve Static Files ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, 'dist');

console.log(`Serving static files from: ${buildPath}`);
app.use(express.static(buildPath));

// --- SPA Fallback ---
// <<< CHANGE '*' TO '*path' (or any other name) >>>
app.get('*path', (req, res) => {
    if (!req.path.startsWith('/api/')) { console.log(`[${new Date().toISOString()}] SPA Fallback triggered for: ${req.path}`); }
    const indexPath = path.resolve(buildPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) { console.error(`Error sending SPA file (${indexPath}):`, err); if (!res.headersSent) { res.status(500).send('Error serving application.'); } }
    });
});

// --- Start Server ---
app.listen(port, () => { console.log(`Production server running and listening on port ${port}`); });

// --- Process Signals ---
process.on('SIGINT', () => { console.log("SIGINT received..."); process.exit(0); });
process.on('SIGTERM', () => { console.log("SIGTERM received..."); process.exit(0); });