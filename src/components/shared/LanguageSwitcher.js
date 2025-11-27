'use client';
import React from 'react';
import { useLocale } from '@/contexts/LocaleContext';

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-1 bg-lightGrey7 dark:bg-lightGrey7-dark rounded-full p-1">
      <button
        onClick={() => setLocale('ko')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          locale === 'ko'
            ? 'bg-primaryColor text-whiteColor dark:text-whiteColor-dark shadow-sm'
            : 'text-contentColor dark:text-contentColor-dark hover:text-blackColor dark:hover:text-blackColor-dark'
        }`}
      >
        KOR
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          locale === 'en'
            ? 'bg-primaryColor text-whiteColor dark:text-whiteColor-dark shadow-sm'
            : 'text-contentColor dark:text-contentColor-dark hover:text-blackColor dark:hover:text-blackColor-dark'
        }`}
      >
        ENG
      </button>
    </div>
  );
};

export default LanguageSwitcher;
