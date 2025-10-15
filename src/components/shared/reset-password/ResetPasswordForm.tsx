'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { resetPasswordAction } from '@/lib/supabase/actions';
import type { ActionState } from '@/lib/auth/middleware';
import svglogo from '@/assets/images/logo/svglogo.svg';

// Submit 버튼 컴포넌트
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primaryColor hover:bg-primaryColor/90 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
    >
      {pending ? 'Resetting...' : 'Reset Password'}
    </button>
  );
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const [isValidSession, setIsValidSession] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [state, formAction] = useFormState<ActionState, FormData>(resetPasswordAction, { error: '' });

  // 비밀번호 재설정 세션이 유효한지 확인
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setIsValidSession(true);
      } else {
        setSessionError('Invalid or expired reset link. Please request a new one.');
      }
    };

    checkSession();
  }, []);

  // 성공 시 리다이렉트
  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }
  }, [state?.success, router]);

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
            Create New Password
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Enter your new password below
          </p>
        </div>

        {isValidSession ? (
          <>
            {/* 폼 */}
            <form className="space-y-6" action={formAction}>
              <div className="space-y-4">
                {/* 새 비밀번호 입력 */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 비밀번호 확인 입력 */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 성공 메시지 */}
              {state?.success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {state.message} Redirecting to login...
                  </p>
                </div>
              )}

              {/* 에러 메시지 */}
              {state?.error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
                </div>
              )}

              {/* Submit 버튼 */}
              <div>
                <SubmitButton />
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            {sessionError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-600 dark:text-red-400">{sessionError}</p>
              </div>
            )}
            <Link
              href="/auth/forgot-password"
              className="text-primaryColor hover:text-primaryColor/80 font-medium"
            >
              Request a new reset link
            </Link>
          </div>
        )}

        {/* 하단 링크 */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-primaryColor hover:text-primaryColor/80"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
