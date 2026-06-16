# Locuras de Productos

Una tienda virtual de afiliados de Amazon — 100% estática, sin backend, sin frameworks. Generada con HTML, CSS y JavaScript puro.

## 🌐 Enlaces
- **Web**: [https://locuras-de-productos.vercel.app](https://locuras-de-productos.vercel.app)

- **API pública**: `https://locuras-de-productos.vercel.app/api/logo` (devuelve el logotipo PNG)

---

## 📋 Tabla de contenidos

1. [¿Qué es Locuras de Productos?](#qué-es-locuras-de-productos)
2. [Stack tecnológico](#stack-tecnológico)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Arquitectura](#arquitectura)
5. [Datos de productos](#datos-de-productos)
6. [Páginas y navegación](#páginas-y-navegación)
7. [Funcionamiento interno](#funcionamiento-interno)
8. [Despliegue](#despliegue)
9. [Desarrollo local](#desarrollo-local)
10. [Integraciones externas](#integraciones-externas)
11. [Peculiaridades y convenciones](#peculiaridades-y-convenciones)
12. [Mantenimiento](#mantenimiento)
13. [Licencia](#licencia)

---

## ¿Qué es Locuras de Productos?

Locuras de Productos es un sitio web afiliado de Amazon España. Su objetivo es recomendar productos seleccionados a los visitantes. Cuando un usuario hace clic en un producto y lo compra en Amazon, el sitio recibe una comisión por la venta.

No hay tienda propia, ni carrito de compra, ni procesamiento de pagos. Todo redirige a Amazon.

---

## Stack tecnológico

| Componente | Tecnología |
|---|---|
| HTML | HTML5 semántico |
| CSS | CSS3 con variables CSS y media queries |
| JavaScript | Vanilla JS (ES6+), ES modules |
| Datos | CSV plano (sin base de datos) |
| Fuentes | Google Fonts (Tsukimi Rounded) |
| Hosting | Vercel (plan gratuito) |
| Analytics | Google Analytics, Google Tag Manager, StatCounter |
| Monetización | Google AdSense, Amazon Afiliados |

No hay:
- Frameworks (React, Vue, Angular, etc.)
- Build tools (Webpack, Vite, etc.)
- Package managers (npm, yarn)
- Backend o base de datos
- TypeScript

---

## Estructura del proyecto

```
locuras_de_productos/
│
├── index.html                 → Página principal (SPA, <body> vacío)
├── main.js                    → Lógica principal de la SPA (módulo ES)
├── functions.js               → Funciones compartidas (carga CSV, búsqueda, render)
├── styles.css                 → Estilos globales con variables CSS
├── vercel.json                → Configuración de Vercel (rewrites, headers)
├── robots.txt                 → Permite crawlers en todo el sitio
├── sitemap.xml                → Sitemap para motores de búsqueda
├── AGENTS.md                  → Instrucciones para asistentes IA (OpenCode)
│
├── elements/                  → Recursos estáticos y sub-páginas
│   ├── products.csv           → Base de datos de productos (separador ;)
│   ├── Logotipo_locuras_de_productos.png              → Logo principal (hero)
│   ├── Logotipo_locuras_de_productos_blanco.png       → Logo blanco (toolbar, footer)
│   ├── Logotipo_locuras_de_productos_resaltado.png    → Logo resaltado (favicon, /api/logo)
│   ├── busqueda.png           → Ilustración "búsqueda sin resultados"
│   ├── señor_comprando.png    → Ilustración "pronto más productos"
│   │
│   ├── ayuda/                 → Página de ayuda y contacto
│   │   ├── index.html         → HTML plano con CSS inline
│   │   ├── Logotipo_locuras_de_productos_resaltado.png
│   │   ├── Logotipo locuras de productos blanco.png   ← (espacios en el nombre)
│   │   ├── carro-de-la-compra.png
│   │   ├── instagram.png
│   │   └── nuevo-correo-electronico.png
│   │
│   └── productTemplate/       → Página de detalle de producto
│       ├── index.html         → Esqueleto HTML
│       ├── main.js            → Lógica (NO es módulo ES, script normal)
│       └── styles.css         → Estilos con valores hardcodeados
│
└── productos/                 → Imágenes de cada producto
    ├── auriculares_inalambricos/
    ├── bascula_bluetooth/
    ├── bateria_portatil/
    ├── cargador_c/
    ├── cepillo_de_limpieza/
    ├── echo/
    ├── esterilla_yoga/
    ├── freidora_aire/
    ├── funda_coche/
    ├── guantes_de_trabajo/
    ├── humificador_ultrasonico/
    ├── kit_tenis/
    ├── mando_procontroler/
    ├── mochila_hidratacion/
    ├── mochila_senderismo/
    ├── navaja_multiusos/
    ├── organizador_escritorio/
    ├── pistola_masaje/
    ├── reloj_amafit/
    ├── saco_boxeo/
    ├── secador_pelo/
    ├── soporte_bicicleta_barato/
    ├── soporte_bicicleta_caro/
    └── soporte_movil_bici/
```

---

## Arquitectura

### Single Page Application (SPA)

La página principal (`index.html`) tiene el `<body>` prácticamente vacío:

```html
<body>
    <script type="module" src="main.js"></script>
</body>
```

Todo el contenido visible se genera dinámicamente desde `main.js` usando manipulación del DOM (`document.createElement`, `appendChild`, etc.). No hay rutas client-side — cada "pantalla" (inicio, resultados de búsqueda) se construye destruyendo y recreando el DOM.

### Flujo de carga

1. El navegador carga `index.html`.
2. Se ejecuta `main.js` (como ES module).
3. `main.js` llama a `initialScreen()`, que limpia el DOM y construye:
   - Barra de herramientas (toolbar) con logo, buscador y botón de ayuda.
   - Contenedor con el logo principal.
   - Título y subtítulo.
   - Parrilla de productos aleatorios (cargados desde el CSV).
   - Pie de página con licencia y atribuciones.

### Sistema de búsqueda

1. El usuario escribe en la barra de búsqueda y pulsa Enter.
2. Se llama a `findSimilarItems(names, input.value)` en `functions.js`.
3. La función normaliza el texto (elimina acentos, pasa a minúsculas) y divide el término en palabras.
4. Filtra los nombres de producto que contienen **todas** las palabras del término (substring match, no es búsqueda exacta).
5. Los resultados se muestran en la pantalla de búsqueda (`searchScreen()`).

### Navegación entre páginas

| Ruta | Tipo | Descripción |
|---|---|---|
| `/` | SPA (JS) | Página principal con productos aleatorios |
| `/elements/ayuda/index.html` | HTML plano | Página de ayuda y contacto |
| `/elements/productTemplate/index.html?name=...` | HTML + JS | Detalle de un producto específico |
| `/api/logo` | Rewrite (Vercel) | Devuelve la imagen del logotipo |

---

## Datos de productos

### Formato del CSV

Archivo: `elements/products.csv`

- **Separador**: `;` (punto y coma)
- **Codificación**: UTF-8
- **Primera fila**: Cabecera con nombres de columna
- **Filas siguientes**: Un producto por fila

### Columnas

| Columna | Descripción |
|---|---|
| `title` | Nombre del producto |
| `href` | Enlace de afiliado de Amazon |
| `price` | Precio (sin símbolo de moneda, solo el número) |
| `description` | Descripción del producto (puede contener `\n` para saltos de línea) |
| `imgPrincipal` | Ruta a la imagen principal del producto |
| `img2`, `img3`, ... | Rutas a imágenes adicionales (para el carrusel) |

### Ejemplo

```
title;href;price;description;imgPrincipal;img2;img3
Auriculares Bluetooth XYZ;https://amazon.es/...;29,99;Auriculares cómodos y ligeros;productos/auriculares/1.jpg;productos/auriculares/2.jpg;productos/auriculares/3.jpg
```

### Carga de datos

El CSV se carga desde el front-end mediante `fetch()`:

```javascript
const response = await fetch("./elements/products.csv");
const csvText = await response.text();
const rows = csvText.trim().split("\n");
```

No hay backend, API ni base de datos. Todo es cliente-side.

---

## Páginas y navegación

### Pantalla principal (`/`)

Generada por `main.js`:
- **Toolbar**: Logo blanco (enlace a inicio), barra de búsqueda, botón "¿Necesitas ayuda?" (enlace a `/elements/ayuda/index.html`).
- **Hero**: Logo principal grande.
- **Título**: "Locuras de productos" + "¿Qué vas a comprar hoy?".
- **Parrilla de productos**: Muestra una selección **aleatoria** de productos. La cantidad se define en `filas_productos` (6 filas × 5 columnas = 30 productos aprox).
- **Footer**: Atribución de Amazon Afiliados + logo blanco.

### Página de ayuda (`/elements/ayuda/index.html`)

HTML plano con CSS inline. Contiene:
- Información de contacto (correo: `adriangongui2@gmail.com`).
- Enlace a Instagram (`@locuras.de.productos`).
- No usa JavaScript modules — es independiente de la SPA.

### Página de detalle de producto (`/elements/productTemplate/index.html?name=...`)

- Recibe el nombre del producto como parámetro GET (`?name=...`).
- Carga el CSV y busca el producto por nombre exacto (`products.find(p => p.title === productTitle)`).
- Muestra:
  - Carrusel de imágenes del producto (auto-play cada 2.5s, navegación con flechas y teclado).
  - Nombre, descripción y precio.
  - Botón "Comprar ahora" que enlaza a Amazon (con código de afiliado).
- Usa un script normal (no `type="module"`), a diferencia del resto del sitio.

### API de logo (`/api/logo`)

Implementada mediante un rewrite en `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/api/logo", "destination": "/elements/Logotipo_locuras_de_productos_resaltado.png" }
  ]
}
```

Acceder a `https://locuras-de-productos.vercel.app/api/logo` devuelve directamente la imagen PNG del logotipo. Es útil para usos externos (embeds, perfiles de redes sociales, etc.). Incluye cabeceras CORS y caché.

---

## Funcionamiento interno

### main.js (módulo ES)

Punto de entrada de la SPA. Funciones principales:

| Función | Descripción |
|---|---|
| `initialScreen()` | Construye la pantalla de inicio completa |
| `searchScreen()` | Construye la pantalla de resultados de búsqueda |
| `createTaskBar()` | Crea la barra de herramientas superior |
| `createSearchBar()` | Crea el formulario de búsqueda |
| `createImageContainer()` | Crea el contenedor del logo principal |
| `createTitleContainer()` | Crea los títulos |
| `createLicensePart()` | Crea el pie de página |
| `addHoverEffect()` | Añade efecto hover a un elemento |

### functions.js (módulo ES)

Funciones compartidas entre `main.js` y el resto de la SPA:

| Función | Descripción |
|---|---|
| `loadProducts()` | Carga el CSV, selecciona productos aleatorios y los muestra en un grid |
| `getNameProducts()` | Devuelve un array con todos los nombres de productos |
| `findSimilarItems(array, term)` | Busca productos que contengan todas las palabras del término |
| `loadSearchedProducts(array)` | Muestra los resultados de la búsqueda en un grid |
| `randomNumbers(max, count)` | Genera números aleatorios sin repetición |
| `parseCSVRow(row)` | Divide una fila del CSV por `;` |
| `createProductElement(title, href, img, price)` | Crea un elemento HTML de producto |
| `createFinalItem(message)` | Crea el elemento final "Pronto más productos" |

### productTemplate/main.js (script normal)

Independiente de la SPA principal. Gestiona la página de detalle de producto:

| Función | Descripción |
|---|---|
| `getProductDetails(title)` | Carga el CSV y busca un producto por nombre |
| `generateProductTemplate(product)` | Construye el HTML del detalle del producto |
| `createTaskBar()` | Crea la barra de herramientas (versión con enlace a index.html) |
| `changeImage(direction)` | Navega las imágenes del carrusel |
| `updateImageDisplay()` | Actualiza qué imagen del carrusel es visible |

---

## Despliegue

El sitio está desplegado en **Vercel** (plan gratuito). El despliegue se activa automáticamente mediante integración con Git.

### vercel.json

```json
{
  "rewrites": [
    { "source": "/api/logo", "destination": "/elements/Logotipo_locuras_de_productos_resaltado.png" }
  ],
  "headers": [
    {
      "source": "/api/logo",
      "headers": [
        { "key": "Content-Type", "value": "image/png" },
        { "key": "Cache-Control", "value": "public, max-age=86400" },
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

No hay configuración adicional necesaria. Vercel detecta automáticamente que es un sitio estático.

### Cómo hacer deploy

1. Haz commit de los cambios:
   ```bash
   git add .
   git commit -m "descripción de los cambios"
   ```

2. Sube a GitHub (u otro Git provider conectado a Vercel):
   ```bash
   git push
   ```

3. Vercel despliega automáticamente. No hay comandos de deploy manual.

---

## Desarrollo local

### Requisitos

- Un editor de código (VS Code recomendado).
- Opcional: [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) para ver los cambios en tiempo real.

### Pasos

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```

2. Abre la carpeta en VS Code.

3. Inicia Live Server (clic derecho en `index.html` → "Open with Live Server").
   - El sitio se abrirá en `http://127.0.0.1:5500`.

4. Haz cambios y recarga para verlos.

### Limitaciones locales

- **`vercel.json` no funciona localmente**: Las rewrites y headers solo aplican en el despliegue de Vercel. Para probar localmente con soporte de rewrites:
  ```bash
  npm i -g vercel
  vercel dev
  ```
  Esto levanta el servidor en `http://localhost:3000` respetando la configuración de `vercel.json`.

---

## Integraciones externas

### Google Analytics 4

- **ID de medición**: `G-H1YK61G8D8`
- Cargado mediante `gtag.js` en `index.html`.
- Mide tráfico, comportamiento de usuarios, conversiones.

### Google Tag Manager

- **Container ID**: `GTM-K4TX9D5H`
- Incluye versión noscript para usuarios con JavaScript desactivado.
- Gestiona etiquetas de analytics y marketing.

### Google AdSense

- **ID de publisher**: `ca-pub-3938572802328484`
- Meta tag de verificación incluida en el `<head>`.

### StatCounter

- **Proyecto ID**: `13110018`
- **Seguridad**: `6afc3f87`
- Contador de visitas clásico, cargado al final del `<body>`.

### Amazon Afiliados

- Todos los enlaces de productos (`href` en el CSV) son enlaces de afiliado de Amazon.
- El pie de página incluye la atribución requerida: *"Esta página pertenece al programa de Amazon afiliados"*.

### Google Fonts

- **Fuente**: Tsukimi Rounded
- Cargada mediante `@import` en `styles.css`.
- Usada para títulos, precios y botones.

---

## Peculiaridades y convenciones

### Variable `curency`

```javascript
const curency = "€"
```

El nombre de la variable tiene un **typo intencional** (`curency` en lugar de `currency`). No corregir — está así deliberadamente en el código.

### CSS: variables vs hardcodeado

- `styles.css` (SPA principal): Usa variables CSS definidas en `:root`.
- `productTemplate/styles.css`: Usa valores hardcodeados directamente (no usa variables).

### Búsqueda de productos

- Normalización: se eliminan acentos (NFD + regex) y se pasa a minúsculas.
- Es **substring match**: si buscas "auriculares", encuentra "Auriculares Bluetooth".
- Deben coincidir **todas** las palabras del término de búsqueda.
- No hay búsqueda por precio, categoría o descripción — solo por nombre.

### Archivos con espacios

Hay un archivo con espacios en el nombre:
```
elements/ayuda/Logotipo locuras de productos blanco.png
```

Al trabajar con este archivo (git, scripts, etc.), usar comillas o escapado.

### Tipos de scripts

- `main.js` (raíz): ES Module (`<script type="module" src="main.js">`).
- `functions.js` (raíz): ES Module (exporta funciones, importado por main.js).
- `productTemplate/main.js`: Script normal (no module). No puede usar `import`/`export`.

### Generación del DOM

No se usan template strings ni frameworks. Todo el DOM se construye con:
```javascript
const elemento = document.createElement("div");
elemento.className = "clase";
elemento.textContent = "Texto";
 padre.appendChild(elemento);
```

---

## Mantenimiento

### Añadir un nuevo producto

1. Añade las imágenes del producto en `productos/<nombre_del_producto>/`.
2. Añade una nueva fila a `elements/products.csv` con el formato descrito.
3. Haz commit y push.

### Cambiar el logo

Los logos están en `elements/`:
- `Logotipo_locuras_de_productos.png` — Logo principal (hero de la página de inicio).
- `Logotipo_locuras_de_productos_blanco.png` — Logo para toolbar y footer.
- `Logotipo_locuras_de_productos_resaltado.png` — Favicon y endpoint `/api/logo`.

Si se reemplazan, mantener los mismos nombres de archivo para no romrer referencias.

### Modificar el número de productos mostrados

En `functions.js`, cambiar la constante:
```javascript
const filas_productos = 6   // Número de filas en la parrilla
```

Cada fila muestra aproximadamente 5 productos (dependiendo del ancho de pantalla).

---

## Licencia

Este proyecto forma parte del programa de afiliados de Amazon España. Todo el contenido, incluyendo imágenes de productos y descripciones, pertenece a sus respectivos propietarios.

Para cualquier consulta: **adriangongui2@gmail.com**
