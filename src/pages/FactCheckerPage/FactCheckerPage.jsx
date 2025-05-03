import React, { useState, useEffect, useMemo } from 'react';
import styles from './FactCheckerPage.module.css';
import { factCheckClaim } from '../../services/llmService';
import {
  FaSearch, FaTimes, FaHistory,
  FaInfoCircle, FaCheckCircle, FaTimesCircle,
  FaQuestionCircle, FaLink,
  FaChevronDown, FaExclamationTriangle
} from 'react-icons/fa';

// Helper to parse markdown-style search results
const parseSearchResults = (resultsText) => {
  if (!resultsText || typeof resultsText !== 'string' ||
      resultsText.toLowerCase().includes("error") ||
      resultsText.toLowerCase().includes("could not connect") ||
      resultsText.toLowerCase().includes("unexpected format")) {
    return { error: resultsText || "No search results available.", items: [], raw: null };
  }
  try {
    const items = [];
    const regex = /(\d+)\.\s*\[(.*?)\]\((.*?)\)\s*\n\s*(.*?)(?=\n\d+\.|$)/gs;
    let match;
    while ((match = regex.exec(resultsText)) !== null) {
      items.push({
        id: match[1].trim(),
        title: match[2].trim(),
        url: match[3].trim(),
        snippet: match[4].trim().replace(/\n\s*/g, ' '),
      });
    }
    if (items.length === 0 && resultsText.length > 10 &&
        !resultsText.startsWith("Received empty search results")) {
      console.warn("Could not parse search results, showing raw.");
      return { error: null, items: [], raw: resultsText };
    }
    return { error: null, items, raw: null };
  } catch (e) {
    console.error("Error parsing search results:", e);
    return { error: "Failed to parse results.", items: [], raw: resultsText };
  }
};

const FactCheckerPage = () => {
  const [claim, setClaim] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => {
    try { const saved = localStorage.getItem('factCheckHistory'); return saved ? JSON.parse(saved) : []; }
    catch { return []; }
  });
  const [showHistory, setShowHistory] = useState(false);
  const [showSources, setShowSources] = useState(false);

  // Persist history
  useEffect(() => {
    try { localStorage.setItem('factCheckHistory', JSON.stringify(history)); }
    catch {}
  }, [history]);

  const handleInputChange = (e) => setClaim(e.target.value);
  const handleClear = () => { setClaim(''); setResult(null); setError(null); };
  const toggleHistory = () => setShowHistory(prev => !prev);
  const toggleSources = () => setShowSources(prev => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!claim.trim() || isLoading) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const analysisResult = await factCheckClaim(claim);
      if (analysisResult?.error?.includes("Invalid Claim")) {
        setError("Invalid Claim: Please provide a meaningful statement or question to check.");
        const newEntry = { claim, timestamp: new Date().toISOString(), result: "Invalid Claim Input" };
        setHistory(prev => [newEntry, ...prev].slice(0, 10));
      } else if (analysisResult?.analysis) {
        setResult(analysisResult);
        const newEntry = {
          claim,
          timestamp: new Date().toISOString(),
          result: analysisResult.analysis.substring(0, 100) + '...'
        };
        setHistory(prev => [newEntry, ...prev].slice(0, 10));
      } else {
        setError(analysisResult?.error || "Unexpected analysis result.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error during fact-check.");
    } finally {
      setIsLoading(false);
      setShowSources(false);
    }
  };

  const renderStatusIcon = (analysis = "") => {
    if (!analysis || analysis.startsWith("Invalid Claim:"))
      return <FaExclamationTriangle className={styles.iconWarning} title="Invalid" />;
    const lower = analysis.toLowerCase();
    if (lower.startsWith('true') || lower.includes('appears true'))
      return <FaCheckCircle className={styles.iconTrue} title="True" />;
    if (lower.startsWith('false') || lower.includes('appears false'))
      return <FaTimesCircle className={styles.iconFalse} title="False" />;
    if (lower.includes('partially') || lower.includes('mixed'))
      return <FaInfoCircle className={styles.iconPartial} title="Partial" />;
    if (lower.includes('unverifiable') || lower.includes('insufficient'))
      return <FaQuestionCircle className={styles.iconUnverified} title="Unverifiable" />;
    return null;
  };

  const parsedSearchResults = useMemo(() => (
    result && !result.error && result.search_results_used
      ? parseSearchResults(result.search_results_used)
      : { error: null, items: [], raw: null }
  ), [result]);

  const formatAnalysisText = (text = "") => {
    if (!text) return [];
    const linked = text.replace(/\[(\d+)\]/g, (m, num) =>
      `<a href=\"#source-${num}\" class=\"${styles.sourceLink}\">[${num}]</a>`
    );
    return linked.split('\n').map(line =>
      line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') || '\u00A0'
    );
  };

  const renderResultContent = () => {
    if (isLoading) return <div className={styles.loadingIndicator}>Checking claim... (This may take a moment)</div>;
    if (error) return (
      <div className={`${styles.resultSection} ${styles.errorBox}`}>
        <h2><FaExclamationTriangle className={styles.iconWarning} /> Error</h2>
        <p>{error}</p>
      </div>
    );
    if (result?.analysis) return (
      <div className={styles.resultSection}>
        <h2 className={styles.resultHeader}>
          {renderStatusIcon(result.analysis)}<span>Analysis Result</span>
        </h2>
        <div className={styles.analysisBox}>
          <div className={styles.analysisText}>
            {formatAnalysisText(result.analysis).map((line, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: line }} />
            ))}
          </div>
        </div>
        {(!error && (parsedSearchResults.items.length > 0 || parsedSearchResults.raw || parsedSearchResults.error)) && (
          <details open={showSources} className={styles.sourcesDetails}>
            <summary onClick={(e) => { e.preventDefault(); toggleSources(); }} className={styles.sourcesToggle}>
              <span>View Search Results Used</span>
              <FaChevronDown />
            </summary>
            {parsedSearchResults.error && <p className={styles.searchWarning}>{parsedSearchResults.error}</p>}
            {parsedSearchResults.items.length > 0 && (
              <ul className={styles.searchResultsList}>
                {parsedSearchResults.items.map(item => (
                  <li key={item.id} id={`source-${item.id}`} className={styles.searchResultItem}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.searchResultTitle}>
                      <span className={styles.sourceNumber}>[{item.id}]</span><FaLink /> {item.title}
                    </a>
                    <p className={styles.searchResultSnippet}>{item.snippet}</p>
                  </li>
                ))}
              </ul>
            )}
            {parsedSearchResults.raw && <pre className={styles.sourcesContent}>{parsedSearchResults.raw}</pre>}
          </details>
        )}
      </div>
    );
    return null;
  };

  const renderHistoryContent = () => showHistory && (
    <ul className={styles.historyList}>
      {history.length === 0 && <li className={styles.noHistory}>No history yet.</li>}
      {history.map((item, i) => (
        <li key={i} onClick={() => { setClaim(item.claim); setResult(null); setError(null); }}>
          <span className={styles.historyClaim}>{item.claim}</span>
          <span className={styles.historyTimestamp}>{new Date(item.timestamp).toLocaleString()}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>News Fact Checker</h1>
      <p className={styles.pageDescription}>Enter a news claim or statement below. We'll use DuckDuckGo Search and AI to assess the claim.</p>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <textarea
          value={claim} onChange={handleInputChange}
          placeholder="Enter the news claim..."
          className={styles.claimInput} rows={4} disabled={isLoading}
        />
        <div className={styles.buttonGroup}>
          <button type="submit" className={`${styles.actionButton} ${styles.submitButton}`} disabled={!claim.trim() || isLoading}>
            {isLoading ? 'Checking...' : <><FaSearch /> Check Fact</>}
          </button>
          <button type="button" onClick={handleClear} className={`${styles.actionButton} ${styles.clearButton}`} disabled={isLoading}>
            <FaTimes /> Clear
          </button>
        </div>
      </form>
      {renderResultContent()}
      <div className={styles.historySection}>
        <div className={styles.historyToggleWrapper}>
          <button onClick={toggleHistory} className={styles.historyToggle}>
            <FaHistory /> {showHistory ? 'Hide Search History' : 'Show Search History'}
          </button>
        </div>
        {renderHistoryContent()}
      </div>
    </div>
  );
};

export default FactCheckerPage;