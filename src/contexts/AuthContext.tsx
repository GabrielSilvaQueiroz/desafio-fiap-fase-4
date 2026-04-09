import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import api, { extractData, setAuthToken, setUnauthorizedHandler } from '../services/api';
import { clearSession, loadSession, saveSession } from '../services/authStorage';
import type { AuthResponse, User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isTeacher: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  patchCurrentUser: (nextUser: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback(async (nextToken: string, nextUser: User) => {
    setAuthToken(nextToken);
    setTokenState(nextToken);
    setUser(nextUser);
    await saveSession(nextToken, nextUser);
  }, []);

  const logout = useCallback(async () => {
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
    await clearSession();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await api.post('/auth/login', { email, password });
      const auth = extractData<AuthResponse>(response);

      await applySession(auth.token, auth.user);
      return auth.user;
    },
    [applySession]
  );

  const patchCurrentUser = useCallback(
    async (nextUser: User) => {
      if (!token) {
        return;
      }

      setUser(nextUser);
      await saveSession(token, nextUser);
    },
    [token]
  );

  useEffect(() => {
    async function bootstrap() {
      try {
        const session = await loadSession();
        if (session) {
          setAuthToken(session.token);
          setTokenState(session.token);
          setUser(session.user);
        }
      } finally {
        setLoading(false);
      }
    }

    void bootstrap();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void logout();
    });

    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      isTeacher: user?.role === 'teacher',
      login,
      logout,
      patchCurrentUser,
    }),
    [login, loading, logout, patchCurrentUser, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de AuthProvider.');
  }

  return context;
}
