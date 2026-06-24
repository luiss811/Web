# MINERALIA - Portal de Gemas & E-commerce

Este repositorio contiene el código fuente de **MINERALIA**, una aplicación web interactiva que fusiona un catálogo científico informativo sobre minerales y una plataforma de comercio electrónico de especímenes geológicos. La aplicación está construida con tecnologías modernas y sigue estrictamente las mejores prácticas de modularidad, tipado estático y diseño responsivo.

A continuación, se presentan las dos actividades requeridas para la documentación del portal.

---

## Actividad 1: Encuadre del Framework de Desarrollo

Esta sección detalla el marco tecnológico utilizado en el desarrollo del sitio web, explicando el propósito de cada herramienta, la arquitectura de la interfaz y las interacciones dinámicas implementadas.

### 1. Herramientas y Framework Empleados

Para garantizar el máximo rendimiento, la legibilidad del código y la facilidad de mantenimiento, se optó por un entorno moderno centrado en React:

*   **Vite**: Se utiliza como herramienta de construcción (*build tool*) y servidor de desarrollo local. Vite reemplaza los empaquetadores tradicionales (como Webpack) ofreciendo un arranque del servidor casi instantáneo gracias al uso de *Esbuild* para la pre-bundling de dependencias y la recarga de módulos en caliente (*Hot Module Replacement* - HMR) basada en ESM nativo del navegador.
*   **React (JavaScript / TSX)**: La biblioteca central para la construcción de interfaces de usuario. Su modelo de renderizado declarativo basado en componentes reutilizables permite gestionar de forma eficiente el DOM virtual de las distintas vistas (Tienda, Catálogo, Métricas, Contacto, Legal).
*   **TypeScript**: Superconjunto tipado de JavaScript que añade tipado estático al código. En este proyecto se definen interfaces estrictas para garantizar la consistencia de los datos consumidos de la API (por ejemplo, `Mineral`, `Variety`, `ClassificationCode`, `CartItem` y `SiteStats`). Esto previene errores de asignación de variables en tiempo de desarrollo.
*   **Tailwind CSS**: Framework de estilos CSS de utilidad. Permite diseñar interfaces directamente desde el marcado utilizando clases preestablecidas. En este sitio, se utiliza para manejar el diseño responsivo (*grid*, *flexbox*), la transición fluida entre el modo claro y oscuro, y una paleta de colores básica simplificada (azul, rojo, verde, amarillo y gris pizarra) que otorga una apariencia limpia, intuitiva y científica.
*   **Lucide React**: Biblioteca de iconos vectoriales ligeros, optimizados para React y totalmente personalizables mediante clases de CSS para mejorar la legibilidad y la experiencia táctil de los usuarios.

---

### 2. Estructura de la Interfaz (Estructura de Componentes)

El diseño del portal se basa en las tres partes fundamentales de una página web descritas en la arquitectura de referencia:

```
[ Cabecera / Header ]
       │
       ├──► Logo Corporativo ("MINERALIA")
       ├──► Buscador Integrado (Sincronizado)
       └──► Conmutador de Páginas e Indicadores de Estado (Modo Oscuro, Carro)
       │
[ Cuerpo de la Página / Main Dynamic Viewport ]
       │
       ├──► E-Shop (Shop.tsx) ────────► Héroe Banner, Filtros de Rareza, Lista de Productos, Carro Lateral, Modal de Compra
       ├──► Catálogo (Catalog.tsx) ────► Buscador Avanzado, Filtros de Cristal, Paginador Dinámico, Fichas de Detalle
       ├──► Analíticas (Analytics.tsx) ─► Contadores de Uso, Gráficas de Tráfico, Consola de Telemetría API
       ├──► Contacto (Contact.tsx) ────► Formulario con validación, Enlaces de soporte directo, Mapa de laboratorio
       └──► Legal (Legal.tsx) ─────────► Aviso de Privacidad y Términos de Uso en Pestañas rápidas
       │
[ Pie de Página / Footer ]
       │
       ├──► Enlaces Rápidos a Secciones
       ├──► Iconos de Redes Sociales Oficiales
       └──► Datos de Soporte y Contacto (Teléfonos oficiales, WhatsApp, Email)
```

1.  **Cabecera (`Header.tsx`)**: Componente persistente en la parte superior. Implementa un menú adhesivo (*sticky navbar*) con efecto de transparencia. Contiene el logotipo animado, la barra de búsqueda global rápida, los botones de navegación entre secciones con resaltado dinámico, el indicador numérico animado del carrito y el selector de tema visual (claro/oscuro).
2.  **Cuerpo Dinámico (`App.tsx` y carpeta `/pages`)**: Ruteador del lado del cliente que renderiza condicionalmente una de las cinco páginas en base al estado del contexto:
    *   **E-Shop (`Shop.tsx`)**: Presenta un banner promocional principal (Hero) con llamadas a la acción (*CTA*). Incluye un menú de filtros de rareza y de ordenamiento por precio y reputación. Despliega la grilla de especímenes minerales listos para la venta, cada uno representado con una forma geométrica cristaloquímica generada en CSS puro según su sistema cristalino. También integra el panel lateral (*Drawer*) del carrito de compras y un modal flotante de confirmación de pedido con número de orden aleatorio.
    *   **Catálogo Científico (`Catalog.tsx`)**: Sección informativa para el estudio de las especies aprobadas por la CNMNC. Cuenta con su propia barra de búsqueda y filtros de sistemas de cristalización. Permite la navegación paginada a través de miles de registros oficiales remotos. Las tarjetas informativas abren un modal interactivo con datos cristaloquímicos completos y enlaces externos a bases de datos científicas internacionales (*Mindat.org*).
    *   **Panel de Analíticas (`Analytics.tsx`)**: Dashboard de telemetría de rendimiento y comportamiento. Muestra tarjetas con contadores dinámicos (vistas de página, búsquedas, adiciones, ventas), una gráfica interactiva de visitas por sección basada en barras de CSS puro, fuentes de tráfico simuladas y una terminal de telemetría que registra peticiones de red y la latencia en milisegundos de la API de GeoAPIs.io.
    *   **Contacto y Ubicación (`Contact.tsx`)**: Contiene un formulario de contacto reactivo que valida en tiempo real la obligatoriedad y el formato del correo. Brinda accesos directos rápidos a los canales de comunicación y un mapa topográfico simulado en CSS que resalta las coordenadas del laboratorio.
    *   **Legal (`Legal.tsx`)**: Organiza el Aviso de Privacidad Simplificado y los Términos de Uso mediante pestañas rápidas y accesibles para los usuarios.
3.  **Pie de Página (`Footer.tsx`)**: Componente persistente inferior. Agrupa enlaces organizados, marcas de tarjetas de pago aceptadas, iconos de redes sociales y los canales oficiales de soporte (teléfonos directos, WhatsApp y correo).

---

### 3. Interacciones y Flujo de Datos

*   **Gestión de Estado Centralizada**: Toda la lógica global se administra en `AppContext.tsx` mediante un React Context. Este contexto comparte funciones y estados como la navegación, el tema actual, el contenido del carrito, las búsquedas globales y las estadísticas del panel de control.
*   **Consumo Sincrónico de API Remota**: La aplicación realiza solicitudes `fetch` directas en tiempo real a la API pública de GeoAPIs.io:
    `https://geoapis.io/api/v1/catalog/resource/mineral-names`
    Al cambiar de página o realizar una consulta, la aplicación recupera un arreglo paginado de 25 registros.
*   **Gestión y Reporte de Errores de API**: De acuerdo con las especificaciones del proyecto, si la conexión con la API falla (por ejemplo, problemas de red o CORS), la aplicación captura el error e impide el renderizado de datos ficticios. En su lugar, muestra un bloque informativo con un mensaje explicativo y un botón interactivo de reintento.
*   **Simulación de Variables de Comercio**: Como la base de datos científica no proporciona campos comerciales, el contexto de la aplicación genera valores deterministas (precio, stock disponible, rareza y color característico) a partir de una función hash basada en el nombre único del mineral. Esto asegura que el mismo espécimen siempre tenga el mismo precio y atributos en todas las recargas de página.
*   **Persistencia Local**: El tema seleccionado por el usuario, el contenido del carrito de compras y las analíticas de navegación se almacenan automáticamente en el almacenamiento local del navegador (`localStorage`) para persistir la sesión.

---

## Actividad 2: Documentación del Prototipo Mockup y Elementos del Sitio

Esta sección proporciona el inventario completo y la distribución espacial de los elementos de interfaz, así como una guía paso a paso para la captura de pantalla de los prototipos del sitio web interactivo.

### 1. Enumeración y Señalización de Elementos del Sitio Web

En el prototipo interactivo desarrollado en JavaScript/React, se identifican y señalan los siguientes elementos del sitio:

1.  **Logotipo de MINERALIA (Header)**: Logotipo corporativo con un icono de gema interactivo que anima al pasar el ratón y redirige a la página principal.
2.  **Tagline de Identidad ("Universo Geológico")**: Breve texto descriptivo en la cabecera que contextualiza al visitante.
3.  **Buscador Rápido de Cabecera**: Entrada de búsqueda que redirige automáticamente al catálogo científico al presionar una tecla.
4.  **Menú de Navegación de Escritorio**: Botones interactivos con iconos integrados para alternar de forma inmediata entre las vistas: E-Shop, Catálogo, Estadísticas y Contacto.
5.  **Indicador Dinámico del Carro**: Insignia circular animada (*badge*) que parpadea y muestra el total de unidades añadidas al carrito de compras.
6.  **Conmutador de Tema (Modo Claro / Modo Oscuro)**: Botón interactivo que alterna las clases globales de CSS para cambiar la visualización del sitio instantáneamente.
7.  **Menú de Navegación Móvil**: Menú plegable de tipo hamburguesa que se adapta a pantallas de teléfonos y tabletas.
8.  **Banner Hero de Bienvenida (E-Shop)**: Bloque publicitario principal con un gradiente animado de fondo, telemetría decorativa y llamadas directas a la acción.
9.  **Llamada a la Acción de Compras ("Comprar Especímenes")**: Botón de gran tamaño en el banner Hero con efecto de elevación al pasar el puntero, diseñado para desplazar la pantalla a la zona de ventas.
10. **Botonera de Rarezas**: Filtro rápido de botones para segmentar los productos en: Todos, Común, Raro, Exótico y Legendario.
11. **Selector de Ordenamiento Comercial**: Menú desplegable para ordenar la grilla por menor precio, mayor precio o mejores calificaciones.
12. **Tarjeta de Producto de Mineral**: Contenedor individual para cada espécimen en venta. Contiene la forma geométrica tridimensional del cristal, el nombre científico, la fórmula química básica, la etiqueta de rareza, las estrellas de valoración y el precio comercial en dólares.
13. **Representador Tridimensional de Cristal (MineralVisual)**: Dibujo vectorial interactivo generado por CSS que adapta su contorno geométrico (hexágono, diamante, polígono truncado) y su gradiente de color según el sistema cristalino oficial del mineral.
14. **Botón de Agregar al Carrito**: Botón azul que añade una unidad del mineral al inventario del carrito de compras del usuario y actualiza los contadores del sistema.
15. **Insignias de Rarity y Stock**: Etiquetas informativas sobre la escasez del espécimen y el número de piezas disponibles en bodega.
16. **Panel Lateral Flotante del Carrito (Drawer)**: Menú desplegable que aparece desde el lateral derecho de la tienda para mostrar el desglose de los productos listos para comprar, modificar cantidades y calcular el total de la compra.
17. **Caja de Texto de Cupón y Desglose de Gastos**: Módulo dentro del carro de compras para visualizar subtotales, envíos y campos de códigos de descuento.
18. **Llamada a la Acción de Pago ("Finalizar Pedido")**: Botón verde que desencadena el proceso de compra ficticio y limpia el carrito de compras.
19. **Modal de Confirmación de Compra (Checkout Complete)**: Cuadro de diálogo flotante centrado que felicita al usuario, proporciona un número de orden aleatorio formateado (ej. `MIN-185942`) y certifica la compra exitosa.
20. **Filtro de Sistemas Cristalinos (Catálogo)**: Selector avanzado para catalogar registros en tiempo real según clasificaciones como: Cúbico, Hexagonal, Monoclínico, Triclínico, Ortorrómbico o Tetragonal.
21. **Terminal del Estado de la API**: Indicador luminoso interactivo en el catálogo que muestra el número total de registros disponibles, la página actual del servidor y la latencia promedio del enlace en milisegundos.
22. **Botón de Ficha Técnica ("Ficha Info")**: Botón con icono de información para abrir el modal cristaloquímico.
23. **Modal de Ficha Técnica Detallada (Especie Mineral)**: Ventana emergente con el desglose de fórmulas empíricas, elementos constitutivos de la tabla periódica, códigos de clasificación oficial y variedades asociadas.
24. **Enlace a Mindat.org**: Acceso externo oficial que vincula el identificador único del mineral con la base de datos geológica internacional de referencia.
25. **Paginador Numérico (Chevron Controls)**: Botones interactivos para avanzar o retroceder de página en el catálogo oficial de GeoAPIs.io.
26. **Indicadores de Tráfico y Actividad (Analíticas)**: Panel visual con tarjetas informativas sobre páginas vistas, búsquedas realizadas, adiciones de carro e indicadores de rendimiento de la base de datos remota.
27. **Gráficos CSS de Sesión**: Barras verticales proporcionales al volumen de visitas de cada pestaña del sitio web.
28. **Consola de Telemetría API**: Caja de texto que imprime logs y eventos asíncronos de la sesión en curso (ej. `[19:02:12] FETCH_API_SUCCESS // LATENCY: 120ms // ADDS: 3`).
29. **Formulario de Soporte Técnico**: Campos interactivos con validación de obligatoriedad para canalizar comentarios.
30. **Mapa Topográfico de Ubicación**: Representación vectorial con curvas de nivel geográficas y pines geolocalizados que simulan la sede del laboratorio físico de Mineralia en Querétaro, México.
31. **Enlaces a Redes Sociales Oficiales**: Botones directos a los perfiles corporativos de Facebook, Instagram y GitHub de la organización.
32. **Canales de Atención Directa**: Enlaces hipertexto interactivos que inician llamadas directas o chats en tiempo real con asesores de venta:
    *   **WhatsApp**: [4428364570](https://wa.me/524428364570) (Mensajería directa).
    *   **Llamadas directas**: tel:4464225541 (Atención al cliente).
    *   **Correo oficial**: mailto:lalitorios81@gmail.com.

---

### 2. Mockups de Distribución Espacial de Elementos (Wireframes de Prototipo)

Los diagramas a continuación ilustran la disposición espacial de los elementos del prototipo en pantallas de escritorio, sirviendo como guía de referencia para comprender el diseño antes de documentar físicamente las capturas de pantalla del servidor web local.

#### A. Distribución en la Vista: E-Shop (`Shop.tsx`)

```
+-----------------------------------------------------------------------------------------+
| [1] LOGO MINERALIA     [2] Universo Geo   [3] [Buscar...]   [4] Shop  Catalog  Stats   [6]|
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  [8] HERO BANNER: "Colecciona la Belleza Geométrica de la Tierra"                       |
|      SYS_STATUS: ACTIVE // GRID_REF: MX_QRO                                     [9]     |
|      [Comprar Especímenes] (Desplaza a Tienda)  [Ver Ofertas]                           |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
| [10] Rareza: [ Todos ] [ Común ] [ Raro ] [ Exótico ] [ Legendario ]     [11] Ordenar: v|
+-----------------------------------------------------------------------------------------+
|  GRID DE PRODUCTOS ESPECÍMENES                                                          |
|                                                                                         |
|  +------------------------+  +------------------------+  +------------------------+  |
|  | [13] CRYSTAL GEOMETRY  |  | [13] CRYSTAL GEOMETRY  |  | [13] CRYSTAL GEOMETRY  |  |
|  |                        |  |                        |  |                        |  |
|  | [12] Mineral Name      |  | [12] Mineral Name      |  | [12] Mineral Name      |  |
|  | Formula: KMgV5O14      |  | Formula: CaSO4         |  | Formula: FeS2          |  |
|  | [15] Exótico [Rating]  |  | [15] Común [Rating]    |  | [15] Legendario [Rating|  |
|  | Stock: 5               |  | Stock: 12              |  | Stock: 2               |  |
|  | Price: $145.00         |  | Price: $22.50          |  | Price: $495.00         |  |
|  |                        |  |                        |  |                        |  |
|  | [14] [AGREGAR AL CARRO]|  | [14] [AGREGAR AL CARRO]|  | [14] [AGREGAR AL CARRO]|  |
|  +------------------------+  +------------------------+  +------------------------+  |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
| [23] Aviso de Privacidad | Términos de Uso          [31] FB [31] IG [31] GH             |
| [32] Soporte: Whatsapp: 4428364570 | Llamadas: 4464225541 | Email: lalitorios81@gmail.com|
+-----------------------------------------------------------------------------------------+
```

#### B. Distribución en la Vista: Catálogo Informativo (`Catalog.tsx`)

```
+-----------------------------------------------------------------------------------------+
| [1] LOGO MINERALIA                        [3] [Buscar...]                 [4] Menú   [6]|
+-----------------------------------------------------------------------------------------+
|  "Catálogo Científico de Minerales" (Datos Sincrónicos)                                 |
+-----------------------------------------------------------------------------------------+
| [3] Buscar por nombre/fórmula... [Buscar]               [20] Sistema Cristalino: [ All ]v|
+-----------------------------------------------------------------------------------------+
| [21] Mostrando página 100 de 392 | Total: 9779         (*) API Conectada (Luz verde)   |
+-----------------------------------------------------------------------------------------+
|  GRID DE REGISTROS CIENTÍFICOS                                                          |
|                                                                                         |
|  +------------------------+  +------------------------+  +------------------------+  |
|  | [13] CRYSTAL GEOMETRY  |  | [13] CRYSTAL GEOMETRY  |  | [13] CRYSTAL GEOMETRY  |  |
|  |                        |  |                        |  |                        |  |
|  | Name: Hummerite        |  | Name: Halite           |  | Name: Pyrite           |  |
|  | Formula: KMgV5O14      |  | Formula: NaCl          |  | Formula: FeS2          |  |
|  | System: Triclinic      |  | System: Cubic          |  | System: Cubic          |  |
|  |                        |  |                        |  |                        |  |
|  | [22] [ FICHA INFO ]    |  | [22] [ FICHA INFO ]    |  | [22] [ FICHA INFO ]    |  |
|  +------------------------+  +------------------------+  +------------------------+  |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
|                      [25] [ Chevron Izq ]   Página: 100   [ Chevron Der ]               |
+-----------------------------------------------------------------------------------------+
```

#### C. Distribución en la Vista: Panel de Analíticas (`Analytics.tsx`)

```
+-----------------------------------------------------------------------------------------+
| [1] LOGO MINERALIA                                                        [4] Menú   [6]|
+-----------------------------------------------------------------------------------------+
|  "Panel de Analíticas y Estadísticas" (Monitoreo en Tiempo Real)                        |
+-----------------------------------------------------------------------------------------+
|  METRICAS CLAVE                                                                         |
|  +--------------------+  +--------------------+  +--------------------+  +------------+ |
|  | [26] Vista Páginas |  | [26] Búsquedas Real|  | [26] Carro Items   |  | Transacc.  | |
|  | 42                 |  | 15                 |  | 7                  |  | 2          | |
|  +--------------------+  +--------------------+  +--------------------+  +------------+ |
|                                                                                         |
|  GRAFICAS Y CONSOLA DE TELEMETRÍA                                                       |
|  +----------------------------------------------+  +----------------------------------+ |
|  | [27] Visitas por Sección                     |  | [28] Consola de Telemetría API   | |
|  | E-Shop    [====================] 25          |  | [19:02] FETCH_SUCCESS (100)      | |
|  | Catálogo  [==============] 12                |  | [19:03] ADD_TO_CART // STOCK: 4  | |
|  | Analíticas[=====] 4                          |  | [19:04] CHECKOUT // ORD_48593    | |
|  | Contacto  [==] 1                             |  | [19:04] API Latency: 110ms       | |
|  +----------------------------------------------+  +----------------------------------+ |
+-----------------------------------------------------------------------------------------+
```

---

### 3. Guía Práctica para la Toma de Capturas de Pantalla del Prototipo

Para documentar visualmente el comportamiento de los elementos señalados arriba en un informe interactivo o carpeta de entregables, siga estos pasos para ejecutar el entorno local y realizar las capturas:

#### Paso 1: Levantar el Servidor de Desarrollo
Abra su terminal preferida (PowerShell, CMD o Bash) en el directorio raíz del proyecto (`c:\Users\ellal\Desktop\Web`) y ejecute:
```powershell
npm run dev
```
El servidor de desarrollo de Vite se iniciará e indicará la dirección de acceso local (por defecto, `http://localhost:5173/`).

#### Paso 2: Navegar a la Interfaz del Prototipo
Abra su navegador web favorito (Chrome, Firefox o Edge) e ingrese a la dirección `http://localhost:5173/`.

#### Paso 3: Capturas de Pantalla Recomendadas para el Entregable
Para mostrar el funcionamiento interactivo completo, se recomienda realizar las siguientes tomas de pantalla:

1.  **Captura del Prototipo A: E-Shop Principal (Modo Claro)**
    *   **Área**: Sección de Tienda superior con el Banner Hero interactivo.
    *   **Elementos visibles**: Botón de llamada a la acción [9], logotipo corporativo [1], barra de búsqueda global [3], el selector de Modo Claro/Oscuro [6] en su estado diurno.
2.  **Captura del Prototipo B: Cuadrícula de Minerales con Carrito Abierto (Modo Oscuro)**
    *   **Área**: Grilla de venta de minerales con el Drawer del Carrito de Compras abierto a la derecha.
    *   **Elementos visibles**: Especímenes con forma tridimensional generados por CSS [13], insignias de stock [15], el Drawer del carro [16] con desgloses de precios, botones de control de cantidad, y el botón finalizador de pago [18].
3.  **Captura del Prototipo C: Modal de Confirmación de Pedido**
    *   **Área**: Pantalla de Tienda después de presionar "Finalizar Pedido".
    *   **Elementos visibles**: El cuadro de diálogo emergente centrado [19] con el número de transacción `MIN-XXXXXX` en formato de color verde, indicando que el flujo de compra simulado se completó exitosamente.
4.  **Captura del Prototipo D: Catálogo de Minerales con Ficha Técnica Abierta**
    *   **Área**: Sección de Catálogo Científico después de cambiar la página y abrir los detalles de un mineral.
    *   **Elementos visibles**: Barra de filtros por cristal [20], indicador de latencia del servidor y total de items [21], modal de detalles químicos [23], elementos químicos mapeados y el enlace hipertexto al portal de Mindat.org [24].
5.  **Captura del Prototipo E: Panel de Analíticas y Consola de Telemetría**
    *   **Área**: Sección de Estadísticas en el menú superior.
    *   **Elementos visibles**: Gráficos de barras horizontales [27] mostrando las páginas más visitadas por el usuario, fuentes de tráfico orgánico y la consola de logs de eventos [28] que imprime los tiempos de respuesta y peticiones consumidas de GeoAPIs.io.
6.  **Captura del Prototipo F: Formulario de Contacto y Mapa Topográfico**
    *   **Área**: Vista de Contacto.
    *   **Elementos visibles**: Campos de entrada validados en tiempo real [29], mapa topográfico con líneas de nivel simuladas [30], iconos de redes sociales y los datos de contacto específicos (WhatsApp: 4428364570, Llamadas: 4464225541, Email: lalitorios81@gmail.com).

*Nota: Para capturar de manera limpia las pantallas en navegadores modernos, puede utilizar la herramienta de recorte de su sistema operativo (`Win + Shift + S` en Windows, o `Cmd + Shift + 4` en macOS) o las herramientas para desarrolladores del navegador (`F12 -> Ctrl + Shift + P -> escribir "Capture full size screenshot"`).*
