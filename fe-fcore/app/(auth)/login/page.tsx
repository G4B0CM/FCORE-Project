// src/app/(auth)/login/page.tsx
import LoginLayout from './components/LoginLayout';
import LoginForm from './components/LoginForm';

type LoginPageProps = {
  searchParams: { redirectTo?: string };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectTo = searchParams.redirectTo || '/dashboard';

  return (
    <LoginLayout redirectTo={redirectTo}>
      <LoginForm redirectTo={redirectTo} />
    </LoginLayout>
  );
}
