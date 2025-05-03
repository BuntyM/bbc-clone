import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getArticleById, incrementArticleViewCount } from '../../data/mockArticles';
import styles from './ArticlePage.module.css';

const ArticlePage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const effectRan = useRef(false); // Flag for StrictMode

  useEffect(() => {
    // StrictMode check for view count increment
    let shouldProcess = true; // Assume we process unless first dev run
    if (process.env.NODE_ENV === 'development') {
        if (!effectRan.current) {
            shouldProcess = false; // Skip first mount in dev StrictMode
        }
    }

    // --- Run only once logic ---
    if (shouldProcess) {
        console.log(`ArticlePage Effect running for real for ${articleId}`);
        window.scrollTo(0, 0);

        // Check if article exists before incrementing
        const initialDataCheck = getArticleById(articleId);
        if (!initialDataCheck) {
            console.error(`Article with ID ${articleId} not found.`);
            setArticle(null); // Set state to null if article doesn't exist
            // navigate('/not-found'); // Optional redirect
            return; // Stop execution
        }

        // Increment count ONCE
        incrementArticleViewCount(articleId);

        // Fetch data AGAIN to get the updated count
        const articleData = getArticleById(articleId);
        setArticle(articleData);
    }
    // --- End Run only once logic ---

    // Set the flag to true after the first run in dev StrictMode
    return () => {
        if (process.env.NODE_ENV === 'development') {
            effectRan.current = true;
        }
    };
  }, [articleId, navigate]); // Rerun effect only if articleId changes

  if (!article) {
    return <div className={styles.notFound}>Loading article or article not found... <Link to="/">Go Home</Link></div>;
  }

  const imageSrc = article.imageUrl || '/images/placeholder.png';

  return (
    <article className={styles.articleContainer}>
      <header className={styles.articleHeader}>
         {article.category && ( <Link to={`/${article.category.toLowerCase()}`} className={styles.categoryLink}> {article.category} </Link> )}
        <h1 className={styles.articleHeadline}>{article.headline}</h1>
        <div className={styles.metadata}>
           {article.publishedAt && <time dateTime={article.publishedAt}>{article.publishedAt}</time>}
           {/* {typeof article.viewCount === 'number' && <span> | {article.viewCount.toLocaleString()} views</span>} */}
        </div>
      </header>
      {article.summary && <p className={styles.summary}>{article.summary}</p>}
      <figure className={styles.mainImageFigure}> <img src={imageSrc} alt={article.headline} /> </figure>
      <div className={styles.articleBody} dangerouslySetInnerHTML={{ __html: article.fullContent }} />
    </article>
  );
};

export default ArticlePage;