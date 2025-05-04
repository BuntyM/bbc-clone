import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import { FiX, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaBusinessTime } from "react-icons/fa";

// Helper function to generate generic page path
const getGenericPath = (title) => `/page/${encodeURIComponent(title)}`;

// <<< DEFINE OR IMPORT SECTIONS DATA HERE
const sections = [
    { name: 'Home', path: '/' },
    { name: 'Fact Check', path: '/fact-check' }, // Added Fact Check
    { name: 'News', path: getGenericPath('News'), subItems: [ /* Add subitems if needed */ ] },
    { name: 'Sport', path: getGenericPath('Sport'), subItems: [ /* Add subitems if needed */ ] },
    { // Updated Business section paths
        name: 'Business',
        path: getGenericPath('Business'),
        subItems: [
            { name: 'Business', path: getGenericPath('Business') },
            { name: 'Executive Lounge', path: getGenericPath('Executive Lounge') },
            { name: 'Technology of Business', path: getGenericPath('Technology of Business') },
            { name: 'Future of Business', path: getGenericPath('Future of Business') },
        ]
    },
    { name: 'Innovation', path: getGenericPath('Innovation'), subItems: [ /* Add subitems if needed */ ] },
    { name: 'Culture', path: getGenericPath('Culture'), subItems: [ /* Add subitems if needed */ ] },
    { name: 'Arts', path: getGenericPath('Arts'), subItems: [ /* Add subitems if needed */ ] },
    { name: 'Travel', path: getGenericPath('Travel'), subItems: [ /* Add subitems if needed */ ] },
    { name: 'Earth', path: getGenericPath('Earth'), subItems: [ /* Add subitems if needed */ ] },
    { name: 'Audio', path: getGenericPath('Audio'), subItems: [ /* Add subitems if needed */ ] },
    { name: 'Video', path: getGenericPath('Video'), subItems: [ /* Add subitems if needed */ ] },
    { name: 'Live', path: getGenericPath('Live'), subItems: [ /* Add subitems if needed */ ] },
    { name: 'Weather', path: getGenericPath('Weather'), subItems: [] }, // Example without subitems
    // Add other sections as needed
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate(); // Get navigate function
  const location = useLocation(); // Get location object
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
            <button
              aria-label="Submit search"
              onClick={() => {
                navigate(getGenericPath('Search Results'));
                onClose(); // Close sidebar after search
              }}
            >
              <FiSearch size={20} />
            </button>
        </div>

        {/* <<< ENSURE THIS MAP RENDERS */}
        <ul className={styles.menuList}>
          {sections.map((section) => {
            // Check if any subitem path matches the start of the current location pathname
            const isParentActive = section.subItems && section.subItems.length > 0 &&
              section.subItems.some(subItem => location.pathname.startsWith(subItem.path) && subItem.path !== '/'); // Avoid matching root path

            return (
            <li key={section.name} className={`${styles.menuItem} ${isParentActive ? styles.activeParent : ''}`}>
              {(section.subItems && section.subItems.length > 0) ? (
                <>
                  <button
                    onClick={() => toggleSection(section.name)}
                    className={styles.sectionToggle}
                    aria-expanded={!!openSections[section.name]}
                  >
                    <span>{section.name}</span>
                    {/* Use just one icon type that will rotate via CSS */}
                    <FiChevronDown size={section.name === 'Business' ? 20 : 16} />
                  </button>
                  {openSections[section.name] && (
                    <ul className={styles.submenu}>
                      {section.subItems.map((subItem) => (
                        <li key={subItem.name}>
                          <NavLink
                            to={subItem.path}
                            onClick={onClose}
                            className={({ isActive }) => {
                              const isRealPage = subItem.path === '/' || subItem.path === '/fact-check';
                              return (isRealPage && isActive) ? `${styles.subLink} ${styles.activeSubLink}` : styles.subLink;
                            }}
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
                  className={({ isActive }) => (isActive ? `${styles.menuLink} ${styles.activeLink}` : styles.menuLink)}
                >
                  {section.name}
                </NavLink>
              )}
            </li>
          );
          })}
        </ul>
        {/* <<< END OF MAP */}
      </nav>
    </>
  );
};

export default Sidebar;
