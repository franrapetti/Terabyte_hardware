# TerraByte — React

Aplicación frontend en desarrollo con React y Vite. Sus dependencias, configuración, código y recursos se encuentran dentro de esta carpeta.

## Estado actual

La aplicación usa React Router, Tailwind y un layout compartido. Están integrados Login, Register, About us, las páginas legales, el mapa del sitio y el carrito (`/cart`). Home, Products y Services siguen pendientes; el inicio muestra un aviso y las rutas todavía no implementadas muestran la página de no encontrada.

El tema claro/oscuro usa `useState` y `useEffect`, la clase `dark` y la clave `terrabyte-theme`.

El carrito usa `CartProvider` y `useCarrito()`. Permite cambiar cantidades, quitar artículos, vaciar y confirmar una compra simulada que limpia el carrito. El total y el contador del Header se calculan desde el mismo estado. Los datos se guardan con `useEffect` bajo la clave `terrabyte-cart`, y se sincronizan entre pestañas. Si falla la escritura, se muestra un aviso y el estado sigue disponible durante la sesión.

Se conservan los registros de la versión simple cuando ambas aplicaciones usan el mismo origen (protocolo, dominio y puerto). Cambiar de puerto no traslada el contenido de `localStorage`.

### Agregar artículos desde las próximas páginas

Dentro de un componente envuelto por `CartProvider`:

```jsx
import { useCarrito } from '../../hooks/useCarrito.js'

const { agregar } = useCarrito()

// En el evento de un botón o formulario:
agregar({ nombre: 'NAS', precio: 120000, tipo: 'Producto' })
```

El contexto también expone `carrito`, `quitar(id)`, `vaciar()`, `cambiarCantidad(id, cambio)`, `total`, `cantidad` y `errorGuardado`. Cada llamada a `agregar` suma una unidad; los productos equivalentes se agrupan y las configuraciones de servicios con componentes distintos se mantienen separadas. La integración de esos botones en Products y Services corresponde a sus respectivos pasos.

## Instalación y desarrollo

Requisitos: Node.js y npm compatibles con las dependencias declaradas en `package-lock.json`.

Desde la raíz del repositorio:

```bash
cd react
npm ci
npm run dev
```

Abrir la dirección que indique Vite en la terminal, normalmente `http://localhost:5173`. Vite actualiza la aplicación al guardar cambios en los archivos fuente.

## Comandos

Ejecutar desde esta carpeta:

| Comando | Función |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente una compilación generada previamente. |
| `npm run lint` | Revisa el código con ESLint. |
| `npm test` | Ejecuta las pruebas del carrito con el runner de Node.js. |

## Estructura

```text
react/
├── package.json
├── package-lock.json
├── index.html
├── vite.config.js
├── eslint.config.js
├── public/
├── tests/                # Pruebas del carrito
└── src/
    ├── main.jsx          # Router y CartProvider
    ├── App.jsx           # Rutas
    ├── index.css
    ├── assets/
    ├── context/          # CartContext, CartProvider y autenticación pendiente de adaptar
    ├── hooks/            # useCarrito, useTheme y otros hooks
    ├── utils/            # Normalización, precios y operaciones del carrito
    ├── components/
    │   ├── cart/         # CartItem
    │   ├── layout/       # Header, Footer y layouts
    │   └── ui/           # Controles reutilizables
    └── pages/
        ├── auth/
        ├── info/
        ├── legal/
        └── shop/         # Cart; Home, Products y Services pendientes
```

`node_modules/` y `dist/` se generan localmente y están excluidos de Git mediante `.gitignore`.
