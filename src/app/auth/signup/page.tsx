import SignUpForm from '@/components/shared/login/SignUpForm';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';

export const metadata = {
  title: 'Sign Up - Banana Korean',
  description: 'Create your Banana Korean account',
};

export default function SignUpPage() {
  return (
    <PageWrapper>
      <div className="container py-100px">
        <div className="md:w-2/3 mx-auto">
          <SignUpForm />
        </div>
      </div>
    </PageWrapper>
  );
}
