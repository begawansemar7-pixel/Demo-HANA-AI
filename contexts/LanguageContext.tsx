import React, { createContext, useState, useEffect, useCallback } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  // FIX: Update t function signature to accept replacements.
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${language}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error(error);
        // Fallback to English if loading fails
        const response = await fetch(`/locales/en.json`);
        const data = await response.json();
        setTranslations(data);
      }
    };

    loadTranslations();
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // FIX: Update t function to handle placeholder replacements.
  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    if (!translations) return key;
    const keys = key.split('.');
    let result: any = translations;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key; // Return the key if not found
      }
    }
    
    if (typeof result === 'string') {
      if (replacements) {
        return Object.keys(replacements).reduce((acc, placeholder) => {
          const value = replacements[placeholder];
          return acc.replace(new RegExp(`{${placeholder}}`, 'g'), String(value));
        }, result);
      }
      return result;
    }

    return key;
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};