'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { requestPasswordResetAction } from '@/lib/supabase/actions';
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
      {pending ? 'Sending...' : 'Send Reset Link'}
    </button>
  );
}

export default function ForgotPasswordForm() {
  const [state, formAction] = useFormState<ActionState, FormData>(requestPasswordResetAction, { error: '' });

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
            Reset Your Password
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* 폼 */}
        <form className="space-y-6" action={formAction}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 성공 메시지 */}
          {state?.success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm text-green-600 dark:text-green-400">{state.message}</p>
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

        {/* 하단 링크 */}
        <div className="text-center space-y-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-primaryColor hover:text-primaryColor/80"
            >
              Log in
            </Link>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
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
    </div>
  );
}
