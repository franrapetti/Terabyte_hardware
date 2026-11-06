# TerraByte — React

Aplicación frontend en desarrollo con React y Vite. Sus dependencias, configuración, código y recursos se encuentran dentro de esta carpeta.

## Estado actual

`index.html` carga `src/main.jsx`, que monta `App` dentro de `StrictMode`. `App.jsx` conserva la pantalla inicial de la plantilla de Vite con un contador manejado mediante `useState`.

Las carpetas de páginas, componentes y datos ya están creadas, pero sus archivos están vacíos y todavía no están integrados en `App`. El catálogo, el carrito, las cuentas y las páginas informativas aún no están implementados en esta aplicación.

Actualmente `App.jsx` importa tres recursos que no existen en `src/assets/`: `hero.png`, `react.svg` y `vite.svg`. Esto impide compilar y cargar la aplicación correctamente hasta que se agreguen esos recursos o se actualice la pantalla inicial. Este problema ya existía antes de reorganizar las carpetas.

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
| `npm run build` | Genera la versión de producción en `dist/`, una vez resueltos los recursos faltantes. |
| `npm run preview` | Sirve localmente una compilación generada previamente. |
| `npm run lint` | Revisa el código con ESLint. |

## Estructura

```text
react/
├── README.md
├── package.json          # Dependencias y comandos
├── package-lock.json     # Versiones de dependencias
├── index.html            # Entrada de Vite
├── vite.config.js        # React y React Compiler
├── eslint.config.js      # Reglas de análisis de código
├── public/               # Recursos públicos
└── src/
    ├── main.jsx          # Montaje de React
    ├── App.jsx           # Componente principal
    ├── App.css
    ├── index.css
    ├── assets/           # Imágenes propias de la aplicación
    ├── api/db/           # Archivo data.json todavía vacío
    ├── components/
    │   ├── layout/       # Header y Footer pendientes
    │   └── ui/           # Componentes reutilizables pendientes
    └── pages/
        ├── auth/         # Acceso y registro pendientes
        ├── info/         # Páginas informativas pendientes
        └── shop/         # Inicio, catálogo, servicios y carrito pendientes
```

`node_modules/` y `dist/` se generan localmente y están excluidos de Git mediante `.gitignore`.
