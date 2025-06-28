import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from './Dashboard';
import Auth from './Auth';

const Index: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Auth />;
  }

  return <Dashboard />;
};

export default Index;
