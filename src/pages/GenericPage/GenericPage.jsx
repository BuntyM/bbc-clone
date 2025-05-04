import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './GenericPage.module.css';

const GenericPage = () => {
  // Get the title from the URL parameter, decode it
  const { pageTitle } = useParams();
  const decodedTitle = pageTitle ? decodeURIComponent(pageTitle.replace(/\+/g, ' ')) : 'Page'; // Handle potential encoding and default

  useEffect(() => {
    // Scroll to top when the page loads or title changes
    window.scrollTo(0, 0);
    // Update document title
    document.title = `${decodedTitle} - BBC News Clone`;
  }, [decodedTitle]); // Rerun effect if the title changes

  return (
    <div className={styles.genericContainer}>
      <h1 className={styles.pageTitle}>{decodedTitle}</h1>
      {/* You could add more placeholder content here if needed */}
      <p>This is a placeholder page for "{decodedTitle}". Functionality is not yet implemented.</p>
    </div>
  );
};

export default GenericPage;
