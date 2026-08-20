import { createContext, useCallback, useEffect, useState } from 'react';
import api, { clearAuthTokens } from '../utils/api';

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearAuthTokens();
    setUser(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      if (!localStorage.getItem('access_token') || !localStorage.getItem('refresh_token')) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        // This validates the access token and lets the API interceptor refresh it once.
        const { data } = await api.get('/user/profile/');
        if (isMounted) setUser({ username: data.username });
      } catch {
        logout();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const handleSessionExpired = () => {
      if (isMounted) setUser(null);
    };

    window.addEventListener('auth:logout', handleSessionExpired);
    restoreSession();
    return () => {
      isMounted = false;
      window.removeEventListener('auth:logout', handleSessionExpired);
    };
  }, [logout]);

  const login = async (username, password) => {
    try {
      const response = await api.post('/user/login/', { username, password }, { skipAuth: true });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setUser({ username });
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const signup = async (username, password) => {
      try {
          await api.post('/user/signup/', { username, password }, { skipAuth: true });
          return true;
      } catch (error) {
          console.error("Signup failed", error);
          throw error;
      }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
