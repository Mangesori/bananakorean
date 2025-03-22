'use client';
import LoginForm from '@/components/shared/login/LoginForm';
import LoginTab from '@/components/sections/login/LoginTab';

const LoginMain = () => {
  return (
    <>
      <div className="container py-100px">
        <div className="md:w-2/3 mx-auto">
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default LoginMain;
