# TerraByte — React y TailwindCSS

## Desarrollo y páginas

Ejecutar `npm install` y `npm run dev` desde esta carpeta.

Las páginas migradas están disponibles en `/aboutus`, `/sitemap`, `/terms`,
`/refunds`, `/legal` y `/privacy`. También se aceptan sus direcciones originales
con `.html`, que redirigen a las rutas de React.

`SiteLayout` comparte Header y Footer entre las rutas; `LegalPage` contiene el
formato común de las páginas legales y `InfoSection` las secciones de Nosotros.
La tienda está disponible en `/` (Home), `/products`, `/services` y `/cart`.
El buscador filtra por el parámetro `q` y puede combinarse con las categorías.
El configurador NAS conserva las selecciones de sus siete pasos y suma sus precios.
`functions/CartFuncion.jsx` comparte el almacenamiento `terrabyte-cart`, las
operaciones de cantidades y el hook `useCarrito` entre todas las páginas. El
carrito se conserva al recargar y se actualiza entre pestañas. Finalizar compra
simula la operación y vacía el carrito tras confirmar, como en el modelo original.
Las páginas `/login` y `/register` administran el acceso mediante
`functions/Auth.jsx`. Conservan el formato del modelo original: cuentas locales
en `terrabyte-users`, contraseñas con PBKDF2-SHA-256 (210.000 iteraciones y sal
individual) y datos públicos de sesión en `terrabyte-session`. Web Crypto requiere
localhost o HTTPS. Registro, ingreso y cierre de sesión actualizan el Header
también entre pestañas. Se trata de la autenticación local del prototipo.

`functions/Theme.jsx` centraliza el tema en `terrabyte-theme`, actualiza
`html[data-theme]` y `color-scheme`, y sincroniza la preferencia entre pestañas.
El tema elegido se aplica a todos los componentes, incluidos los modales en
portales; sigue funcionando durante la sesión si no se puede guardar la preferencia.

En un alojamiento estático, configurar la redirección de las rutas de la SPA a
`index.html` para permitir abrirlas directamente o recargar la página.

## Verificación

- `npm run lint`: revisión estática.
- `npm run build`: compilación de producción.
- `npx playwright install chromium`: instalación inicial del navegador de pruebas.
- `npm run test:e2e`: pruebas de carrito, NAS, autenticación, persistencia,
  sincronización entre pestañas, temas, teclado, modales y carruseles.

Las pruebas arrancan Vite automáticamente en `127.0.0.1:4175` y usan datos
locales aislados. Cubren las doce páginas a 320, 768, 1360 y 1440 píxeles en
ambos temas. Los fallos guardan una traza en `test-results/`.

El tema se aplica antes de cargar React para evitar destellos. Los colores
compartidos de las acciones se definen con `@theme` en `src/index.css`.
`SearchBar` separa la búsqueda de la navegación y `useAuthForm` comparte el envío
de los formularios, cancelando sus efectos al abandonar la página.
