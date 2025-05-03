import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

// Accept theme and children props
const Header = ({ onMenuClick, theme, children }) => {

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
        <button className={styles.registerButton}>Register</button>
        <button className={styles.signInButton}>Sign In</button>
        {/* Render ThemeToggle passed as children */}
        {children}
      </div>
    </header>
  );
};

export default Header;