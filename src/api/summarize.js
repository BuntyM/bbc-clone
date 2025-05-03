import { getSummaryFromOpenAI } from '../server/openaiLogic.js'; // Use ESM import

// Helper to Send JSON Response (using Node http response)
function sendJsonResponse(res, statusCode, data) {
    if (typeof res?.setHeader !== 'function' || typeof res?.writeHead !== 'function' || typeof res?.end !== 'function') { console.error("Summarize API Route: Invalid 'res' object."); return; }
    if (res.writableEnded) { console.warn("Summarize API Route: Response already ended."); return; }
    try { res.setHeader('Content-Type', 'application/json'); res.writeHead(statusCode); res.end(JSON.stringify(data)); }
    catch (e) { console.error("Summarize API Route: Error sending JSON response:", e); if (!res.writableEnded) { try { res.statusCode = 500; res.end(JSON.stringify({ error: "Failed to send." })); } catch (fe) {} } }
}

// --- Main Handler Function (Exported using export default) ---
export default async function handleSummarizationRequest(req, res, apiKey) {
    try {
        // <<< Access req.body directly (populated by express.json() middleware) >>>
        const { articleContent, articleId } = req.body || {}; // Use || {} as fallback

        // Check if body was parsed correctly
        if (!req.body) {
            console.error("Summarize API Route: req.body is missing. JSON middleware might have failed.");
            return sendJsonResponse(res, 400, { error: "Could not parse request body." });
        }

        // Validate inputs
        if (!apiKey) { return sendJsonResponse(res, 500, { error: "API Key missing." }); }
        if (!articleContent) { return sendJsonResponse(res, 400, { error: "articleContent is required." }); }

        console.log(`Summarize API Route: Handling request for article: ${articleId || '?'}`);

        // Call the OpenAI logic
        const summary = await getSummaryFromOpenAI(articleContent, apiKey);
        sendJsonResponse(res, 200, { summary: summary });

    } catch (error) { // Catch errors from getSummaryFromOpenAI
        console.error('Summarize API Route: Error during handling:', error);
        // Handle specific OpenAI errors
        if (error?.status === 429) { sendJsonResponse(res, 429, { error: "API rate limit exceeded." }); }
        else if (error?.status === 401 || error?.message?.includes('Incorrect API key')) { sendJsonResponse(res, 401, { error: "Invalid API Key." }); }
        // Generic error
        else { sendJsonResponse(res, 500, { error: error?.message || 'Failed to generate summary.' }); }
    }
}