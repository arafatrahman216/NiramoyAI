import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { LANGUAGES, languageNames } from '../i18n';

/**
 * LanguageSwitcher Component
 * 
 * A minimalist language toggle button that:
 * - Allows users to switch between available languages
 * - Persists language preference to localStorage (handled by i18next)
 * - Shows a dropdown with all available languages
 * - Matches the project's dark theme and design vibe
 * 
 * Features:
 * - Smooth animations with framer-motion
 * - Minimalist design fitting the NiramoyAI aesthetic
 * - Easy keyboard navigation support
 * - Accessible ARIA labels
 */
const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = i18n.language;

  const handleLanguageChange = (language) => {
    // Change language via i18next (automatically saves to localStorage)
    i18n.changeLanguage(language);
    setIsOpen(false);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.language-switcher')) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="language-switcher relative">
      {/* Language Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg 
          transition-all duration-200 font-medium text-sm
          ${isOpen
            ? 'bg-zinc-700 text-white border border-emerald-500/50'
            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-transparent hover:border-zinc-600'
          }
        `}
        aria-label={t('common.language')}
        aria-expanded={isOpen}
      >
        {/* Globe Icon */}
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20H7m6-4h.01" 
          />
        </svg>
        
        {/* Current Language Code */}
        <span>{currentLanguage.toUpperCase()}</span>
        
        {/* Dropdown Arrow */}
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </motion.button>

      {/* Language Dropdown Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className={`
            absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 
            rounded-lg shadow-2xl py-2 z-50 backdrop-blur-sm
          `}
          role="menu"
          aria-orientation="vertical"
        >
          {/* Language Options */}
          {Object.values(LANGUAGES).map((lang) => (
            <motion.button
              key={lang}
              whileHover={{ x: 4 }}
              onClick={() => handleLanguageChange(lang)}
              className={`
                w-full text-left px-4 py-2 transition-all duration-200 
                rounded-lg mx-1 my-0.5 font-medium
                ${currentLanguage === lang
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
                }
              `}
              role="menuitem"
            >
              <div className="flex items-center justify-between">
                <span>{languageNames[lang]}</span>
                {currentLanguage === lang && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </div>
            </motion.button>
          ))}

          {/* Divider */}
          <div className="border-t border-zinc-700 my-2"></div>

          {/* Info Text */}
          <div className="px-4 py-2 text-xs text-zinc-500">
            {t('common.language')}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
