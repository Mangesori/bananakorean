'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { type Provider } from '@supabase/supabase-js';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { signUpAction, signInWithProviderAction } from '@/lib/supabase/actions';
import type { ActionState } from '@/lib/auth/middleware';
import svglogo from '@/assets/images/logo/svglogo.svg';

// Submit 버튼 컴포넌트 (useFormStatus 사용)
function SubmitButton({ step, isLoading }: { step: 'email' | 'password'; isLoading?: boolean }) {
  const { pending } = useFormStatus();
  const t = useTranslations('auth.signUp');

  return (
    <button
      type="submit"
      disabled={pending || isLoading}
      className="w-full bg-primaryColor hover:bg-primaryColor/90 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
    >
      {pending ? t('creatingAccount') : step === 'email' ? t('continue') : t('createAccount')}
    </button>
  );
}

const SignUpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('auth.signUp');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [step, setStep] = useState<'role' | 'email' | 'password'>('role');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  // 유효성 검사 에러 state
  const [errors, setErrors] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });

  // useFormState로 Server Action 실행 (React 18)
  const [state, formAction] = useFormState<ActionState, FormData>(signUpAction, { error: '' });

  // 리다이렉트 URL 가져오기
  const redirectUrl = searchParams?.get('redirectUrl') || '/';

  // 회원가입 성공 시 처리
  useEffect(() => {
    if (state?.success && state?.message) {
      setSuccessMessage(state.message);
      // 3초 후 로그인 페이지로 이동
      const timer = setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  // 유효성 검사 함수들
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return t('errors.emailRequired');
    }
    if (!emailRegex.test(email)) {
      return t('errors.emailInvalid');
    }
    return '';
  };

  const validateName = (name: string) => {
    if (name.length < 3 || name.length > 20) {
      return t('errors.nameLength');
    }
    const numberCount = (name.match(/\d/g) || []).length;
    if (numberCount > 5) {
      return t('errors.nameNumbers');
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (password.length < 8 || password.length > 20) {
      return t('errors.passwordLength');
    }
    if (/\s/.test(password)) {
      return t('errors.passwordSpaces');
    }
    const types = [
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^a-zA-Z0-9]/.test(password)
    ].filter(Boolean).length;
    if (types < 2) {
      return t('errors.passwordTypes');
    }
    return '';
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const emailValue = formData.get('email') as string;

    const emailError = validateEmail(emailValue);
    if (emailError) {
      setErrors(prev => ({ ...prev, email: emailError }));
      return;
    }

    setEmail(emailValue);
    setErrors(prev => ({ ...prev, email: '' }));
    setStep('password');
  };

  const handleRoleContinue = () => {
    setStep('email');
  };

  const handleEditRole = () => {
    setStep('role');
  };

  const handleSocialSignUp = async (provider: Provider) => {
    try {
      // 선택한 역할을 쿼리 파라미터로 전달
      const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?role=${role}`;

      // 리다이렉트 URL 저장
      if (redirectUrl !== '/') {
        localStorage.setItem('redirectUrl', redirectUrl);
      }

      const result = await signInWithProviderAction(provider, callbackUrl);

      if (result?.error) {
        console.error('소셜 회원가입 오류:', result.error);
        return;
      }

      // OAuth 리디렉션 URL로 이동
      if (result && 'url' in result) {
        window.location.href = result.url as string;
      }
    } catch (err) {
      console.error('소셜 회원가입 오류:', err);
    }
  };

  if (successMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
              {t('accountCreatedTitle')}
            </h3>
            <p className="text-sm text-green-600 dark:text-green-400 mb-4">
              {successMessage}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              {t('redirecting')}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            {t('title')}
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </div>

        {/* Step 1: 역할 선택 */}
        {step === 'role' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                {t('roleLabel')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    role === 'student'
                      ? 'border-primaryColor bg-primaryColor/10 dark:bg-primaryColor/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">🎓</div>
                    <div className={`font-medium ${role === 'student' ? 'text-primaryColor' : 'text-gray-700 dark:text-gray-300'}`}>
                      {t('student')}
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    role === 'teacher'
                      ? 'border-primaryColor bg-primaryColor/10 dark:bg-primaryColor/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">👨‍🏫</div>
                    <div className={`font-medium ${role === 'teacher' ? 'text-primaryColor' : 'text-gray-700 dark:text-gray-300'}`}>
                      {t('teacher')}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Continue 버튼 */}
            <div>
              <button
                type="button"
                onClick={handleRoleContinue}
                className="w-full bg-primaryColor hover:bg-primaryColor/90 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {t('continue')}
              </button>
            </div>

            {/* 하단 링크 */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {t('alreadyHaveAccount')}{' '}
              <Link
                href="/auth/login"
                className="font-medium text-primaryColor hover:text-primaryColor/80"
              >
                {t('logIn')}
              </Link>
            </div>
          </>
        )}

        {/* Step 2: 가입 방법 선택 - step === 'email'일 때만 표시 */}
        {step === 'email' && (
          <>
            {/* 뒤로 가기 버튼 */}
            <button
              type="button"
              onClick={() => setStep('role')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors mb-4"
            >
              <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
            </button>

            {/* 선택된 역할 표시 */}
            <div className="flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-2">
                <span className="text-xl">{role === 'student' ? '🎓' : '👨‍🏫'}</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {role === 'student' ? t('student') : t('teacher')}
                </span>
              </div>
            </div>

            {/* 소셜 로그인 버튼들 */}
            <div className="space-y-3">
              {/* Google 버튼 */}
              <button
                onClick={() => handleSocialSignUp('google')}
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
                  {t('continueWithGoogle')}
                </span>
                <span className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {t('lastUsed')}
                </span>
              </button>

              {/* Facebook 버튼 */}
              <button
                onClick={() => handleSocialSignUp('facebook')}
                type="button"
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
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">{t('or')}</span>
              </div>
            </div>

            {/* 이메일 입력 폼 */}
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t('emailPlaceholder')}
                  onChange={(e) => {
                    const error = validateEmail(e.target.value);
                    setErrors(prev => ({ ...prev, email: error }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* 약관 동의 */}
              <div className="text-center text-xs text-gray-600 dark:text-gray-400">
                {t('termsAgree')}{' '}
                <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {t('termsOfService')}
                </Link>{' '}
                {t('and')}{' '}
                <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {t('privacyPolicy')}
                </Link>
              </div>

              <div>
                <SubmitButton step="email" isLoading={!!errors.email} />
              </div>
            </form>

            {/* 하단 링크 */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {t('alreadyHaveAccount')}{' '}
              <Link
                href="/auth/login"
                className="font-medium text-primaryColor hover:text-primaryColor/80"
              >
                {t('logIn')}
              </Link>
            </div>
          </>
        )}

        {/* Step 3: 비밀번호 입력 */}
        {step === 'password' && (
          <form className="space-y-6" action={formAction}>
            {/* 뒤로 가기 버튼 */}
            <button
              type="button"
              onClick={() => setStep('email')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors mb-4"
            >
              <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
            </button>

            {/* Role 컴팩트 표시 */}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-lg">{role === 'student' ? '🎓' : '👨‍🏫'}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {role === 'student' ? t('student') : t('teacher')}
                </span>
              </div>
              <button
                type="button"
                onClick={handleEditRole}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 text-sm font-medium"
              >
                {t('edit')}
              </button>
            </div>

            {/* 이메일 표시 (Edit 버튼 없음) */}
            <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <span className="text-gray-900 dark:text-white text-sm">{email}</span>
            </div>
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="role" value={role} />

            {/* 이름 입력 */}
            <div>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder={t('namePlaceholder')}
                onChange={(e) => {
                  const error = validateName(e.target.value);
                  setErrors(prev => ({ ...prev, name: error }));
                }}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder={t('passwordPlaceholder')}
                onChange={(e) => {
                  const error = validatePassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: error }));
                }}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder={t('confirmPasswordPlaceholder')}
                onChange={(e) => {
                  const passwordField = document.querySelector<HTMLInputElement>('#password');
                  const password = passwordField?.value || '';
                  const error = e.target.value !== password ? t('errors.confirmPasswordMatch') : '';
                  setErrors(prev => ({ ...prev, confirmPassword: error }));
                }}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 에러 메시지 */}
            {state?.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
              </div>
            )}

            <div>
              <SubmitButton step="password" isLoading={!!(errors.name || errors.password || errors.confirmPassword)} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUpForm;
