import OpenAI from 'openai';

let openaiClient;

export function initializeOpenAI(apiKey) {
    if (!openaiClient && apiKey) {
        try {
            console.log("OpenAI Logic: Initializing OpenAI client (ESM)...");
            openaiClient = new OpenAI({
                apiKey: apiKey,
                baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
                basePath: "/chat/completions"
             });
            console.log("OpenAI Logic: OpenAI client initialized.");
        } catch (initError) { console.error("OpenAI Logic: FAILED:", initError); openaiClient = null; }
    } else if (!apiKey) { console.error("OpenAI Logic: API key missing."); openaiClient = null; }
    return openaiClient;
}

export async function getSummaryFromOpenAI(articleContent, apiKey) {
    const client = initializeOpenAI(apiKey);
    if (!client) { throw new Error("AI Client not initialized."); }
    const systemPrompt = "Summarize news articles concisely in 2-3 sentences.";
    const userPrompt = `Summarize:\n\n"${articleContent}"`;
    try {
        console.log("OpenAI Logic: Sending summarization request...");
        const completion = await client.chat.completions.create({
            model: "gemini-2.0-flash-exp", 
            messages: [ { role: "system", content: systemPrompt }, { role: "user", content: userPrompt } ],
            temperature: 0.5, max_tokens: 150,
        });
        const summary = completion.choices[0]?.message?.content?.trim() || "Could not generate summary.";
        console.log("OpenAI Logic: Summary generated.");
        return summary;
    } catch (error) { console.error('Error calling API for summary:', error); throw error; }
}

// --- ADD analyzeSearchResults function ---
export async function analyzeSearchResults(claim, searchResultsText, apiKey) {
    const client = initializeOpenAI(apiKey);
    if (!client) { throw new Error("AI Client not initialized."); }

    // --- ENHANCED PROMPT ---
    const systemPrompt = `You are a precise and neutral fact-checking assistant.
    Analyze the user's claim based *only* on the provided DuckDuckGo search results.
    Follow these steps strictly:
    1. Review the User Claim: "${claim}"
    2. Analyze the provided DuckDuckGo Search Results.
    3. **Invalid Claim Check:** If the User Claim is gibberish, random characters (e.g., "asdasd"), nonsensical, clearly not a verifiable factual statement, or contains harmful content, respond ONLY with the exact text: "**Invalid Claim:** Your request could not be processed. Please provide a clear, factual statement or question for fact-checking." Do not proceed further.
    4. **Verdict Determination:** If the claim is verifiable, determine a verdict based *strictly* on the search results: True, False, Partially True/False, or Unverifiable.
    5. **Formatted Response:** Structure your response EXACTLY as follows, using double newlines between sections:

    **Verdict:** [Your Verdict Here - e.g., True, False, Partially True/False, Unverifiable]
    **Summary:** [A 1-2 sentence professional concluding statement incorporating the user's claim and the verdict. Example: "Based on the provided search results, the claim that 'X happened' appears True."]
    **Explanation:** [A brief explanation (2-4 sentences) supporting the verdict. Do NOT include source numbers directly in this text.]
    **Based on Sources:** [List only the numbers of the search results used to reach the conclusion, separated by commas. Example: "1, 4, 5" or "2" or "None" if no specific results were conclusive.]

    **Important:**
    *   Do NOT use Markdown formatting like **bold** or *italics*.
    *   Do NOT include hyperlinks in your response.
    *   If search results indicated an error (e.g., contained "Error during search"), the Verdict *must* be "Unverifiable", the Summary should state this, the Explanation should mention the search issue, and Sources Used should be "N/A".

    DuckDuckGo Search Results (Use these numbers for 'Sources Used'):
    ${searchResultsText}`; 

    const userPrompt = `Fact-check the claim based on the provided search results.`;
    // --- END ENHANCED PROMPT ---

    try {
        console.log("OpenAI Logic: Sending fact-check request...");
        const completion = await client.chat.completions.create({
            model: "gemini-2.0-flash-exp",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.2, // Lower temperature for fact-checking
            max_tokens: 500, // Allow enough space for explanation
        });

        let analysis = completion.choices[0]?.message?.content?.trim() || "Could not perform analysis.";
        console.log("OpenAI Logic: Analysis received.");

        // Check if the primary response is just "Invalid"
        if (analysis.trim().toLowerCase() === 'invalid') {
             console.log("OpenAI Logic: Claim deemed invalid.");
             return "Invalid Claim: Please provide a meaningful statement to check.";
        }

        return analysis; // Return the analysis text

    } catch (error) {
        console.error('OpenAI Logic: Error calling API for fact-check:', error);
         if (error?.status) { // Check if it looks like an APIError
             throw error; // Re-throw specific error if identifiable
         }
        else { throw new Error(`Failed analysis: ${error.message || 'Unknown error'}`); }
    }
}