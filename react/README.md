# TerraByte — React

Esta carpeta contiene la versión de la tienda hecha con **React**. Es la versión más completa del proyecto: tiene todas las páginas, las cuentas, el carrito y el armado de NAS.

Para construirla se usan cuatro herramientas:

- **React**, para armar las pantallas con piezas reutilizables llamadas componentes.
- **Vite**, para ejecutar y compilar el proyecto.
- **Tailwind CSS**, para los estilos.
- **React Router**, para moverse entre las páginas sin recargar el sitio.

La versión original, sin framework, está en [`../simple`](../simple/README.md).

## Cómo ejecutarla

Hace falta tener instalado [Node.js](https://nodejs.org) (versión 20.19 o superior). Desde la raíz del repositorio:

```bash
cd react
npm ci
npm run dev
```

`npm ci` descarga las dependencias, y solo hace falta la primera vez o cuando alguien cambia `package.json`. `npm run dev` inicia el sitio: la terminal muestra la dirección, normalmente `http://localhost:5173`. Al guardar un archivo, la página se actualiza sola.

Conviene abrir el sitio desde `localhost`. Si se entra con la dirección IP de la red (por ejemplo, desde un celular), no se pueden crear cuentas ni agregar productos al carrito.

### Comandos

| Comando | Para qué sirve |
| --- | --- |
| `npm run dev` | Inicia el sitio para trabajar en él. |
| `npm run build` | Prepara la versión final del sitio. |
| `npm run preview` | Muestra en local la versión preparada con `build`. |
| `npm run lint` | Revisa que el código no tenga errores de estilo ni de escritura. |

Antes de subir cambios, `npm run lint` y `npm run build` tienen que terminar sin errores. Todavía no hay pruebas automáticas.

## Páginas

| Dirección | Qué muestra |
| --- | --- |
| `/` | Inicio, con la presentación y los productos destacados. |
| `/products` | Catálogo con búsqueda, filtros y detalle de cada producto. |
| `/services` | Armado de un NAS a medida, en siete pasos. |
| `/cart` | Carrito de compras. **Hay que iniciar sesión** para verlo. |
| `/login` y `/register` | Iniciar sesión y crear una cuenta. |
| `/aboutus` | Información de la empresa. |
| `/terms`, `/privacy`, `/refunds` y `/legal` | Páginas legales. |
| `/sitemap` | Mapa del sitio. |

Cualquier otra dirección muestra la página de "no encontrada".

## Cómo está organizado

Todo el código está dentro de `src/`:

| Carpeta | Qué contiene |
| --- | --- |
| `pages/` | Una pantalla por cada página del sitio. |
| `components/` | Piezas que se reutilizan en varias pantallas: encabezado, pie, tarjeta de producto, ventana emergente, carrusel, botones, etc. |
| `context/` | Lo que comparte toda la aplicación: la sesión iniciada y el carrito. |
| `hooks/` | Funciones reutilizables de React, por ejemplo para usar el carrito, la sesión o el tema. |
| `utils/` | Cálculos y operaciones que no dependen de React (precios, totales, validación de cuentas). |
| `data/` | Los datos del catálogo: productos, categorías y marcas. |
| `assets/` | Logos, íconos y favicon. |

Fuera de `src/`, la carpeta `public/products/` guarda las imágenes de los productos y las marcas.

**¿Por qué las imágenes de productos están aparte?** El carrito recuerda la dirección de cada imagen. Las que están en `public/` tienen una dirección fija; las de `src/assets/` cambian de nombre cada vez que se compila el proyecto, y el carrito las perdería.

## Cómo funcionan algunas partes

**Sesión y carrito.** La aplicación guarda quién tiene la sesión iniciada y qué hay en el carrito, y se lo ofrece a todas las páginas. Por eso el contador del encabezado, la página del carrito y los botones de "Agregar" siempre muestran lo mismo. Los datos se guardan en el navegador, así que no se pierden al recargar la página.

**Cuentas.** Al crear una cuenta, la contraseña se guarda protegida (no en texto plano). Las cuentas creadas en la versión simple también funcionan acá, si se abre desde el mismo puerto.

**Carrito protegido.** Si alguien sin sesión intenta entrar al carrito, el sitio lo lleva a iniciar sesión, le explica por qué y, después de ingresar, lo devuelve al carrito. Si cierra sesión estando en el carrito, vuelve al inicio. Esta protección es solo visual: como no hay servidor, no reemplaza a una seguridad real.

**Modo claro y oscuro.** El botón del encabezado cambia el tema, y la elección se recuerda entre visitas.

**Armá tu NAS.** Son siete pasos: gabinete, placa base, procesador, memoria, discos, fuente y sistema operativo. Todos los pasos son opcionales, pero hace falta elegir al menos un componente para agregar el NAS al carrito. En el paso de discos se pueden elegir varios.

**Ventanas emergentes.** Las de Productos y de Armá tu NAS usan la ventana nativa del navegador: al abrirse, el teclado queda dentro de ella, se cierran con la tecla Escape y el foco vuelve al botón que las abrió.

## Pautas para trabajar en el código

- Si algo se usa en una sola página, se escribe en esa página. Si se necesita en una segunda, pasa a `components/`.
- Si un bloque de estilos se repite, se convierte en un componente en lugar de copiarlo.
- Se usan solo las herramientas básicas de React, para que el código sea fácil de entender.
- El título de cada página se define con `usePageTitle`.
- El estilo de escritura es con comillas simples y sin punto y coma. Si el editor reformatea archivos al guardar, revisar el `git diff` antes de hacer el commit.

## Limitaciones

- No hay servidor: la autenticación es una demostración y no es segura.
- El carrito pertenece al navegador, no a cada cuenta: dos personas que usan el mismo navegador comparten el carrito.
- No hay pruebas automáticas.
