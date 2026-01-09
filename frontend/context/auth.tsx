import React, { createContext, useContext, useMemo, useState } from 'react';

type UserRole = 'user' | 'admin';

export type AuthUser = {
  email: string;
  role: UserRole;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const MOCK_USERS: Array<{ email: string; password: string; role: UserRole }> = [
  { email: 'user@test.com', password: 'password123', role: 'user' },
  { email: 'admin@test.com', password: 'admin123', role: 'admin' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string) => {
    const match = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!match) {
      throw new Error('Invalid email or password');
    }

    setUser({ email: match.email, role: match.role });
  };

  const signup = async (email: string, _password: string, _name?: string) => {
    setUser({ email, role: 'user' });
  };

  const logout = async () => {
    setUser(null);
  };

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      loading: false,
      isAdmin: user?.role === 'admin',
      login,
      signup,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
