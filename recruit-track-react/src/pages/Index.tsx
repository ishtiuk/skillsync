import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from './Dashboard';
import DashboardTalentHub from './Dashboard_talenthub';
import Auth from './Auth';

const Index: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Auth />;
  }

  return user.platform === 'talenthub' ? <DashboardTalentHub /> : <Dashboard />;
};

export default Index;
