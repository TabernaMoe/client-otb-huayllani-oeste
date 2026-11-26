import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthService } from '../services/auth.services';
import { authEvents } from '../../../core/auth/authEvents';
import { sessionStorageAdapter } from '../../../core/storage/sessionStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => AuthService.getToken());
  const [user, setUser] = useState(() => AuthService.getUser());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const syncFromStorage = useCallback(() => {
    setToken(AuthService.getToken());
    setUser(AuthService.getUser());
  }, []);

  const login = useCallback(async (credentials) => {
    const session = await AuthService.login(credentials);
    if (session?.ok && session?.token) {
      AuthService.saveSession(session);
      setToken(session.token);
      setUser(session.user);
    }
    return session;
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    const updated = AuthService.updateSession(patch);
    if (updated) {
      setUser(updated);
    }
    return updated;
  }, []);

  const refreshSession = useCallback(async () => {
    if (!AuthService.getToken()) return null;
    try {
      setIsRefreshing(true);
      const response = await AuthService.getMe();
      if (response?.ok && response?.user) {
        sessionStorageAdapter.setUser(response.user);
        setUser(response.user);
        return response.user;
      }
      return null;
    } catch {
      // 401 is handled centrally by the axios interceptor via authEvents
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Silent session verification on mount when a token is present
  useEffect(() => {
    if (token) {
      refreshSession();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Subscribe to Axios 401 unauthorized events & internal session updates
  useEffect(() => {
    const offUnauthorized = authEvents.on('unauthorized', () => {
      setToken(null);
      setUser(null);
    });

    const offSessionChanged = authEvents.on('sessionChanged', (payload) => {
      setToken(payload?.token ?? null);
      setUser(payload?.user ?? null);
    });

    const handleStorage = (event) => {
      if (
        event.key === sessionStorageAdapter.TOKEN_KEY ||
        event.key === sessionStorageAdapter.USER_KEY ||
        event.key === null
      ) {
        syncFromStorage();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      offUnauthorized();
      offSessionChanged();
      window.removeEventListener('storage', handleStorage);
    };
  }, [syncFromStorage]);

  const hasPermission = useCallback(
    (permission) => AuthService.hasPermission(permission, user),
    [user],
  );

  const hasAccountType = useCallback(
    (allowed) => {
      if (!user) return false;
      const list = Array.isArray(allowed) ? allowed : [allowed];
      return list.includes(user.tipo_usuario);
    },
    [user],
  );

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isRefreshing,
      login,
      logout,
      updateUser,
      refreshSession,
      hasPermission,
      hasAccountType,
    }),
    [
      token,
      user,
      isRefreshing,
      login,
      logout,
      updateUser,
      refreshSession,
      hasPermission,
      hasAccountType,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return ctx;
}
