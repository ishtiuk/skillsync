export const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('access_token');
  }
  return null;
};

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('access_token', token);
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('access_token');
  }
};
