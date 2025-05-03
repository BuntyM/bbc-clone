// src/utils/readingTimeUtils.js

const WORDS_PER_MINUTE = 225; // Average reading speed

/**
 * Removes HTML tags from a string.
 * Basic implementation, might not handle all edge cases perfectly.
 * @param {string} htmlString - The string containing HTML.
 * @returns {string} The string with HTML tags removed.
 */
const stripHtml = (htmlString) => {
  if (!htmlString) return '';
  // Replace tags with a space to handle cases like <p>word</p>word
  return htmlString.replace(/<[^>]*>/g, ' ');
};

/**
 * Calculates the estimated reading time in minutes for a given text.
 * @param {string} text - The text content (can include HTML).
 * @returns {number} Estimated reading time in minutes, rounded up.
 */
export const calculateReadingTime = (text) => {
  if (!text) {
    return 0;
  }

  // Remove HTML tags before counting words
  const plainText = stripHtml(text);

  // Count words by splitting by whitespace and filtering empty strings
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  if (wordCount === 0) {
    return 0;
  }

  // Calculate reading time and round up to the nearest minute
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  return minutes;
};