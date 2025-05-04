import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';

// Keep original paths for Home and Fact Check, redirect others to generic page
const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Fact Check', path: '/fact-check' },
  { name: 'News', path: `/page/${encodeURIComponent('News')}` },
  { name: 'Sport', path: `/page/${encodeURIComponent('Sport')}` },
  { name: 'Business', path: `/page/${encodeURIComponent('Business')}` },
  { name: 'Innovation', path: `/page/${encodeURIComponent('Innovation')}` },
  { name: 'Culture', path: `/page/${encodeURIComponent('Culture')}` },
  { name: 'Arts', path: `/page/${encodeURIComponent('Arts')}` },
  { name: 'Travel', path: `/page/${encodeURIComponent('Travel')}` },
  { name: 'Earth', path: `/page/${encodeURIComponent('Earth')}` },
  { name: 'Audio', path: `/page/${encodeURIComponent('Audio')}` },
  { name: 'Video', path: `/page/${encodeURIComponent('Video')}` },
  { name: 'Live', path: `/page/${encodeURIComponent('Live')}` },
];

const Navigation = () => {
  return (
    <nav className={styles.navigationBarHeader}>
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                // Adjust isActive check for generic pages if needed, or remove if selection isn't desired for them
                className={({ isActive }) => {
                  // Only apply 'selected' style for exact matches on Home and Fact Check
                  const isSelected = (item.path === '/' || item.path === '/fact-check') && isActive;
                  return isSelected ? `${styles.navLink} ${styles.selected}` : styles.navLink;
                }}
                // end prop is only relevant for the root path '/'
                end={item.path === '/'}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
    </nav>
  );
};

export default Navigation;
