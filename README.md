# BBC.com Clone - Outlier AI Level UP Vibe Coding Hackathon Project

## Project Overview

This project is a simplified clone of the popular news website, BBC.com. It was created as an entry for the **Outlier AI - Level UP Vibe Coding Hackathon**. The core goal was to replicate the basic structure and layout of the BBC homepage and article pages using modern web technologies (React, Vite, CSS Modules) and then integrate several AI-powered and utility features to enhance the user experience.

## Core Features

This clone implements the following functionalities:

1.  **Basic BBC Layout Replication:**
    *   Homepage structure resembling BBC.com's typical 3-column layout (as of the target design).
    *   Navigation bar and Footer mimicking BBC's design.
    *   Individual Article pages displaying title, image (if available), and content.
    *   Dark Mode / Light Mode theme toggle with persistent preference using `localStorage`.

2.  **News Fact Checker (Integrated AI & MCP):**
    *   A dedicated "Fact Check" page accessible from the main navigation.
    *   Users can input a news claim or statement.
    *   The application uses an `mcp-client` to connect via `stdio` to a running DuckDuckGo MCP search server process (like `@oevortex/ddg_search` or a similar implementation).
    *   Search results are fetched from the DuckDuckGo MCP server based on the user's claim.
    *   These search results, along with the original claim, are sent to an AI model (configured via the OpenAI library, potentially targeting Google's Gemini via custom endpoint) via a secure backend endpoint (handled by Vite middleware during development).
    *   The AI analyzes the search results *only* and provides a verdict (True, False, Partially True/False, Unverifiable) along with a brief explanation and cited source numbers.
    *   Handles potentially invalid or nonsensical user claims.
    *   Displays results clearly, including formatted search results used for the analysis.
    *   Maintains a local search history using `localStorage`.

3.  **Article Read Time Estimation:**
    *   Calculates an estimated reading time (e.g., "4 min read") based on the word count of the article content.
    *   Displayed on relevant article cards in the metadata/actions row.

4.  **Article View Counter:**
    *   Tracks a simple view count for each article.
    *   Uses `localStorage` for basic persistence.
    *   The count increments when an article page is visited.
    *   The current count is displayed on article cards (updates on focus/visibility change).

5.  **PDF Article Export/Download:**
    *   Provides a button on article cards to download the article content as a PDF.
    *   Uses the `jsPDF` library client-side.
    *   Includes the BBC logo (light mode version), centered title, centered metadata (category | estimated absolute GMT time), summary, and the plain text body content (with multi-page support).
    *   Adds video URL and source link at the end.
    *   Tracks a simple download count for each article using `localStorage`, incrementing after successful PDF generation. The count is displayed next to the download button.

6.  **AI Article Summarization:**
    *   Provides a button on article cards to generate a concise summary.
    *   Sends the article content to the configured AI model via the backend endpoint (Vite middleware).
    *   Displays the generated summary in a clean, animated modal popup.

7.  **Text-to-Speech (TTS):**
    *   Utilizes the browser's built-in Web Speech API (`SpeechSynthesis`).
    *   Provides Play/Stop controls on article cards.
    *   Reads the article content aloud sentence by sentence for more natural pacing.

## Tech Stack

*   **Frontend:** React, Vite, JavaScript, CSS Modules
*   **Routing:** React Router DOM
*   **State Management:** React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`)
*   **PDF Generation:** `jsPDF`
*   **Date Formatting:** `date-fns`, `date-fns-tz` (for PDF date)
*   **AI Interaction:** `openai` (Node.js library, potentially configured for Google endpoint)
*   **MCP Interaction:** `mcp-client` (Node.js library)
*   **Icons:** `react-icons` (Font Awesome)
*   **Development Server:** Node.js with Vite Middleware (using Express for routing/parsing API calls)

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (or yarn)
*   Docker (for running the final application)
*   An OpenAI API Key (or a key compatible with your configured `openaiLogic.js` endpoint)
*   A running DuckDuckGo MCP Search Server process accessible via `stdio` (e.g., using `uvx`, `mcp dev`, or configured via Claude Desktop).

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd bbc-clone
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    *   Create a `.env` file in the project root (`bbc-clone/.env`).
    *   Add your API key and MCP server details:
        ```dotenv
        OPENAI_API_KEY=sk-YourActualOpenAISecretKeyHere
        VITE_DUCKDUCKGO_MCP_COMMAND=uvx # Or your command (python3, etc.)
        VITE_DUCKDUCKGO_MCP_ARGS=duckduckgo-mcp-server # Or your script/package name
        ```
    *   **Important:** Add `.env` to your `.gitignore` file!
4.  **Start the DuckDuckGo MCP Server:** Launch your configured DuckDuckGo MCP server process in a separate terminal (ensure the command/args match your `.env` file). Example:
    ```bash
    uvx duckduckgo-mcp-server
    ```
5.  **Start the Vite Development Server:**
    ```bash
    npm run dev
    ```
    This will start the React app and the integrated API middleware. Open the URL shown in the terminal (usually `http://localhost:3000`).

### Building and Running with Docker

1.  **Build the Docker Image:**
    ```bash
    docker build -t bbc-clone-app .
    ```
2.  **Run the Docker Container:**
    ```bash
    docker run -p 3000:3001 \
           -e OPENAI_API_KEY="sk-YourActualOpenAISecretKeyHere" \
           -e VITE_DUCKDUCKGO_MCP_COMMAND="uvx" \
           -e VITE_DUCKDUCKGO_MCP_ARGS="duckduckgo-mcp-server" \
           --rm --name bbc-clone-container bbc-clone-app
    ```
    *   Adjust the `-e` flags to match your actual keys and MCP server command/args.
    *   Access the application at `http://localhost:3000`.
    *   The MCP server process will be started *inside* the container by the `mcp-client` library via the `stdio` connection.

## Important Note

**Disclaimer:** This project is a simplified clone created solely for the **Outlier AI - Level UP Vibe Coding Hackathon**. It is **not affiliated with, endorsed by, or representative of the official BBC website or news organization.** The news content displayed is placeholder mock data and does not reflect real events or BBC reporting. The primary purpose was to demonstrate technical skills in frontend development and AI integration within the hackathon's context.

---

Feel free to modify the Tech Stack details, Getting Started commands, or the Disclaimer as needed!