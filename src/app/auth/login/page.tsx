import LoginForm from '@/components/shared/login/LoginForm';

export const metadata = {
  title: 'Login - Banana Korean',
  description: 'Login to your Banana Korean account',
};

export default function LoginPage() {
  return (
    <div className="container max-w-2xl mx-auto py-16 px-4">
      <LoginForm />
    </div>
  );
}
