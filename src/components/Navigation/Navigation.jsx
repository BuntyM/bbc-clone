import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Fact Check', path: '/fact-check' },
  { name: 'News', path: '/news' },
  { name: 'Sport', path: '/sport' },
  { name: 'Business', path: '/business' },
  { name: 'Innovation', path: '/innovation' },
  { name: 'Culture', path: '/culture' },
  { name: 'Arts', path: '/arts' },
  { name: 'Travel', path: '/travel' },
  { name: 'Earth', path: '/earth' },
  { name: 'Audio', path: '/audio' },
  { name: 'Video', path: '/video' },
  { name: 'Live', path: '/live' },
];

const Navigation = () => {
  return (
    <nav className={styles.navigationBarHeader}>
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.selected}` : styles.navLink
                }
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