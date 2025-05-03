import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import { FaXTwitter, FaFacebookF, FaInstagram, FaTiktok, FaLinkedinIn, FaCaretDown, FaCaretUp } from 'react-icons/fa6';

// Data for the language list
const languageColumns = [
    [ { name: 'Oduu Afaan Oromootiin', href: '#om' }, { name: 'Amharic አማርኛ', href: '#am' }, { name: 'Arabic عربي', href: '#ar' }, { name: 'Azeri AZƏRBAYCAN', href: '#az' }, { name: 'Bangla বাংলা', href: '#bn' }, { name: 'Burmese မြန်မာ', href: '#my' }, { name: 'Chinese 中文网', href: '#zh' }, { name: 'French AFRIQUE', href: '#fr-af' }, { name: 'Hausa HAUSA', href: '#ha' }, { name: 'Hindi हिन्दी', href: '#hi' }, { name: 'Gaelic NAIDHEACHDAN', href: '#gd' }, ],
    [ { name: 'Gujarati ગુજરાતી સમાચાર', href: '#gu' }, { name: 'Igbo AKỤKỌ N\'IGBO', href: '#ig' }, { name: 'Indonesian INDONESIA', href: '#id' }, { name: 'Japanese 日本語', href: '#ja' }, { name: 'Kinyarwanda GAHUZA', href: '#rw' }, { name: 'Kirundi KIRUNDI', href: '#rn' }, { name: 'Korean 한국어', href: '#ko' }, { name: 'Kyrgyz Кыргыз', href: '#ky' }, { name: 'Marathi मराठी', href: '#mr' }, { name: 'Nepali नेपाली', href: '#ne' }, { name: 'Noticias para hispanoparlantes', href: '#es' }, ],
    [ { name: 'Pashto پښتو', href: '#ps' }, { name: 'Persian فارسی', href: '#fa' }, { name: 'Pidgin', href: '#pcm' }, { name: 'Portuguese BRASIL', href: '#pt-br' }, { name: 'Punjabi ਪੰਜਾਬੀ', href: '#pa' }, { name: 'Russian НА РУССКОМ', href: '#ru' }, { name: 'Serbian NA SRPSKOM', href: '#sr' }, { name: 'Sinhala සිංහල', href: '#si' }, { name: 'Somali SOMALI', href: '#so' }, { name: 'Swahili HABARI KWA KISWAHILI', href: '#sw' }, { name: 'Tamil தமிழ் செய்தி', href: '#ta' }, ],
    [ { name: 'Telugu తెలుగు వార్తలు', href: '#te' }, { name: 'Thai ข่าวภาษาไทย', href: '#th' }, { name: 'Tigrinya ዜና ትግርኛ', href: '#ti' }, { name: 'Turkish TÜRKÇE', href: '#tr' }, { name: 'Ukrainian УКРАЇНСЬКА', href: '#uk' }, { name: 'Urdu اردو', href: '#ur' }, { name: 'Uzbek O\'ZBEK', href: '#uz' }, { name: 'Vietnamese TIẾNG VIỆT', href: '#vi' }, { name: 'Welsh NEWYDDION', href: '#cy' }, { name: 'Yoruba ÌRÒYÌN NÍ YORÙBÁ', href: '#yo' }, ]
];

// <<< ACCEPT theme PROP
const Footer = ({ theme }) => {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const footerNav = ['Home', 'News', 'Sport', 'Business', 'Innovation', 'Culture', 'Arts', 'Travel', 'Earth', 'Audio', 'Video', 'Live', 'Weather', 'BBC Shop', 'BritBox'];
  const legalNav = ['Terms of Use', 'About the BBC', 'Privacy Policy', 'Cookies', 'Accessibility Help', 'Contact the BBC', 'Advertise with us', 'Do not share or sell my info', 'Contact technical support'];
  const socialLinks = [
    { Icon: FaXTwitter, label: 'X / Twitter', url: 'https://x.com/bbc' },
    { Icon: FaFacebookF, label: 'Facebook', url: 'https://facebook.com/bbc' },
    { Icon: FaInstagram, label: 'Instagram', url: 'https://instagram.com/bbc' },
    { Icon: FaTiktok, label: 'TikTok', url: 'https://tiktok.com/@bbc' },
    { Icon: FaLinkedinIn, label: 'LinkedIn', url: 'https://linkedin.com/company/bbc' },
  ];
  const toggleLangDropdown = () => setIsLangDropdownOpen(prev => !prev);

  // <<< DETERMINE LOGO SRC BASED ON THEME
  const logoSrc = theme === 'dark'
    ? '/images/bbc-logo-dark-mode.png'
    : '/images/bbc-logo-light-mode.png';

  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerContent}>
        <div className={styles.logoRow}>
            <Link to="/" aria-label="BBC Home">
                {/* <<< USE DYNAMIC LOGO SRC */}
                <img src={logoSrc} alt="BBC Logo" className={styles.footerLogo}/>
            </Link>
        </div>
        <nav aria-label="BBC Sections" className={styles.primaryNavContainer}> <ul className={styles.primaryNav}> {footerNav.map(item => ( <li key={item}><Link to={`/${item.toLowerCase().replace(/\s+/g, '')}`}>{item}</Link></li> ))} </ul> </nav>
        <div className={styles.languageSectionWrapper}>
            <button onClick={toggleLangDropdown} aria-haspopup="true" aria-expanded={isLangDropdownOpen} className={`${styles.languageButton} ${isLangDropdownOpen ? styles.languageButtonOpen : ''}`}>
                <span className={styles.languageButtonText}>BBC in other languages</span>
                {isLangDropdownOpen ? <FaCaretUp className={styles.langIcon} /> : <FaCaretDown className={styles.langIcon} />}
            </button>
            {isLangDropdownOpen && ( <div className={styles.languageDropdownContent}> <h2 className={styles.languageTitle}>The BBC is in multiple languages</h2> <p className={styles.languageSubtitle}>Read the BBC In your own language</p> <div className={styles.languageGrid}> {languageColumns.map((column, colIndex) => ( <ul key={colIndex} className={styles.languageColumn}> {column.map(lang => ( <li key={lang.name}><a href={lang.href}>{lang.name}</a></li> ))} </ul> ))} </div> </div> )}
        </div>
        <div className={styles.socialRow}> <span className={styles.followText}>Follow BBC on:</span> <ul className={styles.socialLinks}> {socialLinks.map(({ Icon, label, url }) => ( <li key={label}> <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Follow BBC on ${label}`}> <Icon /> </a> </li> ))} </ul> </div>
        <nav aria-label="Footer Legal Links" className={styles.legalNavContainer}> <ul className={styles.legalNav}> {legalNav.map(item => ( <li key={item}><Link to="/legal">{item}</Link></li> ))} </ul> </nav>
        <div className={styles.copyrightRow}> Copyright © {new Date().getFullYear()} BBC. All rights reserved. The BBC is not responsible for the content of external sites. <a href="#" className={styles.externalLinkInfo}>Read about our approach to external linking.</a> </div>
      </div>
    </footer>
  );
};
export default Footer;