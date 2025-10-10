'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signInAction } from '@/lib/supabase/actions';
import type { ActionState } from '@/lib/auth/middleware';

// Submit 버튼 컴포넌트 (useFormStatus 사용)
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark disabled:opacity-50"
    >
      {pending ? 'Logging in...' : 'Login'}
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

  const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
    try {
      // next 파라미터가 있으면 해당 값을 사용, 없으면 빈 문자열로 설정
      const nextParamValue = nextParam || '';
      const redirectUrl = nextParamValue
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextParamValue)}`
        : `${window.location.origin}/auth/callback`;

      console.log('[LOGIN-FORM] Social login redirect:', {
        provider,
        nextParam: nextParamValue,
        redirectUrl,
      });

      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      console.error('소셜 로그인 오류:', err);
    }
  };

  return (
    <div className="transition-opacity duration-150 ease-linear">
      <div className="text-center">
        <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
          Log In
        </h3>
        <p className="text-contentColor dark:text-contentColor-dark mb-15px">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/signup"
            className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
          >
            <strong>Sign Up</strong>
          </Link>
        </p>
      </div>

      <form className="pt-25px" action={formAction}>
        <div className="mb-25px">
          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="Your Email"
            defaultValue={rememberedEmail}
            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
          />
        </div>

        <div className="mb-25px">
          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
          />
        </div>

        <div className="flex justify-between mb-25px">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              value="true"
              defaultChecked={!!rememberedEmail}
              className="mr-2"
            />
            <span className="text-contentColor dark:text-contentColor-dark">Remember Me</span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-contentColor dark:text-contentColor-dark hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
          >
            Forgot Password?
          </Link>
        </div>

        {state?.error && <p className="text-red-500 text-sm mb-4">{state.error}</p>}

        <div className="mt-25px text-center">
          <SubmitButton />
        </div>

        <div>
          <p className="text-contentColor dark:text-contentColor-dark text-center relative mb-15px mt-25px before:w-2/5 before:h-1px before:bg-borderColor4 dark:before:bg-borderColor2-dark before:absolute before:left-0 before:top-4 after:w-2/5 after:h-1px after:bg-borderColor4 dark:after:bg-borderColor2-dark after:absolute after:right-0 after:top-4">
            or Log-in with
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => handleSocialSignIn('facebook')}
            className="text-size-15 text-whiteColor bg-primaryColor px-11 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            <i className="icofont-facebook"></i> Facebook
          </button>
          <button
            type="button"
            onClick={() => handleSocialSignIn('google')}
            className="text-size-15 text-whiteColor bg-primaryColor px-11 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            <i className="icofont-google-plus"></i> Google
          </button>
        </div>
      </form>
    </div>
  );
}
