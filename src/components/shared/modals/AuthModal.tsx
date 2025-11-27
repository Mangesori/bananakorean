'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { createClient } from '@/lib/supabase/client';
import svglogo from '@/assets/images/logo/svglogo.svg';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'signup' | null;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, mode, onClose }) => {
  const t = useTranslations('auth.modal');
  const supabase = createClient();

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    try {
      // 현재 브라우저의 origin을 사용 (192.168.x.x:3000 등)
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${currentOrigin}/auth/callback`,
        },
      });

      if (error) {
        console.error('OAuth 오류:', error);
        return;
      }

      // 새 창으로 OAuth 진행
      window.open(data.url, 'oauth', 'width=500,height=600');

      // 모달 닫기
      onClose();
    } catch (err) {
      console.error('소셜 로그인 오류:', err);
    }
  };

  const handleEmailContinue = () => {
    onClose();
    // 페이지 이동은 Link 컴포넌트에서 처리
  };

  if (!isOpen || !mode) return null;

  const isLogin = mode === 'login';
  const subtitle = isLogin ? t('loginSubtitle') : t('signupSubtitle');
  const switchText = isLogin ? t('noAccount') : t('hasAccount');
  const switchLink = isLogin ? t('createAccount') : t('logIn');
  const switchHref = isLogin ? '/auth/signup' : '/auth/login';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-8">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 로고 */}
        <div className="flex justify-center mb-6">
          <Image
            src={svglogo}
            alt="Banana Korean Logo"
            width={140}
            height={140}
            className="w-36 h-auto"
          />
        </div>

        {/* 제목 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('title')}
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div className="space-y-3 mb-6">
          {/* Google 버튼 */}
          <button
            onClick={() => handleSocialAuth('google')}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors relative"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {t('continueWithGoogle')}
            </span>
            {/* Last used 배지 (임시로 표시) */}
            <span className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {t('lastUsed')}
            </span>
          </button>

          {/* Facebook 버튼 */}
          <button
            onClick={() => handleSocialAuth('facebook')}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {t('continueWithFacebook')}
            </span>
          </button>
        </div>

        {/* OR 구분선 */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">{t('or')}</span>
          </div>
        </div>

        {/* Continue with Email 버튼 */}
        <Link href={isLogin ? '/auth/login' : '/auth/signup'} className="block w-full">
          <button
            onClick={handleEmailContinue}
            className="w-full bg-primaryColor hover:bg-primaryColor/90 text-white py-3 px-4 rounded-lg font-medium transition-colors mb-6"
          >
            {t('continueWithEmail')}
          </button>
        </Link>

        {/* 하단 링크 */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <span>{switchText} </span>
          <Link
            href={switchHref}
            className="text-primaryColor hover:text-primaryColor/80"
            onClick={onClose}
          >
            {switchLink}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
