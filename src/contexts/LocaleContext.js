'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
  const [locale, setLocaleState] = useState('ko');
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드 시 쿠키에서 언어 가져오기
  useEffect(() => {
    const getLocaleFromCookie = () => {
      const cookies = document.cookie.split(';');
      const localeCookie = cookies.find(cookie => cookie.trim().startsWith('NEXT_LOCALE='));
      return localeCookie ? localeCookie.split('=')[1].trim() : 'ko';
    };

    const savedLocale = getLocaleFromCookie();
    setLocaleState(savedLocale);
    setIsLoading(false);
  }, []);

  // 언어 변경 함수
  const setLocale = newLocale => {
    if (newLocale === locale) return;

    // 쿠키에 저장 (1년)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    setLocaleState(newLocale);

    // 페이지 새로고침하여 서버에서 새 언어 적용
    window.location.reload();
  };

  const value = {
    locale,
    setLocale,
    isLoading,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
};
