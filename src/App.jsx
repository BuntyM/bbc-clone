import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import Sidebar from './components/Sidebar/Sidebar';
import HomePage from './pages/HomePage/HomePage';
import ArticlePage from './pages/ArticlePage/ArticlePage';
import FactCheckerPage from './pages/FactCheckerPage/FactCheckerPage';
import GenericPage from './pages/GenericPage/GenericPage'; // Import GenericPage
import ThemeToggle from './components/Theme/ThemeToggle';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis'; // Import TTS Hook

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Use the TTS hook
  const {
      isSupported: isSpeechSupported, // Get support status
      isSpeaking,
      speakingArticleId,
      speak,
      cancelSpeech
  } = useSpeechSynthesis();

  // --- Theme State ---
  const [theme, setTheme] = useState(() => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      if (window.matchMedia?.('(prefers-color-scheme: dark)')?.matches) return 'dark';
      return 'light';
  });

  // --- Theme Effect ---
  useEffect(() => {
      if (theme === 'dark') { document.body.classList.add('dark-mode'); }
      else { document.body.classList.remove('dark-mode'); }
      localStorage.setItem('theme', theme);
  }, [theme]);

  // --- Theme Toggle Function ---
  const toggleTheme = useCallback(() => {
      setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => { if (isSidebarOpen) setIsSidebarOpen(false); }
  const handleMainClick = () => closeSidebar();

  // <<< Define TTS props object to pass down >>>
  const ttsProps = { isSpeechSupported, isSpeaking, speakingArticleId, speak, cancelSpeech };

  return (
    <BrowserRouter>
      <Header onMenuClick={toggleSidebar} theme={theme}>
         <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </Header>
      <Navigation />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main onClick={handleMainClick}>
        <Routes>
          {/* <<< Ensure ttsProps are passed to HomePage >>> */}
          <Route path="/" element={<HomePage {...ttsProps} />} />
          <Route path="/article/:articleId" element={<ArticlePage />} />
          <Route path="/fact-check" element={<FactCheckerPage />} />
          <Route path="/page/:pageTitle" element={<GenericPage />} /> {/* Add route for GenericPage */}
          {/* <<< Ensure ttsProps are passed to fallback HomePage >>> */}
          <Route path="*" element={ <HomePage {...ttsProps} /> } />
        </Routes>
      </main>

      <Footer theme={theme} />
    </BrowserRouter>
  );
}

export default App;
