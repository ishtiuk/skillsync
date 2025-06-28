import { useNavigate } from 'react-router-dom';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, UserProfile } from '@/types/auth';

interface AuthStore extends AuthState {
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<UserProfile>) => void;
}

// We need to handle navigation outside of the store since it requires React hooks
export const useHandleLogout = () => {
  const logout = useAuth(state => state.logout);
  const navigate = useNavigate();

  return () => {
    logout();
    navigate('/');
  };
};

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      platform: 'careerforge',

      login: (user: UserProfile, token: string) => {
        set({ user, token, platform: user.platform });
      },

      logout: () => {
        set({ user: null, token: null, platform: 'careerforge' });
      },

      updateUser: (updates: Partial<UserProfile>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
    }),
    {
      name: 'skillsync-auth',
    }
  )
);
