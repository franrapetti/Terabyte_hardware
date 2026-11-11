# Plan de migración a React + Tailwind

Migración progresiva de TERRABYTE (HTML/CSS/JS puro) a React con Tailwind, pensada para un equipo que está aprendiendo React.

## Punto de partida

- 12 páginas HTML estáticas: home, products, services, cart, login, register, aboutus y 5 legales (terms, privacy, refunds, legal, sitemap).
- 7 archivos JS sin módulos, que se comunican por variables globales.
- El estado vive en `localStorage`: carrito (`terrabyte-cart`), usuarios y sesión (`terrabyte-session`) y tema.
- Header y footer copiados en cada HTML.
- Ya existe `react/TerraByte` (Vite + React), con la plantilla por defecto.

## Reglas del equipo

- Un paso por rama o PR. La web vieja sigue funcionando hasta el paso 10.
- No convertir los CSS viejos línea por línea: estilar cada componente directo con clases Tailwind y usar el CSS viejo solo como referencia visual.
- Mantener las mismas claves de `localStorage` para no perder datos.
- Si un bloque de clases se repite mucho, hacerlo un componente, no una clase CSS custom.
- Usar solo lo básico de React (ver la sección siguiente). Aunque el proyecto tenga instalado React 19, no se usan sus hooks ni funciones avanzadas.

## Qué se usa de React y qué no

El equipo está aprendiendo, así que el código se mantiene con las herramientas básicas. Si algo se puede resolver con lo de la columna "Sí", se resuelve con eso.

| Sí se usa | No se usa |
|---|---|
| `useState`, `useEffect`, `useContext`, `useRef` | `use()`, `useActionState`, `useFormStatus`, `useOptimistic` |
| Props, `children`, `.map()`, renderizado condicional | `useTransition`, `useDeferredValue`, `useSyncExternalStore`, `useId` |
| Formularios controlados con `onChange` y `onSubmit` | Form Actions (`<form action={función}>`) y `FormData` en lugar de estado |
| Hooks propios simples hechos con los de arriba (`useTheme`) | Etiquetas de metadata dentro de componentes (`<title>`, `<meta>`) |
| `useNavigate`, `useParams`, `useSearchParams` de React Router | React Compiler (`babel-plugin-react-compiler`) |

Para el título de cada página se usa `document.title` dentro de un `useEffect`.

**Código que ya no cumple** (viene de la rama `react`, hay que reescribirlo en su paso):

- `context/AuthContext.jsx` usa `useSyncExternalStore`. Se pasa a `Context` + `useState` + `useEffect` en el paso 9. El tema ya fue adaptado en el paso 5 y el carrito en el paso 7.
- `functions/useAuthForm.js` usa `FormData` y `AbortController`. Se pasa a formularios controlados con `useState`.
- `components/ui/FormField.jsx` y `components/ui/InfoSection.jsx` usan `useId`. Se reemplaza por un `id` que llega por props.
- `components/layout/AuthLayout.jsx` usa `<title>` dentro del componente.
- `vite.config.js` incluye React Compiler. Se saca del plugin y de `package.json`.

## Cómo trabajar: pages primero, componentes después

No se crean todos los componentes de antemano. El flujo es:

1. Armar la page entera en un solo archivo (JSX + clases Tailwind).
2. Detectar lo que se repite (un título de sección, una tarjeta).
3. Extraerlo a `components/` y usarlo desde la page.
4. En la siguiente page, reutilizarlo y crear los nuevos que hagan falta.

**Regla simple:** si algo se usa en una sola page, queda en la page. Cuando se necesita en una segunda, pasa a `components/`.

**Excepción:** `Layout`, `Header` y `Footer` se pueden crear temprano (paso 4), porque se repiten en todas las rutas.

## Estructura de carpetas

```
src/
  pages/        → una por ruta (Home, Products, Cart...)
  components/   → piezas reutilizables (Header, ProductCard...)
  context/      → CartContext, AuthContext
  hooks/        → useTheme
```

## Pasos

### 1. Base
Limpiar `react/TerraByte` y agregar `react-router-dom`, `tailwindcss` y `@tailwindcss/vite`.
*Por qué:* una sola app con rutas reemplaza las 12 páginas HTML, y Tailwind se instala sin config extra con Vite.

### 2. Assets y tema
Copiar `assets/` a `public/`. Pasar colores, fuentes y modo claro/oscuro de `global.css` a `@theme` de Tailwind, y usar `dark:` para el tema.
*Por qué:* los colores quedan definidos en un solo lugar.

### 3. Páginas estáticas
Legales, About us y sitemap como componentes JSX con clases Tailwind.
*Por qué:* no tienen lógica, así se practican React y Tailwind con poco riesgo. Acá pueden salir `Section` o `LegalPage`.

### 4. Header, Footer y Layout
Sacar header y footer de las pages y armar un `Layout` que envuelva las rutas.
*Por qué:* hoy están copiados 12 veces. Se aprenden props y `children`.

### 5. Tema claro/oscuro
Hook `useTheme` con `useState` y `useEffect` que agrega o quita la clase `dark` en `<html>` y guarda en `localStorage`. Botón `ThemeToggle`.
*Por qué:* es un estado chico y aislado, ideal para practicar los hooks básicos y conectar React con Tailwind.

**Estado: completado.** `Header` usa `hooks/useTheme.js` y pasa el tema y la acción por props a `components/ui/ThemeToggle.jsx`. Se conserva la clave `terrabyte-theme`, el tema oscuro por defecto, los logos y el favicon según el tema y la sincronización entre pestañas. `index.html` aplica la clase antes de cargar React para evitar un destello del tema incorrecto.

### 6. Home y Products
Pasar los productos a un array de datos y mostrarlos con `.map()` y un componente `ProductCard`.
*Por qué:* se ve la ventaja de JSX frente a `createElement` e `innerHTML`.

### 7. Carrito
`CartContext` con `agregar`, `quitar`, `vaciar` y `total`, sincronizado con `localStorage` mediante `useEffect`. Componente `CartItem`.
*Por qué:* el carrito lo usan products, services y cart, y hoy se comparte con funciones globales. Es lo más difícil, por eso va después de entender los hooks. Si se complica, empezar pasando el estado por props y luego migrar a Context.

**Estado: completado.** `CartContext.js` define el contexto, `CartProvider.jsx` mantiene el estado con `useState` y lo guarda con `useEffect`, y `hooks/useCarrito.js` permite consumirlo. La ruta `/cart` usa `CartItem`, controles de cantidad, total y confirmaciones para vaciar y simular una compra. El Header comparte el contador. Se conserva `terrabyte-cart` y se adaptan las imágenes guardadas por la versión simple. Products y Services ya agregan artículos mediante este contexto.

### 8. Services
Formularios controlados (`useState` por input) que agregan al carrito con el contexto del paso 7.
*Por qué:* practican formularios y reutilizan el contexto. Puede salir un `FormInput`.

**Estado: completado.** `/services` muestra el configurador de siete pasos en `pages/shop/Services.jsx`. Cada categoría tiene su propio `useState`; los discos permiten selección múltiple. Se conservan las 18 opciones y precios de la versión simple, la navegación Anterior/Siguiente y Quitar selección. Se exige al menos un componente y se suma su precio antes de llamar a `useCarrito().agregar(...)` con un servicio llamado NAS personalizado. La confirmación reutiliza `Modal` y permite ir al carrito o seguir configurando sin perder las selecciones.

### 9. Login y Register
`AuthContext` con `user`, `login`, `logout` y `register`, y una ruta protegida simple.
*Por qué:* repite el patrón del carrito para afianzarlo. Va al final porque maneja validaciones y usuarios.

### 10. Limpieza
Borrar `html/`, `javascript/` y `css/` viejos y actualizar el README (ya no es "sin dependencias").
*Por qué:* recién cuando todo funciona en React se elimina la versión anterior.

## Resumen de qué sale en cada paso

| Paso | Se hace | Sale |
|---|---|---|
| 3 | Pages legales y About us | `Section`, `LegalPage` |
| 4 | Header y footer | `Header`, `Footer`, `Layout` |
| 5 | Tema | `useTheme`, `ThemeToggle` |
| 6 | Home y Products | `ProductCard` |
| 7 | Carrito | `CartContext`, `CartItem` |
| 8 y 9 | Services, Login y Register | `FormInput`, `AuthContext` |
