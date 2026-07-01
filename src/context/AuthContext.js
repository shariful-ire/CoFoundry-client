'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/axios';

const AuthContext = createContext(null);

// The auth cookie is HttpOnly (can't be read here), but a non-HttpOnly
// "has-session" flag cookie is set alongside it, so we can tell up front
// whether a session might exist — without that, we'd have to call
// /api/auth/me and synchronously react to its result inside an effect.
function hasSessionCookie() {
  return typeof document !== 'undefined' && document.cookie.includes('has-session=1');
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(hasSessionCookie); // only wait on the check if a session might exist
  const loginCalled = useRef(false); // prevents fetchSession from overwriting explicit login()

  const fetchSession = useCallback(async () => {
    if (!hasSessionCookie()) return; // already reflected by the lazy initial state above

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
    (async () => {
      await fetchSession();
    })();
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
