import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ArticleCard.module.css';
import { calculateReadingTime } from '../../utils/readingTimeUtil';
import { generatePdf } from '../../utils/pdfUtils';
import { incrementArticleDownloadCount } from '../../data/mockArticles';
import { summarizeArticle } from '../../services/llmService';
import { FaPlayCircle, FaStopCircle, FaEye, FaDownload, FaAlignLeft, FaTimes, FaQuestionCircle, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaLink, FaHistory, FaChevronDown, FaChevronUp, FaExclamationTriangle } from 'react-icons/fa';

// Accept TTS props
const ArticleCard = ({
    article: initialArticle,
    variant = 'default',
    isSpeechSupported,
    isSpeaking,
    speakingArticleId,
    speak,
    cancelSpeech
}) => {

  const [article, setArticle] = useState(initialArticle || null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Effect to update counts
  useEffect(() => {
      if (!initialArticle?.id) {
          if (!article && initialArticle) setArticle(initialArticle);
          return;
      };
      const articleId = initialArticle.id;
      const updateCounts = () => {
          const storedViewCount = localStorage.getItem(`viewCount_${articleId}`);
          const storedDownloadCount = localStorage.getItem(`downloadCount_${articleId}`);
          const baseViewCount = initialArticle.viewCount ?? 0;
          const baseDownloadCount = initialArticle.downloadCount ?? 0;
          const currentViewCount = storedViewCount ? parseInt(storedViewCount, 10) : baseViewCount;
          const currentDownloadCount = storedDownloadCount ? parseInt(storedDownloadCount, 10) : baseDownloadCount;
          setArticle(prev => {
              if (!prev || prev.viewCount !== currentViewCount || prev.downloadCount !== currentDownloadCount) {
                 return { ...(prev || initialArticle || {}), viewCount: currentViewCount, downloadCount: currentDownloadCount };
              } return prev; });
      };
      updateCounts();
      const viewUpdateHandler = () => updateCounts();
      const downloadUpdateHandler = () => updateCounts();
      window.addEventListener(`viewsUpdated_${articleId}`, viewUpdateHandler);
      window.addEventListener(`downloadsUpdated_${articleId}`, downloadUpdateHandler);
      return () => { window.removeEventListener(`viewsUpdated_${articleId}`, viewUpdateHandler); window.removeEventListener(`downloadsUpdated_${articleId}`, downloadUpdateHandler); };
  }, [initialArticle?.id]);


  if (!article?.id) { return null; }

  const imageSrc = article.imageUrl || '/images/placeholder.png';
  const readingTime = calculateReadingTime(article.fullContent || article.summary || '');
  const isCurrentArticleSpeaking = isSpeaking && speakingArticleId === article.id;

  // --- TTS Button Handler ---
  const handleTTSToggle = (event) => {
      event.preventDefault(); event.stopPropagation();
      console.log("TTS Toggle Clicked. Supported:", isSpeechSupported); // Log support status
      if (!isSpeechSupported) { alert("Sorry, your browser doesn't support Text-to-Speech, or the feature is unavailable."); return; }
      if (isCurrentArticleSpeaking) { console.log("Cancelling speech"); cancelSpeech(); }
      else { const text = article.fullContent || article.summary || article.headline; console.log("Speaking text for:", article.id); speak(text, article.id); }
  };

  // --- PDF Download Handler ---
  const handleDownloadPdf = async (event) => {
       event.preventDefault(); event.stopPropagation();
       if (isDownloading) return;
       setIsDownloading(true);
       try { await generatePdf(article); const newCount = incrementArticleDownloadCount(article.id); setArticle(prev => ({...prev, downloadCount: newCount })); }
       catch (error) { console.error("PDF Download failed", error); alert("Failed to generate PDF."); }
       finally { setIsDownloading(false); }
   };

  // --- Summarize Handler ---
   const handleSummarize = async (event) => {
      event.preventDefault(); event.stopPropagation();
      if (isSummarizing) return;
      setSummaryResult(null); setIsSummarizing(true); setShowSummaryModal(false);
      const contentToSummarize = article.fullContent || article.summary || article.headline || "";
      if (!contentToSummarize) { alert("No content available to summarize."); setIsSummarizing(false); return; }
      try { const summary = await summarizeArticle(contentToSummarize, article.id); setSummaryResult(summary); setShowSummaryModal(true); }
      catch (error) { setSummaryResult(`Error: ${error.message || 'Could not get summary.'}`); setShowSummaryModal(true); }
      finally { setIsSummarizing(false); }
  };

  // --- Close Summary Modal ---
  const closeSummary = () => { setShowSummaryModal(false); };


  // --- Combined Info Footer (Single Line) ---
  const InfoFooter = ({ article, variant, readingTime }) => {
     if (!article) return null;
     const showInfo = (variant === 'leftPairItem' || variant === 'rightListItem' || variant === 'default' || variant === 'centerHeroItem');
     if (!showInfo) return null;

     const showReadingTime = readingTime > 0;
     const showTTS = isSpeechSupported;
     const hasTimestamp = !!article.publishedAt;
     const hasCategory = !!article.category;
     const hasViewCount = typeof article.viewCount === 'number' && article.viewCount >= 0;
     const hasDownloadCount = typeof article.downloadCount === 'number' && article.downloadCount >= 0;
     const showDownloadButton = true;
     const showSummaryButton = !!(article.fullContent || article.summary);

     // Build items array
     const items = [
        hasTimestamp ? <span key="time" className={styles.timespan}>{article.publishedAt}</span> : null,
        hasCategory ? <span key="cat" className={styles.newsPlace}>{article.category}</span> : null,
        showReadingTime ? ( <span key="read" className={styles.readingTime}> {readingTime} {readingTime === 1 ? 'min' : 'mins'} read </span> ) : null,
        hasViewCount ? ( <span key="views" className={styles.viewCount}> <FaEye className={styles.viewCountIcon} /> {article.viewCount.toLocaleString()} </span> ) : null,
        showDownloadButton ? ( <button key="pdf" onClick={handleDownloadPdf} className={styles.pdfButton} disabled={isDownloading || isSummarizing} aria-label="Download article as PDF" title="Download PDF"> <FaDownload className={styles.pdfButtonIcon}/> {(hasDownloadCount) && (<span className={styles.pdfButtonCount}>{article.downloadCount.toLocaleString()}</span> )} </button> ) : null,
        showSummaryButton ? ( <button key="summarize" onClick={handleSummarize} className={styles.summarizeButton} disabled={isSummarizing || isDownloading} title="Summarize article"> {isSummarizing ? '...' : <FaAlignLeft />} </button> ) : null,
        // <<< Render TTS button based on the corrected showTTS >>>
        showTTS ? ( <button key="tts" onClick={handleTTSToggle} className={styles.ttsButton} disabled={isDownloading || isSummarizing} aria-label={isCurrentArticleSpeaking ? "Stop reading article" : "Read article aloud"} title={isCurrentArticleSpeaking ? "Stop reading" : "Read aloud"}> {isCurrentArticleSpeaking ? <FaStopCircle /> : <FaPlayCircle />} </button> ) : null,
     ].filter(Boolean);

     // Only render footer if there are items
     if (items.length === 0) return null;

     return (
            <div className={`${styles.infoFooter} ${styles[`infoFooter-${variant}`]}`}>
                {items.map((item, index) => (
                    <React.Fragment key={item.key || index}>
                        {item}
                        {index < items.length - 1 && <span className={styles.separator}>|</span>}
                    </React.Fragment>
                ))}
            </div>
     );
  };

  // --- Main Card Structure ---
  let cardContent;
  switch (variant) {
      case 'leftPairItem': cardContent = ( <> <div className={styles.newsImgBox}> <Link to={`/article/${article.id}`}> <img src={imageSrc} alt={article.headline} /> </Link> </div> <div className={styles.newsContent}> <h3 className={styles.newsTitle}> <Link to={`/article/${article.id}`}>{article.headline}</Link> </h3> {article.summary && <p className={styles.newsDesc}>{article.summary}</p>} <InfoFooter article={article} variant={variant} readingTime={readingTime} /> </div> </> ); break;
      case 'centerHeroItem': cardContent = ( <> <div className={styles.newsImgBox}> <Link to={`/article/${article.id}`}> <img src={imageSrc} alt={article.headline} /> </Link> </div> <div className={styles.heroContentWrapper}> <h2 className={styles.newsTitle}> <Link to={`/article/${article.id}`}>{article.headline}</Link> </h2> {article.summary && <p className={styles.newsDesc}>{article.summary}</p>} <InfoFooter article={article} variant={variant} readingTime={readingTime} /> </div> </> ); break;
      case 'rightListItem': cardContent = ( <div className={styles.newsContent}> <h3 className={styles.newsTitle}> <Link to={`/article/${article.id}`}>{article.headline}</Link> </h3> {article.summary && <p className={styles.newsDesc}>{article.summary}</p>} <InfoFooter article={article} variant={variant} readingTime={readingTime} /> </div> ); break;
      default: cardContent = ( <> <div className={styles.newsImgBox}> <Link to={`/article/${article.id}`}> <img src={imageSrc} alt={article.headline} /> </Link> </div> <div className={styles.newsContent}> <h3 className={styles.newsTitle}> <Link to={`/article/${article.id}`}>{article.headline}</Link> </h3> {article.summary && <p className={styles.newsDesc}>{article.summary}</p>} <InfoFooter article={article} variant={variant} readingTime={readingTime} /> </div> </> ); break;
  }

  return (
    <article className={`${styles.articleCard} ${styles[variant]}`}>
      {cardContent}
      {/* Keep Summary Modal */}
      {showSummaryModal && ( <div className={styles.summaryModalOverlay} onClick={closeSummary}> <div className={styles.summaryModalContent} onClick={(e) => e.stopPropagation()}> <button className={styles.summaryModalClose} onClick={closeSummary} aria-label="Close Summary"> <FaTimes /> </button> <h2 className={styles.summaryModalTitle}>Article Summary</h2> <div className={styles.summaryModalBody}> <p>{isSummarizing ? "Generating summary..." : (summaryResult || "No summary available.")}</p> </div> <p className={styles.summaryModalGeneratedBy}> Generated by AI </p> </div> </div> )}
    </article>
  );
};
export default ArticleCard;