'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { signInAction } from '@/lib/supabase/actions';
import { createClient } from '@/lib/supabase/client';
import type { ActionState } from '@/lib/auth/middleware';
import svglogo from '@/assets/images/logo/svglogo.svg';

// Submit 버튼 컴포넌트 (useFormStatus 사용)
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primaryColor hover:bg-primaryColor/90 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
    >
      {pending ? 'Logging in...' : 'Log in'}
    </button>
  );
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const nextParam = searchParams?.get('next');
  const [rememberedEmail, setRememberedEmail] = useState('');

  // useFormState로 Server Action 실행 (React 18)
  const [state, formAction] = useFormState<ActionState, FormData>(signInAction, { error: '' });

  // 쿠키에서 저장된 이메일 불러오기
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const emailCookie = cookies.find(c => c.trim().startsWith('remembered_email='));
    if (emailCookie) {
      const email = emailCookie.split('=')[1];
      setRememberedEmail(decodeURIComponent(email));
    }
  }, []);

  // 소셜 로그인 핸들러
  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('OAuth 오류:', error);
        return;
      }

      // 페이지 환경에서는 같은 창에서 리다이렉트
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('소셜 로그인 오류:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 로고 */}
        <div className="flex justify-center">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <Image
              src={svglogo}
              alt="Banana Korean Logo"
              width={180}
              height={180}
              className="w-44 h-auto"
            />
          </Link>
        </div>

        {/* 제목 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Start Learning Korean!
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Log in to your account
          </p>
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div className="space-y-3">
          {/* Google 버튼 */}
          <button
            onClick={() => handleSocialAuth('google')}
            type="button"
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors relative"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Continue with Google
            </span>
            <span className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              Last used
            </span>
          </button>

          {/* Facebook 버튼 */}
          <button
            onClick={() => handleSocialAuth('facebook')}
            type="button"
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Continue with Facebook
            </span>
          </button>
        </div>

        {/* OR 구분선 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">OR</span>
          </div>
        </div>

        {/* 폼 */}
        <form className="space-y-6" action={formAction}>
          <div className="space-y-4">
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email"
                defaultValue={rememberedEmail}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                value="true"
                defaultChecked={!!rememberedEmail}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* 에러 메시지 */}
          {state?.error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
            </div>
          )}

          {/* 로그인 버튼 */}
          <div>
            <SubmitButton />
          </div>
        </form>

        {/* 하단 링크 */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link
            href="/auth/signup"
            className="font-medium text-primaryColor hover:text-primaryColor/80"
          >
            Create your account
          </Link>
        </div>
      </div>
    </div>
  );
}
