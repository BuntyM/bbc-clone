import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './Header.module.css';

// Accept theme and children props
const Header = ({ onMenuClick, theme, children }) => {
  const navigate = useNavigate(); // Get navigate function

  // Determine icon paths based on the theme
  const menuIconSrc = theme === 'dark'
    ? '/images/menu-icon-dark-mode.png'
    : '/images/menu-icon-light-mode.png';

  const logoSrc = theme === 'dark'
    ? '/images/bbc-logo-dark-mode.png'
    : '/images/bbc-logo-light-mode.png';

  // Assuming search icon might also need theme variants
  const searchIconSrc = theme === 'dark'
    ? '/images/search-icon-dark-mode.png' 
    : '/images/search-icon-light-mode.png';
    
  return (
    <header className={styles.clonebbcHeader}>
      <div className={styles.leftControls}>
        <button className={styles.bbcMenu} onClick={onMenuClick} aria-label="menu">
          <img src={menuIconSrc} alt="Menu" />
        </button>
      </div>

      {/* This wrapper is crucial for centering */}
      <div className={styles.bbcLogoWrapper}>
        <Link to="/" aria-label="BBC Home">
          <img className={styles.bbcLogo} src={logoSrc} alt="BBC Logo" />
        </Link>
      </div>

      <div className={styles.rightControls}>
        <button
          className={styles.registerButton}
          onClick={() => navigate(`/page/${encodeURIComponent('Register')}`)} // Add onClick handler
        >
          Register
        </button>
        <button
          className={styles.signInButton}
          onClick={() => navigate(`/page/${encodeURIComponent('Sign In')}`)} // Add onClick handler
        >
          Sign In
        </button>
        {/* Render ThemeToggle passed as children */}
        {children}
      </div>
    </header>
  );
};

export default Header;
