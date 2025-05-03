import 'dotenv/config';

import { analyzeSearchResults } from '../server/openaiLogic.js';
import { MCPClient } from 'mcp-client';

// --- Helper to clean up env‐vars that might literally be "undefined" ---
function cleanEnvVar(val, fallback) {
  return (val && val !== 'undefined') ? val : fallback;
}

// --- MCP Client Setup ---
const mcpClient = new MCPClient({
  name: "BBCFactCheckerClient",
  version: "1.0.0"
});
let isMcpClientConnected = false;
let mcpConnectionPromise = null;

// Safely pull in your command + args
const mcpCommand = cleanEnvVar(
  process.env.DUCKDUCKGO_MCP_COMMAND,
  'npx'
);
const mcpArgsString = cleanEnvVar(
  process.env.DUCKDUCKGO_MCP_ARGS,
  '-y @oevortex/ddg_search'
);
const mcpArgs = mcpArgsString.trim().split(/\s+/);

// Connect (or reuse) the MCP stdio client
async function connectOrGetMcpClient() {
  if (isMcpClientConnected && mcpClient?.isConnected) {
    return mcpClient;
  }

  if (mcpConnectionPromise) {
    await mcpConnectionPromise;
    return isMcpClientConnected ? mcpClient : null;
  }

  mcpConnectionPromise = (async () => {
    console.log(`FactCheck Route: Attempting MCP connect → cmd="${mcpCommand}", args=${JSON.stringify(mcpArgs)}`);
    try {
      mcpClient.removeAllListeners();
      console.log('FactCheck Route: Spawning MCP process:', { cmd: mcpCommand, args: mcpArgs });
      await mcpClient.connect({
        type: "sse",
        command: mcpCommand,
        args: mcpArgs
      });
      console.log("FactCheck Route: Connected DDG MCP via stdio.");
      isMcpClientConnected = true;

      mcpClient.on("error", (err) => {
        console.error("[DDG MCP Error]:", err);
        isMcpClientConnected = false;
        mcpConnectionPromise = null;
      });
      mcpClient.on("close", () => {
        console.log("[DDG MCP Info]: Connection closed.");
        isMcpClientConnected = false;
        mcpConnectionPromise = null;
      });

      return mcpClient;
    } catch (error) {
      console.error("FactCheck Route: FAILED to connect/start DDG MCP.", error);
      isMcpClientConnected = false;
      mcpConnectionPromise = null;
      return null;
    }
  })();

  const client = await mcpConnectionPromise;
  mcpConnectionPromise = null;
  return client;
}

// --- Helper: Send JSON Response reliably ---
function sendJsonResponse(res, statusCode, data) {
  if (res.writableEnded) {
    console.warn("FactCheck Route: Response already ended.");
    return;
  }
  if (
    typeof res?.setHeader !== 'function' ||
    typeof res?.writeHead !== 'function' ||
    typeof res?.end !== 'function'
  ) {
    console.error("FactCheck Route: Invalid 'res' object.");
    return;
  }
  try {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(statusCode);
    res.end(JSON.stringify(data));
  } catch (e) {
    console.error("FactCheck Route: Error sending JSON:", e);
    if (!res.writableEnded) {
      try {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Send fail." }));
      } catch (fe) {
        // swallow
      }
    }
  }
}

// --- Main Handler ---
export default async function handleFactCheckRequest(req, res, apiKey) {
  console.log(`FactCheck Handler: START for ${req.url}`);
  try {
    const { claim } = req.body || {};
    console.log("FactCheck Handler: Accessed req.body, Claim:", claim);

    if (!req.body) {
      return sendJsonResponse(res, 400, { error: "Request body missing or not parsed." });
    }
    if (!apiKey) {
      return sendJsonResponse(res, 500, { error: "API Key missing." });
    }
    if (!claim) {
      return sendJsonResponse(res, 400, { error: "Claim is required in the request body." });
    }
    console.log("FactCheck Handler: Claim validated.");

    let searchResultsText = "Could not connect to search provider.";

    // 1️⃣ Connect to MCP & run DuckDuckGo search
    console.log("FactCheck Handler: Connecting/Getting MCP client...");
    const client = await connectOrGetMcpClient();
    console.log("FactCheck Handler: MCP Client received:", !!client);

    if (client) {
      try {
        console.log("FactCheck Handler: Calling DDG MCP 'search' tool...");
        const ddgResult = await client.callTool({
          name: "web-search",
          arguments: { query: claim, page: 1, numResults: 20 }
        });
        console.log("FactCheck Handler: DDG Search Raw Result:", ddgResult);

        if (typeof ddgResult === 'string') {
          searchResultsText = ddgResult;
        } else if (ddgResult?.content?.[0]?.type === 'text') {
          searchResultsText = ddgResult.content[0].text;
        } else {
          console.warn("Unexpected DDG result format:", ddgResult);
          searchResultsText = "Unexpected search format.";
        }

        console.log("FactCheck Handler: DDG MCP search successful.");
      } catch (ddgError) {
        console.error("Error calling DDG tool:", ddgError);
        searchResultsText = `Error during search: ${ddgError.message}`;
        if (ddgError.message?.toLowerCase().includes('closed')) {
          isMcpClientConnected = false;
        }
      }
    } else {
      console.error("FactCheck Handler: Skipping DDG search – connection failed.");
    }

    // 2️⃣ Run OpenAI analysis
    console.log("FactCheck Handler: Calling analyzeSearchResults...");
    const analysis = await analyzeSearchResults(claim, searchResultsText, apiKey);
    console.log("FactCheck Handler: Analysis received.", analysis);

    sendJsonResponse(res, 200, {
      analysis: analysis,
      search_results_used: searchResultsText
    });
    console.log("FactCheck Handler: Response sent.");

  } catch (error) {
    console.error("FactCheck Handler: Error during handling:", error);
    const status = error?.status || 500;
    let message = error?.message || 'Fact-check processing failed.';
    if (status === 429) message = "API rate limit exceeded.";
    else if (status === 401) message = "Invalid API Key.";

    if (!res.writableEnded) {
      sendJsonResponse(res, status, { error: message });
    }
  }
}
