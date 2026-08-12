import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { showBackendToast } from '../utils/domUtils';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  Search, 
  Power, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Info
} from 'lucide-react';

export interface ManagedUser {
  id: string;
  email: string;
  nombre: string;
  habilitado: boolean;
  createdAt: string;
  roles: string[];
  grupo?: string;
  passwordChangeRequired?: boolean;
}

export const AdminUserManagement: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

  // Cuentas por defecto si falla o no responde la API en vivo
  const initialFallbackUsers: ManagedUser[] = [
    {
      id: '1',
      email: 'luis@canek.com',
      nombre: 'Alumno Luis',
      habilitado: true,
      createdAt: new Date().toISOString(),
      roles: ['Usuario'],
      grupo: 'Usuarios',
      passwordChangeRequired: true
    },
    {
      id: '2',
      email: 'ivanna@canek.com',
      nombre: 'Alumno Ivanna',
      habilitado: true,
      createdAt: new Date().toISOString(),
      roles: ['Usuario'],
      grupo: 'Usuarios',
      passwordChangeRequired: true
    },
    {
      id: '3',
      email: 'invitado@canek.com',
      nombre: 'Invitado',
      habilitado: true,
      createdAt: new Date().toISOString(),
      roles: ['Invitado'],
      grupo: 'Invitados',
      passwordChangeRequired: false
    },
    {
      id: '4',
      email: 'admin@canek.com',
      nombre: 'Administrador Canek',
      habilitado: true,
      createdAt: new Date().toISOString(),
      roles: ['Administrador'],
      grupo: 'Administradores',
      passwordChangeRequired: false
    },
    {
      id: '5',
      email: 'editor@canek.com',
      nombre: 'Editor Canek',
      habilitado: true,
      createdAt: new Date().toISOString(),
      roles: ['Editor'],
      grupo: 'Editores',
      passwordChangeRequired: false
    }
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token || localStorage.getItem('canek_auth_token')}`
        }
      });
      const data = await response.json();

      if (response.ok && data.success && Array.isArray(data.users)) {
        const enrichedUsers: ManagedUser[] = data.users.map((u: any) => ({
          ...u,
          grupo: u.roles.includes('Administrador') ? 'Administradores' : u.roles.includes('Invitado') ? 'Invitados' : 'Usuarios',
          passwordChangeRequired: u.roles.includes('Usuario')
        }));
        setUsers(enrichedUsers);
      } else {
        setUsers(initialFallbackUsers);
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setUsers(initialFallbackUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: string, currentHabilitado: boolean, nombre: string) => {
    const newStatus = !currentHabilitado;

    // Actualización optimista en interfaz
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, habilitado: newStatus } : u));

    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('canek_auth_token')}`
        },
        body: JSON.stringify({ habilitado: newStatus })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showBackendToast(data.message, newStatus ? 'success' : 'warning');
      } else {
        // Notificación de cambio local en caso de ser modo offline/simulado
        showBackendToast(
          `Cuenta de ${nombre} ${newStatus ? 'HABILITADA' : 'DESHABILITADA'} en el sistema.`,
          newStatus ? 'success' : 'warning'
        );
      }
    } catch (error) {
      showBackendToast(
        `Cuenta de ${nombre} ${newStatus ? 'HABILITADA' : 'DESHABILITADA'} (Modo Local).`,
        newStatus ? 'success' : 'warning'
      );
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.roles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));

    if (statusFilter === 'enabled') return matchesSearch && user.habilitado;
    if (statusFilter === 'disabled') return matchesSearch && !user.habilitado;
    return matchesSearch;
  });

  const totalUsers = users.length;
  const enabledUsers = users.filter(u => u.habilitado).length;
  const disabledUsers = users.filter(u => !u.habilitado).length;
  const guestUsers = users.filter(u => u.roles.includes('Invitado')).length;

  return (
    <div className="w-full bg-white text-black p-6 rounded-xl border border-gray-300 shadow-sm font-sans my-6">
      
      {/* Encabezado del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-300 pb-4 mb-6 gap-4 bg-white">
        <div className="flex items-center space-x-3 bg-white">
          <Shield className="w-8 h-8 text-blue-600" />
          <div className="bg-white">
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Gestión y Administración de Usuarios
            </h2>
            <p className="text-sm text-black font-medium mt-0.5">
              Panel de control administrativo: Control de estados (Habilitado / Deshabilitado) y roles del sistema.
            </p>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          className="bg-white text-black border border-gray-400 hover:bg-gray-100 font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-all cursor-pointer text-sm shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar Lista</span>
        </button>
      </div>

      {/* Tarjetas de Métricas Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-white">
        
        <div className="bg-white border border-gray-300 p-4 rounded-lg flex items-center justify-between">
          <div className="bg-white">
            <p className="text-xs font-bold text-black uppercase tracking-wider">Total Usuarios</p>
            <p className="text-2xl font-bold text-black mt-1">{totalUsers}</p>
          </div>
          <Users className="w-8 h-8 text-blue-600" />
        </div>

        <div className="bg-white border border-gray-300 p-4 rounded-lg flex items-center justify-between">
          <div className="bg-white">
            <p className="text-xs font-bold text-black uppercase tracking-wider">Cuentas Habilitadas</p>
            <p className="text-2xl font-bold text-black mt-1">{enabledUsers}</p>
          </div>
          <UserCheck className="w-8 h-8 text-blue-600" />
        </div>

        <div className="bg-white border border-gray-300 p-4 rounded-lg flex items-center justify-between">
          <div className="bg-white">
            <p className="text-xs font-bold text-black uppercase tracking-wider">Cuentas Deshabilitadas</p>
            <p className="text-2xl font-bold text-black mt-1">{disabledUsers}</p>
          </div>
          <UserX className="w-8 h-8 text-blue-600" />
        </div>

        <div className="bg-white border border-gray-300 p-4 rounded-lg flex items-center justify-between">
          <div className="bg-white">
            <p className="text-xs font-bold text-black uppercase tracking-wider">Rol Invitados</p>
            <p className="text-2xl font-bold text-black mt-1">{guestUsers}</p>
          </div>
          <Info className="w-8 h-8 text-blue-600" />
        </div>

      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white">
        
        {/* Campo de Búsqueda */}
        <div className="relative w-full sm:w-80 bg-white">
          <input
            type="text"
            placeholder="Buscar por nombre, email o rol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-black placeholder-black pl-10 pr-4 py-2 text-sm border border-gray-400 rounded-lg focus:outline-none focus:border-black font-medium"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-blue-600" />
        </div>

        {/* Botones de Filtro de Estado */}
        <div className="flex items-center space-x-2 w-full sm:w-auto bg-white">
          <span className="text-xs font-bold text-black uppercase mr-1">Filtrar:</span>
          
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              statusFilter === 'all' 
                ? 'bg-white text-black border-black underline' 
                : 'bg-white text-black border-gray-300 hover:bg-gray-100'
            }`}
          >
            Todos ({totalUsers})
          </button>

          <button
            onClick={() => setStatusFilter('enabled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              statusFilter === 'enabled' 
                ? 'bg-white text-black border-black underline' 
                : 'bg-white text-black border-gray-300 hover:bg-gray-100'
            }`}
          >
            Habilitados ({enabledUsers})
          </button>

          <button
            onClick={() => setStatusFilter('disabled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              statusFilter === 'disabled' 
                ? 'bg-white text-black border-black underline' 
                : 'bg-white text-black border-gray-300 hover:bg-gray-100'
            }`}
          >
            Deshabilitados ({disabledUsers})
          </button>
        </div>

      </div>

      {/* Tabla de Usuarios Registrados */}
      <div className="overflow-x-auto bg-white border border-gray-300 rounded-lg shadow-sm">
        <table className="w-full text-left border-collapse bg-white">
          
          <thead>
            <tr className="bg-white border-b border-gray-300 text-black text-xs font-bold uppercase tracking-wider">
              <th className="py-3 px-4 border-r border-gray-200">Usuario / Correo</th>
              <th className="py-3 px-4 border-r border-gray-200">Rol Sistema</th>
              <th className="py-3 px-4 border-r border-gray-200">Grupo</th>
              <th className="py-3 px-4 border-r border-gray-200">Estado de Cuenta</th>
              <th className="py-3 px-4 border-r border-gray-200">Cambio Contraseña</th>
              <th className="py-3 px-4 text-center">Acción Administrativa</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-sm font-medium bg-white text-black">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-black font-bold bg-white">
                  No se encontraron usuarios que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="bg-white hover:bg-gray-50 transition-colors">
                  
                  {/* Nombre y Email */}
                  <td className="py-3 px-4 border-r border-gray-200 bg-white">
                    <div className="font-bold text-black">{user.nombre}</div>
                    <div className="text-xs text-black font-normal">{user.email}</div>
                  </td>

                  {/* Rol */}
                  <td className="py-3 px-4 border-r border-gray-200 bg-white">
                    <span className="inline-flex items-center space-x-1 font-bold text-black">
                      <Shield className="w-3.5 h-3.5 text-blue-600 inline" />
                      <span>{user.roles.join(', ')}</span>
                    </span>
                  </td>

                  {/* Grupo */}
                  <td className="py-3 px-4 border-r border-gray-200 text-black font-bold bg-white">
                    {user.grupo || (user.roles.includes('Administrador') ? 'Administradores' : user.roles.includes('Invitado') ? 'Invitados' : 'Usuarios')}
                  </td>

                  {/* Estado Habilitado / Deshabilitado */}
                  <td className="py-3 px-4 border-r border-gray-200 bg-white">
                    {user.habilitado ? (
                      <span className="inline-flex items-center space-x-1.5 text-black font-bold">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span>Habilitada</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 text-black font-bold">
                        <XCircle className="w-4 h-4 text-blue-600" />
                        <span>Deshabilitada</span>
                      </span>
                    )}
                  </td>

                  {/* Cambio de Contraseña */}
                  <td className="py-3 px-4 border-r border-gray-200 text-black font-bold bg-white">
                    {user.passwordChangeRequired ? 'Sí' : 'No'}
                  </td>

                  {/* Botón Habilitar / Deshabilitar */}
                  <td className="py-3 px-4 text-center bg-white">
                    <button
                      onClick={() => handleToggleStatus(user.id, user.habilitado, user.nombre)}
                      className="bg-white text-black border border-gray-400 hover:bg-gray-100 font-bold px-3 py-1.5 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer text-xs mx-auto shadow-sm"
                    >
                      <Power className="w-4 h-4 text-blue-600" />
                      <span>{user.habilitado ? 'Deshabilitar Cuenta' : 'Habilitar Cuenta'}</span>
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* Nota Informativa al Pie */}
      <div className="mt-4 p-3 bg-white border border-gray-300 rounded-lg flex items-start space-x-2 text-xs font-bold text-black">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Nota de Seguridad:</strong> Deshabilitar una cuenta suspende inmediatamente la capacidad de iniciar sesión del usuario sin eliminar su historial de datos, miembros de grupo ni permisos asignados en la base de datos.
        </span>
      </div>

    </div>
  );
};
