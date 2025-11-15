// src/app/(auth)/login/page.tsx
'use client';

import LoginLayout from './components/LoginLayout';
import LoginForm from './components/LoginForm';

export default function LoginPage() {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
}
