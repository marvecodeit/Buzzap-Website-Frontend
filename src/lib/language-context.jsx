'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';

const dictionaries = { en, fr, es };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('buzzap_lang');
    if (saved && dictionaries[saved]) {
      setLang(saved);
    }
  }, []);

  const changeLanguage = (newLang) => {
    if (dictionaries[newLang]) {
      setLang(newLang);
      localStorage.setItem('buzzap_lang', newLang);
    }
  };

  // Safe nested key lookup helper e.g. t('nav.services')
  const t = (path, fallback = '') => {
    if (!path) return fallback;
    const keys = path.split('.');
    let currentDict = dictionaries[lang] || dictionaries.en;

    for (const k of keys) {
      if (currentDict && currentDict[k] !== undefined) {
        currentDict = currentDict[k];
      } else {
        // Fallback to English dictionary
        let fallbackDict = dictionaries.en;
        for (const fk of keys) {
          if (fallbackDict && fallbackDict[fk] !== undefined) {
            fallbackDict = fallbackDict[fk];
          } else {
            return fallback || path;
          }
        }
        return typeof fallbackDict === 'string' ? fallbackDict : fallback || path;
      }
    }
    return typeof currentDict === 'string' ? currentDict : fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return { lang: 'en', changeLanguage: () => {}, t: (k, fb = '') => fb || k };
  }
  return context;
};
