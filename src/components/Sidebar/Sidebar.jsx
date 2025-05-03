import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { Link, NavLink } from 'react-router-dom';
import { FiX, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// <<< DEFINE OR IMPORT SECTIONS DATA HERE
const sections = [
    { name: 'Home', path: '/' },
    { name: 'News', path: '/news', subItems: [ /* Add subitems if needed */ ] },
    { name: 'Sport', path: '/sport', subItems: [ /* Add subitems if needed */ ] },
    {
        name: 'Business',
        path: '/business',
        subItems: [
            { name: 'Business', path: '/business' },
            { name: 'Executive Lounge', path: '/business/executive-lounge' },
            { name: 'Technology of Business', path: '/business/technology' },
            { name: 'Future of Business', path: '/business/future' },
        ]
    },
    { name: 'Innovation', path: '/innovation', subItems: [ /* Add subitems if needed */ ] },
    { name: 'Culture', path: '/culture', subItems: [ /* Add subitems if needed */ ] },
    { name: 'Arts', path: '/arts', subItems: [ /* Add subitems if needed */ ] },
    { name: 'Travel', path: '/travel', subItems: [ /* Add subitems if needed */ ] },
    { name: 'Earth', path: '/earth', subItems: [ /* Add subitems if needed */ ] },
    { name: 'Audio', path: '/audio', subItems: [ /* Add subitems if needed */ ] },
    { name: 'Video', path: '/video', subItems: [ /* Add subitems if needed */ ] },
    { name: 'Live', path: '/live', subItems: [ /* Add subitems if needed */ ] },
    { name: 'Weather', path: '/weather', subItems: [] }, // Example without subitems
    // Add other sections as needed
];

const Sidebar = ({ isOpen, onClose }) => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (sectionName) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };


  if (!isOpen) return null; // Don't render if closed

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={onClose}></div>
      <nav className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <button onClick={onClose} className={styles.closeButton} aria-label="Close menu">
          <FiX size={24} />
        </button>

        <div className={styles.searchContainer}>
            <input type="text" placeholder="Search news, topics and more" />
            <button aria-label="Submit search"><FiSearch size={20} /></button>
        </div>

        {/* <<< ENSURE THIS MAP RENDERS */}
        <ul className={styles.menuList}>
          {sections.map((section) => (
            <li key={section.name} className={styles.menuItem}>
              {(section.subItems && section.subItems.length > 0) ? (
                <>
                  <button
                    onClick={() => toggleSection(section.name)}
                    className={styles.sectionToggle}
                    aria-expanded={!!openSections[section.name]}
                  >
                    <span>{section.name}</span>
                    {openSections[section.name] ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {openSections[section.name] && (
                    <ul className={styles.submenu}>
                      {section.subItems.map((subItem) => (
                        <li key={subItem.name}>
                          <NavLink
                            to={subItem.path}
                            onClick={onClose}
                            className={({ isActive }) => isActive ? `${styles.subLink} ${styles.activeSubLink}` : styles.subLink}
                          >
                            {subItem.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink
                  to={section.path}
                  onClick={onClose}
                  className={({ isActive }) => isActive ? `${styles.menuLink} ${styles.activeLink}` : styles.menuLink}
                >
                  {section.name}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
        {/* <<< END OF MAP */}
      </nav>
    </>
  );
};

export default Sidebar;