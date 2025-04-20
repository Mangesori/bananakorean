import ThemeController from '@/components/shared/others/ThemeController';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import LoginForm from '@/components/shared/login/LoginForm';

export const metadata = {
  title: 'Login/Register - Dark',
  description: 'Login/Register - Dark',
};
const Login_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <div className="container py-100px">
          <div className="md:w-2/3 mx-auto">
            <LoginForm />
          </div>
        </div>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Login_Dark;
