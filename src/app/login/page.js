import LoginMain from '@/components/layout/main/LoginMain';
import ThemeController from '@/components/shared/others/ThemeController';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';

export const metadata = {
  title: 'Login/Register',
  description: 'Login/Register',
};
const Login = () => {
  return (
    <PageWrapper>
      <main>
        <LoginMain />
      </main>
    </PageWrapper>
  );
};

export default Login;
