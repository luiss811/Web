import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

app.use(cors({
  origin: '*', // Permitir todas las conexiones para simplificar
  credentials: true
}));
app.use(express.json());

// Interfaz para extender Request en Express
interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    nombre: string;
    roles: string[];
    permissions: string[];
  };
}

// ==========================================
// MIDDLEWARES DE SEGURIDAD
// ==========================================

// Middleware para verificar JWT y cargar roles/permisos
const authenticateToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado: Token de sesión no proporcionado.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    
    // Buscar usuario en base de datos junto con sus roles y los permisos de esos roles
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      include: {
        roles: {
          include: {
            rol: {
              include: {
                permisos: {
                  include: {
                    permiso: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado o sesión inválida.'
      });
    }

    const rolesNames = user.roles.map(ur => ur.rol.nombre);
    
    // Recopilar todos los nombres de permisos únicos
    const permissionsSet = new Set<string>();
    user.roles.forEach(ur => {
      ur.rol.permisos.forEach(rp => {
        permissionsSet.add(rp.permiso.nombre);
      });
    });

    req.user = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      roles: rolesNames,
      permissions: Array.from(permissionsSet)
    };

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Sesión inválida o expirada. Por favor, inicia sesión nuevamente.'
    });
  }
};

// Middleware para validar un permiso específico
const requirePermission = (permission: string) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado.'
      });
    }

    // Administrador tiene acceso a todo de manera incondicional
    if (req.user.roles.includes('Administrador')) {
      return next();
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: No tienes el permiso requerido (${permission}) para esta acción.`
      });
    }

    next();
  };
};

// ==========================================
// ENDPOINTS DE AUTENTICACIÓN
// ==========================================

// 1. Registro de usuarios
app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { email, password, nombre } = req.body;

  if (!email || !password || !nombre) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos (email, password, nombre) son obligatorios.'
    });
  }

  try {
    // Validar si el email ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya se encuentra registrado.'
      });
    }

    // Cifrar la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Obtener el rol "Usuario" por defecto
    const defaultRol = await prisma.rol.findUnique({
      where: { nombre: 'Usuario' }
    });

    if (!defaultRol) {
      return res.status(500).json({
        success: false,
        message: 'Error de configuración: El rol por defecto "Usuario" no existe.'
      });
    }

    // Crear el usuario y asignarle el rol en una transacción
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.usuario.create({
        data: {
          email,
          nombre,
          password: passwordHash
        }
      });

      await tx.usuarioRol.create({
        data: {
          usuarioId: user.id,
          rolId: defaultRol.id
        }
      });

      return user;
    });

    return res.status(201).json({
      success: true,
      message: `¡Registro exitoso! Bienvenido ${newUser.nombre}. Ya puedes iniciar sesión.`
    });
  } catch (error: any) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al procesar el registro.'
    });
  }
});

// 2. Inicio de sesión
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Por favor, proporciona correo y contraseña.'
    });
  }

  try {
    // Buscar usuario y cargar roles/permisos
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            rol: {
              include: {
                permisos: {
                  include: {
                    permiso: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'El correo electrónico o la contraseña son incorrectos.'
      });
    }

    // Verificar la contraseña cifrada
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'El correo electrónico o la contraseña son incorrectos.'
      });
    }

    // Generar Token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const rolesNames = user.roles.map(ur => ur.rol.nombre);
    const permissionsSet = new Set<string>();
    user.roles.forEach(ur => {
      ur.rol.permisos.forEach(rp => {
        permissionsSet.add(rp.permiso.nombre);
      });
    });

    return res.json({
      success: true,
      message: `¡Bienvenido de nuevo, ${user.nombre}!`,
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        roles: rolesNames,
        permissions: Array.from(permissionsSet)
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno al procesar el inicio de sesión.'
    });
  }
});

// 3. Obtener datos de sesión del usuario logueado
app.get('/api/auth/me', authenticateToken, (req: CustomRequest, res: Response) => {
  return res.json({
    success: true,
    user: req.user
  });
});

// 4. Cerrar sesión (control básico en backend, frontend borra el token)
app.post('/api/auth/logout', (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: 'Sesión cerrada correctamente. Vuelve pronto.'
  });
});

// ==========================================
// ENDPOINTS PROTEGIDOS POR ROLES / PERMISOS
// ==========================================

// Endpoint para validar permisos específicos sobre módulos
app.get('/api/modules/check/:permission', authenticateToken, (req: CustomRequest, res: Response) => {
  const { permission } = req.params;
  const isAuthorized = req.user?.roles.includes('Administrador') || req.user?.permissions.includes(permission);

  if (isAuthorized) {
    return res.json({
      success: true,
      authorized: true,
      message: `Autorizado para el módulo: ${permission}`
    });
  } else {
    return res.status(403).json({
      success: false,
      authorized: false,
      message: `No tienes el permiso requerido (${permission}) para este módulo.`
    });
  }
});

// Endpoint exclusivo de administrador para obtener todos los usuarios y sus roles
app.get('/api/admin/users', authenticateToken, requirePermission('ver_admin'), async (req: Request, res: Response) => {
  try {
    const users = await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        createdAt: true,
        roles: {
          select: {
            rol: {
              select: {
                nombre: true
              }
            }
          }
        }
      }
    });

    const formattedUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      nombre: u.nombre,
      createdAt: u.createdAt,
      roles: u.roles.map(r => r.rol.nombre)
    }));

    return res.json({
      success: true,
      users: formattedUsers
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios del sistema.'
    });
  }
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`[Server] Corriendo en http://localhost:${PORT}`);
});
