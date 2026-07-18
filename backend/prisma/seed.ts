import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando la siembra (seeding) de la base de datos...');

  // 1. Definir los permisos requeridos
  const permisosData = [
    { nombre: 'ver_tienda', descripcion: 'Permiso para ver la sección de la tienda (Shop)' },
    { nombre: 'ver_catalogo', descripcion: 'Permiso para ver el catálogo detallado de minerales' },
    { nombre: 'ver_metricas', descripcion: 'Permiso para ver métricas y analíticas avanzadas (Lighthouse)' },
    { nombre: 'ver_contacto', descripcion: 'Permiso para ver y enviar el formulario de contacto' },
    { nombre: 'ver_legal', descripcion: 'Permiso para ver los términos legales' },
    { nombre: 'ver_admin', descripcion: 'Permiso para acceder al panel de administración general' }
  ];

  const permisosMap: Record<string, any> = {};

  for (const perm of permisosData) {
    const dbPerm = await prisma.permiso.upsert({
      where: { nombre: perm.nombre },
      update: { descripcion: perm.descripcion },
      create: perm,
    });
    permisosMap[perm.nombre] = dbPerm;
    console.log(`Permiso configurado: ${perm.nombre}`);
  }

  // 2. Definir los roles requeridos
  const rolesData = [
    { nombre: 'Administrador', descripcion: 'Acceso total al sistema y configuraciones' },
    { nombre: 'Editor', descripcion: 'Acceso para gestionar tienda, catálogo, contacto y legal' },
    { nombre: 'Usuario', descripcion: 'Acceso básico para comprar y explorar catálogo' }
  ];

  const rolesMap: Record<string, any> = {};

  for (const rol of rolesData) {
    const dbRol = await prisma.rol.upsert({
      where: { nombre: rol.nombre },
      update: { descripcion: rol.descripcion },
      create: rol,
    });
    rolesMap[rol.nombre] = dbRol;
    console.log(`Rol configurado: ${rol.nombre}`);
  }

  // Limpiar relaciones rol_permiso existentes para reasignar limpiamente
  await prisma.rolPermiso.deleteMany({});

  // 3. Asignar permisos a roles
  // Administrador tiene TODOS los permisos
  for (const perm of Object.values(permisosMap)) {
    await prisma.rolPermiso.create({
      data: {
        rolId: rolesMap['Administrador'].id,
        permisoId: perm.id
      }
    });
  }
  console.log('Permisos asignados a Administrador.');

  // Editor tiene ver_tienda, ver_catalogo, ver_contacto, ver_legal
  const editorPerms = ['ver_tienda', 'ver_catalogo', 'ver_contacto', 'ver_legal'];
  for (const permName of editorPerms) {
    await prisma.rolPermiso.create({
      data: {
        rolId: rolesMap['Editor'].id,
        permisoId: permisosMap[permName].id
      }
    });
  }
  console.log('Permisos asignados a Editor.');

  // Usuario tiene ver_tienda, ver_catalogo
  const userPerms = ['ver_tienda', 'ver_catalogo'];
  for (const permName of userPerms) {
    await prisma.rolPermiso.create({
      data: {
        rolId: rolesMap['Usuario'].id,
        permisoId: permisosMap[permName].id
      }
    });
  }
  console.log('Permisos asignados a Usuario.');

  // 4. Crear usuarios de prueba por defecto
  const passwordHashAdmin = await bcrypt.hash('adminpassword', 10);
  const passwordHashEditor = await bcrypt.hash('editorpassword', 10);
  const passwordHashUser = await bcrypt.hash('userpassword', 10);

  const testUsers = [
    {
      email: 'admin@canek.com',
      nombre: 'Administrador Canek',
      password: passwordHashAdmin,
      rol: 'Administrador'
    },
    {
      email: 'editor@canek.com',
      nombre: 'Editor Canek',
      password: passwordHashEditor,
      rol: 'Editor'
    },
    {
      email: 'user@canek.com',
      nombre: 'Usuario Canek',
      password: passwordHashUser,
      rol: 'Usuario'
    }
  ];

  for (const u of testUsers) {
    // Buscar o crear usuario
    let dbUser = await prisma.usuario.findUnique({
      where: { email: u.email }
    });

    if (!dbUser) {
      dbUser = await prisma.usuario.create({
        data: {
          email: u.email,
          nombre: u.nombre,
          password: u.password
        }
      });
      console.log(`Usuario creado: ${u.email}`);
    } else {
      // Actualizar datos
      dbUser = await prisma.usuario.update({
        where: { email: u.email },
        data: {
          nombre: u.nombre,
          password: u.password
        }
      });
      console.log(`Usuario actualizado: ${u.email}`);
    }

    // Vincular rol
    // Limpiar roles anteriores para evitar duplicados
    await prisma.usuarioRol.deleteMany({
      where: { usuarioId: dbUser.id }
    });

    await prisma.usuarioRol.create({
      data: {
        usuarioId: dbUser.id,
        rolId: rolesMap[u.rol].id
      }
    });
    console.log(`Rol ${u.rol} asignado a ${u.email}`);
  }

  console.log('Siembra de base de datos completada exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error durante la siembra de base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
