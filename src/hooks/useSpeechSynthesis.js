import { useState, useEffect, useCallback, useRef } from 'react';

// Basic HTML stripper
const stripHtml = (htmlString) => {
  if (!htmlString) return '';
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  return doc.body.textContent || "";
};

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingArticleId, setSpeakingArticleId] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceQueue = useRef([]); // Queue for sentence utterances
  const currentArticleId = useRef(null); // Track which article's queue is active

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      console.warn("Web Speech API (SpeechSynthesis) is not supported.");
      setIsSupported(false);
    }
    // Cleanup function: Ensure speech stops on component unmount or reload
    const cancelOnUnload = () => {
        if (window.speechSynthesis.speaking) {
             window.speechSynthesis.cancel();
        }
    };
    window.addEventListener('beforeunload', cancelOnUnload);
    return () => {
      window.removeEventListener('beforeunload', cancelOnUnload);
      cancelOnUnload(); // Also cancel if the hook itself unmounts
    };
  }, []);

  // Function to process the next utterance in the queue
  const speakNext = useCallback(() => {
    if (utteranceQueue.current.length > 0) {
      const utterance = utteranceQueue.current.shift(); // Get the next sentence
      // Re-assign onend for the next item in the queue, except for the last one
      if (utteranceQueue.current.length > 0) {
          utterance.onend = speakNext; // Continue the chain
      } else {
          utterance.onend = handleSpeechEnd; // Last item resets state
      }
       utterance.onerror = (event) => {
          console.error('SpeechSynthesisUtterance.onerror', event);
          handleSpeechEnd(); // Reset on error
       };
      window.speechSynthesis.speak(utterance);
    } else {
      handleSpeechEnd();
    }
  }, []);

  // Function to clean up state when speech finishes or is cancelled
  const handleSpeechEnd = useCallback(() => {
    // Check if it was actually speaking *this* article before resetting
    // This prevents state reset if cancellation happened rapidly before speech started
    if (speakingArticleId === currentArticleId.current) {
        setIsSpeaking(false);
        setSpeakingArticleId(null);
        currentArticleId.current = null;
        utteranceQueue.current = []; // Clear the queue
    }
  }, [speakingArticleId]); // Depend on speakingArticleId

  // Main speak function - now queues sentences
  const speak = useCallback((textToSpeak, articleId) => {
    if (!isSupported || !textToSpeak) return;

    // Always cancel any ongoing speech first
    window.speechSynthesis.cancel(); // This is synchronous
    utteranceQueue.current = []; // Clear any remnants of a previous queue

    const plainText = stripHtml(textToSpeak);
    if (!plainText) return;

    // Split into sentences (basic split, could be improved with more complex regex)
    // This regex tries to keep the punctuation with the sentence.
    const sentences = plainText.match(/[^.!?]+[.!?]*\s*/g) || [];

    if (sentences.length === 0) {
        // Handle case where text exists but no sentences found (e.g., just "Headline")
        sentences.push(plainText);
    }

    // Create utterances for each sentence
    utteranceQueue.current = sentences
        .map(sentence => sentence.trim()) // Trim whitespace
        .filter(sentence => sentence.length > 0) // Remove empty sentences
        .map(sentence => new SpeechSynthesisUtterance(sentence));

    if (utteranceQueue.current.length === 0) return; // No valid sentences to speak

    // Set state *before* starting the sequence
    currentArticleId.current = articleId; // Set which article is being spoken
    setSpeakingArticleId(articleId);
    setIsSpeaking(true);

    // Start speaking the first sentence
    speakNext();

  }, [isSupported, speakNext, handleSpeechEnd]); // Add dependencies

  // Function to explicitly cancel speech
  const cancelSpeech = useCallback(() => {
    if (!isSupported) return;
    utteranceQueue.current = []; // Clear the queue immediately
    window.speechSynthesis.cancel(); // Stop any current utterance
    // Reset state immediately
    setIsSpeaking(false);
    setSpeakingArticleId(null);
    currentArticleId.current = null;
  }, [isSupported]);


  return {
    isSupported,
    isSpeaking,
    speakingArticleId,
    speak,
    cancelSpeech,
  };
};