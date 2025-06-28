
import React, { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [platform, setPlatform] = useState<'careerforge' | 'talenthub'>('careerforge');

  // Listen for platform changes from the forms
  React.useEffect(() => {
    const handlePlatformChange = (event: CustomEvent) => {
      setPlatform(event.detail);
    };

    window.addEventListener('platformChange', handlePlatformChange as EventListener);
    return () => window.removeEventListener('platformChange', handlePlatformChange as EventListener);
  }, []);

  return (
    <AuthLayout
      title={isLogin ? "Welcome Back" : "Join SkillSync"}
      subtitle={isLogin
        ? "Sign in to your SkillSync account to continue tracking your career journey"
        : "Create your account and start your career journey with us"
      }
      platform={platform}
    >
      {isLogin ? <LoginForm /> : <RegisterForm />}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </p>
        <Button
          variant="link"
          onClick={() => setIsLogin(!isLogin)}
          className={`mt-2 p-0 h-auto font-medium hover-gradient-scale ${
            platform === 'careerforge'
              ? 'text-careerforge-gradient'
              : 'text-talenthub-gradient'
          }`}
        >
          {isLogin ? "Create an account" : "Sign in"}
        </Button>
      </div>
    </AuthLayout>
  );
};

export default Auth;
