import LoginMain from '@/components/layout/main/LoginMain';
import ThemeController from '@/components/shared/others/ThemeController';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';

export const metadata = {
  title: 'Login/Register - Dark',
  description: 'Login/Register - Dark',
};
const Login_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <LoginMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Login_Dark;
