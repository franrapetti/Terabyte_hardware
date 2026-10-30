# TerraByte — entrega HTML, CSS y JavaScript

![Logo de TerraByte](assets/Logo.png)

Esta carpeta conserva la entrega original del proyecto: páginas HTML, estilos
CSS y scripts JavaScript sin React ni herramientas de compilación.
La [entrega React](../react/README.md) está disponible por separado.

## Estructura

```text
simple/
├── assets/          # Logos, productos, marcas e iconos
├── css/             # global.css y estilos de cada página
├── html/            # Páginas y navegación mediante enlaces .html
├── javascript/      # Carrusel, filtros, NAS, carrito, autenticación y tema
└── README.md
```

## Ejecutar la entrega

Desde esta carpeta:

```bash
python3 -m http.server 8000
```

Abrir [http://localhost:8000/html/home.html](http://localhost:8000/html/home.html).
Desde la raíz del repositorio también se puede ejecutar
`python3 -m http.server 8000 --directory simple`. No hay dependencias de npm.
Live Server u otro servidor estático también sirven para esta entrega.

Usar localhost o HTTPS. Abrir los archivos con `file://` puede impedir el uso
de Web Crypto para registrar usuarios e iniciar sesión.

## Páginas y funcionalidades

- [Inicio](html/home.html): presentación y carrusel de productos destacados.
- [Productos](html/products.html): marcas, búsqueda, categorías y detalles.
- [Armá tu NAS](html/services.html): configuración de componentes en siete pasos.
- [Carrito](html/cart.html): cantidades, eliminación, total y compra simulada.
- [Ingresar](html/login.html) y [registrarse](html/register.html): cuentas locales.
- [Nosotros](html/aboutus.html), [mapa del sitio](html/sitemap.html),
  [términos](html/terms.html), [reembolsos](html/refunds.html),
  [información legal](html/legal.html) y [privacidad](html/privacy.html).

El tema claro/oscuro, el carrito, las cuentas y la sesión usan `localStorage`
con las claves `terrabyte-theme`, `terrabyte-cart`, `terrabyte-users` y
`terrabyte-session`. Las contraseñas usan hash PBKDF2 con sal individual.
Es un prototipo frontend con compra simulada y autenticación local.

## Recursos y mantenimiento

Los enlaces de HTML a `../css/`, `../javascript/` y `../assets/` se mantienen
relativos dentro de esta entrega. Para modificarla, trabajar en estas carpetas.

React tiene su propia copia de los assets en `react/TerraByte/src/assets/`.
Actualizar una imagen aquí no actualiza automáticamente la versión React.

Consultar el [README general](../README.md) para el flujo de trabajo, commits
y revisión de Pull Requests.
