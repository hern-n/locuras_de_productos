# Locuras de Productos — AGENTS.md

## Stack
- **100% estático**: HTML + CSS + vanilla JS (ES modules). Sin frameworks, sin build tools, sin `package.json`.
- **Despliegue**: Vercel con `vercel.json` (rewrite `/api/logo` → imagen del favicon).

## Arquitectura
- **SPA**: `index.html` tiene `<body>` vacío + `<script type="module" src="main.js">`. Todo el DOM lo genera JS.
- **Sub-páginas**:
  - `/elements/ayuda/index.html` — página de ayuda/contacto (HTML plano, CSS inline).
  - `/elements/productTemplate/index.html?name=...` — detalle de producto (CSV vía fetch, JS script normal, no module).
- **Logo / favicon**: `elements/Logotipo_locuras_de_productos_resaltado.png` (se usa como favicon y en `/api/logo`).

## Datos de productos
- Fichero: `elements/products.csv`. Separador `;`, primera fila = cabecera.
- Columnas: `title;href(Amazon);price;description;imgPrincipal;img2;img3;...`
- Se carga con `fetch()` del lado cliente. Sin backend.

## Convenciones y peculiaridades
- Variable `curency = "€"` (typo intencional en el código, no corregir).
- Los CSS de `styles.css` usan variables (`--primary-bg`, `--toolbar-bg`...). `productTemplate/styles.css` tiene valores hardcodeados.
- Búsqueda: normaliza strings (quita acentos, minúsculas) y hace substring match de todas las palabras.
- Imágenes de producto en `productos/<carpeta_del_producto>/`.
- Hay un archivo con espacios en el nombre: `elements/ayuda/Logotipo locuras de productos blanco.png`.

## Comandos
- **No hay** test, lint, typecheck, ni build. No ejecutar nada de eso.
- **Local**: Live Server (VS Code) en puerto 5500. `vercel.json` **no** funciona localmente — las rewrites solo aplican en Vercel.
- **Deploy**: subir a Git (integración con Vercel). No hay comandos de deploy locales.
- **Vercel preview**: `vercel dev` (requiere CLI global `npm i -g vercel`) respeta rewrites.

## Integraciones (no tocar)
- Google Analytics (`G-H1YK61G8D8`), Google AdSense (`ca-pub-3938572802328484`), Google Tag Manager (`GTM-K4TX9D5H`), StatCounter (`13110018`).
- Amazon Afiliados: todos los enlaces de productos son de Amazon.
