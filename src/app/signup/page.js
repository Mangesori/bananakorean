import SignUpMain from '@/components/layout/main/SignUpMain';
import ThemeController from '@/components/shared/others/ThemeController';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';

export const metadata = {
  title: 'Sign Up',
  description: 'Sign Up',
};

const SignUp = () => {
  return (
    <PageWrapper>
      <main>
        <SignUpMain />
      </main>
    </PageWrapper>
  );
};

export default SignUp;
