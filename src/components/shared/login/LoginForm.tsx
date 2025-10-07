'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams?.get('next');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // 로컬 스토리지에서 이메일 불러오기
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 이메일 기억하기 설정
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // 사용자 프로필 정보 조회
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        throw new Error('사용자 정보를 불러오는데 실패했습니다.');
      }

      // 사용자 역할에 따른 리디렉션
      const redirectUrl =
        nextParam ||
        (profileData.role === 'admin'
          ? '/dashboards/admin-dashboard'
          : '/dashboards/student-dashboard');

      router.push(redirectUrl);
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
    try {
      setLoading(true);
      setError(null);

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

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('소셜 로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
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

      <form className="pt-25px" onSubmit={handleSignIn}>
        <div className="mb-25px">
          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
            Email
          </label>
          <input
            type="email"
            required
            placeholder="Your Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
          />
        </div>

        <div className="mb-25px">
          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
          />
        </div>

        <div className="flex justify-between mb-25px">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
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

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mt-25px text-center">
          <button
            type="submit"
            disabled={loading}
            className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
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
