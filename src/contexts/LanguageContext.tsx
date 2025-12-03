import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language } from '../constants/i18n';
import { CardType } from '../types/game';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getCardName: (type: CardType) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ja');

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key} in ${language}`);
        return key;
      }
    }

    if (typeof value !== 'string') {
        // キーが見つからない、または末端が文字列でない場合
        return key; 
    }

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = (value as string).replace(`{${paramKey}}`, String(paramValue));
      });
    }

    return value as string;
  };

  const getCardName = (type: CardType): string => {
      return translations[language].cards[type] || type;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getCardName }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

