import React from 'react';
import styles from './HomePage.module.css';
import { mockArticles } from '../../data/mockArticles'; // Verify path
import ArticleCard from '../../components/ArticleCard/ArticleCard';

// Accept TTS props
const HomePage = ({
    isSpeechSupported,
    isSpeaking,
    speakingArticleId,
    speak,
    cancelSpeech
}) => {


  // Check if data array itself is valid
  if (!Array.isArray(mockArticles) || mockArticles.length === 0) {
      console.error("HomePage Error: mockArticles is not a valid array or is empty!");
      return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Error: Article data is unavailable.</div>;
  }


  // --- Get articles for the 3-COLUMN layout ---
  // Define IDs clearly
  const leftArticle1Id = 'gaza-activists-ship-drones';
  const leftArticle2Id = 'trump-trudeau-carney';
  const centerHeroId = 'harry-legal-challenge-security';
  const rightArticle1Id = 'afd-germany-intelligence';
  const rightArticle2Id = 'chile-tsunami-warning';
  const rightArticle3Id = 'jill-sobule-house-fire';
  const rightArticle4Id = 'russell-brand-bail';

  // Find articles, log if not found
  const findArticle = (id) => {
      const article = mockArticles.find(a => a?.id === id);
      if (!article) {
          console.warn(`HomePage Warning: Article with ID "${id}" not found in mockArticles.`);
      }
      return article;
  };

  const leftPairArticles = [
    findArticle(leftArticle1Id),
    findArticle(leftArticle2Id),
  ].filter(Boolean); // Removes undefined/null if ID not found

  const centerHeroArticle = findArticle(centerHeroId);

  const rightListArticles = [
    findArticle(rightArticle1Id),
    findArticle(rightArticle2Id),
    findArticle(rightArticle3Id),
    findArticle(rightArticle4Id),
  ].filter(Boolean);
  // --- End Get Articles ---


  // Check if *absolutely nothing* was found for the layout
   if (!centerHeroArticle && leftPairArticles.length === 0 && rightListArticles.length === 0) {
       console.error("HomePage Error: No articles found matching required IDs for layout.");
       // Return a more specific error message
       return <div style={{ padding: '20px', textAlign: 'center', color: 'orange' }}>Warning: Could not find articles required for the main layout. Check article IDs in mockArticles.js and HomePage.jsx.</div>;
   }

  const ttsProps = { isSpeechSupported, isSpeaking, speakingArticleId, speak, cancelSpeech };

  return (
    // Ensure container itself isn't hidden
    <div className={styles.homePageContainer}>
        {/* Ensure grid isn't hidden */}
      <section className={styles.mainGrid}>
        {/* Column 1 */}
        <div className={styles.leftPairColumn}>
          {leftPairArticles.length > 0 ? (
            leftPairArticles.map(article => (
              // Removed extra null check, .filter(Boolean) handles it
              <ArticleCard key={article.id} article={article} variant="leftPairItem" {...ttsProps} />
            ))
          ) : (
            <p className={styles.missingContent}>Left column articles not found (Check IDs: {leftArticle1Id}, {leftArticle2Id}).</p> // Fallback
          )}
        </div>

        {/* Column 2 */}
        <div className={styles.centerHeroColumn}>
          {centerHeroArticle ? (
            <ArticleCard article={centerHeroArticle} variant="centerHeroItem" {...ttsProps} />
          ) : (
             <p className={styles.missingContent}>Hero article not found (Check ID: {centerHeroId}).</p> // Fallback
          )}
        </div>

        {/* Column 3 */}
        <aside className={styles.rightListColumn}>
          {rightListArticles.length > 0 ? (
            rightListArticles.map(article => (
               // Removed extra null check, .filter(Boolean) handles it
              <ArticleCard key={article.id} article={article} variant="rightListItem" {...ttsProps} />
            ))
           ) : (
             <p className={styles.missingContent}>Right column articles not found (Check IDs).</p> // Fallback
          )}
        </aside>
      </section>
      {/* ... other sections ... */}
    </div>
  );
};
export default HomePage;