# TerraByte

Repositorio del proyecto frontend de una tienda virtual de hardware para computadoras. Incluye dos implementaciones independientes: una con HTML, CSS y JavaScript puro y otra en desarrollo con React y Vite.

## Organización

```text
Compra-Gamer-G9/
├── README.md
├── simple/
│   ├── README.md
│   ├── assets/
│   ├── css/
│   ├── html/
│   └── javascript/
└── react/
    ├── README.md
    ├── package.json
    ├── package-lock.json
    ├── index.html
    ├── vite.config.js
    ├── eslint.config.js
    ├── public/
    └── src/
```

Cada proyecto contiene sus propios recursos y se ejecuta desde su carpeta, sin depender del otro.

- [Proyecto HTML, CSS y JavaScript](simple/README.md): funcionamiento, estructura y ejecución de la versión sin framework.
- [Proyecto React](react/README.md): estado actual, estructura y comandos de la aplicación con Vite.

## Trabajo en equipo

1. Actualizar la rama principal antes de comenzar.
2. Crear una rama para la funcionalidad o modificación.
3. Realizar los cambios en la carpeta del proyecto correspondiente y probarlos.
4. Crear un commit descriptivo y subir la rama.
5. Abrir una Pull Request para que otro integrante la revise antes de incorporarla a la rama principal.

Los commits deben indicar el tipo de cambio, por ejemplo: `feat`, `fix`, `style`, `refactor` o `docs`.

Cada Pull Request debe describir la funcionalidad o modificación, los archivos afectados, los aspectos que requieren atención y el nombre de su autor. El revisor debe ser distinto del desarrollador y comprobar el funcionamiento antes de aprobarla.
