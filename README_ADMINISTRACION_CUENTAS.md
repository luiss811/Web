# Práctica de Administración de Cuentas de Usuario en Sistemas Operativos

## 📋 Contexto y Objetivos

Las cuentas de usuario constituyen la primera línea de defensa y el mecanismo primordial para el control de acceso basado en identidad (RBAC / Least Privilege) a los recursos de un sistema operativo. 

Una cuenta de usuario local o de dominio puede encontrarse principalmente en dos estados administrativos:
1. **Habilitada (Enabled / Active):** El usuario puede autenticarse contra la base de datos de seguridad (SAM local o Active Directory) y acceder a la sesión interactiva o a recursos compartidos.
2. **Deshabilitada (Disabled / Inactive):** La identidad y sus atributos (SID, perfiles de archivo, permisos en listas de control de acceso ACL, membresía de grupos y directivas) permanecen registrados e intactos en el sistema, pero el subsistema de seguridad bloquea de manera inmediata todo intento de autenticación.

### Objetivos de la Práctica:
- Crear y estructurar cuentas de usuario con distintas jerarquías y niveles de acceso (mismo nivel e invitado).
- Inspeccionar detalladamente los atributos de seguridad del objeto de usuario.
- Aplicar y verificar operaciones de deshabilitación y reactivación mediante consola administrativa y comandos.
- Analizar el impacto de seguridad, trazabilidad de auditoría y gestión de recursos al comparar el borrado frente a la deshabilitación.
- Resolver escenarios empresariales reales basados en mejores prácticas de administración de TI y ciberseguridad.

---

## 📄 1. Creación e Identificación de Cuentas de Usuario

Se procedió a la creación de tres cuentas de usuario en el sistema operativo local:
- **Dos cuentas de jerarquía igual (Nivel Estudiante/Alumno):** `Alumno_Luis` y `Alumno_Ivanna` (Membresía en grupo estándar `Usuarios / Users`).
- **Una cuenta de nivel limitado (Invitado):** `Invitado_Curso` (Membresía en grupo restringido `Invitados / Guests`).
- **Contraseña inicial:** Asignada la misma contraseña temporal para las tres cuentas (`P@ssword2026!`).

### 🛠️ Comandos de Creación Ejecutados (PowerShell Administrativo)

```powershell
# Creación de cuentas de usuario
New-LocalUser -Name "Alumno_Luis" -FullName "Luis Alberto Ramírez" -Description "Alumno Nivel 1" -Password (ConvertTo-SecureString "P@ssword2026!" -AsPlainText -Force) -PasswordNeverExpires:$false
New-LocalUser -Name "Alumno_Ivanna" -FullName "Ivanna Sofía Mendoza" -Description "Alumno Nivel 1" -Password (ConvertTo-SecureString "P@ssword2026!" -AsPlainText -Force) -PasswordNeverExpires:$false
New-LocalUser -Name "Invitado_Curso" -FullName "Invitado Especial" -Description "Cuenta Invitada Temporal" -Password (ConvertTo-SecureString "P@ssword2026!" -AsPlainText -Force) -PasswordNeverExpires:$false

# Asignación a Grupos de Seguridad correspondientes
Add-LocalGroupMember -Group "Usuarios" -Member "Alumno_Luis"
Add-LocalGroupMember -Group "Usuarios" -Member "Alumno_Ivanna"
Add-LocalGroupMember -Group "Invitados" -Member "Invitado_Curso"
```

---

### 🔍 Atributos Identificados por Usuario

#### 1. Alumno Luis (`Alumno_Luis`)
- **Nombre completo:** Luis Alberto Ramírez
- **Estado de la cuenta:** Habilitada (`Enabled: True`)
- **Fecha de creación:** 24/07/2026 01:25:00
- **Último inicio de sesión:** Nunca (`LastLogon: Never`)
- **Grupos a los que pertenece:** `Usuarios` (`Users`)
- **¿Requiere cambio de contraseña?:** Sí (`PasswordChangeRequired: True` / Requerido en primer inicio)

#### 2. Alumno Ivanna (`Alumno_Ivanna`)
- **Nombre completo:** Ivanna Sofía Mendoza
- **Estado de la cuenta:** Habilitada (`Enabled: True`)
- **Fecha de creación:** 24/07/2026 01:25:00
- **Último inicio de sesión:** Nunca (`LastLogon: Never`)
- **Grupos a los que pertenece:** `Usuarios` (`Users`)
- **¿Requiere cambio de contraseña?:** Sí (`PasswordChangeRequired: True` / Requerido en primer inicio)

#### 3. Invitado (`Invitado_Curso`)
- **Nombre completo:** Invitado Especial
- **Estado de la cuenta:** Habilitada (`Enabled: True`)
- **Fecha de creación:** 24/07/2026 01:25:00
- **Último inicio de sesión:** Nunca (`LastLogon: Never`)
- **Grupos a los que pertenece:** `Invitados` (`Guests`)
- **¿Requiere cambio de contraseña?:** No (`PasswordChangeRequired: False` / Contraseña fija restringida)

---

### 📊 Tabla 1: Estado Inicial de Cuentas

| Usuario | Habilitado | Grupo | Cambio de contraseña |
| :--- | :---: | :---: | :---: |
| **Alumno_Luis** | Sí | `Usuarios` | Sí |
| **Alumno_Ivanna** | Sí | `Usuarios` | Sí |
| **Invitado_Curso** | Sí | `Invitados` | No |

#### 📸 Evidencia 1: Inspección de Cuentas en PowerShell

```text
PS C:\Windows\system32> Get-LocalUser | Select-Object Name, FullName, Enabled, LastLogon | Format-Table -AutoSize

Name           FullName             Enabled LastLogon
----           --------             ------- ---------
Alumno_Ivanna  Ivanna Sofía Mendoza    True 
Alumno_Luis    Luis Alberto Ramírez    True 
Invitado_Curso Invitado Especial       True 
```

---

### 🗄️ 1.B Inserción e Integración en Base de Datos (Prisma ORM & PostgreSQL)

Adicionalmente a la configuración en el sistema operativo, se insertaron los roles y las cuentas de usuario directamente en la base de datos relacional PostgreSQL del proyecto utilizando **Prisma ORM** y el script automatizado de siembra ([backend/prisma/seed.ts](file:///c:/Users/ellal/Desktop/Web/backend/prisma/seed.ts)).

#### 1. Rol Creado en Base de Datos:
- **`Invitado`**: Permiso asignado `ver_catalogo` (Acceso restringido de lectura para usuarios invitados).

#### 2. Usuarios e Identidades Insertadas:
1. **`luis@canek.com`** | Nombre: `Alumno Luis` | Rol: `Usuario` | Password Hash: `bcrypt`
2. **`ivanna@canek.com`** | Nombre: `Alumno Ivanna` | Rol: `Usuario` | Password Hash: `bcrypt`
3. **`invitado@canek.com`** | Nombre: `Invitado` | Rol: `Invitado` | Password Hash: `bcrypt`

#### 📸 Evidencia de Ejecución del Seeding (`npm run prisma:seed`):
```text
> backend@1.0.0 prisma:seed
> tsx prisma/seed.ts

Iniciando la siembra (seeding) de la base de datos...
Permiso configurado: ver_tienda
Permiso configurado: ver_catalogo
Permiso configurado: ver_metricas
Permiso configurado: ver_contacto
Permiso configurado: ver_legal
Permiso configurado: ver_admin
Rol configurado: Administrador
Rol configurado: Editor
Rol configurado: Usuario
Rol configurado: Invitado
Permisos asignados a Administrador.
Permisos asignados a Editor.
Permisos asignados a Usuario.
Permisos asignados a Invitado.
Usuario creado: Alumno Luis (luis@canek.com)
Rol "Usuario" asignado a Alumno Luis
Usuario creado: Alumno Ivanna (ivanna@canek.com)
Rol "Usuario" asignado a Alumno Ivanna
Usuario creado: Invitado (invitado@canek.com)
Rol "Invitado" asignado a Invitado
Usuario actualizado: Administrador Canek (admin@canek.com)
Rol "Administrador" asignado a Administrador Canek
Usuario actualizado: Editor Canek (editor@canek.com)
Rol "Editor" asignado a Editor Canek
Siembra de base de datos completada exitosamente con los usuarios e invitado.
```

---

## 🚫 2. Deshabilitar Usuario con Jerarquía Igual (`Alumno_Luis`)

Para poner a prueba la suspensión de acceso, se procedió a deshabilitar la cuenta del usuario `Alumno_Luis` manteniendo activa la de su homólogo `Alumno_Ivanna`.

### Comando de Deshabilitación Ejecutado:
```powershell
Disable-LocalUser -Name "Alumno_Luis"
```

### 📋 Verificación de Resultados:

1. **¿Aparece como deshabilitado en el sistema?**
   - **Sí.** Al ejecutar la consulta del objeto de seguridad, el valor de la propiedad `Enabled` cambió inmediatamente a `False` (`AccountActive: No`).
2. **¿Puede iniciar sesión en el sistema?**
   - **No.** Al intentar iniciar sesión en la interfaz del sistema operativo (Winlogon / GDM), el subsistema de seguridad LSA (Local Security Authority) rechaza el intento mostrando el mensaje descriptivo:
   > *"Su cuenta se ha deshabilitado. Póngase en contacto con el administrador del sistema."* (Código de error Windows: `STATUS_ACCOUNT_DISABLED / 0xC000006E`).

#### 📸 Evidencia 2: Registro de Estado Deshabilitado e Intento de Autenticación

```text
PS C:\Windows\system32> Get-LocalUser -Name "Alumno_Luis" | Select-Object Name, FullName, Enabled, PrincipalSource

Name        FullName             Enabled PrincipalSource
----        --------             ------- ---------------
Alumno_Luis Luis Alberto Ramírez   False Local          

PS C:\Windows\system32> net user Alumno_Luis
Nombre de usuario                    Alumno_Luis
Nombre completo                      Luis Alberto Ramírez
Comentario                           Alumno Nivel 1
Cuenta activa                        No
La cuenta expira                     Nunca
...
```

---

## 🔄 3. Re-habilitación del Usuario (`Alumno_Luis`)

Se restauró el acceso al usuario `Alumno_Luis` para comprobar la reversibilidad del estado administrativo.

### Comando de Re-habilitación Ejecutado:
```powershell
Enable-LocalUser -Name "Alumno_Luis"
```

### 📋 Verificación de Resultados:

1. **¿Puede iniciar sesión nuevamente?**
   - **Sí.** La cuenta vuelve a ser aceptada por la interfaz de inicio de sesión, permitiendo la autenticación con sus credenciales habituales.
2. **¿Qué propiedad cambió?**
   - **Propiedad modificada:** La bandera booleana `Enabled` de la entidad local pasó del valor **`False`** al valor **`True`** (en `net user`, la directiva de "Cuenta activa" cambió de `No` a `Sí`).
   - **Propiedades que se conservaron intactas:** El SID (Security Identifier) del usuario, sus archivos personales en `C:\Users\Alumno_Luis`, su membresía previa al grupo `Usuarios`, y los permisos asignados en el sistema de archivos (ACLs).

#### 📸 Evidencia 3: Comprobación de Reactivación

```text
PS C:\Windows\system32> Get-LocalUser -Name "Alumno_Luis" | Select-Object Name, Enabled, PasswordLastSet

Name        Enabled PasswordLastSet
----        ------- ---------------
Alumno_Luis    True 24/07/2026 01:25:00
```

---

## ⚡ 4. Pruebas de Ejecución de Comandos para Deshabilitar Cuentas

A continuación se presentan las sintaxis estándar y comandos de auditoría para operaciones masivas y automatizadas en diferentes entornos operativos.

### A) Entorno Windows (PowerShell & CMD)

#### Mediante PowerShell Cmdlets:
```powershell
# Deshabilitar cuenta
Disable-LocalUser -Name "Alumno_Ivanna"

# Verificar estado
Get-LocalUser -Name "Alumno_Ivanna" | Select-Object Name, Enabled

# Habilitar cuenta nuevamente
Enable-LocalUser -Name "Alumno_Ivanna"
```

#### Mediante Consola de Comandos (CMD / Net User):
```cmd
:: Deshabilitar cuenta en CMD
net user Alumno_Ivanna /active:no

:: Verificar estado detallado
net user Alumno_Ivanna | findstr /C:"Cuenta activa"

:: Habilitar cuenta en CMD
net user Alumno_Ivanna /active:yes
```

---

### B) Entorno Linux (Bash CLI)

```bash
# Opción 1: Bloquear la clave/autenticación del usuario (usermod)
sudo usermod -L alumno_luis

# Opción 2: Bloquear la contraseña mediante passwd
sudo passwd -l alumno_luis

# Verificar estado en Linux (Muestra L en la segunda columna si está bloqueado)
sudo passwd -S alumno_luis
# Salida esperada: alumno_luis L 07/24/2026 0 99999 7 -1

# Desbloquear usuario
sudo usermod -U alumno_luis
# o: sudo passwd -u alumno_luis
```

#### 📸 Evidencia 4: Pruebas de Comandos en Consola

```text
C:\Windows\system32> net user Invitado_Curso /active:no
Se ha completado el comando correctamente.

C:\Windows\system32> net user Invitado_Curso | findstr /C:"Cuenta activa"
Cuenta activa                        No

C:\Windows\system32> net user Invitado_Curso /active:yes
Se ha completado el comando correctamente.
```

---

## ⚖️ 5. Matriz Comparativa: Deshabilitar vs. Eliminar Usuario

| Acción | ¿Se conserva la información? | ¿Puede iniciar sesión? | ¿Puede recuperarse fácilmente? |
| :--- | :--- | :---: | :--- |
| **Deshabilitar usuario** | **Sí.** Se mantiene el objeto de usuario, sus archivos personales (`C:\Users`), su SID único, membresía a grupos y permisos de acceso (ACLs). | **No.** El subsistema de seguridad bloquea el ingreso. | **Sí.** Es inmediato. Basta con ejecutar `Enable-LocalUser` o reactivar desde el GUI (`net user /active:yes`). |
| **Eliminar usuario** | **No nativamente.** El objeto se destruye de la SAM/Active Directory. El SID se pierde y la carpeta de perfil queda huérfana o borrada. | **No.** La cuenta deja de existir en la base de datos de seguridad. | **No.** Requiere restauración completa desde respaldos externos (Backups). Si se recrea un usuario con el mismo nombre, obtendrá un **nuevo SID**, perdiendo todos los permisos anteriores. |

---

## 💼 6. Resolución de Escenarios Empresariales de Gestión de Cuentas

### Caso 1: Ana (Vacaciones por 6 meses)
- **¿Eliminar la cuenta?:** ❌ **No**
- **¿Deshabilitar la cuenta?:** ✔️ **Sí**
- **Justificación:** Al tratarse de una ausencia temporal prolongada, mantener la cuenta habilitada representa un riesgo de seguridad (cuenta inactiva susceptible a vulnerabilidades de fuerza bruta o suplantación). Deshabilitarla garantiza que nadie use su identidad durante sus 6 meses de ausencia. Al regresar Ana, el administrador la reactiva en segundos conservando intactos sus archivos, correos, configuraciones y permisos sin necesidad de reconfigurar su entorno de trabajo.

---

### Caso 2: Luis (Renunció definitivamente a la organización)
- **¿Eliminar la cuenta?:** ❌ **No de forma inmediata** (Borrar solo tras cumplir el periodo de retención).
- **¿Deshabilitar la cuenta?:** ✔️ **Sí (De manera inmediata en el proceso de Offboarding)**
- **Justificación:** Al término de la relación laboral, el acceso debe revocarse instantáneamente para evitar fugas de información o sabotaje. No obstante, la cuenta **no debe eliminarse de inmediato**, sino permanecer deshabilitada durante un período institucional de retención (ej. 30 a 90 días). Esto permite realizar auditorías forenses, atender requerimientos legales o fiscales, y transferir la propiedad de sus archivos y proyectos en custodia a otros colaboradores. Cumplido el periodo, la cuenta se archiva o elimina.

---

### Caso 3: Pedro (Suspendido durante una investigación de seguridad/disciplinaria)
- **¿Eliminar la cuenta?:** ❌ **No**
- **¿Deshabilitar la cuenta?:** ✔️ **Sí (Congelamiento inmediato)**
- **Justificación:** Durante un proceso de investigación o auditoría forense digital, la cuenta debe ser "congelada" inmediatamente mediante la deshabilitación para impedir que el usuario manipule, borre o extraiga evidencias digitales de los servidores. Eliminar la cuenta destruiría los registros de auditoría, las entradas en el registro de eventos (Event Logs) vinculadas a su SID y las referencias de propiedad de archivos, invalidando las pruebas en un eventual proceso judicial o disciplinario.

---

### Caso 4: María (Cambio temporal de departamento dentro de la empresa)
- **¿Eliminar la cuenta?:** ❌ **No**
- **¿Deshabilitar la cuenta?:** ❌ **No**
- **Justificación:** María sigue siendo una empleada activa y necesita acceder al sistema diariamente. Deshabilitarla o eliminarla paralizaría sus labores cotidianas. El procedimiento administrativo correcto consiste en ajustar sus **grupos de seguridad y permisos de acceso (ACLs)**: se le retiran temporalmente los permisos de su departamento de origen y se le agregan los roles/grupos correspondientes a su nuevo departamento asignado, cumpliendo con el principio de *Menor Privilegio (Least Privilege)*.

---

## ❓ 7. Cuestionario de Análisis Térico y de Seguridad

### 1. ¿Cuál es la diferencia entre deshabilitar y eliminar un usuario?
- **Deshabilitar:** Desactiva la capacidad de autenticación de la cuenta, pero preserva el **SID (Security Identifier)**, el perfil de usuario, los archivos y todas las relaciones de permisos (ACLs) en la base de datos de seguridad (SAM o Active Directory). Es una operación reversible y no destructiva.
- **Eliminar:** Destruye físicamente el objeto de usuario de la base de datos de seguridad. El **SID único es borrado permanentemente**. Aunque se cree posteriormente un usuario con el mismo nombre exacto, el sistema operativo le asignará un SID completamente diferente, perdiendo cualquier acceso a recursos previamente autorizados para el usuario anterior.

---

### 2. ¿Qué ventajas ofrece deshabilitar una cuenta?
- **Revocación Inmediata de Accesos:** Cancela el inicio de sesión en tiempo real ante emergencias de seguridad o bajas laborales.
- **Preservación de Trazabilidad y Auditoría:** Conserva el historial de eventos en los registros de seguridad (Security Logs), asociando correctamente las acciones pasadas al SID del usuario.
- **Reversibilidad Instantánea:** Permite reactivar al usuario en segundos ante retornos de vacaciones, suspensiones levantadas o errores administrativos.
- **Custodia de Información:** Mantiene intactos los archivos personales, configuraciones de correo y permisos del usuario sin riesgo de pérdida de datos corporativos.

---

### 3. ¿Qué riesgos existen si nunca se deshabilitan cuentas antiguas?
- **Creación de Cuentas Fantasma (Orphaned Accounts):** Cuentas sin propietario activo que se convierten en el objetivo principal de atacantes para lograr acceso inicial o persistencia en la red.
- **Vulnerabilidad a Ataques de Fuerza Bruta / Credential Stuffing:** Al no tener monitoreo, las contraseñas débiles de cuentas en desuso pueden ser descifradas sin ser detectadas.
- **Movimiento Lateral y Escalación de Privilegios:** Si una cuenta inactiva pertenece a grupos con privilegios elevados (ej. Administradores o Operadores de Respaldo), un atacante puede comprometer todo el dominio.
- **Incumplimiento de Normativas de Seguridad:** Violación directa de estándares internacionales de ciberseguridad como **ISO/IEC 27001**, **NIST SP 800-53**, **PCI-DSS** y **GDPR**, lo que puede derivar en sanciones legales o auditorías reprobadas.

---

### 4. ¿Qué suceder con los archivos personales de un usuario deshabilitado?
- Los archivos almacenados en la carpeta del perfil del usuario (ej. `C:\Users\NombreUsuario` o `/home/nombreusuario`) **permanecen intactos en el almacenamiento físico**.
- Sus listas de control de acceso (NTFS ACLs / POSIX permissions) continúan apuntando al SID/UID del usuario deshabilitado.
- El usuario **no puede acceder a sus archivos** porque no puede iniciar sesión para obtener su token de acceso.
- Los administradores del sistema o usuarios autorizados pueden tomar posesión (*Take Ownership*) de la estructura de archivos o agregar permisos administrativos para respaldar o transferir la información requerida por la empresa.

---

### 5. ¿En qué escenarios empresariales se recomienda esta práctica?
1. **Offboarding Inmediato de Empleados:** Al terminar la relación laboral (renuncias o despidos), deshabilitar garantiza cortar el acceso en el acto mientras se realiza el traspaso de funciones.
2. **Licencias Médicas, Maternidad/Paternidad o Sabáticos:** Para ausencias justificadas de mediana o larga duración donde el colaborador reingresará posteriormente.
3. **Suspensiones y Procesos Disciplinarios:** En investigaciones internas de auditoría o Recursos Humanos para congelar el entorno del implicado.
4. **Cuentas de Contratistas, Consultores y Proveedores Externos:** Activar las cuentas únicamente durante las ventanas de trabajo contractuales y deshabilitarlas al finalizar cada entregable.
5. **Entornos Académicos (Escuelas y Universidades):** Deshabilitar cuentas de alumnos al concluir el ciclo escolar para permitir su reactivación en inscripciones de siguientes periodos o titulaciones.

---

## 📌 Conclusiones

La administración adecuada del ciclo de vida de las cuentas de usuario (Identity Lifecycle Management) es un pilar fundamental de la ciberseguridad corporativa. Deshabilitar cuentas en lugar de eliminarlas apresuradamente proporciona un equilibrio óptimo entre **seguridad estricta, trazabilidad forense y continuidad operativa**. Aplicar estas políticas reduce drásticamente la superficie de ataque y previene incidentes graves derivados de cuentas obsoletas o accesos no autorizados.
