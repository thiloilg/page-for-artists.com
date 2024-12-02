import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const navigate = useNavigate();

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch('/.netlify/functions/refresh-token', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const { accessToken } = await response.json();
        localStorage.setItem('accessToken', accessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const success = await refreshAccessToken();
        if (success) {
          setIsAuthenticated(true);
          // In a real app, decode the token to get user info
          setUser({ email: 'demo@example.com' });
        } else {
          localStorage.removeItem('accessToken');
        }
      }
    };

    initAuth();
  }, [refreshAccessToken]);

  const login = async (email: string, password: string) => {
    const response = await fetch('/.netlify/functions/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const { accessToken } = await response.json();
    localStorage.setItem('accessToken', accessToken);
    setIsAuthenticated(true);
    setUser({ email });
    navigate('/dashboard');
  };

  const logout = async () => {
    await fetch('/.netlify/functions/logout', {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
