import React, { useState } from 'react';
import Link from 'next/link'; // 추가
import { supabase } from '@/utils/supabaseClient'; // Supabase 클라이언트 임포트
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Remember me 상태 추가
  const [error, setError] = useState(null);

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Remember me 기능 구현
      if (rememberMe) {
        localStorage.setItem('email', email);
      } else {
        localStorage.removeItem('email');
      }

      // 로그인 성공 시 대시보드로 리다이렉트
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const redirectPath =
        profile?.role === 'admin' ? '/dashboards/admin-dashboard' : '/dashboards/student-dashboard';

      router.push(redirectPath);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSocialLogin = async provider => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboards/student-dashboard`,
        },
      });

      if (error) throw error;

      // 세션 정보 가져오기
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (session?.user) {
        // profiles 테이블에 사용자 정보 저장 시도
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
              role: 'student',
            },
          ])
          .select()
          .single();

        // 이미 프로필이 있는 경우(23505 에러) 무시하고 진행
        if (profileError && profileError.code !== '23505') {
          throw profileError;
        }

        // 로그인 성공 시 대시보드로 리다이렉트
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        const redirectPath =
          profile?.role === 'admin'
            ? '/dashboards/admin-dashboard'
            : '/dashboards/student-dashboard';

        router.push(redirectPath);
      }
    } catch (error) {
      console.error('Social login error:', error);
      setError(error.message);
    }
  };

  return (
    <div className="opacity-100 transition-opacity duration-150 ease-linear">
      <div className="text-center">
        <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
          Login
        </h3>
        <p className="text-contentColor dark:text-contentColor-dark mb-15px">
          {" Don't"} have an account yet?{' '}
          <Link
            href="/signup"
            className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
          >
            <strong>Sign up for free</strong>
          </Link>
        </p>
      </div>

      <form className="pt-25px" data-aos="fade-up" onSubmit={handleLogin}>
        <div className="mb-25px">
          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
            Email
          </label>
          <input
            type="text"
            placeholder="Email"
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
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
          />
        </div>

        <div className="flex items-center mb-25px justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-18px h-18px mr-2"
            />
            <label htmlFor="rememberMe" className="text-contentColor dark:text-contentColor-dark">
              Remember me
            </label>
          </div>
          <Link href="/forgot-password" className="text-primaryColor hover:underline">
            Forgot your password?
          </Link>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="my-25px text-center">
          <button
            type="submit"
            className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            Log in
          </button>
        </div>
        <div>
          <p className="text-contentColor dark:text-contentColor-dark text-center relative mb-15px before:w-2/5 before:h-1px before:bg-borderColor4 dark:before:bg-borderColor2-dark before:absolute before:left-0 before:top-4 after:w-2/5 after:h-1px after:bg-borderColor4 dark:after:bg-borderColor2-dark after:absolute after:right-0 after:top-4">
            or Log-in with
          </p>
        </div>
        <div className="text-center flex gap-x-1 md:gap-x-15px lg:gap-x-25px gap-y-5 items-center justify-center flex-wrap">
          <button
            type="button"
            onClick={() => handleSocialLogin('facebook')}
            className="text-size-15 text-whiteColor bg-primaryColor px-11 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            <i className="icofont-facebook"></i> Facebook
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="text-size-15 text-whiteColor bg-primaryColor px-11 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            <i className="icofont-google-plus"></i> Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
