import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import cors from 'cors';
import path from 'path';

// --- Vite Plugin for API Route Handling ---
const apiRouteHandlerPlugin = () => {
  let apiKey = null;
  let ddgCommand = null;
  let ddgArgs = null;

  return {
    name: 'vite-plugin-api-route-handler',
    config(config, { mode }) {
        const env = loadEnv(mode, process.cwd(), '');
        apiKey = env.GEMINI_API_KEY;
        ddgCommand = env.VITE_DUCKDUCKGO_MCP_COMMAND; // Load DDG command
        ddgArgs = env.VITE_DUCKDUCKGO_MCP_ARGS;       // Load DDG args
        // Set process.env vars so dynamically loaded module can access them
        process.env.VITE_DUCKDUCKGO_MCP_COMMAND = ddgCommand;
        process.env.VITE_DUCKDUCKGO_MCP_ARGS = ddgArgs;

        if (!apiKey) { console.warn('VITE CONFIG WARNING: API_KEY not found...'); }
        else { console.log('VITE CONFIG: API Key loaded.'); }
        if (!ddgCommand || !ddgArgs) { console.warn('VITE CONFIG WARNING: VITE_DUCKDUCKGO_MCP_COMMAND or ARGS not found...'); }
        else { console.log('VITE CONFIG: DuckDuckGo MCP command/args loaded.'); }
    },
    configureServer(server) {
        console.log('Configuring dev server middleware for API routes...');
        server.middlewares.use('/api', express.json());
        server.middlewares.use('/api', cors());

        server.middlewares.use('/api', async (req, res, next) => {
            const url = req.url?.split('?')[0];
            const method = req.method;
            let handlerPath = null;

            // --- ROUTING ---
            if (url === '/summarize' && method === 'POST') {
                handlerPath = path.resolve(server.config.root, 'src', 'api', 'summarize.js');
            } else if (url === '/fact-check' && method === 'POST') {
                handlerPath = path.resolve(server.config.root, 'src', 'api', 'factCheck.js');
            }
            // --- END ROUTING ---

            if (handlerPath) {
                console.log(`Middleware received ${method} ${req.originalUrl || req.url}`);
                try {
                    console.log(`Attempting to ssrLoadModule: ${handlerPath}`);
                    // <<< Use Vite's ssrLoadModule for ESM >>>
                    const module = await server.ssrLoadModule(handlerPath);

                    if (module.default && typeof module.default === 'function') {
                        console.log(`Handler module loaded successfully.`);
                        // Call the default export function
                        await module.default(req, res, apiKey);
                        // Handler MUST end the response using Node methods (via sendJsonResponse)
                        if (!res.writableEnded) { console.warn(`Handler for ${url} did not end response.`); res.statusCode = 500; res.end(JSON.stringify({ error:'Internal Handler Error'})); }
                    } else {
                        console.error(`Default export handler function not found in ${handlerPath}`);
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: `API handler not found` }));
                    }
                } catch (error) {
                    console.error(`Error executing handler or ssrLoadModule for ${url}:`, error);
                    if (!res.writableEnded) { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Internal Server Error processing API.' })); }
                }
            } else { next(); } // Pass other requests
        });
        console.log('Vite API route middleware configured.');
    }
  }
};

// --- Vite Config ---
export default defineConfig({
  plugins: [ react(), apiRouteHandlerPlugin() ],
  server: { port: 3000, open: true },
  build: { outDir: 'dist' }
});