
import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

const Register: React.FC = () => {
  return (
    <AuthLayout
      title="Join SkillSync"
      subtitle="Create your account and start your career journey with us"
      platform="careerforge" // Default to CareerForge for register page
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
