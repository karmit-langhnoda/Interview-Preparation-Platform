// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { adminLogoutApi, loginApi, registerApi, logoutApi, meApi } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const bootstrapAuth = async () => {
      if (!token) {
        if (active) setLoading(false);
        return;
      }

      if (user?.role === 'admin') {
        if (active) setLoading(false);
        return;
      }

      try {
        const res = await meApi();
        const currentUser = res.data.data || res.data;

        if (!active) return;

        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (!active) return;

        setToken('');
        setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    bootstrapAuth();

    return () => {
      active = false;
    };
  }, [token]);

  const persistAuth = (payload) => {
    const authData = payload?.data || payload || {};
    const newToken = authData.token || '';
    const rawUser = authData.user || authData.admin || null;
    const currentUser = rawUser
      ? { ...rawUser, role: authData.role || rawUser.role || (authData.admin ? 'admin' : 'user') }
      : null;

    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
    }

    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
      setUser(currentUser);
    }

    return authData;
  };

  const login = async (payload) => {
    const res = await loginApi(payload);
    persistAuth(res.data);
    return res.data;
  };

  const register = async (payload) => {
    const res = await registerApi(payload);
    persistAuth(res.data);
    return res.data;
  };

  const logout = async () => {
    try {
      if (user?.role === 'admin') {
        await adminLogoutApi();
      } else {
        await logoutApi();
      }
    } catch (err) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token,
      login,
      register,
      logout
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthFromContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthFromContext must be used inside AuthProvider');
  return ctx;
};

export const useAuth = useAuthFromContext;