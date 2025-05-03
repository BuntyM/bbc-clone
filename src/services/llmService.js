const API_BASE = '/api';
const SUMMARIZE_ENDPOINT = `${API_BASE}/summarize`;
const FACTCHECK_ENDPOINT = `${API_BASE}/fact-check`;

export const summarizeArticle = async (articleContent, articleId) => {
    console.log(`[llmService] Sending content for article ${articleId} to ${SUMMARIZE_ENDPOINT}...`);
    // Log the content being sent (first 100 chars)
    console.log(`[llmService] Content Snippet: "${(articleContent || '').substring(0, 100)}..."`);
    if (!articleContent) {
         console.warn("[llmService] No articleContent provided for summarization.");
         return "Failed: No content provided."; // Early exit if no content
    }

    try {
        const response = await fetch(SUMMARIZE_ENDPOINT, {
             method: 'POST',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({ articleContent, articleId }) // Ensure content is stringified
        });
        console.log(`[llmService] Response status for ${articleId}: ${response.status}`);

        // Try getting text first for better error messages on non-JSON responses
        const responseText = await response.text();
        let responseData;
        try {
            responseData = JSON.parse(responseText); // Try parsing JSON
        } catch (e) {
             console.error("[llmService] Failed to parse JSON response:", responseText);
            // Throw error with the raw text if parsing failed
             throw new Error(`Received non-JSON response: ${response.status} ${response.statusText}`);
        }


        if (!response.ok) {
            // Use error from parsed JSON or status text
            const errorMsg = responseData.error || `HTTP error! status: ${response.status} ${response.statusText}`;
            console.error("[llmService] Summarization API error:", errorMsg);
            throw new Error(errorMsg);
        }

        console.log(`[llmService] Received summary for article ${articleId}:`, responseData.summary);
        return responseData.summary || "Summary not available."; // Return summary or default

    } catch (error) {
        console.error('[llmService] Failed summary fetch/process:', error);
        // Return the specific error message
        return `Failed: ${error.message || 'Network error or invalid response'}`;
    }
};



export const factCheckClaim = async (claim) => {
    console.log(`Sending claim "${claim}" to ${FACTCHECK_ENDPOINT}...`);
    try {
        const response = await fetch(FACTCHECK_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ claim }),
        });
        const responseData = await response.json();

        if (!response.ok) {
            const errorMsg = responseData.error || `Request failed: ${response.status}`;
            console.error("Fact-check API error:", errorMsg);
            throw new Error(errorMsg);
        }
        console.log(`Received fact-check analysis for claim "${claim}"`);
        return responseData;

    } catch (error) {
        console.error('Failed to fetch or process fact-check:', error);
        throw error; // Re-throw error
    }
};