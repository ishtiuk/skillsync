
import React, { useEffect, useState } from 'react';
import { AuthLeftSide } from './AuthLeftSide';
import { AuthRightSide } from './AuthRightSide';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  platform?: 'careerforge' | 'talenthub';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  platform: initialPlatform = 'careerforge'
}) => {
  const [platform, setPlatform] = useState<'careerforge' | 'talenthub'>(initialPlatform);

  // Listen for platform changes from the forms
  useEffect(() => {
    const handlePlatformChange = (event: CustomEvent) => {
      setPlatform(event.detail);
    };

    window.addEventListener('platformChange', handlePlatformChange as EventListener);
    return () => window.removeEventListener('platformChange', handlePlatformChange as EventListener);
  }, []);

  // Update platform when prop changes
  useEffect(() => {
    setPlatform(initialPlatform);
  }, [initialPlatform]);

  return (
    <div className="min-h-screen flex">
      <AuthLeftSide platform={platform} />
      <AuthRightSide title={title} subtitle={subtitle} platform={platform}>
        {children}
      </AuthRightSide>
    </div>
  );
};
