'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { type Provider } from '@supabase/supabase-js';
import { signUpAction, signInWithProviderAction } from '@/lib/supabase/actions';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 리다이렉트 URL 가져오기
  const redirectUrl = searchParams?.get('redirectUrl') || '/';

  useEffect(() => {
    // 로컬 스토리지에서 저장된 이메일 가져오기
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // 리다이렉트 URL 저장
      if (redirectUrl !== '/') {
        localStorage.setItem('redirectUrl', redirectUrl);
      }

      // FormData 객체 생성
      const data = new FormData();
      data.append('name', name);
      data.append('email', email);
      data.append('password', password);

      // 서버 액션 호출
      const result = await signUpAction(data);

      if (result?.error) {
        throw new Error(result.error);
      }

      // 성공 메시지 표시
      setSuccessMessage(result.message || '회원가입이 완료되었습니다. 이메일을 확인해주세요.');

      // 일정 시간 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: Provider) => {
    try {
      setLoading(true);
      setError(null);

      // 리다이렉트 URL 저장
      if (redirectUrl !== '/') {
        localStorage.setItem('redirectUrl', redirectUrl);
      }

      const result = await signInWithProviderAction(provider, redirectUrl);

      if (result?.error) {
        throw new Error(result.error);
      }

      // OAuth 리디렉션 URL로 이동
      if (result && 'url' in result) {
        window.location.href = result.url as string;
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err: unknown) => {
    console.error('회원가입 오류:', err);
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="transition-opacity duration-150 ease-linear">
      <div className="text-center">
        <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
          Sign Up
        </h3>
        <p className="text-contentColor dark:text-contentColor-dark mb-15px">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
          >
            <strong>Log In</strong>
          </Link>
        </p>
      </div>

      {successMessage ? (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded text-center">
          <p>{successMessage}</p>
          <p className="text-sm mt-2">잠시 후 로그인 페이지로 이동합니다...</p>
        </div>
      ) : (
        <form className="pt-25px" data-aos="fade-up" onSubmit={handleSignUp}>
          <div className="mb-25px">
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
          </div>

          <div className="mb-25px">
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
          </div>

          <div className="mb-25px">
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="mt-25px text-center">
            <button
              type="submit"
              disabled={loading}
              className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark disabled:opacity-50"
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </div>

          <div>
            <p className="text-contentColor dark:text-contentColor-dark text-center relative mb-15px mt-25px before:w-2/5 before:h-1px before:bg-borderColor4 dark:before:bg-borderColor2-dark before:absolute before:left-0 before:top-4 after:w-2/5 after:h-1px after:bg-borderColor4 dark:after:bg-borderColor2-dark after:absolute after:right-0 after:top-4">
              or Sign-up with
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => handleSocialSignUp('facebook')}
              className="text-size-15 text-whiteColor bg-primaryColor px-11 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
            >
              <i className="icofont-facebook"></i> Facebook
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignUp('google')}
              className="text-size-15 text-whiteColor bg-primaryColor px-11 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
            >
              <i className="icofont-google-plus"></i> Google
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SignUpForm;
