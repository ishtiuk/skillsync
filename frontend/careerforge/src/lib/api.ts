import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

// Error handling utility
export const handleApiError = (error: any) => {
  console.error('API Error:', error);

  let errorMessage = 'Something went wrong. Please try again.';

  if (error.response?.data?.detail) {
    errorMessage = error.response.data.detail;
  } else if (error.message) {
    errorMessage = error.message;
  }

  toast({
    title: 'Error',
    description: errorMessage,
    variant: 'destructive',
  });
};

// Get base URL from environment or window.location
const getBaseUrl = () => {
  // If running in development, use the backend server URL
  if (import.meta.env.DEV) {
    // Use the same host as the frontend, but with port 8000
    const host = window.location.hostname;
    return `http://${host}:8000/api/v1`;
  }
  // In production, use relative path
  return '/api/v1';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('skillsync-auth');
  if (authData) {
    try {
      const { state } = JSON.parse(authData);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
        // Add platform to headers for backend context
        if (state?.platform) {
          config.headers['X-Platform'] = state.platform;
        }
      }
    } catch (e) {
      console.error('Error parsing auth data:', e);
    }
  }
  return config;
});

export const auth = {
  login: async (email: string, password: string, platform: 'careerforge' | 'talenthub') => {
    try {
      const response = await api.post('/auth/login/self', { email, password, platform });
      console.log('Login response:', response.data);

      // After successful login, fetch the user profile
      const userResponse = await api.get('/user/me', {
        headers: { Authorization: `Bearer ${response.data.access_token}` }
      });

      // Fetch profile picture URL if user has a profile picture
      let profilePictureUrl = null;
      if (userResponse.data.profile_picture_url) {
        const pictureResponse = await api.get('/generate-download-url/user/profile', {
          headers: { Authorization: `Bearer ${response.data.access_token}` }
        });
        profilePictureUrl = pictureResponse.data.download_url;
      }

      return {
        access_token: response.data.access_token,
        user: {
          ...userResponse.data,
          profile_picture_download_url: profilePictureUrl
        }
      };
    } catch (error: any) {
      console.error('Login error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },
  register: async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    platform: string;
  }) => {
    try {
      const response = await api.post('/user/self', userData);
      console.log('Register response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Register error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },
  getProfile: async () => {
    const response = await api.get('/user/me');
    return response.data;
  },
  updateProfile: async (updates: any) => {
    const response = await api.put('/user/update-user', updates);
    return response.data;
  },
  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getProfilePictureUrl: async () => {
    const response = await api.get('/generate-download-url/user/profile');
    return response.data;
  }
};

export const experiences = {
  getAll: async () => {
    try {
      const response = await api.get('/user/experience');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch experiences:', error);
      throw error;
    }
  },

  create: async (data: {
    position_title: string;
    organization_name: string;
    employment_type: string;
    is_current: boolean;
    start_month: number;
    start_year: number;
    end_month?: number;
    end_year?: number;
    logo_url?: string;
  }) => {
    try {
      const response = await api.post('/user/experience', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create experience:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<{
    position_title: string;
    organization_name: string;
    employment_type: string;
    is_current: boolean;
    start_month: number;
    start_year: number;
    end_month?: number;
    end_year?: number;
    logo_url?: string;
  }>) => {
    try {
      const response = await api.put(`/user/experience/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update experience:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/user/experience/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete experience:', error);
      throw error;
    }
  },
};

export const users = {
  getPublicProfile: async (userId: string) => {
    try {
      const response = await api.get(`/user/public/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch public profile:', error);
      throw error;
    }
  }
};

export const milestones = {
  getAll: async () => {
    const response = await api.get('/milestones');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/milestones', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/milestones/${id}`, data);
    return response.data;
  },
  markComplete: async (id: string) => {
    const response = await api.patch(`/milestones/${id}/complete`);
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/milestones/${id}`);
    return response.data;
  },
};

export const positions = {
  getPositions: async (filters: any, page: number = 0, limit: number = 20) => {
    try {
      const response = await api.post('/positions/careerforge', filters, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  getSectorCounts: async () => {
    try {
      const response = await api.get('/positions/careerforge/count');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  getPosition: async (id: string) => {
    try {
      const response = await api.get(`/positions/public/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};

export default api;
