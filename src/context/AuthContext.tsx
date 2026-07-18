import React, { createContext, useContext, useState, useEffect } from 'react';
import type {ReactNode} from 'react'
import { showBackendToast } from '../utils/domUtils';

export interface UserSession {
  id: string;
  email: string;
  nombre: string;
  roles: string[];
  permissions: string[];
}

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, nombre: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('canek_auth_token');
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Validar sesión del usuario al cargar la página
  const checkSession = async () => {
    const activeToken = localStorage.getItem('canek_auth_token');
    if (!activeToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        setToken(activeToken);
      } else {
        // Token expirado o inválido
        localStorage.removeItem('canek_auth_token');
        setUser(null);
        setToken(null);
        showBackendToast(data.message || 'La sesión expiró.', 'warning');
      }
    } catch (err) {
      console.error('Error al validar sesión:', err);
      // No borrar token local en caso de error de red, solo pausar
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // Inicio de sesión
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('canek_auth_token', data.token);
        setToken(data.token);
        setUser(data.user);
        
        // MANIPULACIÓN DEL DOM: Mostrar notificación de éxito devuelta por el backend
        showBackendToast(data.message, 'success');
        return true;
      } else {
        // MANIPULACIÓN DEL DOM: Mostrar error devuelto por el backend
        showBackendToast(data.message || 'Credenciales inválidas.', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error en login:', error);
      showBackendToast('Error de conexión con el servidor de autenticación.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Registro de usuarios
  const register = async (email: string, password: string, nombre: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, nombre })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // MANIPULACIÓN DEL DOM: Mostrar notificación de éxito devuelta por el backend
        showBackendToast(data.message, 'success');
        return true;
      } else {
        // MANIPULACIÓN DEL DOM: Mostrar error devuelto por el backend
        showBackendToast(data.message || 'Error al registrar el usuario.', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error en register:', error);
      showBackendToast('Error al conectar con el servidor de registro.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cierre de sesión
  const logout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      const data = await response.json();
      
      localStorage.removeItem('canek_auth_token');
      setToken(null);
      setUser(null);

      // MANIPULACIÓN DEL DOM: Mostrar cierre de sesión
      showBackendToast(data.message || 'Sesión cerrada correctamente.', 'info');
    } catch (error) {
      // Si falla la red, cerramos de todas formas localmente
      localStorage.removeItem('canek_auth_token');
      setToken(null);
      setUser(null);
      showBackendToast('Sesión cerrada localmente.', 'info');
    } finally {
      setLoading(false);
    }
  };

  // Verificar si tiene un permiso
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    // Administrador siempre tiene acceso
    if (user.roles.includes('Administrador')) return true;
    return user.permissions.includes(permission);
  };

  // Verificar si tiene un rol
  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      hasPermission,
      hasRole,
      checkSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
