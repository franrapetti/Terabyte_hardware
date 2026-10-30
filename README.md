# TerraByte

![Logo de TerraByte](simple/assets/Logo.png)

Proyecto frontend de una tienda de hardware, servidores NAS y configuraciones
personalizadas. El repositorio contiene dos entregas de la misma propuesta,
con tecnologías y formas de ejecución diferentes.

## Entregas

| Entrega | Ubicación | Tecnologías | Documentación |
| --- | --- | --- | --- |
| Versión original | `simple/` | HTML, CSS y JavaScript puro | [README de simple](simple/README.md) |
| Versión React | `react/TerraByte/` | React, React Router, TailwindCSS y Vite | [README de React](react/README.md) |

Ambas incluyen catálogo de productos, configurador NAS, carrito, registro e
inicio de sesión y temas claro/oscuro. Son prototipos frontend: las cuentas,
la sesión, el carrito y el tema se guardan en el navegador; la compra se simula.

## Organización del repositorio

```text
Compra-Gamer-G9/
├── README.md
├── simple/
│   ├── README.md
│   ├── assets/          # Recursos originales
│   ├── css/             # Estilos de las páginas HTML
│   ├── html/            # Páginas; entrada: home.html
│   └── javascript/      # Comportamiento de la entrega original
└── react/
    ├── README.md
    └── TerraByte/
        ├── README.md    # Detalles de implementación y verificación
        ├── package.json
        ├── public/
        ├── src/
        │   ├── assets/  # Copia independiente para React
        │   ├── components/
        │   ├── data/
        │   ├── functions/
        │   └── pages/
        └── tests/
```

La versión original se encuentra íntegramente en `simple/`. React importa sus
imágenes desde `react/TerraByte/src/assets/`: modificar los recursos de una
entrega no modifica los de la otra.

## Clonar y ejecutar

```bash
git clone https://github.com/franrapetti/Compra-Gamer-G9.git
cd Compra-Gamer-G9
```

### Entrega HTML, CSS y JavaScript

Desde la raíz del repositorio, sin instalar paquetes de npm:

```bash
python3 -m http.server 8000 --directory simple
```

Abrir [http://localhost:8000/html/home.html](http://localhost:8000/html/home.html).
También se puede usar un servidor estático como Live Server.

### Entrega React

Desde la raíz del repositorio, con Node.js y npm instalados:

```bash
npm --prefix react/TerraByte ci
npm --prefix react/TerraByte run dev
```

Abrir la dirección que indique Vite, normalmente
[http://localhost:5173/](http://localhost:5173/).

Usar localhost o HTTPS para las funciones criptográficas del registro y el
inicio de sesión. Los datos de `localStorage` pertenecen al origen del sitio;
al ejecutar las entregas en puertos diferentes, sus datos quedan separados.

## Colaboración

### Flujo de trabajo

Para realizar cambios en el proyecto se deberá:

1. Actualizar la rama principal antes de comenzar a trabajar.
2. Crear una rama nueva para la funcionalidad o modificación.
3. Realizar los cambios correspondientes.
4. Probar que los cambios funcionen correctamente.
5. Realizar el commit siguiendo la estructura establecida.
6. Subir la rama al repositorio.
7. Crear una Pull Request.
8. La Pull Request deberá ser revisada y aprobada por otro integrante del equipo antes de incorporarse a la rama principal.

### Estructura de los commits

Los commits deberán utilizar una estructura clara que permita identificar rápidamente qué tipo de modificación se realizó.

Ejemplos:

| Tipo     | Descripción                  |
| -------- | ---------------------------- |
| feat     | Agregar tarjeta de producto  |
| fix      | Corregir diseño del carrito  |
| style    | Ajustar estilos del catálogo |
| refactor | Reorganizar componentes      |
| docs     | Actualizar documentación     |

### Pull Requests

Cada Pull Request deberá indicar claramente:

- Qué funcionalidad o modificación se realizó.
- Qué archivos o componentes fueron modificados.
- Si existen aspectos que requieren especial atención durante la revisión.
- El nombre del integrante que realizó la modificación.

Cada Pull Request deberá contar con un **revisor diferente al desarrollador que realizó los cambios**. El revisor deberá comprobar que la funcionalidad cumpla con lo solicitado y que no introduzca errores en otras partes del proyecto antes de aprobarla.
