# TerraByte — HTML, CSS y JavaScript

Tienda de hardware desarrollada con HTML, CSS y JavaScript puro. Funciona en el navegador, sin dependencias de npm ni un backend.

## Ejecución

Desde la raíz del repositorio:

```bash
cd simple
python3 -m http.server 8000
```

Abrir [http://localhost:8000/html/home.html](http://localhost:8000/html/home.html). También se puede usar Live Server de VS Code sobre `html/home.html`.

Usar un servidor en localhost o HTTPS: el registro y el inicio de sesión utilizan la API criptográfica del navegador y pueden fallar si se abre el archivo directamente con `file://`.

## Funcionamiento

- **Inicio:** presentación de la tienda y carrusel de productos.
- **Productos:** catálogo con búsqueda, filtros, detalles y acciones para agregar productos al carrito.
- **Armá tu NAS:** selección de componentes y agregado de la configuración al carrito.
- **Carrito:** modificación de cantidades, eliminación de artículos, cálculo del total y confirmación de compra simulada. La confirmación vacía el carrito; no procesa pagos ni envía pedidos a un servidor.
- **Cuentas:** registro, inicio y cierre de sesión locales. Los usuarios se guardan en `localStorage`, con sal y hash de contraseña mediante PBKDF2; la sesión también se conserva en el navegador.
- **Tema:** selección de modo claro u oscuro, guardada en `localStorage`.
- **Información:** páginas de la empresa, privacidad, términos, reembolsos, información legal y mapa del sitio.

El carrito, las cuentas, la sesión y el tema persisten en el almacenamiento del navegador para el mismo origen. No se sincronizan entre dispositivos. Las fuentes de Google Fonts requieren conexión a Internet.

## Estructura

```text
simple/
├── README.md
├── assets/       # Logotipos, imágenes y recursos de productos
├── css/          # Estilos globales y de cada página
├── html/         # Páginas; home.html es la entrada principal
└── javascript/   # Interacciones, cuentas, carrito y tema
```

Las páginas enlazan sus estilos, scripts e imágenes mediante rutas relativas. `carrito.js` contiene las funciones compartidas del carrito y se carga antes de los scripts que las utilizan (`products.js`, `services.js` y `cart.js`).
