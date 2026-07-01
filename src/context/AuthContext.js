'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const loginCalled = useRef(false); // prevents fetchSession from overwriting explicit login()

  const fetchSession = useCallback(async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      if (!loginCalled.current) setUser(data);
    } catch {
      if (!loginCalled.current) setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = useCallback((userData) => {
    loginCalled.current = true;
    setUser(userData);
    setLoading(false);
  }, []);

  const logout = async () => {
    loginCalled.current = false;
    try {
      await api.post('/api/auth/signout');
    } catch { /* ignore */ }
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refetch: fetchSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
