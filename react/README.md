# TerraByte — React

Aplicación frontend en desarrollo con React y Vite. Sus dependencias, configuración, código y recursos se encuentran dentro de esta carpeta.

## Estado actual

La aplicación usa React Router, Tailwind y un layout compartido. Están integrados Login, Register, Products, Services (`/services`), About us, las páginas legales, el mapa del sitio y el carrito (`/cart`). Home sigue pendiente; el inicio muestra un aviso y las rutas desconocidas muestran la página de no encontrada.

El tema claro/oscuro usa `useState` y `useEffect`, la clase `dark` y la clave `terrabyte-theme`.

El carrito usa `CartProvider` y `useCarrito()`. Permite cambiar cantidades, quitar artículos, vaciar y confirmar una compra simulada que limpia el carrito. El total y el contador del Header se calculan desde el mismo estado. Los datos se guardan con `useEffect` bajo la clave `terrabyte-cart`, y se sincronizan entre pestañas. Si falla la escritura, se muestra un aviso y el estado sigue disponible durante la sesión.

Se conservan los registros de la versión simple cuando ambas aplicaciones usan el mismo origen (protocolo, dominio y puerto). Cambiar de puerto no traslada el contenido de `localStorage`.

### Configurador NAS

`/services` conserva los siete pasos y las 18 opciones de la versión simple. Gabinete, placa, procesador, RAM, fuente y sistema operativo usan selecciones individuales; discos permite varias opciones. Cada categoría tiene su propio `useState`, y los inputs se controlan con `checked` y `onChange`.

Anterior y Siguiente conservan las selecciones; Quitar selección limpia únicamente la categoría actual. Todas las categorías son opcionales, pero se exige al menos un componente antes de agregar el NAS. Una selección gratuita, como TrueNAS, también es válida.

El envío suma los precios y usa `useCarrito().agregar(...)` con el tipo `Servicio`, el nombre `NAS personalizado` y la lista de componentes. El modal de confirmación permite ir al carrito o seguir configurando. Las configuraciones equivalentes incrementan su cantidad en el carrito y los fallos de persistencia se muestran como avisos.

### Agregar artículos desde otras páginas

Dentro de un componente envuelto por `CartProvider`:

```jsx
import { useCarrito } from '../../hooks/useCarrito.js'

const { agregar } = useCarrito()

// En el evento de un botón o formulario:
agregar({ nombre: 'NAS', precio: 120000, tipo: 'Producto' })
```

El contexto también expone `carrito`, `quitar(id)`, `vaciar()`, `cambiarCantidad(id, cambio)`, `total`, `cantidad` y `errorGuardado`. Cada llamada a `agregar` suma una unidad; los productos equivalentes se agrupan y las configuraciones de servicios con componentes distintos se mantienen separadas. Products y Services ya utilizan este contexto.

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
| `npm test` | Ejecuta el runner de pruebas de Node.js. |

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
        └── shop/         # Products, Services y Cart; Home pendiente
```

`node_modules/` y `dist/` se generan localmente y están excluidos de Git mediante `.gitignore`.
